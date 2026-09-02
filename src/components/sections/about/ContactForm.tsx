"use client";
import { useState } from "react";

// adjust path to your actual api-client.ts
import { ContactSchema } from "@/lib/validations/contact.schema";
import { springApi } from "@/lib/api/client";
const SUBJECTS = ["Bulk Order Inquiry", "Product Information", "Custom Branding", "Delivery Query", "Partnership", "Other"];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate client-side first with the schema you already have
    const parsed = ContactSchema.safeParse(form);
    if (!parsed.success) {
      setStatus("error");
      setErrorMsg(parsed.error.issues[0]?.message || "Please check the form fields.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");
    try {
      // Public endpoint — no auth token needed, springApi's interceptor
      // just won't attach one in the browser (INTERNAL_API_TOKEN is
      // server-only and undefined client-side, which is fine here).
      await springApi.post("/api/contact", parsed.data);
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group"><label className="form-label">Your Name *</label><input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Rajesh Kumar" /></div>
        <div className="form-group"><label className="form-label">Company</label><input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Infosys Ltd." /></div>
        <div className="form-group"><label className="form-label">Email *</label><input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="rajesh@infosys.com" /></div>
        <div className="form-group"><label className="form-label">Phone</label><input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="9876500000" /></div>
      </div>
      <div className="form-group">
        <label className="form-label">Subject *</label>
        <select required value={form.subject} onChange={e => set("subject", e.target.value)}>
          <option value="">Select subject</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Message *</label>
        <textarea required value={form.message} onChange={e => set("message", e.target.value)} rows={5} className="resize-none" placeholder="Tell us about your gifting requirements..." />
      </div>
      {status === "success" && <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">✅ Message sent! We'll respond within 2 business hours.</p>}
      {status === "error" && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">❌ {errorMsg || "Failed to send. Please call us directly."}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-gold w-full py-3.5 text-base disabled:opacity-60">
        {status === "submitting" ? "Sending..." : "📧 Send Message"}
      </button>
    </form>
  );
}