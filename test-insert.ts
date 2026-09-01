import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function main() {
  const { data, error } = await supabase.from('Acara').insert({
    id: crypto.randomUUID(),
    diubahPada: new Date().toISOString(),
    judul: "Test",
    deskripsi: "Test",
    tanggalMulai: new Date().toISOString(),
    tanggalSelesai: new Date().toISOString(),
    lokasi: "Test",
    harga: 10000,
    kapasitas: 100
  });
  console.log(error);
}
main();
