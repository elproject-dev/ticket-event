import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    const { order_id, id_tiket, status } = await req.json();

    if (!order_id && !id_tiket) {
      return NextResponse.json({ error: "Order ID atau ID Tiket diperlukan" }, { status: 400 });
    }

    let finalStatus = status || "VALID";
    let statusBayar = "settlement";

    // 1. Coba cek ke Midtrans jika server key terkonfigurasi
    if (order_id) {
      try {
        const snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY || "dummy_server_key",
          clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "dummy_client_key",
        });

        const response = await snap.transaction.notification({
          order_id: order_id,
        });

        if (response && response.transaction_status) {
          statusBayar = response.transaction_status;
          if (response.transaction_status === "settlement" || response.transaction_status === "capture") {
            finalStatus = "VALID";
          } else if (response.transaction_status === "pending") {
            finalStatus = "PENDING";
          } else if (["cancel", "deny", "expire"].includes(response.transaction_status)) {
            finalStatus = "DIBATALKAN";
          }
        }
      } catch (midtransErr) {
        console.log("Cek Midtrans API fallback ke status manual:", midtransErr);
      }
    }

    // 2. Cari tiket berdasarkan order_id (id_pembayaran) atau id_tiket
    const tiket = await prisma.tiket.findFirst({
      where: {
        OR: [
          ...(order_id ? [{ id_pembayaran: order_id }] : []),
          ...(id_tiket ? [{ id: id_tiket }] : []),
        ],
      },
    });

    if (!tiket) {
      return NextResponse.json({ error: "Tiket tidak ditemukan di database" }, { status: 404 });
    }

    // 3. Update tiket menjadi VALID / Sudah Bayar
    const updatedTiket = await prisma.tiket.update({
      where: { id: tiket.id },
      data: {
        status: finalStatus as any,
        status_bayar: statusBayar,
        diubah_pada: new Date(),
      },
    });

    return NextResponse.json({ success: true, tiket: updatedTiket });
  } catch (error: any) {
    console.error("Gagal mengonfirmasi pembayaran:", error);
    return NextResponse.json({ error: error.message || "Gagal mengonfirmasi pembayaran" }, { status: 500 });
  }
}
