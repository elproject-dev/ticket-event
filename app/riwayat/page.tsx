import { TopBar } from "@/components/top-bar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { PayButton } from "@/components/pay-button";
import { CancelButton } from "@/components/cancel-button";
import { ConfirmPaymentButton } from "@/components/confirm-payment-button";
import { TicketDetailsModal } from "@/components/ticket-details-modal";
import { Button } from "@/components/ui/button";

// Agar halaman selalu mengambil data terbaru dari database setiap kali dikunjungi
export const dynamic = "force-dynamic";

export default async function Tiketku() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.email) {
    redirect("/masuk");
  }

  const pengguna = await prisma.pengguna.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  const rawTiketList = pengguna ? await prisma.tiket.findMany({
    where: {
      id_pengguna: pengguna.id
    },
    include: {
      acara: true,
      event: true
    },
    orderBy: {
      dibuat_pada: "desc"
    }
  }) : [];

  const tiketList = JSON.parse(JSON.stringify(rawTiketList));

  return (
    <div className="flex flex-col min-h-screen text-xs">
      {/* Consistent Header */}
      <TopBar />

      <main className="flex-1 pb-24">


        <div className="container mx-auto px-4 py-6">
          {tiketList.length === 0 ? (
            <div className="border p-8 text-center bg-muted/5">
              <Link href="/acara" className="text-primary font-bold  mt-4 block text-[10px]">Jelajahi Acara</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {tiketList.map((tiket: any) => {
                const isUsed = tiket.status === "TERPAKAI";
                const isValid = tiket.status === "VALID";
                const isPending = tiket.status === "PENDING";

                // Ambil data acara atau event (mana yang ada)
                const item = tiket.acara || tiket.event;

                return (
                  <div key={tiket.id} className={`border bg-background transition-colors ${isUsed ? "border-blue-500/40 bg-blue-50/10" : isValid ? "border-primary/50" : "border-border"}`}>
                    <div className="p-4 flex flex-col gap-4">
                      {/* Ticket Header (Status) */}
                      <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-[10px] text-muted-foreground  tracking-widest">ID: {tiket.id.split('-')[0]}</span>
                        <div className={`px-2 py-1 text-[9px] font-bold  tracking-widest border ${
                          isUsed ? "bg-blue-600 text-white border-blue-700" :
                          isValid ? "bg-primary/10 text-primary border-primary/20" :
                          isPending ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                          "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}>
                          {isUsed ? "TIKET SUDAH DIGUNAKAN" : isValid ? "SUDAH BAYAR" : isPending ? "BELUM BAYAR" : "DIBATALKAN"}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div>
                        <h2 className="text-sm font-bold  tracking-wide mb-1">{item?.judul}</h2>
                        <div className="flex flex-col gap-1.5 mt-3 text-[10px] text-muted-foreground  tracking-wider">
                          <div className="flex justify-between">
                            <span>Tanggal</span>
                            <span className="text-foreground font-medium">{item?.tanggal_mulai ? new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : ""}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lokasi</span>
                            <span className="text-foreground font-medium">{item?.lokasi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Kode QR</span>
                            <span className={`font-medium ${isUsed ? "text-blue-600 font-bold" : isValid ? "text-green-600 font-bold" : "text-foreground"}`}>
                              {isUsed ? "Sudah Terpakai (Scan Berhasil)" : isValid ? "Tersedia (Siap Scan)" : "Menunggu pembayaran"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t pt-3 mt-1">
                        <span className="font-bold text-sm">IDR {Number(item?.harga || 0).toLocaleString('id-ID')}</span>
                        {isPending && (
                          <div className="flex gap-2">
                            <CancelButton idTiket={tiket.id} />
                            {tiket.snap_token ? (
                              <PayButton snapToken={tiket.snap_token} idTiket={tiket.id} idPembayaran={tiket.id_pembayaran} />
                            ) : (
                              <Link href={tiket.id_acara ? `/acara/${tiket.id_acara}` : `/event/${tiket.id_event}`} className="text-[10px] font-bold tracking-widest text-primary border border-primary px-3 py-1.5 hover:bg-primary/10 transition-colors bg-primary/5">
                                Bayar
                              </Link>
                            )}
                            <ConfirmPaymentButton idTiket={tiket.id} idPembayaran={tiket.id_pembayaran} />
                          </div>
                        )}
                        {!isPending && (
                          <TicketDetailsModal tiket={tiket} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>


    </div>
  );
}
