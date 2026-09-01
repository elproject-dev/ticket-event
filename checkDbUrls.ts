import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const b = await prisma.banner.findFirst();
  console.log(b?.url_gambar);
}
main();
