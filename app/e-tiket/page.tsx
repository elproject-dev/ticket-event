import Link from "next/link";
import { prisma } from "@/lib/prisma";
import QRCode from "react-qr-code";
import { ArrowLeft, Box } from "lucide-react";
import { BoxArrowUpIcon, BoxArrowDownIcon } from "@phosphor-icons/react";

export default async function ETiketScannerFast() {
  const pengguna = await prisma.pengguna.findFirst({
    where: { email: "dummy@example.com" },
    select: { id: true }
  });

  const tiket = pengguna ? await prisma.tiket.findFirst({
    where: {
      id_pengguna: pengguna.id,
      status: { in: ["VALID", "TERPAKAI"] }
    },
    include: {
      acara: true,
      event: true,
      pengguna: true
    },
    orderBy: {
      dibuat_pada: "asc"
    }
  }) : null;

  if (!tiket) {
    return (
      <div className="flex flex-col min-h-screen text-xs bg-background">
        {/* Consistent Header */}
        <header className="px-4 py-3 flex items-center justify-between border-b bg-background sticky top-0 z-50">
          <div>
            <span className="text-sm font-bold tracking-tight">Tiketku.com</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/masuk" className="text-xs font-medium  tracking-wider text-muted-foreground hover:text-primary">
              Masuk
            </Link>
            <Link href="/daftar" className="text-xs font-medium  tracking-wider text-primary">
              Daftar
            </Link>
          </nav>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 mb-12">
          <div className="text-center flex flex-col items-center max-w-sm">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Box className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight leading-snug mb-2">Belum Ada Tiket Aktif</h1>
            <p className="text-xs text-muted-foreground leading-relaxed mb-8">
              Anda belum memiliki tiket yang dibeli untuk ditampilkan. <br />Silakan cek menu Riwayat untuk melihat status pesanan Anda
            </p>
            <div className="flex flex-col w-full gap-3">
              <Link href="/acara" className="w-full text-center px-6 py-3 bg-primary text-primary-foreground font-bold text-[10px] tracking-widest uppercase">
                Jelajahi Acara
              </Link>
              <Link href="/riwayat" className="w-full text-center px-6 py-3 border border-border text-foreground font-bold text-[10px] tracking-widest uppercase">
                Lihat Riwayat
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const item = tiket.acara || tiket.event;

  // Jika tiket ditemukan, langsung tampilkan layar hitam premium
  return (
    <div className="flex flex-col min-h-screen text-xs bg-black text-white">
      {/* Consistent Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b bg-background sticky top-0 z-50">
        <div>
          <span className="text-sm font-bold tracking-tight text-foreground">Tiketku.com</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/masuk" className="text-xs font-medium  tracking-wider text-muted-foreground hover:text-primary">
            Masuk
          </Link>
          <Link href="/daftar" className="text-xs font-medium  tracking-wider text-primary">
            Daftar
          </Link>
        </nav>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 mb-12">
        <div className="w-full max-w-sm flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-xl font-bold tracking-widest uppercase leading-snug mb-2 text-white">{item?.judul}</h1>
            <p className="text-[10px] text-white/60 uppercase tracking-widest">
              {item?.tanggal_mulai ? new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} • {item?.lokasi}
            </p>
          </div>

          {/* Area QR Code - Harus sangat kontras */}
          <div className="bg-white p-6 w-full aspect-square flex items-center justify-center relative">
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
              <span className="text-[10px] text-white/50 tracking-widest">Nama Pemegang</span>
              <span className="text-xs font-bold tracking-wider uppercase">{tiket.pengguna.nama}</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-[10px] text-white/50 tracking-widest">ID Tiket</span>
              <span className="text-xs font-bold tracking-wider uppercase">{tiket.id.split('-')[0]}</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-[10px] text-white/50 tracking-widest">Status</span>
              <span className="text-xs font-bold tracking-wider text-green-400 uppercase">{tiket.status === "VALID" ? "Valid" : "Terpakai"}</span>
            </div>
          </div>

          <p className="mt-12 text-center text-[9px] text-white/40 tracking-widest leading-relaxed">
            Tunjukkan layar ini kepada petugas di pintu masuk. Pastikan kecerahan layar Anda maksimal.
          </p>
        </div>
      </main>
    </div>
  );
}
