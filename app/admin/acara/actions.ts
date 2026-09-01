"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function hapusAcara(id: string) {
  try {
    await prisma.acara.delete({
      where: { id }
    });
      
    revalidatePath("/admin/acara");
    revalidatePath("/");
    revalidatePath("/acara");
    
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus acara:", error);
    return { success: false, error: "Gagal menghapus acara" };
  }
}
