import { TopBar } from "@/components/top-bar";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LogOut, Bell, HelpCircle, User, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/masuk");
  }

  // Ambil nama dari database, bukan dari session Google
  const dbUser = await prisma.pengguna.findUnique({
    where: { email: session.user.email! },
    select: { nama: true, no_telp: true },
  });

  const user = session.user;
  const displayName = dbUser?.nama || user.name || "Pengguna";

  // Handle logout action
  const handleLogout = async () => {
    "use server";
    await auth.signOut();
    redirect("/masuk");
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden pb-16">
      {/* Consistent Header */}
      <TopBar title="Tiketku.com" />

      <main className="flex-1 p-4 space-y-4 flex flex-col justify-start overflow-hidden">
        <div className="flex items-center space-x-4 p-4 border rounded-none bg-muted/20">
          {user.image ? (
            <img
              src={user.image}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border">
              <User className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h2 className="font-bold text-sm">{displayName}</h2>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">Menu Utama</h3>

          <Link href="/profil" className="flex items-center justify-between p-4 border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Profil Saya</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          <Link href="/riwayat" className="flex items-center justify-between p-4 border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <Ticket className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Riwayat Transaksi</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          <Link href="/notifikasi" className="flex items-center justify-between p-4 border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Notifikasi</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          <Link href="/pusat-bantuan" className="flex items-center justify-between p-4 border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Pusat Bantuan</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>

        <div className="mt-auto pt-2 flex justify-end">
          <form action={handleLogout} className="flex">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-none h-8 px-4 text-xs tracking-widest" type="submit">
              <LogOut className="w-3.5 h-3.5 mr-2" />
              KELUAR
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
