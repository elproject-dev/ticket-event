"use client";

import { useTransition, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { buatBanner } from "./actions";
import PhotoGalleryDnD, { PhotoItem } from "@/components/PhotoGalleryDnD";

export default function AdminTambahBannerPage() {
  const [isPending, startTransition] = useTransition();
  const [photos, setPhotos] = useState<PhotoItem[]>(Array.from({ length: 6 }).map((_, i) => ({
    id: `photo-${i}`,
    file: null,
    previewUrl: null,
    isExisting: false,
  })));
  const [isActive, setIsActive] = useState(true);

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
    if (photos[1]?.file) formData.append("subGambar1", photos[1].file);
    if (photos[2]?.file) formData.append("subGambar2", photos[2].file);
    if (photos[3]?.file) formData.append("subGambar3", photos[3].file);
    if (photos[4]?.file) formData.append("subGambar4", photos[4].file);
    if (photos[5]?.file) formData.append("subGambar5", photos[5].file);

    startTransition(() => {
      buatBanner(formData);
    });
  };

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-1 bg-background border-b">
        <Link href="/admin/banner" className="p-2 -ml-2 rounded-none hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Tambah Banner</h1>
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
            <Input id="judul" name="judul" required className="rounded-none text-sm" placeholder="Masukkan judul banner..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-xs font-semibold">Deskripsi Singkat (Opsional)</Label>
            <Textarea 
              id="deskripsi" 
              name="deskripsi" 
              className="rounded-none text-sm min-h-[80px]" 
              placeholder="Masukkan deskripsi singkat banner..." 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tautan" className="text-xs font-semibold">Tautan URL (Opsional)</Label>
            <Input id="tautan" name="tautan" className="rounded-none text-sm" placeholder="https://..." />
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
                SIMPAN BANNER
              </>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
