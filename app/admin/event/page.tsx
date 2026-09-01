import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import EventCardClient from "./EventCardClient";

export const dynamic = "force-dynamic";

export default async function AdminEventSaatIniPage() {
  const eventList = await prisma.event.findMany({
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
        <h1 className="text-sm font-bold tracking-widest uppercase">Jadwal Event</h1>
        <Link href="/admin/event/tambah" className="p-2 -mr-2 rounded-none hover:bg-muted transition-colors">
          <Plus className="w-5 h-5" />
        </Link>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          {!eventList || eventList.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs border border-dashed rounded-none">
              Belum ada event
            </div>
          ) : (
            eventList.map((event) => (
              <EventCardClient key={event.id} event={{ ...event, harga: Number(event.harga), diskon: event.diskon ? Number(event.diskon) : null } as any} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
