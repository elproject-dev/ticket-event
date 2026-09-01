"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutBar({ event }: { event: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
          "ngrok-skip-browser-warning": "true" 
        },
        body: JSON.stringify({
          id_event: event.id,
          harga: event.harga,
          diskon: event.diskon || 0,
          judul: event.judul
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "Gagal menghubungi server");
      }

      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log("Success", result);
            alert("Pembayaran berhasil! Tiket sedang diproses.");
          },
          onPending: function (result: any) {
            console.log("Pending", result);
            alert("Menunggu pembayaran Anda.");
          },
          onError: function (result: any) {
            console.log("Error", result);
            alert("Pembayaran gagal!");
          },
          onClose: function () {
            console.log("Closed without finishing payment");
          }
        });
      } else {
        throw new Error("Token Midtrans tidak ditemukan dari server");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error: " + (err.message || "Terjadi kesalahan sistem. Coba refresh halaman."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-[60px] left-0 right-0 border-t bg-background p-4 z-40 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] tracking-widest text-muted-foreground">Harga Tiket</span>
          <span className="text-[10px] font-medium">IDR {event.harga.toLocaleString('id-ID')}</span>
        </div>
        {event.diskon > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] tracking-widest text-primary">Diskon</span>
            <span className="text-[10px] font-medium text-primary">-IDR {event.diskon.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-3 border-b pb-2">
          <span className="text-[10px] tracking-widest text-muted-foreground">Biaya Layanan</span>
          <span className="text-[10px] font-medium">IDR 1.000</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-muted-foreground font-bold">TOTAL</span>
            <span className="text-sm font-bold tracking-wide">IDR {Math.max(0, event.harga - (event.diskon || 0) + 1000).toLocaleString('id-ID')}</span>
          </div>
          <Button
            className="h-10 px-8 rounded-none text-xs tracking-widest disabled:opacity-50"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Beli Tiket"}
          </Button>
        </div>
      </div>
    </div>
  );
}
