// src/lib/auth/jwt.ts
import { jwtVerify, type JWTPayload } from "jose";

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
    throw new Error("[auth] JWT_SECRET environment variable is not set.");
}

// Spring Boot's JwtTokenProvider derives the signing key via
// Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret)) — the secret is
// base64-encoded key material, not raw UTF-8 text. Verify this actually
// matches your backend's key derivation, or every token silently fails.
const JWT_SECRET = Uint8Array.from(atob(rawSecret), (c) => c.charCodeAt(0));

export async function verifyAdminJwt(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}