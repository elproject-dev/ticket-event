import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.pengguna.upsert({
    where: { email: 'elproject.dev@gmail.com' },
    update: { peran: 'admin' },
    create: {
      email: 'elproject.dev@gmail.com',
      nama: 'Elproject Dev',
      peran: 'admin',
    },
  });
  console.log('Upserted user:', user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
