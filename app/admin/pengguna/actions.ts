"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function makeStaff(userId: string) {
  try {
    await prisma.pengguna.update({
      where: { id: userId },
      data: { peran: "staf" },
    });
    revalidatePath("/admin/pengguna");
    revalidatePath("/admin/staf");
    return { success: true };
  } catch (error) {
    console.error("Gagal mengubah peran pengguna:", error);
    return { success: false, error: "Gagal mengubah peran pengguna." };
  }
}

export async function makeAdmin(userId: string) {
  try {
    await prisma.pengguna.update({
      where: { id: userId },
      data: { peran: "admin" },
    });
    revalidatePath("/admin/pengguna");
    revalidatePath("/admin/staf");
    return { success: true };
  } catch (error) {
    console.error("Gagal mengubah peran pengguna:", error);
    return { success: false, error: "Gagal mengubah peran pengguna." };
  }
}
