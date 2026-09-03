import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Mail, Shield, AlertTriangle, Phone } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import { PhoneDialog } from "./phone-dialog";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const { data: session } = await auth.getSession();

  console.log("Session in /profil:", session);

  if (!session?.user) {
    console.log("No session user, redirecting to /masuk");
    redirect("/masuk");
  }

  const dbUser = (await prisma.pengguna.findUnique({
    where: { email: session.user.email },
  })) as any;

  if (!dbUser) {
    redirect("/masuk");
  }

  const user = session.user;
  const isPhoneVerified = !!dbUser.no_telp; 

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 pb-20">
      {/* Header */}
      <header className="px-4 py-3 flex items-center border-b bg-background sticky top-0 z-50">
        <Link href="/akun" className="mr-3">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="text-sm font-bold tracking-tight">Profil Saya</h1>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {/* Pesan Peringatan Kuning jika belum verifikasi no telp */}
        {!isPhoneVerified && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong className="font-bold">Perhatian:</strong> Anda belum melakukan verifikasi nomor telepon. Untuk pemesanan tiket online{" "}
                  <PhoneDialog
                    initialPhone={dbUser.no_telp}
                    trigger={
                      <button type="button" className="font-medium underline hover:text-yellow-600 cursor-pointer bg-transparent border-0 p-0 text-yellow-700 font-sans text-sm">
                        Verifikasi sekarang
                      </button>
                    }
                  />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Foto Profil */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-background border p-4">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile photo"}
                referrerPolicy="no-referrer"
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
            {isPhoneVerified && (
              <span className="inline-flex items-center mt-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-600 text-white shadow-sm uppercase tracking-wider">
                Terverifikasi
              </span>
            )}
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
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Nomor Telepon</p>
                  <p className="text-sm font-medium">
                    {dbUser.no_telp ? dbUser.no_telp : <span className="text-muted-foreground">Belum diatur</span>}
                  </p>
                </div>
                <PhoneDialog initialPhone={dbUser.no_telp} />
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
