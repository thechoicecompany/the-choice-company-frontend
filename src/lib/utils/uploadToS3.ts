// ─── uploadToS3.ts ───────────────────────────────────────────────────────────
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  buffer:      Buffer,
  key:         string,
  contentType: string
): Promise<string> {
  const bucket = process.env.S3_BUCKET_NAME!;

  await s3.send(
    new PutObjectCommand({
      Bucket:      bucket,
      Key:         key,
      Body:        buffer,
      ContentType: contentType,
    })
  );

  return `https://${bucket}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${key}`;
}
