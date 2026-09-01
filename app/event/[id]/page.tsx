import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CheckoutBar from "./CheckoutBar";
import SubPhotoGallery from "./SubPhotoGallery";

export default async function DetailEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id }
  });

  if (!event) {
    return notFound();
  }

  const startDate = new Date(event.tanggal_mulai);
  const endDate = new Date(event.tanggal_selesai);
  
  const eventDimulaiDate = startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const eventBerakhirDate = endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const waktuFormat = `${startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

  return (
    <div className="flex flex-col min-h-screen text-xs">
      {/* Consistent Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b bg-background sticky top-0 z-50">
        <div>
          <span className="text-sm font-bold tracking-tight ">ManajemenTiket</span>
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

      <main className="flex-1 pb-48">
        {/* Event Banner */}
        <div 
          className="w-full h-[25vh] bg-cover bg-center relative border-b"
          style={{ backgroundImage: `url('${event.url_gambar || '/tech-banner.jpg'}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <Link href="/" className="absolute top-4 left-4 z-10 p-2 text-white bg-none hover:bg-white/10  rounded-none">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold mb-4 leading-tight tracking-wide">{event.judul}</h1>
                <SubPhotoGallery 
                  img1={event.url_sub_gambar_1} 
                  img2={event.url_sub_gambar_2} 
                  img3={event.url_sub_gambar_3} 
                />
              </div>

              <div className="flex flex-col gap-4 py-5 border-y">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="text-[10px] text-muted-foreground  tracking-widest">Event Dimulai</div>
                  <div className="font-bold text-xs ">{eventDimulaiDate}</div>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="text-[10px] text-muted-foreground  tracking-widest">Event Berakhir</div>
                  <div className="font-bold text-xs ">{eventBerakhirDate}</div>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="text-[10px] text-muted-foreground  tracking-widest">Waktu</div>
                  <div className="font-bold text-xs ">{waktuFormat}</div>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="text-[10px] text-muted-foreground  tracking-widest">Lokasi</div>
                  <div className="font-bold text-xs  text-right max-w-[200px]">{event.lokasi}</div>
                </div>
                {event.url_maps && (
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="text-[10px] text-muted-foreground  tracking-widest">Maps</div>
                    <a href={event.url_maps} target="_blank" rel="noopener noreferrer" className="font-bold text-xs text-primary hover:underline">
                      Buka di Google Maps
                    </a>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="text-[10px] text-muted-foreground  tracking-widest">Penyelenggara</div>
                  <div className="font-bold text-xs ">{event.nama_penyelenggara || "MANAJEMENTIKET"}</div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold mb-3  tracking-widest">Tentang Event Ini</h2>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-3 whitespace-pre-wrap">
                  {event.deskripsi}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CheckoutBar event={event} />
    </div>
  );
}
