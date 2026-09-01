import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient("http://127.0.0.1:54321", process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const { data } = await supabase.from('acara').select('id, judul, sub_foto');
  console.log(JSON.stringify(data, null, 2));
}
main();
