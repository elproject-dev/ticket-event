"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface ConfirmPaymentButtonProps {
  idTiket: string;
  idPembayaran?: string | null;
}

export function ConfirmPaymentButton({ idTiket, idPembayaran }: ConfirmPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_tiket: idTiket,
          order_id: idPembayaran,
          status: "VALID",
        }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Gagal mengonfirmasi status pembayaran.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleConfirm}
      disabled={isLoading}
      title="Klik untuk mengonfirmasi bahwa pembayaran simulasi telah selesai"
      className="text-[10px] font-bold tracking-widest text-green-700 border border-green-600 px-2 py-1.5 hover:bg-green-50 transition-colors bg-green-50/50 flex items-center gap-1 disabled:opacity-50"
    >
      <CheckCircle className="w-3 h-3 text-green-600" />
      {isLoading ? "Cek..." : "Konfirmasi Manual"}
    </button>
  );
}
