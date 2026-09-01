import Link from "next/link";
import { ArrowLeft, MessageCircle, Phone, Mail } from "lucide-react";

export default function PusatBantuanPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-4 py-4 border-b bg-background sticky top-0 z-50 flex items-center space-x-3">
        <Link href="/akun" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Pusat Bantuan</h1>
      </header>

      <main className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Ada yang bisa kami bantu?</h2>
          <p className="text-sm text-muted-foreground">Silakan hubungi tim dukungan kami melalui salah satu saluran di bawah ini.</p>
        </div>

        <div className="space-y-4 pt-4">
          <a href="#" className="flex items-center p-4 border hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mr-4">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Live Chat</h3>
              <p className="text-xs text-muted-foreground">Chat langsung dengan tim dukungan (24/7)</p>
            </div>
          </a>

          <a href="mailto:support@eventticket.com" className="flex items-center p-4 border hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mr-4">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Email Support</h3>
              <p className="text-xs text-muted-foreground">support@eventticket.com</p>
            </div>
          </a>

          <a href="tel:+6281234567890" className="flex items-center p-4 border hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mr-4">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Telepon</h3>
              <p className="text-xs text-muted-foreground">+62 812-3456-7890 (Sen-Jum, 09:00 - 17:00)</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
