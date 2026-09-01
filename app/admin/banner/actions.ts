"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function hapusBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/banner");
  revalidatePath("/");
}
