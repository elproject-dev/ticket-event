import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const { data: session } = await auth.getSession();

  console.log("Session in /profil:", session);

  if (!session?.user) {
    console.log("No session user, redirecting to /masuk");
    redirect("/masuk");
  }

  const user = session.user;

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 pb-20">
      {/* Header */}
      <header className="px-4 py-3 flex items-center border-b bg-background sticky top-0 z-50">
        <Link href="/akun" className="mr-3">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="text-sm font-bold tracking-tight">Profil Saya</h1>
      </header>

      <main className="flex-1 p-4 space-y-6 max-w-lg mx-auto w-full">
        {/* Foto Profil */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-background border p-4">
          <div className="relative">
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name || "Profile photo"} 
                className="w-24 h-24 rounded-full object-cover border-4 border-muted"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-muted">
                <User className="w-12 h-12 text-primary" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="font-bold text-lg">{user.name || "Pengguna"}</h2>
            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Terverifikasi
            </span>
          </div>
        </div>

        {/* Informasi Pribadi */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Informasi Akun</h3>
          
          <div className="bg-background border divide-y">
            <div className="p-4 flex items-center space-x-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Nama Lengkap</p>
                <p className="text-sm font-medium">{user.name || "Belum diatur"}</p>
              </div>
            </div>
            
            <div className="p-4 flex items-center space-x-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>

            <div className="p-4 flex items-center space-x-4">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Metode Login</p>
                <p className="text-sm font-medium capitalize">Google OAuth</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Saat ini profil dikelola menggunakan akun Google Anda.
          </p>
        </div>
      </main>
    </div>
  );
}
