// lib/recaptcha.ts  (replace your current verifyRecaptcha)
export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  // ✅ Only skip in non-production; never silently pass in prod
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[reCAPTCHA] No token — skipping in dev mode");
      return true;
    }
    console.error("[reCAPTCHA] No token supplied in production");
    return false;
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token,
    }),
  });

  const data = await res.json();
  return data.success === true;
}