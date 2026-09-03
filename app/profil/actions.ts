"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updatePhoneNumber(noTelp: string) {
  try {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
      return { success: false, error: "Tidak ada sesi pengguna." };
    }

    const userId = session.user.id;

    if (!noTelp || noTelp.trim() === "") {
      return { success: false, error: "Nomor telepon tidak valid." };
    }

    await prisma.pengguna.update({
      where: { email: session.user.email },
      data: { no_telp: noTelp.trim() } as any,
    });

    // Validasi jalur profil agar data terbarui
    revalidatePath("/profil");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update phone number:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan nomor telepon." };
  }
}
