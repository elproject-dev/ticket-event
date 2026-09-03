"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePhoneNumber } from "./actions";

interface PhoneDialogProps {
  initialPhone?: string | null;
  trigger?: React.ReactNode;
}

export function PhoneDialog({ initialPhone, trigger }: PhoneDialogProps) {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await updatePhoneNumber(phoneNumber);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || "Gagal menyimpan nomor.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger render={trigger as any} />
      ) : (
        <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-none px-3 h-7 text-xs">
          {initialPhone ? "Ubah" : "Tambah"}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Verifikasi Nomor Telepon</DialogTitle>
            <DialogDescription>
              Masukkan nomor telepon Anda yang aktif. Nomor ini digunakan untuk verifikasi dan keperluan pemesanan tiket.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none">
                Nomor Telepon
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="08xxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || !phoneNumber}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
