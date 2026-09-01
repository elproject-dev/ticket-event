import { prisma } from "@/lib/prisma";
import { Users, CreditCard, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const totalUser = await prisma.pengguna.count();

  // Ambil total transaksi tiket (yang sudah sukses)
  const tiketSukses = await prisma.tiket.findMany({
    where: {
      status: { in: ["VALID", "TERPAKAI"] }
    },
    include: {
      acara: true
    }
  });

  const totalPendapatan = tiketSukses.reduce((sum, tiket) => sum + Number(tiket.acara?.harga || 0), 0);
  const totalTiketTerjual = tiketSukses.length;

  // Ambil event aktif
  const totalEvent = await prisma.acara.count();

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-xs text-muted-foreground mt-1">Ringkasan statistik aplikasi Event Ticket.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total User */}
        <div className="border p-4 rounded-none bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Total User</h2>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">{totalUser || 0}</p>
        </div>

        {/* Total Pendapatan */}
        <div className="border p-4 rounded-none bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Cash Flow</h2>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-emerald-600">
            Rp {(totalPendapatan).toLocaleString('id-ID')}
          </p>
        </div>

        {/* Tiket Terjual */}
        <div className="border p-4 rounded-none bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Tiket Terjual</h2>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{totalTiketTerjual}</p>
        </div>

        {/* Total Event */}
        <div className="border p-4 rounded-none bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Event</h2>
            <Calendar className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">{totalEvent || 0}</p>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold border-b pb-2">Analitik Penjualan Terbaru</h2>
        {tiketSukses && tiketSukses.length > 0 ? (
          <div className="space-y-3">
            {tiketSukses.slice(0, 5).map((tiket, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 border text-xs">
                <div>
                  <p className="font-bold line-clamp-1">{tiket.acara?.judul || "Acara"}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Tiket Terjual</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">+ Rp {Number(tiket.acara?.harga || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-8 border border-dashed">Belum ada data penjualan</p>
        )}
      </div>

      <div className="pt-4">
        <Link href="/admin/acara" className={buttonVariants({ className: "w-full rounded-none text-xs tracking-widest" })}>
          KELOLA ACARA
        </Link>
      </div>
    </div>
  );
}
