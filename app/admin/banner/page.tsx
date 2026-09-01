import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  const banner = await prisma.banner.findFirst({
    orderBy: {
      dibuat_pada: "desc"
    }
  });

  const photos = banner ? [
    banner.url_gambar,
    banner.url_sub_gambar_1,
    banner.url_sub_gambar_2,
    banner.url_sub_gambar_3,
    banner.url_sub_gambar_4,
    banner.url_sub_gambar_5,
  ] : [];

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-1 bg-white border-b">
        <Link href="/admin" className="p-2 -ml-2 rounded-none hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Kelola Banner</h1>
        {banner ? (
          <Link href={`/admin/banner/edit/${banner.id}`} className="p-2 -mr-2 rounded-none hover:bg-muted transition-colors">
            <Edit className="w-5 h-5" />
          </Link>
        ) : (
          <Link href="/admin/banner/tambah" className="p-2 -mr-2 rounded-none hover:bg-muted transition-colors">
            <Plus className="w-5 h-5" />
          </Link>
        )}
      </div>
      <div className="p-4 space-y-6">
        {!banner ? (
          <div className="text-center py-10 text-muted-foreground text-xs border border-dashed rounded-none flex flex-col items-center justify-center gap-2">
            Belum ada banner yang diatur.
            <Link href="/admin/banner/tambah" className="text-primary hover:underline font-bold mt-2 text-sm">
              Buat Banner Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="font-bold text-lg">{banner.judul}</h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">{banner.deskripsi || "Tanpa deskripsi"}</p>
                {banner.tautan && (
                  <a href={banner.tautan} target="_blank" rel="noreferrer" className="text-primary text-[10px] hover:underline mt-2 inline-block">
                    {banner.tautan}
                  </a>
                )}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 border shrink-0 ${banner.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {banner.is_active ? "AKTIF" : "NONAKTIF"}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((url, index) => (
                <Card key={index} className="rounded-none border shadow-sm aspect-video relative overflow-hidden bg-muted">
                  {url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover absolute inset-0" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground absolute inset-0">
                      KOSONG
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold border">
                    #{index + 1}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
