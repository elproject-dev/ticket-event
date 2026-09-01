"use client";

import { useTransition, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, ImagePlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { perbaruiEvent } from "@/app/admin/event/edit/[id]/actions";
import PhotoGalleryDnD, { PhotoItem } from "@/components/PhotoGalleryDnD";
import { event } from "@prisma/client";

type Event = event;

function formatTanggal(date: Date) {
  return format(date, "dd MMM yyyy", { locale: id }).replace("Agt", "Agu");
}

function formatJamStr(date: Date) {
  return format(date, "HH:mm");
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

export default function EditEventClient({ event }: { event: Event }) {
  const [isPending, startTransition] = useTransition();

  const [photos, setPhotos] = useState<PhotoItem[]>([
    { id: "photo-0", file: null, previewUrl: event.url_gambar, isExisting: !!event.url_gambar },
    { id: "photo-1", file: null, previewUrl: event.url_sub_gambar_1, isExisting: !!event.url_sub_gambar_1 },
    { id: "photo-2", file: null, previewUrl: event.url_sub_gambar_2, isExisting: !!event.url_sub_gambar_2 },
    { id: "photo-3", file: null, previewUrl: event.url_sub_gambar_3, isExisting: !!event.url_sub_gambar_3 },
    { id: "photo-4", file: null, previewUrl: event.url_sub_gambar_4, isExisting: !!event.url_sub_gambar_4 },
    { id: "photo-5", file: null, previewUrl: event.url_sub_gambar_5, isExisting: !!event.url_sub_gambar_5 },
  ]);

  // Date and Time init handling safely
  const parsedTanggalMulai = event.tanggal_mulai ? new Date(event.tanggal_mulai) : undefined;
  const parsedTanggalSelesai = event.tanggal_selesai ? new Date(event.tanggal_selesai) : undefined;

  const [dateMulai, setDateMulai] = useState<Date | undefined>(parsedTanggalMulai);
  const [dateSelesai, setDateSelesai] = useState<Date | undefined>(parsedTanggalSelesai);

  const [timeMulai, setTimeMulai] = useState<string>(parsedTanggalMulai ? formatJamStr(parsedTanggalMulai) : "");
  const [timeSelesai, setTimeSelesai] = useState<string>(parsedTanggalSelesai ? formatJamStr(parsedTanggalSelesai) : "");

  const [isMulaiOpen, setIsMulaiOpen] = useState(false);
  const [isSelesaiOpen, setIsSelesaiOpen] = useState(false);
  const [harga, setHarga] = useState<string>(event.harga.toString());
  const [diskon, setDiskon] = useState<string>(event.diskon ? event.diskon.toString() : "");
  const [kapasitas, setKapasitas] = useState<string>(event.kapasitas.toString());

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
      perbaruiEvent(event.id, formData);
    });
  };

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-1 bg-white border-b">
        <Link href="/admin/event" className="p-2 -ml-2 rounded-none hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Edit Event</h1>
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
              defaultValue={event.judul}
              placeholder="Contoh: Konser Musik"
              required
              className="rounded-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama_penyelenggara" className="text-xs font-semibold">Nama Penyelenggara</Label>
            <Input
              id="nama_penyelenggara"
              name="nama_penyelenggara"
              defaultValue={event.nama_penyelenggara || ""}
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
              defaultValue={event.deskripsi || ""}
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
              defaultValue={event.lokasi}
              placeholder="Contoh: Stadion Utama"
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
              defaultValue={event.url_maps || ""}
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
                value={formatNumber(harga)}
                onChange={(e) => setHarga(e.target.value)}
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
                value={formatNumber(diskon)}
                onChange={(e) => setDiskon(e.target.value)}
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
                value={formatNumber(kapasitas)}
                onChange={(e) => setKapasitas(e.target.value)}
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
              <Save className="w-6 h-4 mr-2" />
            )}
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </div>
    </>
  );
}
