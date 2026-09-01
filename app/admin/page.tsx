import { prisma } from "@/lib/prisma";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalBanner,
    totalAcara,
    totalPengguna,
    totalTiket
  ] = await Promise.all([
    prisma.banner.count(),
    prisma.acara.count(),
    prisma.pengguna.count(),
    prisma.tiket.count(),
  ]);

  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6 mt-4">
        <ChartAreaInteractive />
      </div>
      <div className="mt-4">
        <DataTable data={data} />
      </div>
    </>
  );
}
