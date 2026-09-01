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


  const formatPaymentMethod = (method: string | null) => {
    if (!method) return "Belum Tercatat";
    // Bersihkan format (contoh: "bca_va" -> "BCA VA", "gopay" -> "GoPay")
    return method.replace(/_/g, " ").toUpperCase();
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
        <div className="fixed top-0 left-0 right-0 bottom-[60px] z-40 flex flex-col bg-background overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-background border-b">
            <h2 className="text-sm font-bold tracking-widest">Rincian Pemesanan</h2>
            <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold tracking-widest text-muted-foreground hover:text-foreground">
              TUTUP
            </button>
          </div>

          {/* Konten Utama */}
          <div className="flex-1 p-4 pb-24">
            <div className="max-w-md mx-auto space-y-6">

              {/* Status Header */}
              <div
                className="flex flex-col items-center justify-center text-center border-b relative overflow-hidden aspect-[2/1]"
                style={{
                  backgroundImage: `url('${tiket.event?.url_gambar || "/tech-banner.jpg"}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="relative z-10 w-full p-4">
                  <h3 className="text-lg font-bold tracking-widest mb-1 text-white drop-shadow-md">{tiket.event?.judul}</h3>
                </div>
              </div>

              {/* Rincian Pemesanan */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground">Info Pesanan</h4>
                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">ID Pemesanan</div>
                    <div className="font-bold tracking-wider mt-1">{tiket.id_pembayaran || tiket.id.split('-')[0]}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Waktu Transaksi</div>
                    <div className="font-medium mt-1">{formatDate(tiket.dibuat_pada)} • {formatTime(tiket.dibuat_pada)}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Metode Pembayaran</div>
                    <div className="font-bold mt-1 tracking-widest">{formatPaymentMethod(tiket.metode_pembayaran)}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Total Pembayaran</div>
                    <div className="font-bold mt-1 tracking-widest">IDR {tiket.event?.harga?.toLocaleString("id-ID") || 0}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Status Pembayaran</div>
                    <div className={`font-bold mt-1 tracking-widest ${tiket.status === "DIBATALKAN" ? "text-red-600" : "text-green-600"}`}>
                      {tiket.status === "DIBATALKAN" ? "Pesanan Dibatalkan" : "Pembayaran Berhasil"}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Status Tiket</div>
                    <div className="font-bold mt-1 tracking-widest">
                      {tiket.status === "VALID" ? "Belum Digunakan" :
                        tiket.status === "DIGUNAKAN" ? "Sudah Digunakan" :
                          "Tidak Berlaku"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Acara */}
              <div className="space-y-4 pt-4 border-t border-dashed">
                <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground">Detail Acara</h4>
                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Tanggal Acara</div>
                    <div className="font-medium mt-1">{tiket.event?.tanggal_mulai ? formatDate(tiket.event.tanggal_mulai) : ""}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Berakhir Pada</div>
                    <div className="font-medium mt-1">{tiket.event?.tanggal_selesai ? formatDate(tiket.event.tanggal_selesai) : ""}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Waktu</div>
                    <div className="font-medium mt-1">{tiket.event?.tanggal_mulai ? formatTime(tiket.event.tanggal_mulai) : ""} - {tiket.event?.tanggal_selesai ? formatTime(tiket.event.tanggal_selesai) : ""} WIB</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest">Lokasi</div>
                    <div className="font-medium mt-1 leading-relaxed">{tiket.event?.lokasi}</div>
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
