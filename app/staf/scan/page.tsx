"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
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
            message: "Tiket Valid! Berhasil digunakan.",
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="px-4 py-4 flex items-center space-x-3 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Scanner Tiket</h1>
      </header>

      <main className="flex-1 flex flex-col relative justify-center">
        {!scanResult ? (
          <div className="w-full max-w-md mx-auto aspect-square overflow-hidden bg-zinc-900 border-2 border-dashed border-white/20 p-2 relative">
            <Scanner 
              onScan={(result) => handleScan(result[0].rawValue)} 
              formats={["qr_code"]}
              components={{ finder: false }}
            />
            {/* Finder overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[70%] aspect-square border-2 border-primary opacity-50 relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 w-full max-w-sm mx-auto bg-zinc-900 border border-zinc-800 rounded-none shadow-xl">
            {isValidating ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-sm font-medium animate-pulse">Memvalidasi tiket...</p>
              </div>
            ) : validationResult ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-6">
                {validationResult.success ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-emerald-500">Akses Diberikan</h2>
                      <p className="text-sm text-zinc-400">{validationResult.message}</p>
                    </div>
                    
                    {validationResult.ticketData && (
                      <div className="w-full p-4 bg-black/50 border border-zinc-800 text-left space-y-2 mt-4 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">ID Tiket</span>
                          <span className="font-mono">{validationResult.ticketData.id.substring(0,8)}...</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Pembeli</span>
                          <span className="font-bold">{validationResult.ticketData.pengguna?.nama || "User"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Acara</span>
                          <span className="font-bold text-right max-w-[150px] line-clamp-1">{validationResult.ticketData.event?.judul}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                      <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-red-500">Akses Ditolak</h2>
                      <p className="text-sm text-zinc-400">{validationResult.message}</p>
                    </div>
                  </>
                )}
                
                <Button 
                  onClick={resetScan}
                  className="w-full h-12 rounded-none font-bold tracking-widest mt-6"
                >
                  SCAN LAGI
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </main>

      {!scanResult && (
        <div className="p-6 text-center text-zinc-500 text-xs">
          Arahkan kamera ke QR Code e-Tiket pengunjung. Scanner akan mendeteksi secara otomatis.
        </div>
      )}
    </div>
  );
}
