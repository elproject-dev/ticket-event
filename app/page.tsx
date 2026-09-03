import { TopBar } from "@/components/top-bar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Ticket, History, Bell, Clapperboard } from "lucide-react";
import { prisma } from "@/lib/prisma";

import { HeroCarousel } from "@/components/hero-carousel";
import { SplashScreen } from "@/components/splash-screen";

export const dynamic = "force-dynamic";

export default async function Beranda() {
  const [
    bannerList,
    acaraList,
    eventList
  ] = await Promise.all([
    prisma.banner.findMany({
      where: { is_active: true },
      orderBy: { dibuat_pada: "desc" }
    }),
    prisma.acara.findMany({
      orderBy: { dibuat_pada: "desc" }
    }),
    prisma.event.findMany({
      orderBy: { dibuat_pada: "desc" }
    })
  ]);

  const acaraSaatIni = acaraList || [];
  
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const allEvents = eventList || [];
  const unggulan = allEvents.filter(e => new Date(e.tanggal_mulai) <= sevenDaysFromNow).slice(0, 3);
  const mendatang = allEvents.filter(e => new Date(e.tanggal_mulai) > sevenDaysFromNow).slice(0, 3);
  return (
    <div className="flex flex-col min-h-screen text-xs">
      <SplashScreen />
      {/* Consistent Header */}
      <TopBar />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroCarousel bannerList={bannerList || []} />

        {/* Menu Boxes Section */}
        <section className="py-6 border-b bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-2">
              {[
                { title: "AKUN", href: "/akun", icon: User },
                { title: "EVENT", href: "/event", icon: Clapperboard },
                { title: "RIWAYAT", href: "/riwayat", icon: History },
                { title: "NOTIFIKASI", href: "/notifikasi", icon: Bell }
              ].map((menu, idx) => {
                const Icon = menu.icon;
                return (
                  <Link key={idx} href={menu.href} className="flex flex-col items-center justify-center h-16 border bg-background hover:bg-muted/20 transition-colors relative group overflow-hidden gap-1.5">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors relative z-10" strokeWidth={1.5} />
                    <span className="text-[8px] font-bold tracking-widest relative z-10 text-center">{menu.title}</span>
                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Acara Saat Ini Section */}
        {acaraSaatIni.length > 0 && (
          <section className="py-8 bg-background">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-5 border-b pb-2">
                <h2 className="text-sm font-bold tracking-widest text-primary">JADWAL ACARA</h2>
                <Link href="/acara" className="text-[10px] font-bold text-muted-foreground">
                  Lihat Semua
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {acaraSaatIni.map((acara) => (
                  <Link href={`/acara/${acara.id}`} key={acara.id}>
                    <div className="border border-primary/20 bg-primary/5 transition-colors hover:bg-primary/10">
                      <div
                        className="aspect-video bg-cover bg-center relative border-b border-primary/20"
                        style={{ backgroundImage: `url('${acara.url_gambar || '/tech-banner.jpg'}')` }}
                      >
                        {new Date() >= new Date(acara.tanggal_mulai) && new Date() <= new Date(acara.tanggal_selesai) && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-none uppercase tracking-widest animate-pulse">
                            Live Now
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col">
                        <div className="font-bold text-sm text-primary tracking-wide mb-3 line-clamp-1">{acara.judul}</div>
                        <div className="flex flex-col gap-1.5 text-[10px] text-muted-foreground mb-4 tracking-wider">
                          <div>
                            {new Date(acara.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} - {new Date(acara.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                          </div>
                          <div>{acara.lokasi}</div>
                        </div>
                        <div className="flex items-center justify-between border-t border-primary/10 pt-3">
                          <span className="font-bold text-sm">IDR {Number(acara.harga).toLocaleString('id-ID')}</span>
                          <span className="text-[10px] font-bold tracking-widest text-primary">Detail</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Events Section */}
        <section className="py-8 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-5 border-b pb-2">
              <h2 className="text-sm font-bold  tracking-widest">EVENT PILIHAN</h2>
              <Link href="/event" className="text-[10px]  font-bold text-muted-foreground">
                Lihat Semua
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {unggulan.length > 0 ? unggulan.map((event) => (
                <Link href={`/event/${event.id}`} key={event.id}>
                  <div className="border bg-background transition-colors hover:bg-muted/10">
                    <div
                      className="aspect-video bg-cover bg-center relative border-b"
                      style={{ backgroundImage: `url('${event.url_gambar || '/tech-banner.jpg'}')` }}
                    >
                      {/* Premium Image Placeholder */}
                      {new Date() >= new Date(event.tanggal_mulai) && new Date() <= new Date(event.tanggal_selesai) && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-none uppercase tracking-widest animate-pulse">
                          Live Now
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col">
                      <div className="font-bold text-sm text-primary tracking-wide mb-3 line-clamp-1">{event.judul}</div>
                      <div className="flex flex-col gap-1.5 text-[10px] text-muted-foreground mb-4  tracking-wider">
                        <div>
                          {new Date(event.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} - {new Date(event.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                        </div>
                        <div>{event.lokasi}</div>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="font-bold text-sm">IDR {Number(event.harga).toLocaleString('id-ID')}</span>
                        <span className="text-[10px] font-bold  tracking-widest text-primary">Detail</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="text-xs text-muted-foreground text-center py-4 border border-dashed">Belum ada acara unggulan</p>
              )}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-8 border-t">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-5 border-b pb-2">
              <h2 className="text-sm font-bold  tracking-widest">MENDATANG</h2>
              <Link href="/event" className="text-[10px]  font-bold text-muted-foreground">
                Semua Event
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mendatang.length > 0 ? mendatang.map((event) => (
                <Link href={`/event/${event.id}`} key={event.id}>
                  <div className="border bg-background transition-colors hover:bg-muted/10">
                    <div
                      className="aspect-video bg-cover bg-center relative border-b"
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
                      <div className="flex flex-col gap-1.5 text-[10px] text-muted-foreground mb-4  tracking-wider">
                        <div>
                          {new Date(event.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} - {new Date(event.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                        </div>
                        <div>{event.lokasi}</div>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="font-bold text-sm">IDR {Number(event.harga).toLocaleString('id-ID')}</span>
                        <span className="text-[10px] font-bold  tracking-widest text-primary">Detail</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="col-span-full text-xs text-muted-foreground text-center py-4 border border-dashed">Belum ada acara mendatang</p>
              )}
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
