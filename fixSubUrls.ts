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

  for (const table of ['acara', 'event']) {
    const { data } = await supabase.from(table).select('*');
    if (data) {
      for (const item of data) {
        let updateData: any = {};
        let needsUpdate = false;
        
        ['url_sub_gambar_1', 'url_sub_gambar_2', 'url_sub_gambar_3'].forEach(col => {
          if (item[col]) {
            for (const oldUrl of oldUrls) {
              if (item[col].includes(oldUrl)) {
                updateData[col] = item[col].replace(oldUrl, newUrl);
                needsUpdate = true;
              }
            }
          }
        });
        
        if (needsUpdate) {
          await supabase.from(table).update(updateData).eq('id', item.id);
          console.log(`Updated ${table} ${item.id} sub gambar`);
        }
      }
    }
  }
}
main();
