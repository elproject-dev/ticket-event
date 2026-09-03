"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { authClient } from "@/lib/auth/client"
import Link from "next/link"

interface LoginFormProps extends React.ComponentProps<"div"> {
  mode?: "login" | "register";
}

export function LoginForm({
  mode = "login",
  className,
  ...props
}: LoginFormProps) {
  const isDaftar = mode === "register";

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-5xl mx-auto", className)} {...props}>
      <Card className="overflow-hidden p-0 w-full min-h-[500px] md:min-h-[600px] shadow-lg border-0 md:border flex flex-col">
        <CardContent className="grid p-0 md:grid-cols-2 flex-1">
          <div className="p-6 md:p-12 flex flex-col justify-center">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <img 
                  src="/logo-login.svg" 
                  alt="Logo Login" 
                  className="w-20 h-20 mb-4 md:hidden object-contain" 
                />
                <h1 className="text-2xl font-bold tracking-tight">
                  {isDaftar ? 'Daftar Akun' : 'Selamat Datang'}
                </h1>
                <p className="text-balance text-muted-foreground text-sm">
                  {isDaftar 
                    ? 'Daftar sekarang untuk mendapatkan promo diskon khusus pengguna baru.' 
                    : 'Masuk ke akun Anda saat ini untuk mendapatkan promo diskon khusus pengguna baru.'}
                </p>
              </div>
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full h-12 text-sm tracking-wide mt-4"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Lanjutkan dengan Google
              </Button>
              <FieldDescription className="text-center mt-6">
                {isDaftar ? (
                  <>Sudah punya akun? <Link href="/masuk" className="text-primary hover:underline">Masuk sekarang</Link></>
                ) : (
                  <>Belum punya akun? <Link href="/daftar" className="text-primary hover:underline">Daftar sekarang</Link></>
                )}
              </FieldDescription>
            </FieldGroup>
          </div>
          <div className="relative hidden bg-primary/5 md:flex md:items-center md:justify-center p-12">
            <img
              src="/logo-login.svg"
              alt="Logo Login"
              className="w-full max-w-[300px] h-auto object-contain drop-shadow-md"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-[10px]">
        Dengan melanjutkan, Anda menyetujui <a href="#" className="hover:underline">Syarat Layanan</a>{" "}
        dan <a href="#" className="hover:underline">Kebijakan Privasi</a> kami.
      </FieldDescription>
    </div>
  )
}
