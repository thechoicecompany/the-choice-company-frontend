"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useRecaptcha } from "@/lib/hooks/useRecaptcha";
import type { KitBuilderHook } from "@/lib/hooks/useKitBuilder";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const ALL_PRODUCTS = [
  { id: 1, name: "Steel Thermos", icon: "🥤", price: 280 },
  { id: 2, name: "Copper Bottle", icon: "🍶", price: 320 },
  { id: 3, name: "Coffee Mug", icon: "☕", price: 180 },
  { id: 4, name: "Laptop Bag", icon: "💼", price: 680 },
  { id: 5, name: "Backpack", icon: "🎒", price: 750 },
  { id: 6, name: "Tote Bag", icon: "👜", price: 220 },
  { id: 7, name: "Notepad", icon: "📓", price: 120 },
  { id: 8, name: "Pen Set", icon: "🖊", price: 95 },
  { id: 9, name: "Desk Organiser", icon: "🗂", price: 340 },
  { id: 10, name: "Wireless Mouse", icon: "🖱", price: 420 },
  { id: 11, name: "T-Shirt", icon: "👕", price: 280 },
  { id: 12, name: "Cap", icon: "🧢", price: 180 },
  { id: 13, name: "Dry Fruit Hamper", icon: "🫙", price: 450 },
  { id: 14, name: "Scented Candle", icon: "🕯", price: 260 },
  { id: 15, name: "Bamboo Pen", icon: "✏", price: 65 },
  { id: 16, name: "Wireless Earbuds", icon: "🎧", price: 890 },
];

export default function Step5ReviewQuote({ kit }: { kit: KitBuilderHook }) {
  const router = useRouter();
  const { getToken } = useRecaptcha();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [contact, setContact] = useState({ companyName: "", contactPerson: "", mobile: "", email: "", city: "", state: "" });

  const selected = ALL_PRODUCTS.filter(p => kit.selectedProducts.has(p.id));
  const perKit = selected.reduce((s, p) => s + p.price, 0);
  const total = perKit * kit.quantity;

  const setC = (k: string, v: string) => setContact(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      // Guarded: getToken rejects with a clear "reCAPTCHA not loaded" error
      // instead of throwing if the script hasn't finished loading yet.
      const recaptchaToken = RECAPTCHA_SITE_KEY
        ? await getToken("kit_builder_quote")
        : "";

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          designation: "",
          productCategory: selected.map(p => p.name).join(", "),
          quantityRequired: kit.quantity,
          budgetRange: kit.budget,
          deliveryLocation: contact.city,
          brandingRequired: !!kit.logoUrl,
          additionalNotes: `Occasion: ${kit.occasion}. Branding: ${kit.brandingStyle}. AI Kit Builder submission.${kit.aiRecommendation ? ` AI Recommendation: ${kit.aiRecommendation.substring(0, 200)}` : ""}`,
          logoUrl: kit.logoUrl || undefined,
          recaptchaToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setTimeout(() => {
        router.push(`/thank-you?ref=${data.refNumber}&company=${encodeURIComponent(contact.companyName)}`);
      }, 1200);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-5">
      {RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} />
      )}

      {/* Kit Summary */}
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span> Your Kit Summary
        </h3>
        <div className="space-y-2 mb-5">
          {selected.map(p => (
            <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <span className="text-xl w-8 text-center">{p.icon}</span>
              <span className="flex-1 text-sm font-medium text-navy">{p.name}</span>
              <span className="text-sm text-gray-500">₹{p.price}/unit</span>
              {kit.logoUrl && <span className="badge-teal text-[10px]">Logo</span>}
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div><div className="font-bold text-navy">{kit.occasion}</div><div className="text-xs text-gray-400">Occasion</div></div>
          <div><div className="font-bold text-navy">{kit.quantity} kits</div><div className="text-xs text-gray-400">Quantity</div></div>
          <div><div className="font-bold text-navy">₹{perKit.toLocaleString("en-IN")}</div><div className="text-xs text-gray-400">Per Kit</div></div>
          <div><div className="font-bold text-gold">₹{total.toLocaleString("en-IN")}</div><div className="text-xs text-gray-400">Est. Total</div></div>
        </div>
        {kit.brandingStyle && (
          <p className="text-xs text-gray-500 mt-3">🎨 Branding: <strong>{kit.brandingStyle}</strong>{kit.logoUrl ? " · Logo uploaded ✓" : ""}</p>
        )}
      </div>

      {/* Contact Form */}
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
          <span className="text-xl">👤</span> Your Details
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input required value={contact.companyName} onChange={e => setC("companyName", e.target.value)} placeholder="Infosys Ltd." />
            </div>
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input required value={contact.contactPerson} onChange={e => setC("contactPerson", e.target.value)} placeholder="Rajesh Kumar" />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile *</label>
              <input required type="tel" value={contact.mobile} onChange={e => setC("mobile", e.target.value)} placeholder="9876500000" pattern="[6-9][0-9]{9}" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input required type="email" value={contact.email} onChange={e => setC("email", e.target.value)} placeholder="rajesh@infosys.com" />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input required value={contact.city} onChange={e => setC("city", e.target.value)} placeholder="Bengaluru" />
            </div>
            <div className="form-group">
              <label className="form-label">State *</label>
              <input required value={contact.state} onChange={e => setC("state", e.target.value)} placeholder="Karnataka" />
            </div>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">❌ Submission failed. Please try again.</p>
          )}
          {status === "success" && (
            <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">✅ Kit inquiry submitted! Redirecting...</p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => kit.setStep(4)} className="btn-outline-navy flex-1">← Back</button>
            <button type="submit" disabled={status === "submitting"}
              className="btn-gold flex-[3] py-3.5 text-base disabled:opacity-60">
              {status === "submitting" ? "⏳ Submitting..." : "📋 Submit Kit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}