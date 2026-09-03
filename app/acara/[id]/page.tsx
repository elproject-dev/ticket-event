import { TopBar } from "@/components/top-bar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CheckoutBar from "./CheckoutBar";
import SubPhotoGallery from "./SubPhotoGallery";

export default async function DetailAcara({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const acara = await prisma.acara.findUnique({
    where: { id }
  });

  if (!acara) {
    return notFound();
  }

  const startDate = new Date(acara.tanggal_mulai);
  const endDate = new Date(acara.tanggal_selesai);
  
  const eventDimulaiDate = startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const eventBerakhirDate = endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const waktuFormat = `${startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

  return (
    <div className="flex flex-col min-h-screen text-xs">
      {/* Consistent Header */}
      <TopBar />

      <main className="flex-1 pb-8 mt-4">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold mb-4 leading-tight tracking-wide">{acara.judul}</h1>
                <SubPhotoGallery 
                  mainImg={acara.url_gambar}
                  img1={acara.url_sub_gambar_1} 
                  img2={acara.url_sub_gambar_2} 
                  img3={acara.url_sub_gambar_3} 
                  img4={acara.url_sub_gambar_4} 
                  img5={acara.url_sub_gambar_5} 
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
                  <div className="font-bold text-xs  text-right max-w-[200px]">{acara.lokasi}</div>
                </div>
                {acara.url_maps && (
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="text-[10px] text-muted-foreground  tracking-widest">Maps</div>
                    <a href={acara.url_maps} target="_blank" rel="noopener noreferrer" className="font-bold text-xs text-primary hover:underline">
                      Buka di Google Maps
                    </a>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="text-[10px] text-muted-foreground  tracking-widest">Penyelenggara</div>
                  <div className="font-bold text-xs ">{acara.nama_penyelenggara || "MANAJEMENTIKET"}</div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold mb-3  tracking-widest">Tentang Acara Ini</h2>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-3 whitespace-pre-wrap">
                  {acara.deskripsi}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CheckoutBar acara={{ ...acara, harga: Number(acara.harga), diskon: acara.diskon ? Number(acara.diskon) : null } as any} />
    </div>
  );
}
