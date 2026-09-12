"use client";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";

import { ContactSchema } from "@/lib/validations/contact.schema";
import { springApi, ApiError } from "@/lib/api/client";
import { useRecaptcha } from "@/lib/hooks/useRecaptcha";
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const SUBJECTS = ["Bulk Order Inquiry", "Product Information", "Custom Branding", "Delivery Query", "Partnership", "Other"];

type ContactFields = {
  name: string; company: string; email: string; phone: string; subject: string; message: string;
};

export default function ContactForm() {
  const { getToken } = useRecaptcha();
  const [form, setForm] = useState<ContactFields>({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFields, string>>>({});
  const [cooldown, setCooldown] = useState(0);

  const fieldRefs = useRef<Partial<Record<keyof ContactFields, HTMLElement | null>>>({});

  const set = (k: keyof ContactFields, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    setFieldErrors(prev => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const scrollToFirstError = (errs: Partial<Record<keyof ContactFields, string>>) => {
    const firstKey = Object.keys(errs)[0] as keyof ContactFields | undefined;
    if (!firstKey) return;
    const el = fieldRefs.current[firstKey];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.focus?.(), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    const parsed = ContactSchema.safeParse(form);
    if (!parsed.success) {
      // Map every Zod issue to its field, not just the first one
      const errs: Partial<Record<keyof ContactFields, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFields;
        if (key && !errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setStatus("error");
      setErrorMsg("Please fix the highlighted fields below.");
      scrollToFirstError(errs);
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    setErrorMsg("");
    try {
      const recaptchaToken = RECAPTCHA_SITE_KEY ? await getToken("contact_form") : "";

      await springApi.post("/api/contact", { ...parsed.data, recaptchaToken });
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");

      if (err instanceof ApiError && err.status === 429) {
        const seconds = err.retryAfter ? Number(err.retryAfter) : 60;
        setCooldown(seconds);
        setErrorMsg(`Too many attempts. Please wait ${seconds}s before trying again.`);
      } else {
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
  };

  const disabled = status === "submitting" || cooldown > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Your Name *</label>
          <input
            ref={el => { fieldRefs.current.name = el; }}
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Rajesh Kumar"
            disabled={disabled}
            className={fieldErrors.name ? "input-error" : ""}
          />
          {fieldErrors.name && <p className="error-msg">{fieldErrors.name}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Company</label>
          <input
            value={form.company}
            onChange={e => set("company", e.target.value)}
            placeholder="Infosys Ltd."
            disabled={disabled}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            ref={el => { fieldRefs.current.email = el; }}
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            placeholder="rajesh@infosys.com"
            disabled={disabled}
            className={fieldErrors.email ? "input-error" : ""}
          />
          {fieldErrors.email && <p className="error-msg">{fieldErrors.email}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            ref={el => { fieldRefs.current.phone = el; }}
            type="tel"
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
            placeholder="9876500000"
            disabled={disabled}
            className={fieldErrors.phone ? "input-error" : ""}
          />
          {fieldErrors.phone && <p className="error-msg">{fieldErrors.phone}</p>}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Subject *</label>
        <select
          ref={el => { fieldRefs.current.subject = el; }}
          value={form.subject}
          onChange={e => set("subject", e.target.value)}
          disabled={disabled}
          className={fieldErrors.subject ? "input-error" : ""}
        >
          <option value="">Select subject</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {fieldErrors.subject && <p className="error-msg">{fieldErrors.subject}</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Message *</label>
        <textarea
          ref={el => { fieldRefs.current.message = el; }}
          value={form.message}
          onChange={e => set("message", e.target.value)}
          rows={5}
          className={`resize-none ${fieldErrors.message ? "input-error" : ""}`}
          placeholder="Tell us about your gifting requirements..."
          disabled={disabled}
        />
        {fieldErrors.message && <p className="error-msg">{fieldErrors.message}</p>}
      </div>
      {status === "success" && <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">✅ Message sent! We'll respond within 2 business hours.</p>}
      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          ❌ {errorMsg || "Failed to send. Please call us directly."}
        </p>
      )}
      <button type="submit" disabled={disabled} className="btn-gold w-full py-3.5 text-base disabled:opacity-60">
        {status === "submitting"
          ? "Sending..."
          : cooldown > 0
            ? `Try again in ${cooldown}s`
            : "📧 Send Message"}
      </button>
    </form>
  );
}