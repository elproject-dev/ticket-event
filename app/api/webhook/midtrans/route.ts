import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In a real application, you MUST verify the signature key here
    // const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    // const signatureKey = crypto.createHash("sha512").update(body.order_id + body.status_code + body.gross_amount + serverKey).digest("hex");
    // if (signatureKey !== body.signature_key) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;
    const orderId = body.order_id;

    console.log(`[Midtrans Webhook] Order ID: ${orderId} | Status: ${transactionStatus}`);

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        // TODO: Handle successful credit card payment
      }
    } else if (transactionStatus === "settlement") {
      // TODO: Handle successful payment (e-wallets, bank transfer, etc.)
      console.log(`[Midtrans Webhook] Pembayaran Sukses untuk ${orderId}. Membuat Tiket di database...`);
      // Here you would use Prisma to create the Ticket record:
      // await prisma.tiket.create({ ... })
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      // TODO: Handle failed/cancelled payment
    } else if (transactionStatus === "pending") {
      // TODO: Handle pending payment
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
