"use client";

import { useEffect, useState } from "react";
import { Clapperboard, Loader2 } from "lucide-react";

export function SplashScreen() {
  const [mounted, setMounted] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasShownSplash = sessionStorage.getItem("splash_shown");
    if (hasShownSplash) {
      setMounted(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Start fading out after 2s

    const timer2 = setTimeout(() => {
      sessionStorage.setItem("splash_shown", "true");
      setMounted(false);
    }, 2500); // Unmount after 2.5s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary text-primary-foreground transition-opacity duration-500 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="animate-bounce">
          <Clapperboard className="w-24 h-24 stroke-[1.5]" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-black tracking-[0.2em] animate-pulse">TIKETKU.COM</h1>
          <p className="text-xs font-medium tracking-widest opacity-80 uppercase">Event Ticketing App</p>
        </div>
        <div className="mt-8">
          <Loader2 className="w-6 h-6 animate-spin opacity-80" />
        </div>
      </div>
    </div>
  );
}
