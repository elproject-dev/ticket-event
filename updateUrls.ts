import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function updateUrls() {
  console.log("Mulai memperbarui URL gambar...");
  const oldUrl = "http://127.0.0.1:54321";
  const newUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!newUrl || oldUrl === newUrl) {
    console.log("NEXT_PUBLIC_SUPABASE_URL belum diubah atau masih sama dengan lokal.");
    process.exit(0);
  }

  // Update banner
  const banners = await prisma.banner.findMany();
  for (const b of banners) {
    if (b.url_gambar && b.url_gambar.includes(oldUrl)) {
      await prisma.banner.update({
        where: { id: b.id },
        data: { url_gambar: b.url_gambar.replace(oldUrl, newUrl) }
      });
      console.log(`Banner ${b.judul} diperbarui.`);
    }
  }

  // Update acara
  const acaras = await prisma.acara.findMany();
  for (const a of acaras) {
    if (a.url_gambar && a.url_gambar.includes(oldUrl)) {
      await prisma.acara.update({
        where: { id: a.id },
        data: { url_gambar: a.url_gambar.replace(oldUrl, newUrl) }
      });
      console.log(`Acara ${a.judul} diperbarui.`);
    }
    // Update sub_gambar
    if (a.url_sub_gambar_1 && a.url_sub_gambar_1.includes(oldUrl)) {
      await prisma.acara.update({ where: { id: a.id }, data: { url_sub_gambar_1: a.url_sub_gambar_1.replace(oldUrl, newUrl) } });
    }
    if (a.url_sub_gambar_2 && a.url_sub_gambar_2.includes(oldUrl)) {
      await prisma.acara.update({ where: { id: a.id }, data: { url_sub_gambar_2: a.url_sub_gambar_2.replace(oldUrl, newUrl) } });
    }
    if (a.url_sub_gambar_3 && a.url_sub_gambar_3.includes(oldUrl)) {
      await prisma.acara.update({ where: { id: a.id }, data: { url_sub_gambar_3: a.url_sub_gambar_3.replace(oldUrl, newUrl) } });
    }
  }

  console.log("Selesai memperbarui URL!");
}

updateUrls()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
