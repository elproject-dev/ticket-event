import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = "http://192.168.1.9:54321";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient("http://127.0.0.1:54321", supabaseKey);

async function main() {
  const oldUrls = [
    "http://127.0.0.1:54321",
    "https://statements-but-bedrooms-apps.trycloudflare.com"
  ];
  const newUrl = "http://192.168.1.9:54321";

  for (const table of ['banner', 'acara', 'event']) {
    const { data } = await supabase.from(table).select('*');
    if (data) {
      for (const item of data) {
        for (const oldUrl of oldUrls) {
          if (item.url_gambar && item.url_gambar.includes(oldUrl)) {
            await supabase.from(table).update({ url_gambar: item.url_gambar.replace(oldUrl, newUrl) }).eq('id', item.id);
            console.log(`Updated ${table} ${item.id} url_gambar`);
          }
          if (item.sub_foto && Array.isArray(item.sub_foto)) {
            const newSubFoto = item.sub_foto.map((url: string) => url.replace(oldUrl, newUrl));
            await supabase.from(table).update({ sub_foto: newSubFoto }).eq('id', item.id);
            console.log(`Updated ${table} ${item.id} sub_foto`);
          }
        }
      }
    }
  }
}
main();
