import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { ticketId } = await request.json();

    if (!ticketId) {
      return NextResponse.json({ error: "ID Tiket tidak valid" }, { status: 400 });
    }

    // Ambil session staf yang sedang melakukan scan
    const { data: session } = await auth.getSession();
    let stafRecord = null;

    if (session?.user?.email) {
      stafRecord = await prisma.pengguna.findUnique({
        where: { email: session.user.email },
      });
    }

    const namaStaf = stafRecord?.nama || session?.user?.name || "Staf Scanner";

    // Cari tiket di database berdasarkan ID atau QR Code
    const tiket = await prisma.tiket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { qr_code: ticketId }
        ]
      },
      include: {
        acara: {
          select: { judul: true }
        },
        event: {
          select: { judul: true }
        },
        pengguna: {
          select: { nama: true }
        }
      }
    });

    if (!tiket) {
      // Catat riwayat scan gagal: tidak ditemukan
      await prisma.riwayat_scan.create({
        data: {
          id_staf: stafRecord?.id || null,
          nama_staf: namaStaf,
          status_scan: "TIDAK_DITEMUKAN",
          pesan: "Tiket tidak ditemukan di database",
        },
      });
      return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
    }

    // Cek status tiket
    if (tiket.status === "TERPAKAI") {
      // Catat riwayat scan gagal: tiket sudah terpakai
      await prisma.riwayat_scan.create({
        data: {
          id_tiket: tiket.id,
          id_staf: stafRecord?.id || null,
          nama_staf: namaStaf,
          status_scan: "SUDAH_DIPAKAI",
          pesan: "Tiket ini sudah di-scan sebelumnya!",
        },
      });
      return NextResponse.json({ error: "Tiket ini sudah di-scan sebelumnya!" }, { status: 400 });
    }

    if (tiket.status !== "VALID") {
      // Catat riwayat scan gagal: tiket belum lunas
      await prisma.riwayat_scan.create({
        data: {
          id_tiket: tiket.id,
          id_staf: stafRecord?.id || null,
          nama_staf: namaStaf,
          status_scan: "BELUM_LUNAS",
          pesan: "Tiket ini belum lunas!",
        },
      });
      return NextResponse.json({ error: "Tiket ini belum lunas!" }, { status: 400 });
    }

    // Validasi berhasil, ubah status menjadi digunakan
    await prisma.tiket.update({
      where: { id: tiket.id },
      data: { status: "TERPAKAI" }
    });

    // Catat riwayat scan BERHASIL
    await prisma.riwayat_scan.create({
      data: {
        id_tiket: tiket.id,
        id_staf: stafRecord?.id || null,
        nama_staf: namaStaf,
        status_scan: "BERHASIL",
        pesan: "Tiket valid dan berhasil di-scan",
      },
    });

    return NextResponse.json({
      success: true,
      tiket,
    });
  } catch (error: any) {
    console.error("Error validasi tiket:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
