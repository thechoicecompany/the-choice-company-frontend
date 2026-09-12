// src/lib/auth/session.ts
import { cookies } from "next/headers";
import { verifyAdminJwt } from "@/lib/auth/jwt";

export async function getServerSession() {
  const token = (await cookies()).get("tcc_admin_token")?.value; // ← fix here
  if (!token) return null;
  const payload = await verifyAdminJwt(token);
  return payload;
}