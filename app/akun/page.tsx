import { auth } from "@/lib/auth/server";
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

  const user = session.user;

  // Handle logout action
  const handleLogout = async () => {
    "use server";
    await auth.signOut();
    redirect("/masuk");
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
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

      <main className="flex-1 p-4 space-y-6">
        <div className="flex items-center space-x-4 p-4 border rounded-none bg-muted/20">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name || "Profile photo"} 
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border">
              <User className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h2 className="font-bold text-sm">{user.name || "Pengguna"}</h2>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">Menu Utama</h3>
          
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

        <div className="pt-4">
          <form action={handleLogout}>
            <Button variant="destructive" className="w-full rounded-none h-12 text-xs tracking-widest" type="submit">
              <LogOut className="w-4 h-4 mr-2" />
              KELUAR
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
