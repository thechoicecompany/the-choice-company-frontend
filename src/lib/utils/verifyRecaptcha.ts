// Verifies Google reCAPTCHA v3 token server-side.
// Returns true if score >= 0.5 (human-like behaviour).
export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  if (!token) return true; // Skip verification if token not provided (dev mode)

  const secret = process.env.GOOGLE_RECAPTCHA_SECRET;
  if (!secret) {
    console.warn("[reCAPTCHA] Secret not configured — skipping verification");
    return true;
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    `secret=${secret}&response=${token}`,
    });
    const data = await res.json();
    return data.success && (data.score ?? 1) >= 0.5;
  } catch (err) {
    console.error("[reCAPTCHA] Verification error:", err);
    return true; // Fail open — don't block genuine users if reCAPTCHA is down
  }
}
