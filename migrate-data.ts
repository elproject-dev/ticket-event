import { PrismaClient } from '@prisma/client'
import { Client } from 'pg'

const prisma = new PrismaClient()

async function main() {
  const pgClient = new Client({
    connectionString: "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
  });
  await pgClient.connect();

  console.log("Connected to Supabase local...");

  const tables = ['banner', 'acara', 'pengguna', 'tiket'];

  for (const table of tables) {
    console.log(`Migrating ${table}...`);
    const { rows } = await pgClient.query(`SELECT * FROM ${table}`);
    console.log(`Found ${rows.length} rows in ${table}`);

    for (const row of rows) {
      // Prisma expects models to be accessed like prisma.banner, prisma.event
      try {
        await (prisma as any)[table].create({
          data: row
        });
      } catch (err: any) {
        console.error(`Error inserting into ${table}: ${err.message}`);
      }
    }
    console.log(`Done migrating ${table}`);
  }

  await pgClient.end();
  await prisma.$disconnect();
}

main().catch(console.error);
