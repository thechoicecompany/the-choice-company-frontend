"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  productName: string;
  productId: number;
  onClose?: () => void;
  isModal?: boolean;
}

export default function QuickInquiryForm({ productName, productId, onClose, isModal }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle"|"submitting"|"success"|"error">("idle");
  const [form, setForm] = useState({
    companyName: "", contactPerson: "", mobile: "", email: "",
    quantityRequired: 100, additionalNotes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "quantityRequired" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productCategory: productName,
          budgetRange: "To be discussed",
          deliveryLocation: "To be confirmed",
          city: "N/A", state: "N/A",
          designation: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setTimeout(() => {
        onClose?.();
        router.push(`/thank-you?ref=${data.refNumber}&company=${encodeURIComponent(form.companyName)}`);
      }, 1500);
    } catch {
      setStatus("error");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/10 border border-gold/20">
        <span className="text-lg">🎁</span>
        <span className="text-sm font-medium text-navy line-clamp-1">{productName}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="form-group">
          <label className="form-label">Company Name *</label>
          <input name="companyName" value={form.companyName} onChange={handleChange}
            placeholder="Infosys Ltd." required minLength={2} />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Person *</label>
          <input name="contactPerson" value={form.contactPerson} onChange={handleChange}
            placeholder="Rajesh Kumar" required />
        </div>
        <div className="form-group">
          <label className="form-label">Mobile Number *</label>
          <input name="mobile" value={form.mobile} onChange={handleChange}
            placeholder="9876500000" required pattern="[6-9][0-9]{9}" />
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="rajesh@infosys.com" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Quantity Required *</label>
        <input name="quantityRequired" type="number" value={form.quantityRequired} onChange={handleChange}
          min={50} max={100000} required />
        <p className="text-[11px] text-gray-400 mt-1">Minimum order: 50 units</p>
      </div>

      <div className="form-group">
        <label className="form-label">Additional Notes</label>
        <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange}
          placeholder="Any specific branding, packaging or delivery requirements..."
          rows={3} className="resize-none" />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          ❌ Something went wrong. Please try again or call us directly.
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          ✅ Inquiry submitted! Redirecting...
        </p>
      )}

      <button type="submit" disabled={status === "submitting"}
        className="btn-gold w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed">
        {status === "submitting" ? "Submitting..." : "📋 Submit Inquiry"}
      </button>

      <p className="text-[11px] text-center text-gray-400">
        🔒 Your data is secure · ✅ Response within 24 hrs · 📦 Pan-India Delivery
      </p>
    </form>
  );

  if (!isModal) {
    return (
      <div className="mt-6 p-6 rounded-2xl border border-gray-200 bg-gray-50">
        <h3 className="font-bold text-navy mb-4 text-base">📋 Request a Bulk Quote</h3>
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl anim-fade-up"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair font-bold text-navy text-xl">Get a Bulk Quote</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
        </div>
        {formContent}
      </div>
    </div>
  );
}
