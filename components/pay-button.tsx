"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";

interface PayButtonProps {
  snapToken: string;
}

export function PayButton({ snapToken }: PayButtonProps) {
  const [isSnapLoaded, setIsSnapLoaded] = useState(false);

  useEffect(() => {
    // Cek apakah snap sudah ter-load (jika script dieksekusi cepat)
    if (window.snap) {
      setIsSnapLoaded(true);
    }
  }, []);

  const handlePay = () => {
    if (!isSnapLoaded || !window.snap) {
      alert("Menunggu sistem pembayaran dimuat...");
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: function(result: any) {
        console.log("Payment success:", result);
        window.location.reload();
      },
      onPending: function(result: any) {
        console.log("Payment pending:", result);
      },
      onError: function(result: any) {
        console.error("Payment error:", result);
        alert("Pembayaran gagal. Silakan coba lagi.");
      },
      onClose: function() {
        console.log('User closed the popup without finishing the payment');
      }
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
