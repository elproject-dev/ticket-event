"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { banner } from "@prisma/client";
import { hapusBanner } from "@/app/admin/banner/actions";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
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

export default function BannerCardClient({ banner }: { banner: banner }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleHapus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin menghapus banner ini?")) {
      startTransition(async () => {
        await hapusBanner(banner.id);
      });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/banner/edit/${banner.id}`);
  };

  return (
    <>
      <Card
        className="rounded-none border shadow-sm flex flex-col p-0 gap-0 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform relative"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-full aspect-video bg-muted relative shrink-0">
          {banner.url_gambar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={banner.url_gambar} alt={banner.judul} className="object-cover w-full h-full absolute inset-0" />
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
                <DropdownMenuItem onClick={handleHapus} className="rounded-none cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" disabled={isPending}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isPending ? "Menghapus..." : "Hapus"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-sm line-clamp-1 flex-1">{banner.judul}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 border shrink-0 ${banner.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {banner.is_active ? "AKTIF" : "NONAKTIF"}
              </span>
            </div>
            {banner.deskripsi && (
              <div className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                {banner.deskripsi}
              </div>
            )}
            <div className="text-[10px] text-muted-foreground mt-1.5 line-clamp-1 font-mono">
              {banner.tautan || "Tanpa tautan"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-none sm:rounded-none max-w-sm max-h-[90vh] overflow-y-auto p-4">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg leading-tight">{banner.judul}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Galeri Foto</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  banner.url_gambar, 
                  banner.url_sub_gambar_1, 
                  banner.url_sub_gambar_2, 
                  banner.url_sub_gambar_3, 
                  // @ts-ignore
                  banner.url_sub_gambar_4, 
                  // @ts-ignore
                  banner.url_sub_gambar_5
                ].map((gambar, idx) => (
                  <div key={idx} className="w-full aspect-video bg-muted/50 relative shrink-0 overflow-hidden border">
                    {gambar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={gambar as string} alt={`Foto ${idx + 1}`} className="object-cover w-full h-full absolute inset-0" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-[8px] text-muted-foreground/50 border-dashed border-muted-foreground/20">
                        -
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Status</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 border shrink-0 ${banner.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {banner.is_active ? "AKTIF" : "NONAKTIF"}
                </span>
              </div>

              {banner.tautan && (
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block">Tautan URL</span>
                  <a href={banner.tautan} target="_blank" rel="noreferrer" className="text-primary text-xs underline underline-offset-2 text-right max-w-[200px] truncate">
                    {banner.tautan}
                  </a>
                </div>
              )}

              {banner.deskripsi && (
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground block shrink-0">Deskripsi</span>
                  <span className="font-medium text-xs text-right truncate ml-4 max-w-[200px] text-muted-foreground">{banner.deskripsi}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
