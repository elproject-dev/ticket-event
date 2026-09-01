import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321"
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log("Checking if bucket 'acara' exists...");
  const { data: buckets, error: errBuckets } = await supabase.storage.listBuckets();
  if (errBuckets) {
    console.error("Failed to list buckets:", errBuckets);
    process.exit(1);
  }
  
  const bucketExists = buckets.find(b => b.name === 'acara');
  if (bucketExists) {
    console.log("Bucket 'acara' already exists.");
  } else {
    console.log("Creating bucket 'acara'...");
    const { data, error } = await supabase.storage.createBucket('acara', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    });

    if (error) {
      console.error("Failed to create bucket:", error);
      process.exit(1);
    }
    console.log("Bucket 'acara' created successfully:", data);
  }
}

run();
