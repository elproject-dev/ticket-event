"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";

interface PayButtonProps {
  snapToken: string;
  idTiket?: string;
  idPembayaran?: string | null;
}

export function PayButton({ snapToken, idTiket, idPembayaran }: PayButtonProps) {
  const [isSnapLoaded, setIsSnapLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Cek apakah snap sudah ter-load (jika script dieksekusi cepat)
    if (window.snap) {
      setIsSnapLoaded(true);
    }
  }, []);

  const confirmPayment = async (orderId?: string) => {
    try {
      setIsProcessing(true);
      await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId || idPembayaran,
          id_tiket: idTiket,
          status: "VALID",
        }),
      });
      window.location.reload();
    } catch (err) {
      console.error("Gagal update status pembayaran:", err);
      window.location.reload();
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = () => {
    if (!isSnapLoaded || !window.snap) {
      alert("Menunggu sistem pembayaran dimuat...");
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: function (result: any) {
        console.log("Payment success:", result);
        confirmPayment(result?.order_id);
      },
      onPending: function (result: any) {
        console.log("Payment pending:", result);
      },
      onError: function (result: any) {
        console.error("Payment error:", result);
        alert("Pembayaran gagal. Silakan coba lagi.");
      },
      onClose: function () {
        console.log("User closed the popup without finishing the payment");
      },
    });
  };

  return (
    <>
      {/* Load Midtrans Snap Script dengan Client Key dari ENV */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
        onLoad={() => setIsSnapLoaded(true)}
      />
      <button 
        onClick={handlePay} 
        className="text-[10px] font-bold tracking-widest text-primary border border-primary px-3 py-1.5 hover:bg-primary/10 transition-colors bg-primary/5"
      >
        Bayar
      </button>
    </>
  );
}
