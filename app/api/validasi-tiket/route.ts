import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { ticketId } = await request.json();

    if (!ticketId) {
      return NextResponse.json({ error: "ID Tiket tidak valid" }, { status: 400 });
    }

    // Cari tiket di database
    const tiket = await prisma.tiket.findUnique({
      where: { id: ticketId },
      include: {
        acara: {
          select: { judul: true }
        },
        pengguna: {
          select: { nama: true }
        }
      }
    });

    if (!tiket) {
      return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
    }

    // Cek status tiket
    if (tiket.status === "TERPAKAI") {
      return NextResponse.json({ error: "Tiket ini sudah di-scan sebelumnya!" }, { status: 400 });
    }

    if (tiket.status !== "VALID") {
      return NextResponse.json({ error: "Tiket ini belum lunas!" }, { status: 400 });
    }

    // Validasi berhasil, ubah status menjadi digunakan
    await prisma.tiket.update({
      where: { id: ticketId },
      data: { status: "TERPAKAI" }
    });

    return NextResponse.json({
      success: true,
      tiket,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
