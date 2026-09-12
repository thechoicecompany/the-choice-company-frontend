// src/lib/auth/session.ts
import { cookies } from "next/headers";
import { verifyAdminJwt } from "@/lib/auth/jwt";

export async function getServerSession() {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyAdminJwt(token);
  return payload; // null if invalid/expired
}