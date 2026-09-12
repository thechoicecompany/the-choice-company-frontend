"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { BUDGET_RANGES } from "@/lib/constants/budgetRanges";
import { useRecaptcha } from "@/lib/hooks/useRecaptcha";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const CATEGORIES = [
  "Diwali Gifts", "Holi Gifts", "New Year Gifts", "Christmas Gifts", "Festive Hampers",
  "Gift Hampers", "Laptop Bags", "Backpacks", "Trolley Bags", "Drinkware", "Office Essentials",
  "Apparel", "Travel Kits", "Electronics", "Eco-Friendly Gifts", "Premium Gifts", "Custom Merchandise",
  "Employee Welcome", "Work Anniversary", "Client Appreciation", "Conference Kits",
  "Retirement Gifts", "Wedding Gifts", "Dealer Meet Gifts", "Women's Day",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
];

type FormFields = {
  companyName: string; contactPerson: string; designation: string; email: string;
  mobile: string; city: string; state: string; productCategory: string;
  quantityRequired: number; budgetRange: string; deliveryLocation: string;
  brandingRequired: boolean; packagingRequirement: string;
  expectedDeliveryDate: string; additionalNotes: string;
};

export default function BulkInquiryForm() {
  const router = useRouter();
  const { getToken } = useRecaptcha();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [form, setForm] = useState<FormFields>({
    companyName: "", contactPerson: "", designation: "", email: "",
    mobile: "", city: "", state: "", productCategory: "",
    quantityRequired: 100, budgetRange: "", deliveryLocation: "",
    brandingRequired: true, packagingRequirement: "",
    expectedDeliveryDate: "", additionalNotes: "",
  });

  // Refs so we can scroll + focus the first invalid field
  const fieldRefs = useRef<Partial<Record<keyof FormFields, HTMLElement | null>>>({});

  const set = (k: string, v: unknown) => {
    setForm(p => ({ ...p, [k]: v }));
    // clear that field's error as soon as the user edits it
    setErrors(prev => {
      if (!prev[k as keyof FormFields]) return prev;
      const next = { ...prev };
      delete next[k as keyof FormFields];
      return next;
    });
  };

  const validate = (): Partial<Record<keyof FormFields, string>> => {
    const e: Partial<Record<keyof FormFields, string>> = {};

    if (!form.companyName.trim() || form.companyName.trim().length < 2)
      e.companyName = "Company name is required";
    if (!form.contactPerson.trim() || form.contactPerson.trim().length < 2)
      e.contactPerson = "Contact person is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))
      e.mobile = "Enter a valid 10-digit mobile number (no +91, no spaces)";
    if (!form.state) e.state = "Please select a state";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.deliveryLocation.trim()) e.deliveryLocation = "Delivery location is required";
    if (!form.productCategory) e.productCategory = "Please select a product category";
    if (!form.budgetRange) e.budgetRange = "Please select a budget range";
    if (!form.quantityRequired || form.quantityRequired < 50)
      e.quantityRequired = "Minimum order quantity is 50 units";

    return e;
  };

  const scrollToFirstError = (errs: Partial<Record<keyof FormFields, string>>) => {
    const firstKey = Object.keys(errs)[0] as keyof FormFields | undefined;
    if (!firstKey) return;
    const el = fieldRefs.current[firstKey];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // small delay so the scroll finishes before focus grabs it
      setTimeout(() => el.focus?.(), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("error");
      setErrorMsg("Please fix the highlighted fields below.");
      scrollToFirstError(validationErrors);
      return;
    }

    setStatus("submitting");
    try {
      const recaptchaToken = RECAPTCHA_SITE_KEY ? await getToken("bulk_inquiry") : "";

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setTimeout(() => {
        router.push(`/thank-you?ref=${data.refNumber}&company=${encodeURIComponent(form.companyName)}`);
      }, 1200);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  };

  const field = (
    label: string,
    name: keyof FormFields,
    type = "text",
    required = true,
    placeholder = ""
  ) => (
    <div className="form-group">
      <label className="form-label">{label}{required && " *"}</label>
      <input
        ref={el => { fieldRefs.current[name] = el; }}
        name={name}
        type={type}
        value={form[name] as string}
        onChange={e => set(name, e.target.value)}
        placeholder={placeholder}
        className={errors[name] ? "input-error" : ""}
        aria-invalid={!!errors[name]}
      />
      {errors[name] && <p className="error-msg">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      {RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} />
      )}
      <form onSubmit={handleSubmit} className="card p-8 space-y-6" noValidate>
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
              <select
                ref={el => { fieldRefs.current.state = el; }}
                value={form.state}
                onChange={e => set("state", e.target.value)}
                className={errors.state ? "input-error" : ""}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className="error-msg">{errors.state}</p>}
            </div>
            {field("City", "city", "text", true, "Mumbai")}
            {field("Delivery Location", "deliveryLocation", "text", true, "All offices pan-India")}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-navy mb-4 text-sm uppercase tracking-wide">Order Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Product Category *</label>
              <select
                ref={el => { fieldRefs.current.productCategory = el; }}
                value={form.productCategory}
                onChange={e => set("productCategory", e.target.value)}
                className={errors.productCategory ? "input-error" : ""}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.productCategory && <p className="error-msg">{errors.productCategory}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Budget Range *</label>
              <select
                ref={el => { fieldRefs.current.budgetRange = el; }}
                value={form.budgetRange}
                onChange={e => set("budgetRange", e.target.value)}
                className={errors.budgetRange ? "input-error" : ""}
              >
                <option value="">Select Budget</option>
                {BUDGET_RANGES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
              {errors.budgetRange && <p className="error-msg">{errors.budgetRange}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Quantity Required *</label>
              <input
                ref={el => { fieldRefs.current.quantityRequired = el; }}
                type="number" min={50} max={500000}
                value={form.quantityRequired}
                onChange={e => set("quantityRequired", Number(e.target.value))}
                className={errors.quantityRequired ? "input-error" : ""}
              />
              {errors.quantityRequired && <p className="error-msg">{errors.quantityRequired}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Expected Delivery Date</label>
              <input type="date" value={form.expectedDeliveryDate}
                onChange={e => set("expectedDeliveryDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]} />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <input type="checkbox" id="branding" checked={form.brandingRequired}
              onChange={e => set("brandingRequired", e.target.checked)}
              className="w-4 h-4 accent-gold" />
            <label htmlFor="branding" className="text-sm font-medium text-gray-700 cursor-pointer">
              I need custom branding (logo printing, embroidery, engraving)
            </label>
          </div>
        </div>

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

        {status === "error" && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            ❌ {errorMsg || "Submission failed. Please try again or call us at +91 62688 99194."}
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
    </>
  );
}