import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Terima data dari Midtrans
    const { 
      order_id, 
      status_code, 
      gross_amount, 
      signature_key,
      transaction_status,
      payment_type
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "dummy_server_key";

    // 2. Verifikasi keamanan (Signature Key)
    // Rumus Midtrans: SHA512(order_id + status_code + gross_amount + server_key)
    const hash = crypto.createHash("sha512");
    hash.update(order_id + status_code + gross_amount + serverKey);
    const expectedSignature = hash.digest("hex");

    if (expectedSignature !== signature_key) {
      console.error("Signature key tidak valid!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // 3. Update status tiket di database menggunakan Prisma
    let statusTiketDb = "VALID"; // Default untuk berhasil
    
    // Konversi status Midtrans ke logika aplikasi kita
    if (transaction_status === "settlement" || transaction_status === "capture") {
      // Pembayaran Sukses
      statusTiketDb = "VALID";
    } else if (transaction_status === "pending") {
      // Masih menunggu pembayaran (misal di minimarket atau virtual account)
      statusTiketDb = "PENDING";
    } else if (
      transaction_status === "deny" || 
      transaction_status === "cancel" || 
      transaction_status === "expire"
    ) {
      // Pembayaran Gagal / Dibatalkan
      statusTiketDb = "DIBATALKAN";
    }

    // Cari tiket berdasarkan ID Pembayaran (order_id)
    const tiket = await prisma.tiket.findFirst({
      where: { id_pembayaran: order_id },
      select: { id: true }
    });

    if (!tiket) {
      console.error(`Tiket dengan order_id ${order_id} tidak ditemukan.`);
      return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
    }

    // Update tiket
    await prisma.tiket.update({
      where: { id: tiket.id },
      data: {
        status_bayar: transaction_status,
        status: statusTiketDb as any,
        metode_pembayaran: payment_type,
        diubah_pada: new Date()
      }
    });

    console.log(`Berhasil update tiket ${order_id} menjadi ${statusTiketDb}`);

    // 4. Beri respon 200 OK ke Midtrans
    return NextResponse.json({ status: "success", message: "Webhook processed" });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
