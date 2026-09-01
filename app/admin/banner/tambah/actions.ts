"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadImageToNeon } from "@/lib/s3";

export async function buatBanner(formData: FormData) {
  const judul = formData.get("judul") as string;
  const deskripsi = formData.get("deskripsi") as string | null;
  const tautan = formData.get("tautan") as string | null;
  const statusStr = formData.get("status") as string;
  const is_active = statusStr === "true";
  
  const gambarFile = formData.get("gambar") as File;
  let url_gambar = "";

  if (gambarFile && gambarFile.size > 0) {
    const uploadedUrl = await uploadImageToNeon(gambarFile, "banner");
    if (uploadedUrl) {
      url_gambar = uploadedUrl;
    }
  }

  try {
    await prisma.banner.create({
      data: {
        judul,
        deskripsi: deskripsi || null,
        tautan: tautan || null,
        is_active,
        url_gambar,
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
