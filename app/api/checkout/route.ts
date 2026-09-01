import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_acara, id_event, harga, diskon = 0, judul } = body;

    const orderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Buat data dummy untuk Pengguna dan Acara agar tidak error constraint
    let dummyUser = await prisma.pengguna.findFirst({
      where: { email: "dummy@example.com" }
    });

    if (!dummyUser) {
      dummyUser = await prisma.pengguna.create({
        data: {
          email: "dummy@example.com",
          nama: "Dummy User",
          diubah_pada: new Date()
        }
      });
    }

    let itemFound = false;
    
    if (id_acara) {
      const acara = await prisma.acara.findUnique({ where: { id: id_acara } });
      if (acara) itemFound = true;
    } else if (id_event) {
      const eventItem = await prisma.event.findUnique({ where: { id: id_event } });
      if (eventItem) itemFound = true;
    }

    if (!itemFound) {
      return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
    }

    // Simpan tiket ke database dengan status pending
    const tiket = await prisma.tiket.create({
      data: {
        id_acara: id_acara || null,
        id_event: id_event || null,
        id_pengguna: dummyUser.id,
        qr_code: crypto.randomBytes(16).toString("hex"),
        id_pembayaran: orderId,
        status_bayar: "pending",
        status: "PENDING",
        diubah_pada: new Date()
      }
    });

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "dummy_server_key",
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "dummy_client_key"
    });

    const biaya_layanan = 1000;
    const gross_amount = Math.max(0, harga - diskon + biaya_layanan);

    const item_details: any[] = [
      {
        id: id_acara || id_event,
        price: harga,
        quantity: 1,
        name: judul,
      }
    ];

    if (diskon > 0) {
      item_details.push({
        id: "DISKON",
        price: -diskon,
        quantity: 1,
        name: "Diskon",
      });
    }

    item_details.push({
      id: "BIAYA-LAYANAN",
      price: biaya_layanan,
      quantity: 1,
      name: "Biaya Layanan"
    });

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: gross_amount
      },
      item_details: item_details,
      customer_details: {
        first_name: "Dummy",
        last_name: "User",
        email: "dummy@example.com",
        phone: "08123456789"
      }
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Simpan token unik ke tiket
    await prisma.tiket.update({
      where: { id: tiket.id },
      data: { snap_token: transaction.token }
    });
    
    return NextResponse.json({ 
      token: transaction.token,
      orderId 
    });

  } catch (error: any) {
    console.error("Midtrans Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi. Pastikan kunci API sudah benar di .env" },
      { status: 500 }
    );
  }
}
