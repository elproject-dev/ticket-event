"use client";

import { useTransition, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { buatBanner } from "./actions";

export default function AdminTambahBannerPage() {
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      buatBanner(formData);
    });
  };

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-1 bg-white border-b">
        <Link href="/admin/banner" className="p-2 -ml-2 rounded-none hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Tambah Banner</h1>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 pb-10">

          {/* Upload Gambar Utama (Rasio 2:1) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Foto Banner</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[2/1] border-2 border-dashed border-muted-foreground/25 bg-muted/30 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden transition-colors hover:bg-muted/50 rounded-none"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-medium">Klik untuk upload foto</span>
                  <span className="text-[10px] opacity-70">Rasio ideal 2:1</span>
                </div>
              )}
            </div>
            <input
              type="file"
              name="gambar"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              required
            />
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
