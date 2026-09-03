import Link from "next/link"
import { auth } from "@/lib/auth/server"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export async function TopBar({ title = "Tiketku.com" }: { title?: string }) {
  const { data: session } = await auth.getSession()

  return (
    <header className="px-4 py-3 flex items-center justify-between border-b bg-background sticky top-0 z-50">
      <div>
        <span className="text-sm font-bold tracking-tight">{title}</span>
      </div>
      <nav className="flex items-center gap-3">
        {session?.user ? (
          <Link href="/akun" className="flex items-center">
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || "User"} 
                referrerPolicy="no-referrer"
                className="size-8 rounded-full border bg-muted object-cover"
              />
            ) : (
              <Avatar className="size-8 rounded-full border bg-muted">
                <AvatarFallback className="text-[10px]">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            )}
          </Link>
        ) : (
          <>
            <Link href="/masuk" className="text-xs font-medium tracking-wider text-muted-foreground hover:text-primary">
              Masuk
            </Link>
            <Link href="/daftar" className="text-xs font-medium tracking-wider text-primary">
              Daftar
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
