import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import BannerCardClient from "./BannerCardClient";

export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  const bannerList = await prisma.banner.findMany({
    orderBy: {
      dibuat_pada: "desc"
    }
  });

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-1 bg-white border-b">
        <Link href="/admin" className="p-2 -ml-2 rounded-none hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Kelola Banner</h1>
        <Link href="/admin/banner/tambah" className="p-2 -mr-2 rounded-none hover:bg-muted transition-colors">
          <Plus className="w-5 h-5" />
        </Link>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          {!bannerList || bannerList.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs border border-dashed rounded-none">
              Belum ada banner
            </div>
          ) : (
            bannerList.map((banner) => (
              <BannerCardClient key={banner.id} banner={banner} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
