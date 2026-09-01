import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/10 text-xs">
      {/* Consistent Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b bg-background sticky top-0 z-50">
        <div>
          <span className="text-sm font-bold tracking-tight">Tiketku.com</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/masuk" className="text-xs font-medium tracking-wider text-muted-foreground hover:text-primary">
            Masuk
          </Link>
          <Link href="/daftar" className="text-xs font-medium tracking-wider text-primary">
            Daftar
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
