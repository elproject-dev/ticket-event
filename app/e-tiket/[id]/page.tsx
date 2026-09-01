import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QRCode from "react-qr-code";
import { ArrowLeft } from "lucide-react";

export default async function DetailETiket({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const tiketRaw = await prisma.tiket.findUnique({
    where: { id },
    include: {
      acara: true,
      pengguna: true
    }
  });

  const tiket = tiketRaw as any; // Typecast or handle explicit nested object typing

  if (!tiket || (tiket.status !== "VALID" && tiket.status !== "TERPAKAI")) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen text-xs bg-black text-white">
      {/* Header Minimalis */}
      <header className="px-4 py-4 flex items-center justify-between z-50">
        <Link href="/e-tiket" className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-xs font-bold tracking-widest  text-white/50">E-Tiket</span>
        <div className="w-9" /> {/* Spacer untuk centering text */}
      </header>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 mb-12">
        <div className="w-full max-w-sm flex flex-col items-center">
          
          <div className="text-center mb-10">
            <h1 className="text-xl font-bold tracking-widest  leading-snug mb-2 text-white">{tiket.acara.judul}</h1>
            <p className="text-[10px] text-white/60  tracking-widest">
              {new Date(tiket.acara.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • {tiket.acara.lokasi}
            </p>
          </div>

          {/* Area QR Code - Harus sangat kontras */}
          <div className="bg-white p-6 w-full aspect-square flex items-center justify-center relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black m-2"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black m-2"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black m-2"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black m-2"></div>
            
            <QRCode
              value={tiket.qr_code}
              size={256}
              style={{ height: "100%", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>

          {/* Info Pendukung */}
          <div className="mt-10 w-full flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-[10px] text-white/50  tracking-widest">Nama Pemegang</span>
              <span className="text-xs font-bold  tracking-wider">{tiket.pengguna.nama}</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-[10px] text-white/50  tracking-widest">ID Tiket</span>
              <span className="text-xs font-bold  tracking-wider">{tiket.id.split('-')[0]}</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-[10px] text-white/50  tracking-widest">Status</span>
              <span className="text-xs font-bold  tracking-wider text-green-400">{tiket.status === "VALID" ? "Valid" : "Terpakai"}</span>
            </div>
          </div>
          
          <p className="mt-12 text-center text-[9px] text-white/40  tracking-widest leading-relaxed">
            Tunjukkan layar ini kepada petugas di pintu masuk. Pastikan kecerahan layar Anda maksimal.
          </p>
        </div>
      </main>
    </div>
  );
}
