import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

export default function NotifikasiPage() {
  const notifications = [
    {
      id: 1,
      title: "Selamat datang!",
      message: "Terima kasih telah bergabung di Event Ticket. Temukan event menarik untuk Anda.",
      date: "Hari ini",
      isRead: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-4 py-4 border-b bg-background sticky top-0 z-50 flex items-center space-x-3">
        <Link href="/akun" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Notifikasi</h1>
      </header>

      <main className="flex-1 p-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Bell className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">Belum ada notifikasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 border ${!notif.isRead ? 'bg-muted/30 border-primary/20' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm">{notif.title}</h3>
                  <span className="text-[10px] text-muted-foreground">{notif.date}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
