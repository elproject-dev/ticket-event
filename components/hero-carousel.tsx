"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroCarousel({ bannerList = [] }: { bannerList?: any[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  if (!bannerList || bannerList.length === 0) return null;

  return (
    <section className="border-b relative overflow-hidden bg-background">
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {bannerList.map((banner) => {
            const content = (
              <>
                <img
                  src={banner.url_gambar || "/tech-banner-1.jpg"}
                  alt={banner.judul}
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-none"
                />
                <div className="absolute inset-0 flex items-end px-4 pb-3 md:px-10 md:pb-5 pt-10">
                  <div className="max-w-[500px] text-left z-10 relative">
                    <h1 className="text-base md:text-xl font-bold tracking-tight mb-1 text-balance leading-snug text-white drop-shadow-md">
                      {banner.judul}
                    </h1>
                    {banner.deskripsi && (
                      <p className="text-xs md:text-sm text-white/90 line-clamp-2 drop-shadow">
                        {banner.deskripsi}
                      </p>
                    )}
                  </div>
                  {/* Overlay to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0 hover:from-black/70 hover:via-black/10 transition-colors"></div>
                </div>
              </>
            );

            return (
              <CarouselItem key={banner.id}>
                {banner.tautan ? (
                  <Link 
                    href={banner.tautan} 
                    target={banner.tautan.startsWith('http') ? "_blank" : undefined}
                    className="relative flex w-full aspect-[2/1] items-center justify-start overflow-hidden rounded-none cursor-pointer"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="relative flex w-full aspect-[2/1] items-center justify-start overflow-hidden rounded-none">
                    {content}
                  </div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
