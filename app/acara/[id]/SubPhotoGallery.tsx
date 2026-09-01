"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SubPhotoGallery({
  img1,
  img2,
  img3,
}: {
  img1?: string | null;
  img2?: string | null;
  img3?: string | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {img1 ? (
        <Dialog>
          <DialogTrigger 
            render={
              <button type="button" className="aspect-[2/1] rounded-none overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity block w-full p-0 border-0 bg-transparent text-left focus:outline-none">
                <img src={img1} alt="Galeri 1" className="w-full h-full object-cover" />
              </button>
            }
          />
          <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none ring-0">
            <img src={img1} alt="Galeri 1" className="w-full h-auto object-contain rounded-none" />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="aspect-[2/1] rounded-none bg-muted/30 border border-dashed flex items-center justify-center">
          <span className="text-[8px] text-muted-foreground tracking-widest uppercase">Foto 1</span>
        </div>
      )}

      {img2 ? (
        <Dialog>
          <DialogTrigger 
            render={
              <button type="button" className="aspect-[2/1] rounded-none overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity block w-full p-0 border-0 bg-transparent text-left focus:outline-none">
                <img src={img2} alt="Galeri 2" className="w-full h-full object-cover" />
              </button>
            }
          />
          <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none ring-0">
            <img src={img2} alt="Galeri 2" className="w-full h-auto object-contain rounded-none" />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="aspect-[2/1] rounded-none bg-muted/30 border border-dashed flex items-center justify-center">
          <span className="text-[8px] text-muted-foreground tracking-widest uppercase">Foto 2</span>
        </div>
      )}

      {img3 ? (
        <Dialog>
          <DialogTrigger 
            render={
              <button type="button" className="aspect-[2/1] rounded-none overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity block w-full p-0 border-0 bg-transparent text-left focus:outline-none">
                <img src={img3} alt="Galeri 3" className="w-full h-full object-cover" />
              </button>
            }
          />
          <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none ring-0">
            <img src={img3} alt="Galeri 3" className="w-full h-auto object-contain rounded-none" />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="aspect-[2/1] rounded-none bg-muted/30 border border-dashed flex items-center justify-center">
          <span className="text-[8px] text-muted-foreground tracking-widest uppercase">Foto 3</span>
        </div>
      )}
    </div>
  );
}
