"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Link from "next/link"

export function HeroCarousel({ bannerList = [] }: { bannerList?: any[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const banner = bannerList[0];

  if (!banner) return null;

  const images = [
    banner.url_gambar,
    banner.url_sub_gambar_1,
    banner.url_sub_gambar_2,
    banner.url_sub_gambar_3,
    banner.url_sub_gambar_4,
    banner.url_sub_gambar_5,
  ].filter(Boolean);

  if (images.length === 0) return null;

  return (
    <section className="border-b relative overflow-hidden bg-background py-6">
      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {images.map((imgUrl, index) => {
              const content = (
                <img
                  src={imgUrl}
                  alt={`${banner.judul} - Foto ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-none"
                />
              );

              return (
                <CarouselItem key={index} className="pl-2 basis-full sm:basis-1/2 md:basis-1/3">
                  {banner.tautan ? (
                    <Link
                      href={banner.tautan}
                      target={banner.tautan.startsWith('http') ? "_blank" : undefined}
                      className="relative flex w-full aspect-video items-center justify-center overflow-hidden rounded-none cursor-pointer bg-muted hover:opacity-90 transition-opacity"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="relative flex w-full aspect-video items-center justify-center overflow-hidden rounded-none bg-muted">
                      {content}
                    </div>
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
