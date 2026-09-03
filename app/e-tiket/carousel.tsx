"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TiketItem {
  id: string;
  qr_code: string;
  status: string;
  dibuat_pada: string;
  acara?: { judul: string; tanggal_mulai: string; lokasi: string } | null;
  event?: { judul: string; tanggal_mulai: string; lokasi: string } | null;
  pengguna: { nama: string };
}

export default function ETiketCarousel({ tiketList }: { tiketList: TiketItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = tiketList.length;
  const tiket = tiketList[currentIndex];
  const item = tiket.acara || tiket.event;

  const prev = () => setCurrentIndex((i) => (i - 1 + total) % total);
  const next = () => setCurrentIndex((i) => (i + 1) % total);

  return (
    <main className="flex-1 flex flex-col items-center justify-between p-4 pb-24 overflow-hidden relative bg-black text-white">
      <div className="w-full max-w-sm flex-1 flex flex-col justify-between items-center my-auto">

        {/* Navigasi Tiket (jika > 1) */}
        {total > 1 && (
          <div className="flex items-center justify-between w-full mb-4">
            <button onClick={prev} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              {tiketList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-primary w-6" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Judul Acara */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold tracking-widest uppercase leading-snug mb-2 text-white">
            {item?.judul}
          </h1>
          <p className="text-[10px] text-white/60 uppercase tracking-widest">
            {item?.tanggal_mulai
              ? new Date(item.tanggal_mulai).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : ""}{" "}
            • {item?.lokasi}
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 w-full aspect-square flex items-center justify-center relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black m-2" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black m-2" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black m-2" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black m-2" />

          <QRCode
            value={tiket.qr_code}
            size={256}
            style={{ height: "100%", maxWidth: "100%", width: "100%" }}
            viewBox="0 0 256 256"
          />
        </div>

        {/* Info Pendukung */}
        <div className="mt-8 w-full flex flex-col gap-4">
          <div className="flex justify-between items-end border-b border-white/20 pb-2">
            <span className="text-[10px] text-white/50 tracking-widest">Nama Pemegang</span>
            <span className="text-xs font-bold tracking-wider uppercase">{tiket.pengguna?.nama}</span>
          </div>
          <div className="flex justify-between items-end border-b border-white/20 pb-2">
            <span className="text-[10px] text-white/50 tracking-widest">ID Tiket</span>
            <span className="text-xs font-bold tracking-wider uppercase">{tiket.id.split("-")[0]}</span>
          </div>
          <div className="flex justify-between items-end border-b border-white/20 pb-2">
            <span className="text-[10px] text-white/50 tracking-widest">Status</span>
            <span className="text-xs font-bold tracking-wider uppercase text-green-400">Aktif (Valid)</span>
          </div>
          {total > 1 && (
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-[10px] text-white/50 tracking-widest">Tiket</span>
              <span className="text-xs font-bold tracking-wider uppercase text-primary">{currentIndex + 1} dari {total}</span>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[9px] text-white/40 tracking-widest leading-relaxed">
          Tunjukkan layar ini kepada petugas di pintu masuk
        </p>
      </div>
    </main>
  );
}
