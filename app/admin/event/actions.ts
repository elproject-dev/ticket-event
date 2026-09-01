"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function hapusEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id }
    });
      
    revalidatePath("/admin/event");
    revalidatePath("/event");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus event:", error);
    return { success: false, error: "Gagal menghapus event" };
  }
}
