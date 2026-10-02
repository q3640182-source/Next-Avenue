"use server";

import crypto from "crypto";

export async function getUploadSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const secret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (!secret || !apiKey) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  const signature = crypto
    .createHash("sha1")
    .update(`timestamp=${timestamp}${secret}`)
    .digest("hex");

  return { timestamp, signature, apiKey };
}
