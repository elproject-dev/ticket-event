import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import AcaraCardClient from "./AcaraCardClient";

export const dynamic = "force-dynamic";

export default async function AdminAcaraSaatIniPage() {
  const acaraList = await prisma.acara.findMany({
    orderBy: {
      dibuat_pada: "desc"
    }
  });

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-1 bg-background border-b">
        <Link href="/admin" className="p-2 -ml-2 rounded-none hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Jadwal Acara</h1>
        <Link href="/admin/acara/tambah" className="p-2 -mr-2 rounded-none hover:bg-muted transition-colors">
          <Plus className="w-5 h-5" />
        </Link>
      </div>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!acaraList || acaraList.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs border border-dashed rounded-none">
              Belum ada event
            </div>
          ) : (
            acaraList.map((acara) => (
              <AcaraCardClient key={acara.id} acara={{ ...acara, harga: Number(acara.harga), diskon: acara.diskon ? Number(acara.diskon) : null } as any} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
