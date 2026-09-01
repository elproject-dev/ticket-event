"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToNeon } from "@/lib/s3";

export async function perbaruiEvent(id: string, formData: FormData) {
  const judul = formData.get("judul") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const tanggal_mulai = formData.get("tanggal_mulai") as string;
  const tanggal_selesai = formData.get("tanggal_selesai") as string;
  const lokasi = formData.get("lokasi") as string;
  const url_maps = formData.get("url_maps") as string | null;
  const harga = parseFloat(formData.get("harga") as string);
  const diskonRaw = formData.get("diskon") as string | null;
  const diskon = diskonRaw ? parseFloat(diskonRaw) : null;
  const kapasitas = parseInt(formData.get("kapasitas") as string, 10);
  
  const gambar = formData.get("gambar") as File | null;
  const subGambar1 = formData.get("subGambar1") as File | null;
  const subGambar2 = formData.get("subGambar2") as File | null;
  const subGambar3 = formData.get("subGambar3") as File | null;

  if (!judul || !deskripsi || !tanggal_mulai || !tanggal_selesai || !lokasi || isNaN(harga) || isNaN(kapasitas)) {
    throw new Error("Data tidak lengkap");
  }

  const url_gambar = await uploadImageToNeon(gambar, "event");
  const url_sub_gambar_1 = await uploadImageToNeon(subGambar1, "event");
  const url_sub_gambar_2 = await uploadImageToNeon(subGambar2, "event");
  const url_sub_gambar_3 = await uploadImageToNeon(subGambar3, "event");

  const updateData: any = {
    judul,
    deskripsi,
    tanggal_mulai: new Date(tanggal_mulai),
    tanggal_selesai: new Date(tanggal_selesai),
    lokasi,
    url_maps,
    harga,
    diskon,
    kapasitas,
    diubah_pada: new Date(),
  };

  if (url_gambar) updateData.url_gambar = url_gambar;
  if (url_sub_gambar_1) updateData.url_sub_gambar_1 = url_sub_gambar_1;
  if (url_sub_gambar_2) updateData.url_sub_gambar_2 = url_sub_gambar_2;
  if (url_sub_gambar_3) updateData.url_sub_gambar_3 = url_sub_gambar_3;

  try {
    await prisma.event.update({
      where: { id },
      data: updateData
    });
  } catch (updateError: any) {
    console.error("Gagal memperbarui event:", updateError);
    throw new Error("Gagal memperbarui event");
  }

  revalidatePath("/admin/event");
  revalidatePath("/event");
  revalidatePath("/");
  
  redirect("/admin/event");
}
