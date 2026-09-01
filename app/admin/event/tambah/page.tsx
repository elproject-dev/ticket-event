"use client";

import { useTransition, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, ImagePlus, CalendarIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { buatEvent } from "@/app/admin/event/tambah/actions";
import PhotoGalleryDnD, { PhotoItem } from "@/components/PhotoGalleryDnD";

function formatTanggal(date: Date) {
  return format(date, "dd MMM yyyy", { locale: id }).replace("Agt", "Agu");
}

function TimePicker({ value, onChange, placeholder = "Atur Waktu" }: { value: string, onChange: (val: string) => void, placeholder?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  const [h, m] = value ? value.split(":") : ["", ""];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-start text-left font-normal rounded-none text-sm mt-1",
          !value && "text-muted-foreground"
        )}
      >
        {value || <span className="text-xs">{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 rounded-none" align="center">
        <div className="flex divide-x border-b">
          <div className="flex-1 flex flex-col h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => onChange(`${hour}:${m || "00"}`)}
                className={cn(
                  "py-2 text-sm text-center hover:bg-muted transition-colors rounded-none",
                  h === hour && "bg-primary text-primary-foreground font-bold hover:bg-primary"
                )}
              >
                {hour}
              </button>
            ))}
          </div>
          <div className="flex-1 flex flex-col h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {minutes.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => {
                  onChange(`${h || "00"}:${minute}`);
                  setIsOpen(false);
                }}
                className={cn(
                  "py-2 text-sm text-center hover:bg-muted transition-colors rounded-none",
                  m === minute && "bg-primary text-primary-foreground font-bold hover:bg-primary"
                )}
              >
                {minute}
              </button>
            ))}
          </div>
        </div>
        <div className="p-2 text-center text-[10px] text-muted-foreground bg-muted/30">
          Jam : Menit
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function AdminTambahEventPage() {
  const [isPending, startTransition] = useTransition();
  const [photos, setPhotos] = useState<PhotoItem[]>(Array.from({ length: 6 }).map((_, i) => ({
    id: `photo-${i}`,
    file: null,
    previewUrl: null,
    isExisting: false,
  })));
  const [dateMulai, setDateMulai] = useState<Date>();
  const [dateSelesai, setDateSelesai] = useState<Date>();
  const [timeMulai, setTimeMulai] = useState<string>("");
  const [timeSelesai, setTimeSelesai] = useState<string>("");
  const [isMulaiOpen, setIsMulaiOpen] = useState(false);
  const [isSelesaiOpen, setIsSelesaiOpen] = useState(false);
  const [harga, setHarga] = useState<string>("");
  const [diskon, setDiskon] = useState<string>("");
  const [kapasitas, setKapasitas] = useState<string>("");

  const tzOffset = format(new Date(), "xxx");

  const formatNumber = (val: string) => {
    const rawValue = val.replace(/\D/g, "");
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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
      buatEvent(formData);
    });
  };

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-1 bg-white border-b">
        <Link href="/admin/event" className="p-2 -ml-2 rounded-none hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Tambah Event</h1>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 pb-10">

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Galeri Foto Event (Utama & Tambahan)</Label>
            <PhotoGalleryDnD initialPhotos={photos} onChange={setPhotos} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="judul" className="text-xs font-semibold">Judul Event</Label>
            <Input
              id="judul"
              name="judul"
              placeholder="Masukkan Judul Event"
              required
              className="rounded-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama_penyelenggara" className="text-xs font-semibold">Nama Penyelenggara</Label>
            <Input
              id="nama_penyelenggara"
              name="nama_penyelenggara"
              placeholder="Masukkan Nama Penyelenggara"
              required
              className="rounded-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-xs font-semibold">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              placeholder="Jelaskan tentang event ini"
              required
              className="rounded-none text-sm min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-semibold">Tanggal Dimulai</Label>
              <Popover open={isMulaiOpen} onOpenChange={setIsMulaiOpen}>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-start text-left font-normal rounded-none text-sm",
                    !dateMulai && "text-muted-foreground"
                  )}
                >
                  {dateMulai ? formatTanggal(dateMulai) : <span className="text-xs">Pilih tanggal</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-none" align="start">
                  <Calendar
                    mode="single"
                    selected={dateMulai}
                    onSelect={(date) => {
                      setDateMulai(date);
                      if (date) setIsMulaiOpen(false);
                    }}
                    className="rounded-none border"
                  />
                </PopoverContent>
              </Popover>
              <Label className="text-xs font-semibold mt-2">Waktu Mulai</Label>
              <TimePicker value={timeMulai} onChange={setTimeMulai} />
              <input type="hidden" name="tanggal_mulai" value={dateMulai ? `${format(dateMulai, 'yyyy-MM-dd')}T${timeMulai || '00:00'}:00${tzOffset}` : ""} />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-semibold">Berakhir Pada</Label>
              <Popover open={isSelesaiOpen} onOpenChange={setIsSelesaiOpen}>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-start text-left font-normal rounded-none text-sm",
                    !dateSelesai && "text-muted-foreground"
                  )}
                >
                  {dateSelesai ? formatTanggal(dateSelesai) : <span className="text-xs">Pilih tanggal</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-none" align="start">
                  <Calendar
                    mode="single"
                    selected={dateSelesai}
                    onSelect={(date) => {
                      setDateSelesai(date);
                      if (date) setIsSelesaiOpen(false);
                    }}
                    className="rounded-none border"
                  />
                </PopoverContent>
              </Popover>
              <Label className="text-xs font-semibold mt-2">Waktu Berakhir</Label>
              <TimePicker value={timeSelesai} onChange={setTimeSelesai} />
              <input type="hidden" name="tanggal_selesai" value={dateSelesai ? `${format(dateSelesai, 'yyyy-MM-dd')}T${timeSelesai || '00:00'}:00${tzOffset}` : ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lokasi" className="text-xs font-semibold">Lokasi</Label>
            <Input
              id="lokasi"
              name="lokasi"
              placeholder="Masukkan Lokasi Event"
              required
              className="rounded-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_maps" className="text-xs font-semibold">Link Google Maps (Opsional)</Label>
            <Input
              id="url_maps"
              name="url_maps"
              type="url"
              placeholder="Contoh: https://maps.app.goo.gl/..."
              className="rounded-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harga" className="text-xs font-semibold">Harga (Rp)</Label>
              <Input
                id="harga-display"
                type="text"
                inputMode="numeric"
                value={harga}
                onChange={(e) => setHarga(formatNumber(e.target.value))}
                placeholder="0"
                required
                className="rounded-none text-sm"
              />
              <input type="hidden" name="harga" value={harga.replace(/\./g, "")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diskon" className="text-xs font-semibold">Diskon (Rp - Opsional)</Label>
              <Input
                id="diskon-display"
                type="text"
                inputMode="numeric"
                value={diskon}
                onChange={(e) => setDiskon(formatNumber(e.target.value))}
                placeholder="Kosongkan jika tidak ada"
                className="rounded-none text-sm"
              />
              <input type="hidden" name="diskon" value={diskon.replace(/\./g, "")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kapasitas" className="text-xs font-semibold">Kapasitas</Label>
              <Input
                id="kapasitas-display"
                type="text"
                inputMode="numeric"
                value={kapasitas}
                onChange={(e) => setKapasitas(formatNumber(e.target.value))}
                placeholder="100"
                required
                className="rounded-none text-sm"
              />
              <input type="hidden" name="kapasitas" value={kapasitas.replace(/\./g, "")} />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-none mt-6" disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isPending ? "Menyimpan..." : "Simpan Event"}
          </Button>
        </form>
      </div>
    </>
  );
}
