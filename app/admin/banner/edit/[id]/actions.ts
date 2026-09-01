"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadImageToNeon } from "@/lib/s3";

export async function perbaruiBanner(id: string, formData: FormData) {
  const judul = formData.get("judul") as string;
  const deskripsi = formData.get("deskripsi") as string | null;
  const tautan = formData.get("tautan") as string | null;
  const statusStr = formData.get("status") as string;
  const is_active = statusStr === "true";
  
  const gambarFile = formData.get("gambar") as File | null;
  const subGambar1File = formData.get("subGambar1") as File | null;
  const subGambar2File = formData.get("subGambar2") as File | null;
  const subGambar3File = formData.get("subGambar3") as File | null;
  const subGambar4File = formData.get("subGambar4") as File | null;
  const subGambar5File = formData.get("subGambar5") as File | null;

  const existingGambar = formData.get("existing_gambar") as string | null;
  const existingSubGambar1 = formData.get("existing_subGambar1") as string | null;
  const existingSubGambar2 = formData.get("existing_subGambar2") as string | null;
  const existingSubGambar3 = formData.get("existing_subGambar3") as string | null;
  const existingSubGambar4 = formData.get("existing_subGambar4") as string | null;
  const existingSubGambar5 = formData.get("existing_subGambar5") as string | null;

  const uploadPromises = [
    gambarFile && gambarFile.size > 0 ? uploadImageToNeon(gambarFile, "banner") : Promise.resolve(null),
    subGambar1File && subGambar1File.size > 0 ? uploadImageToNeon(subGambar1File, "banner") : Promise.resolve(null),
    subGambar2File && subGambar2File.size > 0 ? uploadImageToNeon(subGambar2File, "banner") : Promise.resolve(null),
    subGambar3File && subGambar3File.size > 0 ? uploadImageToNeon(subGambar3File, "banner") : Promise.resolve(null),
    subGambar4File && subGambar4File.size > 0 ? uploadImageToNeon(subGambar4File, "banner") : Promise.resolve(null),
    subGambar5File && subGambar5File.size > 0 ? uploadImageToNeon(subGambar5File, "banner") : Promise.resolve(null),
  ];

  const [
    url_gambar,
    url_sub_gambar_1,
    url_sub_gambar_2,
    url_sub_gambar_3,
    url_sub_gambar_4,
    url_sub_gambar_5,
  ] = await Promise.all(uploadPromises);

  try {
    await prisma.banner.update({
      where: { id },
      data: {
        judul,
        deskripsi: deskripsi || null,
        tautan: tautan || null,
        is_active,
        url_gambar: url_gambar || existingGambar || null,
        url_sub_gambar_1: url_sub_gambar_1 || existingSubGambar1 || null,
        url_sub_gambar_2: url_sub_gambar_2 || existingSubGambar2 || null,
        url_sub_gambar_3: url_sub_gambar_3 || existingSubGambar3 || null,
        url_sub_gambar_4: url_sub_gambar_4 || existingSubGambar4 || null,
        url_sub_gambar_5: url_sub_gambar_5 || existingSubGambar5 || null,
        diubah_pada: new Date(),
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/banner");
  revalidatePath("/");
  redirect("/admin/banner");
}
