"use client";

import { useTransition, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { perbaruiBanner } from "@/app/admin/banner/edit/[id]/actions";
import { banner } from "@prisma/client";
import PhotoGalleryDnD, { PhotoItem } from "@/components/PhotoGalleryDnD";

export default function EditBannerClient({ banner }: { banner: banner }) {
  const [isPending, startTransition] = useTransition();
  const [photos, setPhotos] = useState<PhotoItem[]>([
    { id: "photo-0", file: null, previewUrl: banner.url_gambar, isExisting: !!banner.url_gambar },
    { id: "photo-1", file: null, previewUrl: banner.url_sub_gambar_1, isExisting: !!banner.url_sub_gambar_1 },
    { id: "photo-2", file: null, previewUrl: banner.url_sub_gambar_2, isExisting: !!banner.url_sub_gambar_2 },
    { id: "photo-3", file: null, previewUrl: banner.url_sub_gambar_3, isExisting: !!banner.url_sub_gambar_3 },
    { id: "photo-4", file: null, previewUrl: banner.url_sub_gambar_4, isExisting: !!banner.url_sub_gambar_4 },
    { id: "photo-5", file: null, previewUrl: banner.url_sub_gambar_5, isExisting: !!banner.url_sub_gambar_5 },
  ]);
  const [isActive, setIsActive] = useState(banner.is_active || false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    formData.delete("gambar");
    formData.delete("subGambar1");
    formData.delete("subGambar2");
    formData.delete("subGambar3");
    formData.delete("subGambar4");
    formData.delete("subGambar5");

    if (photos[0]?.file) formData.append("gambar", photos[0].file);
    else if (photos[0]?.isExisting && photos[0].previewUrl) formData.append("existing_gambar", photos[0].previewUrl);

    if (photos[1]?.file) formData.append("subGambar1", photos[1].file);
    else if (photos[1]?.isExisting && photos[1].previewUrl) formData.append("existing_subGambar1", photos[1].previewUrl);

    if (photos[2]?.file) formData.append("subGambar2", photos[2].file);
    else if (photos[2]?.isExisting && photos[2].previewUrl) formData.append("existing_subGambar2", photos[2].previewUrl);

    if (photos[3]?.file) formData.append("subGambar3", photos[3].file);
    else if (photos[3]?.isExisting && photos[3].previewUrl) formData.append("existing_subGambar3", photos[3].previewUrl);

    if (photos[4]?.file) formData.append("subGambar4", photos[4].file);
    else if (photos[4]?.isExisting && photos[4].previewUrl) formData.append("existing_subGambar4", photos[4].previewUrl);

    if (photos[5]?.file) formData.append("subGambar5", photos[5].file);
    else if (photos[5]?.isExisting && photos[5].previewUrl) formData.append("existing_subGambar5", photos[5].previewUrl);

    startTransition(() => {
      perbaruiBanner(banner.id, formData);
    });
  };

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-1 bg-background border-b">
        <Link href="/admin/banner" className="p-2 -ml-2 rounded-none hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Edit Banner</h1>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 pb-10">

          {/* Upload Galeri Banner (Utama & Tambahan) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Galeri Foto Banner (Utama & Tambahan)</Label>
            <p className="text-[10px] text-muted-foreground">Rasio ideal 2:1. Geser untuk mengatur urutan.</p>
            <PhotoGalleryDnD initialPhotos={photos} onChange={setPhotos} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="judul" className="text-xs font-semibold">Judul Banner</Label>
            <Input id="judul" name="judul" defaultValue={banner.judul} required className="rounded-none text-sm" placeholder="Masukkan judul banner..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-xs font-semibold">Deskripsi Singkat (Opsional)</Label>
            <Textarea 
              id="deskripsi" 
              name="deskripsi"
              defaultValue={banner.deskripsi || ""} 
              className="rounded-none text-sm min-h-[80px]" 
              placeholder="Masukkan deskripsi singkat banner..." 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tautan" className="text-xs font-semibold">Tautan URL (Opsional)</Label>
            <Input id="tautan" name="tautan" defaultValue={banner.tautan || ""} className="rounded-none text-sm" placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Status Banner</Label>
                <p className="text-[10px] text-muted-foreground">Tampilkan banner di halaman beranda</p>
              </div>
              <input type="hidden" name="status" value={isActive ? "true" : "false"} />
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'bg-primary' : 'bg-input'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-background shadow-sm transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full rounded-none mt-6 font-semibold">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                MENYIMPAN...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                SIMPAN PERUBAHAN
              </>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
