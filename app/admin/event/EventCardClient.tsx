"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { event } from "@prisma/client";
import { hapusEvent } from "@/app/admin/event/actions";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatTanggalIndo(date: Date | string) {
  return format(new Date(date), "dd MMM yyyy", { locale: id }).replace("Agt", "Agu");
}

function formatJam(date: Date | string) {
  return format(new Date(date), "HH:mm");
}

export default function EventCardClient({ event }: { event: event }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Yakin ingin menghapus event ini?")) {
      startTransition(async () => {
        await hapusEvent(event.id);
        router.refresh();
      });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/event/edit/${event.id}`);
  };

  return (
    <>
      <Card
        className="rounded-none border shadow-sm flex flex-col p-0 gap-0 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-full aspect-video bg-muted relative shrink-0">
          {event.url_gambar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={event.url_gambar} alt={event.judul} className="object-cover w-full h-full absolute inset-0" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground absolute inset-0">
              IMG
            </div>
          )}

          <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-none bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 text-foreground">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none">
                <DropdownMenuItem onClick={handleEdit} className="rounded-none cursor-pointer" disabled={isPending}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="rounded-none cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" disabled={isPending}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isPending ? "Menghapus..." : "Hapus"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardContent className="p-4 flex-1 space-y-1">
          <h3 className="font-semibold text-sm line-clamp-1">{event.judul}</h3>
          <div className="flex justify-between items-start mt-1">
            <div className="flex flex-col text-[10px] text-muted-foreground gap-1 flex-1">
              <div>
                {formatTanggalIndo(event.tanggal_mulai)} - {formatTanggalIndo(event.tanggal_selesai)}
              </div>
              <div className="line-clamp-1">
                {event.lokasi}
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2 gap-0.5">
              <span className="text-[10px] text-muted-foreground font-medium">{formatJam(event.tanggal_mulai)} - {formatJam(event.tanggal_selesai)} WIB</span>
              <span className="text-xs font-bold text-primary">Rp {Number(event.harga).toLocaleString("id-ID")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-none sm:rounded-md w-[95vw] max-w-sm md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg leading-tight">{event.judul}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {event.url_gambar && (
              <div className="space-y-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Galeri Foto</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    event.url_gambar, 
                    event.url_sub_gambar_1, 
                    event.url_sub_gambar_2, 
                    event.url_sub_gambar_3, 
                    // @ts-ignore
                    event.url_sub_gambar_4, 
                    // @ts-ignore
                    event.url_sub_gambar_5
                  ].map((gambar, idx) => (
                    <div key={idx} className="w-full aspect-video bg-muted/50 relative shrink-0 overflow-hidden">
                      {gambar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={gambar as string} alt={`Foto ${idx + 1}`} className="object-cover w-full h-full absolute inset-0" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[8px] text-muted-foreground/50 border border-dashed border-muted-foreground/20">
                          -
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Jadwal</span>
                <span className="font-medium text-xs">{formatTanggalIndo(event.tanggal_mulai)} - {formatTanggalIndo(event.tanggal_selesai)}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Waktu</span>
                <span className="font-medium text-xs">{formatJam(event.tanggal_mulai)} - {formatJam(event.tanggal_selesai)} WIB</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Lokasi</span>
                <span className="font-medium text-xs text-right max-w-[200px] truncate">{event.lokasi}</span>
              </div>

              {event.url_maps && (
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Peta Lokasi</span>
                  <a href={event.url_maps} target="_blank" rel="noreferrer" className="text-primary text-xs underline underline-offset-2 text-right">
                    Buka di Google Maps
                  </a>
                </div>
              )}

              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Penyelenggara</span>
                <span className="font-medium text-xs">{event.nama_penyelenggara || "MANAJEMENTIKET"}</span>
              </div>

              <div className="flex justify-between items-center border-t border-b py-2 my-2">
                <div>
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Harga Tiket</span>
                  <span className="font-bold text-primary text-base">Rp {Number(event.harga).toLocaleString("id-ID")}</span>
                </div>
                {event.diskon && Number(event.diskon) > 0 ? (
                  <div className="text-right">
                    <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Diskon</span>
                    <span className="text-emerald-600 font-bold text-base">Rp {Number(event.diskon).toLocaleString("id-ID")}</span>
                  </div>
                ) : null}
              </div>

              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Tiket Tersedia</span>
                <span className="font-medium text-xs">{event.kapasitas.toLocaleString("id-ID")} Orang</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block shrink-0">Deskripsi Event</span>
                <span className="font-medium text-xs text-right truncate ml-4 max-w-[200px] text-muted-foreground">{event.deskripsi}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
