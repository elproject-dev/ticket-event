import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // use service role key for bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.log("Variabel environment belum diset.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUrls() {
  console.log("Mulai memperbarui URL gambar...");
  const oldUrl = "http://127.0.0.1:54321";
  
  if (supabaseUrl === oldUrl) {
    console.log("URL belum diubah ke Cloudflare.");
    process.exit(0);
  }

  // Update banner
  const { data: banners } = await supabase.from('banner').select('*');
  if (banners) {
    for (const b of banners) {
      if (b.url_gambar && b.url_gambar.includes(oldUrl)) {
        await supabase.from('banner').update({ url_gambar: b.url_gambar.replace(oldUrl, supabaseUrl) }).eq('id', b.id);
        console.log(`Banner ${b.judul} diperbarui.`);
      }
    }
  }

  // Update acara
  const { data: acaras } = await supabase.from('acara').select('*');
  if (acaras) {
    for (const a of acaras) {
      if (a.url_gambar && a.url_gambar.includes(oldUrl)) {
        await supabase.from('acara').update({ url_gambar: a.url_gambar.replace(oldUrl, supabaseUrl) }).eq('id', a.id);
        console.log(`Acara ${a.judul} diperbarui.`);
      }
      if (a.sub_foto && Array.isArray(a.sub_foto)) {
        const newSubFoto = a.sub_foto.map((url: string) => 
          url.includes(oldUrl) ? url.replace(oldUrl, supabaseUrl) : url
        );
        await supabase.from('acara').update({ sub_foto: newSubFoto }).eq('id', a.id);
      }
    }
  }

  // Update event
  const { data: events } = await supabase.from('event').select('*');
  if (events) {
    for (const e of events) {
      if (e.url_gambar && e.url_gambar.includes(oldUrl)) {
        await supabase.from('event').update({ url_gambar: e.url_gambar.replace(oldUrl, supabaseUrl) }).eq('id', e.id);
        console.log(`Event ${e.judul} diperbarui.`);
      }
      if (e.sub_foto && Array.isArray(e.sub_foto)) {
        const newSubFoto = e.sub_foto.map((url: string) => 
          url.includes(oldUrl) ? url.replace(oldUrl, supabaseUrl) : url
        );
        await supabase.from('event').update({ sub_foto: newSubFoto }).eq('id', e.id);
      }
    }
  }

  console.log("Selesai memperbarui URL!");
}

updateUrls().catch(console.error);
