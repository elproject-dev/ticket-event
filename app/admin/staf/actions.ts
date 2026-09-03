'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateRole(userId: string, newRole: string) {
  try {
    await prisma.pengguna.update({
      where: { id: userId },
      data: { peran: newRole },
    });
    
    revalidatePath('/admin/staf');
    revalidatePath('/admin/pengguna');
    return { success: true };
  } catch (error) {
    console.error('Failed to update role:', error);
    return { success: false, error: 'Gagal memperbarui peran pengguna' };
  }
}
