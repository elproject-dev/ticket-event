"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function SubPhotoGallery({
  mainImg,
  img1,
  img2,
  img3,
  img4,
  img5,
}: {
  mainImg?: string | null;
  img1?: string | null;
  img2?: string | null;
  img3?: string | null;
  img4?: string | null;
  img5?: string | null;
}) {
  const plugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  const images = [mainImg, img1, img2, img3, img4, img5].filter(Boolean);

  if (images.length === 0) return null;

  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {images.map((img, index) => (
            <CarouselItem key={index} className="pl-2 basis-full sm:basis-1/2 md:basis-1/3">
              <Dialog>
                <DialogTrigger 
                  render={
                    <button type="button" className="aspect-video rounded-none overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity block w-full p-0 border border-primary/10 bg-transparent text-left focus:outline-none">
                      <img src={img as string} alt={`Galeri ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  }
                />
                <DialogContent showCloseButton={false} className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] p-0 border-none bg-transparent shadow-none ring-0">
                  <DialogClose render={<button className="w-full h-full cursor-zoom-out focus:outline-none" />}>
                    <img src={img as string} alt={`Galeri ${index + 1}`} className="w-full h-auto max-h-[90vh] object-contain rounded-none" />
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
