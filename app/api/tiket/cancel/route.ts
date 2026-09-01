import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { idTiket } = await req.json();

    if (!idTiket) {
      return NextResponse.json({ error: "ID Tiket tidak diberikan" }, { status: 400 });
    }

    const tiket = await prisma.tiket.update({
      where: { id: idTiket },
      data: { status: "DIBATALKAN", diubah_pada: new Date() }
    });
      
    return NextResponse.json({ success: true, tiket });
  } catch (error: any) {
    console.error("Gagal membatalkan tiket:", error);
    return NextResponse.json(
      { error: "Gagal membatalkan tiket" },
      { status: 500 }
    );
  }
}
