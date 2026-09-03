import { PrismaClient } from "@prisma/client";
import { TopBar } from "@/components/top-bar";
import { History, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function RiwayatScanPage() {
  const scanLogs = await prisma.riwayat_scan.findMany({
    include: {
      tiket: {
        include: {
          acara: { select: { judul: true } },
          event: { select: { judul: true } },
          pengguna: { select: { nama: true, email: true } },
        },
      },
      staf: { select: { nama: true, email: true } },
    },
    orderBy: { dibuat_pada: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col min-h-screen text-xs bg-background pb-20">
      <TopBar title="Riwayat Scan Tiket" />

      <main className="flex-1 p-4 container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-3 h-3 text-primary" />
          <h1 className="text-1x1 font-bold tracking-widest text-primary uppercase">
            Riwayat Pemindaian Tiket
          </h1>
        </div>

        <div className="bg-background border rounded-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 uppercase tracking-widest border-b">
                <tr>
                  <th className="p-3 font-bold">Waktu Scan</th>
                  <th className="p-3 font-bold">Staf Pemindai</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold">Pembeli Tiket</th>
                  <th className="p-3 font-bold">Acara / Event</th>
                  <th className="p-3 font-bold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {scanLogs.length > 0 ? (
                  scanLogs.map((log) => {
                    const isSuccess = log.status_scan === "BERHASIL";
                    const isWarning = log.status_scan === "SUDAH_DIPAKAI";
                    const item = log.tiket?.acara || log.tiket?.event;

                    return (
                      <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3 text-muted-foreground whitespace-nowrap">
                          {new Date(log.dibuat_pada).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="p-3 font-medium">
                          {log.nama_staf || log.staf?.nama || "Staf"}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${isSuccess
                              ? "bg-green-600 text-white"
                              : isWarning
                                ? "bg-yellow-500 text-white"
                                : "bg-red-600 text-white"
                              }`}
                          >
                            {isSuccess ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : isWarning ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {log.status_scan}
                          </span>
                        </td>
                        <td className="p-3 font-medium">
                          {log.tiket?.pengguna?.nama || "-"}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {item?.judul || "-"}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {log.pesan || "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      Belum ada riwayat pemindaian tiket.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
