"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CancelButtonProps {
  idTiket: string;
}

export function CancelButton({ idTiket }: CancelButtonProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;

    try {
      setIsCancelling(true);
      const res = await fetch("/api/tiket/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idTiket })
      });

      if (!res.ok) {
        throw new Error("Gagal membatalkan tiket");
      }

      // Refresh halaman untuk memperbarui status
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat membatalkan pesanan.");
      setIsCancelling(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isCancelling}
      className="text-[10px] font-bold tracking-widest text-muted-foreground border border-border px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-50"
    >
      {isCancelling ? "Memproses..." : "Batalkan"}
    </button>
  );
}
