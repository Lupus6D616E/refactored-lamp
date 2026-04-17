import { S3Client } from "bun";

// Initialize client (matches your docker-compose)
export const s3Client = new S3Client({
  accessKeyId: process.env.MINIO_USERNAME,
  secretAccessKey: process.env.MINIO_PASSWORD,
  endpoint: process.env.MINIO_ENDPOINT,   // MinIO API port
  bucket: "userdata"               // optional: set default bucket
});
