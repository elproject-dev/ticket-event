import { prisma } from "@/lib/prisma";
import { CalendarDays, Users, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalBanner,
    totalAcara,
    totalPengguna,
    totalTiket
  ] = await Promise.all([
    prisma.banner.count(),
    prisma.acara.count(),
    prisma.pengguna.count(),
    prisma.tiket.count(),
  ]);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Dasbor Admin</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Ringkasan data aplikasi Anda.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-none border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acara</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAcara}</div>
            <p className="text-[10px] text-muted-foreground">Total acara terdaftar</p>
          </CardContent>
        </Card>

        <Card className="rounded-none border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banner</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBanner}</div>
            <p className="text-[10px] text-muted-foreground">Total banner aktif/non-aktif</p>
          </CardContent>
        </Card>

        <Card className="rounded-none border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPengguna}</div>
            <p className="text-[10px] text-muted-foreground">Pengguna terdaftar</p>
          </CardContent>
        </Card>

        <Card className="rounded-none border shadow-sm col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiket Terjual</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTiket}</div>
            <p className="text-[10px] text-muted-foreground">Keseluruhan transaksi tiket</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <a href="/admin/acara" className="flex items-center justify-center p-4 border bg-card hover:bg-muted transition-colors rounded-none">
          <div className="flex flex-col items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-sm font-bold tracking-widest uppercase">Kelola Acara</span>
          </div>
        </a>
        <a href="/admin/event" className="flex items-center justify-center p-4 border bg-card hover:bg-muted transition-colors rounded-none">
          <div className="flex flex-col items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-sm font-bold tracking-widest uppercase">Kelola Event</span>
          </div>
        </a>
        <a href="/admin/banner" className="flex items-center justify-center p-4 border bg-card hover:bg-muted transition-colors rounded-none">
          <div className="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span className="text-sm font-bold tracking-widest uppercase">Kelola Banner</span>
          </div>
        </a>
      </div>
    </div>
  );
}
