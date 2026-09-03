import { TopBar } from "@/components/top-bar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventPage() {
  const eventList = await prisma.event.findMany({
    orderBy: { dibuat_pada: "desc" }
  });

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 text-xs">
      {/* Consistent Header */}
      <TopBar />

      <main className="flex-1 p-4 pb-24">
        <div className="container mx-auto">
          {!eventList || eventList.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border border-dashed rounded-none bg-background">
              Belum ada event saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventList.map((event) => (
                <Link href={`/event/${event.id}`} key={event.id}>
                  <div className="border border-primary/20 bg-primary/5 transition-colors hover:bg-primary/10 shadow-sm">
                    <div
                      className="aspect-video bg-cover bg-center relative border-b border-primary/20"
                      style={{ backgroundImage: `url('${event.url_gambar || '/tech-banner.jpg'}')` }}
                    >
                      {new Date() >= new Date(event.tanggal_mulai) && new Date() <= new Date(event.tanggal_selesai) && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-none uppercase tracking-widest animate-pulse">
                          Live Now
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col">
                      <div className="font-bold text-sm text-primary tracking-wide mb-3 line-clamp-1">{event.judul}</div>
                      <div className="flex flex-col gap-1.5 text-[10px] text-muted-foreground mb-4 tracking-wider">
                        <div>
                          {new Date(event.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} - {new Date(event.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                        </div>
                        <div>{event.lokasi}</div>
                      </div>
                      <div className="flex items-center justify-between border-t border-primary/10 pt-3">
                        <span className="font-bold text-sm">IDR {Number(event.harga).toLocaleString('id-ID')}</span>
                        <span className="text-[10px] font-bold tracking-widest text-primary hover:underline">Detail</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
