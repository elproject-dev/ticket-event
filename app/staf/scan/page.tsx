"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Scan, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ScanBarcodePage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
    ticketData?: any;
  } | null>(null);

  const handleScan = async (text: string) => {
    if (text && !isValidating && !validationResult) {
      setScanResult(text);
      setIsValidating(true);
      
      try {
        const response = await fetch("/api/validasi-tiket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId: text }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setValidationResult({
            success: true,
            message: "Tiket Valid! Akses berhasil diterima.",
            ticketData: data.tiket
          });
        } else {
          setValidationResult({
            success: false,
            message: data.error || "Tiket tidak valid atau sudah digunakan.",
          });
        }
      } catch (error: any) {
        setValidationResult({
          success: false,
          message: "Gagal terhubung ke server.",
        });
      } finally {
        setIsValidating(false);
      }
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setValidationResult(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden select-none">
      <style>{`
        @keyframes scanBeam {
          0% { top: 4%; opacity: 0.6; }
          50% { top: 92%; opacity: 1; }
          100% { top: 4%; opacity: 0.6; }
        }
        .animate-scan-beam {
          animation: scanBeam 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="flex items-center space-x-3">
          <Link href="/" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <Scan className="w-4 h-4 text-primary animate-pulse" />
              Scanner e-Tiket
            </h1>
            <p className="text-[10px] text-zinc-400">Pemindai Otomatis QR Code</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative justify-center items-center p-4">
        {!scanResult ? (
          <div className="w-full max-w-sm aspect-square overflow-hidden bg-zinc-950 border border-white/10 rounded-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            {/* Base Scanner */}
            <Scanner 
              onScan={(result) => handleScan(result[0].rawValue)} 
              formats={["qr_code"]}
              components={{ finder: false }}
            />

            {/* Futuristic HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
              <div className="w-full aspect-square border border-primary/40 rounded-xl relative shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                
                {/* 4 Corner Target Brackets */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-sm animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-sm animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-sm animate-pulse"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-sm animate-pulse"></div>

                {/* Animated Neon Laser Beam */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#3b82f6] absolute animate-scan-beam" />

                {/* Center Target Dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border border-primary/50 bg-primary/20 animate-ping"></div>
                </div>

                {/* Status Text inside Frame */}
                <div className="absolute bottom-2 inset-x-0 text-center">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold tracking-widest text-primary border border-primary/30 uppercase">
                    Mencari QR Code...
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 w-full max-w-sm mx-auto bg-zinc-900/90 backdrop-blur-lg border border-zinc-800 rounded-2xl shadow-2xl transition-all duration-300">
            {isValidating ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <Sparkles className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-xs font-bold tracking-widest uppercase animate-pulse text-zinc-300">
                  Memvalidasi Tiket...
                </p>
              </div>
            ) : validationResult ? (
              <div className="flex flex-col items-center justify-center text-center space-y-5 py-4">
                {validationResult.success ? (
                  <>
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold tracking-tight text-emerald-400 uppercase">
                        Akses Diberikan
                      </h2>
                      <p className="text-xs text-zinc-300">{validationResult.message}</p>
                    </div>
                    
                    {validationResult.ticketData && (
                      <div className="w-full p-4 bg-black/60 border border-emerald-500/30 rounded-xl text-left space-y-2.5 text-xs shadow-inner">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <span className="text-zinc-400">ID Tiket</span>
                          <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded text-[10px]">
                            {validationResult.ticketData.id.substring(0,8)}...
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <span className="text-zinc-400">Pembeli</span>
                          <span className="font-bold text-emerald-300">
                            {validationResult.ticketData.pengguna?.nama || "User"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Acara</span>
                          <span className="font-bold text-right max-w-[160px] truncate text-white">
                            {validationResult.ticketData.event?.judul || validationResult.ticketData.acara?.judul || "Tiket Event"}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      <XCircle className="w-12 h-12 text-red-500 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold tracking-tight text-red-500 uppercase">
                        Akses Ditolak
                      </h2>
                      <p className="text-xs text-zinc-300">{validationResult.message}</p>
                    </div>
                  </>
                )}
                
                <Button 
                  onClick={resetScan}
                  className="w-full h-12 rounded-xl font-bold tracking-widest mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                >
                  SCAN LAGI
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </main>

      {!scanResult && (
        <div className="p-6 text-center text-zinc-400 text-xs tracking-wider z-10">
          Arahkan kamera ke QR Code e-Tiket pengunjung. Pemindaian berlangsung secara otomatis.
        </div>
      )}
    </div>
  );
}
