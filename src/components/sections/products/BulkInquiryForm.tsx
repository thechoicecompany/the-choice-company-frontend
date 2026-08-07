"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OCCASIONS }     from "@/lib/constants/occasions";
import { BUDGET_RANGES } from "@/lib/constants/budgetRanges";

const CATEGORIES = [
  "Gift Hampers","Laptop Bags","Backpacks","Drinkware","Office Essentials",
  "Apparel","Travel Kits","Electronics","Eco-Friendly Gifts","Premium Gifts","Custom Merchandise",
];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

export default function BulkInquiryForm() {
  const router  = useRouter();
  const [status, setStatus] = useState<"idle"|"submitting"|"success"|"error">("idle");
  const [form,   setForm]   = useState({
    companyName:"", contactPerson:"", designation:"", email:"",
    mobile:"", city:"", state:"", productCategory:"",
    quantityRequired:100, budgetRange:"", deliveryLocation:"",
    brandingRequired:true, packagingRequirement:"",
    expectedDeliveryDate:"", additionalNotes:"",
  });

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res  = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setTimeout(() => {
        router.push(`/thank-you?ref=${data.refNumber}&company=${encodeURIComponent(form.companyName)}`);
      }, 1200);
    } catch {
      setStatus("error");
    }
  };

  const field = (label: string, name: string, type = "text", required = true, placeholder = "") => (
    <div className="form-group">
      <label className="form-label">{label}{required && " *"}</label>
      <input name={name} type={type} required={required}
        value={(form as Record<string, unknown>)[name] as string}
        onChange={e => set(name, e.target.value)}
        placeholder={placeholder} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-6">
      {/* Company Info */}
      <div>
        <h4 className="font-bold text-navy mb-4 text-sm uppercase tracking-wide">Company Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("Company Name", "companyName", "text", true, "Infosys Limited")}
          {field("Contact Person", "contactPerson", "text", true, "Rajesh Kumar")}
          {field("Designation", "designation", "text", false, "HR Manager")}
          {field("Email Address", "email", "email", true, "rajesh@infosys.com")}
          {field("Mobile Number", "mobile", "tel", true, "9876500000")}
          <div className="form-group">
            <label className="form-label">State *</label>
            <select required value={form.state} onChange={e => set("state", e.target.value)}>
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {field("City", "city", "text", true, "Mumbai")}
          {field("Delivery Location", "deliveryLocation", "text", true, "All offices pan-India")}
        </div>
      </div>

      {/* Order Details */}
      <div>
        <h4 className="font-bold text-navy mb-4 text-sm uppercase tracking-wide">Order Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Product Category *</label>
            <select required value={form.productCategory} onChange={e => set("productCategory", e.target.value)}>
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Budget Range *</label>
            <select required value={form.budgetRange} onChange={e => set("budgetRange", e.target.value)}>
              <option value="">Select Budget</option>
              {BUDGET_RANGES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity Required *</label>
            <input type="number" required min={50} max={500000}
              value={form.quantityRequired}
              onChange={e => set("quantityRequired", Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Expected Delivery Date</label>
            <input type="date" value={form.expectedDeliveryDate}
              onChange={e => set("expectedDeliveryDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]} />
          </div>
        </div>

        {/* Branding toggle */}
        <div className="flex items-center gap-3 mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <input type="checkbox" id="branding" checked={form.brandingRequired}
            onChange={e => set("brandingRequired", e.target.checked)}
            className="w-4 h-4 accent-gold" />
          <label htmlFor="branding" className="text-sm font-medium text-gray-700 cursor-pointer">
            I need custom branding (logo printing, embroidery, engraving)
          </label>
        </div>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Packaging Requirement</label>
          <textarea value={form.packagingRequirement}
            onChange={e => set("packagingRequirement", e.target.value)}
            placeholder="Standard / premium box / custom packaging..."
            rows={3} className="resize-none" />
        </div>
        <div className="form-group">
          <label className="form-label">Additional Notes</label>
          <textarea value={form.additionalNotes}
            onChange={e => set("additionalNotes", e.target.value)}
            placeholder="Any other specific requirements..."
            rows={3} className="resize-none" />
        </div>
      </div>

      {/* Status messages */}
      {status === "error" && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          ❌ Submission failed. Please try again or call us at +91 81090 00100.
        </div>
      )}
      {status === "success" && (
        <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
          ✅ Inquiry submitted successfully! Redirecting to confirmation...
        </div>
      )}

      <button type="submit" disabled={status === "submitting"}
        className="btn-gold w-full py-4 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
        {status === "submitting" ? "⏳ Submitting..." : "📋 Submit Bulk Requirement"}
      </button>

      <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
        <span>🔒 Data is 100% secure</span>
        <span>✅ Response within 24 hours</span>
        <span>📦 Pan-India delivery</span>
        <span>🏭 MOQ from 50 units</span>
      </div>
    </form>
  );
}
