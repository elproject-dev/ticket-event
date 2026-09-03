import { TopBar } from "@/components/top-bar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { Box } from "lucide-react";
import ETiketCarousel from "./carousel";

export const dynamic = "force-dynamic";

export default async function ETiketScannerFast() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.email) {
    redirect("/masuk");
  }

  const pengguna = await prisma.pengguna.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  // Ambil semua tiket yang sudah dibayar
  const semuaTiket = pengguna ? await prisma.tiket.findMany({
    where: {
      id_pengguna: pengguna.id,
      status: "VALID"
    },
    include: {
      acara: true,
      event: true,
      pengguna: { select: { nama: true } }
    },
    orderBy: { dibuat_pada: "desc" }
  }) : [];

  // Logika pintar: Urutkan berdasarkan tanggal acara terdekat
  const now = new Date();

  const tiketList = semuaTiket
    .map(t => {
      const item = t.acara || t.event;
      const tanggalMulai = item?.tanggal_mulai ? new Date(item.tanggal_mulai) : null;
      return { ...t, _tanggalMulai: tanggalMulai };
    })
    .sort((a, b) => {
      const dateA = a._tanggalMulai?.getTime() ?? Infinity;
      const dateB = b._tanggalMulai?.getTime() ?? Infinity;
      const isAFuture = dateA >= now.getTime();
      const isBFuture = dateB >= now.getTime();
      if (isAFuture && !isBFuture) return -1;
      if (!isAFuture && isBFuture) return 1;
      return dateA - dateB;
    });

  if (tiketList.length === 0) {
    return (
      <div className="fixed inset-0 bg-background text-foreground flex flex-col overflow-hidden text-xs pb-16">
        <TopBar title="Tiketku.com" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 my-auto overflow-hidden">
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

  // Serialisasi untuk menghindari error Decimal pada Client Component
  const tiketListPlain = JSON.parse(JSON.stringify(tiketList));

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden text-xs z-40">
      <TopBar title="Tiketku.com" />
      <ETiketCarousel tiketList={tiketListPlain} />
    </div>
  );
}
