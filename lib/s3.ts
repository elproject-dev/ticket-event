import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.NEON_S3_ENDPOINT || "";
const region = process.env.NEON_S3_REGION || "us-east-2";
const accessKeyId = process.env.NEON_S3_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.NEON_S3_SECRET_ACCESS_KEY || "";
const bucketName = process.env.NEON_S3_BUCKET_NAME || "acara";

export const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true, // Often required for non-AWS S3 endpoints like Neon/Supabase/Minio
});

export async function uploadImageToNeon(file: File | null, folder: string = "uploads"): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  if (!accessKeyId || !secretAccessKey) {
    console.warn("Kredensial S3 Neon belum diatur. Mengembalikan URL mock.");
    return `https://dummy-neon-storage.com/${bucketName}/${folder}/${file.name}`;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const key = `${folder}/${filename}`;
    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );
    
    // Construct public URL
    // For forcePathStyle, the URL usually looks like: {endpoint}/{bucketName}/{key}
    return `${endpoint}/${bucketName}/${key}`;
  } catch (e) {
    console.error("Gagal mengupload gambar ke Neon S3:", e);
    return null;
  }
}
