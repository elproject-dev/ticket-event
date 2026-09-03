"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TicketDetailsModalProps {
  tiket: any;
}

export function TicketDetailsModal({ tiket }: TicketDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fungsi format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const item = tiket.acara || tiket.event;
  const isUsed = tiket.status === "TERPAKAI";
  const isValid = tiket.status === "VALID";
  const isPending = tiket.status === "PENDING";
  const isCancelled = tiket.status === "DIBATALKAN";

  const formatPaymentMethod = (method: string | null) => {
    if (!method) return "QRIS / Online";
    return method.replace(/_/g, " ").toUpperCase();
  };

  const getStatusTiketLabel = () => {
    if (isUsed) return "Sudah Digunakan";
    if (isValid) return "Valid (Siap Scan)";
    if (isPending) return "Menunggu Pembayaran";
    if (isCancelled) return "Dibatalkan";
    return "Tidak Berlaku";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-bold tracking-widest text-primary border border-primary px-3 py-1.5 hover:bg-primary/10 transition-colors bg-primary/5"
      >
        Lihat Rincian
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-background flex flex-col max-h-[90vh] shadow-xl border border-border rounded-none">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-background border-b">
              <h2 className="text-sm font-bold tracking-widest">Rincian Pemesanan</h2>
              <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold tracking-widest text-muted-foreground hover:text-foreground">
                TUTUP
              </button>
            </div>

            {/* Konten Utama */}
            <div className="flex-1 p-4 pb-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="mx-auto space-y-6">

              {/* Status Header Banner */}
              <div
                className="flex flex-col items-center justify-center text-center border-b relative overflow-hidden aspect-[2.5/1] rounded-none bg-muted"
                style={{
                  backgroundImage: item?.url_gambar ? `url('${item.url_gambar}')` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 w-full p-4">
                  <h3 className="text-base font-bold tracking-widest mb-1 text-white drop-shadow-md">{item?.judul || "Tiket Acara"}</h3>
                </div>
              </div>

              {/* Rincian Pemesanan */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Info Pesanan</h4>
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">ID Pemesanan</span>
                    <span className="font-bold tracking-wider">{tiket.id_pembayaran || tiket.id.split('-')[0]}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Waktu Transaksi</span>
                    <span className="font-medium">{formatDate(tiket.dibuat_pada)} • {formatTime(tiket.dibuat_pada)}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Metode Pembayaran</span>
                    <span className="font-bold tracking-widest">{formatPaymentMethod(tiket.metode_pembayaran)}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Total Pembayaran</span>
                    <span className="font-bold tracking-widest text-primary">IDR {Number(item?.harga || 0).toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Status Pembayaran</span>
                    <span className={`font-bold tracking-widest ${isCancelled ? "text-red-600" : isPending ? "text-yellow-600" : "text-green-600"}`}>
                      {isCancelled ? "Pesanan Dibatalkan" : isPending ? "Belum Bayar" : "Pembayaran Berhasil"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Status Tiket</span>
                    <span className={`font-bold tracking-widest ${isUsed ? "text-blue-600" : isValid ? "text-green-600" : isPending ? "text-yellow-600" : "text-red-600"}`}>
                      {getStatusTiketLabel()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rincian Acara */}
              <div className="space-y-4 pt-4 border-t border-dashed">
                <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Detail Acara</h4>
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Tanggal Acara</span>
                    <span className="font-medium">{item?.tanggal_mulai ? formatDate(item.tanggal_mulai) : "-"}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Berakhir Pada</span>
                    <span className="font-medium">{item?.tanggal_selesai ? formatDate(item.tanggal_selesai) : "-"}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Waktu</span>
                    <span className="font-medium">
                      {item?.waktu || (item?.tanggal_mulai ? `${formatTime(item.tanggal_mulai)} ${item?.tanggal_selesai ? `- ${formatTime(item.tanggal_selesai)}` : ""} WIB` : "-")}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="text-[10px] text-muted-foreground tracking-widest">Lokasi</span>
                    <span className="font-medium text-right max-w-[200px]">{item?.lokasi || "-"}</span>
                  </div>
                </div>
              </div>

            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
