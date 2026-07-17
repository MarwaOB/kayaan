import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100MB, enough for short homepage clips.

function cloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") || "kayaaan");

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return NextResponse.json({ error: "Only image and video uploads are supported." }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File is too large. Maximum upload size is 100MB." }, { status: 413 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary is not configured yet." }, { status: 500 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const timestamp = Math.round(Date.now() / 1000).toString();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "";
  const signatureParams = {
    folder,
    timestamp,
    ...(uploadPreset ? { upload_preset: uploadPreset } : {}),
  };
  const signature = cloudinarySignature(signatureParams, apiSecret);

  const data = new FormData();
  data.append("file", new Blob([buffer], { type: file.type }), file.name);
  data.append("api_key", apiKey);
  data.append("timestamp", timestamp);
  data.append("signature", signature);
  data.append("folder", folder);
  if (uploadPreset) data.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: data,
  });

  const json = await res.json();
  if (!res.ok || !json.secure_url) {
    return NextResponse.json({ error: json.error?.message || "Upload failed." }, { status: 500 });
  }

  return NextResponse.json({ url: json.secure_url });
}
