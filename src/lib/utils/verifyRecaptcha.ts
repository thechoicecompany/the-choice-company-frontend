export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  // No token → skip in dev, block in prod
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[reCAPTCHA] No token — skipping in dev mode");
      return true;
    }
    console.error("[reCAPTCHA] No token in production");
    return false;
  }

  const secret = process.env.GOOGLE_RECAPTCHA_SECRET;
  if (!secret) {
    console.warn("[reCAPTCHA] Secret not configured — skipping");
    return true;
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${token}`,
    });
    const data = await res.json();
    return data.success && (data.score ?? 1) >= 0.5;
  } catch (err) {
    console.error("[reCAPTCHA] Verification error:", err);
    return true; // fail open — don't block genuine users
  }
}