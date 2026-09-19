"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Buildings,
  User,
  Briefcase,
  Envelope,
  Phone,
  MapPin,
  Package,
  CurrencyInr,
  Hash,
  Calendar,
  PaintBucket,
  Gift,
  CheckCircle,
  WarningCircle,
  ArrowRight,
  Spinner,
  ShieldCheck,
  Clock,
  Truck,
  Factory,
} from "@phosphor-icons/react";
import { BUDGET_RANGES } from "@/lib/constants/budgetRanges";
import { useRecaptcha } from "@/lib/hooks/useRecaptcha";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "100% Secure" },
  { icon: Clock, label: "24h Response" },
  { icon: Truck, label: "Pan-India Delivery" },
  { icon: Factory, label: "MOQ 50 Units" },
];

export default function BulkInquiryForm() {
  const router = useRouter();
  const { getToken } = useRecaptcha();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [form, setForm] = useState<FormFields>({
    companyName: "", contactPerson: "", designation: "", email: "",
    mobile: "", city: "", state: "", productCategory: "",
    quantityRequired: 100, budgetRange: "", deliveryLocation: "",
    brandingRequired: true, packagingRequirement: "", expectedDeliveryDate: "", additionalNotes: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<keyof FormFields, HTMLElement | null>>>({});
  const btnRef = useRef<HTMLButtonElement>(null);

  // ── Entrance animations ──────────────────────────────────────────────────
  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".anim-section");
    sections.forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 32,
        duration: 0.65,
        delay: i * 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    gsap.from(".anim-field", {
      opacity: 0,
      y: 18,
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.out",
      delay: 0.1,
    });
  }, { scope: containerRef });

  // ── Helpers ──────────────────────────────────────────────────────────────
  const set = (k: string, v: unknown) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(prev => {
      if (!prev[k as keyof FormFields]) return prev;
      const next = { ...prev };
      delete next[k as keyof FormFields];
      return next;
    });
  };

  const validate = (): Partial<Record<keyof FormFields, string>> => {
    const e: Partial<Record<keyof FormFields, string>> = {};
    if (!form.companyName.trim() || form.companyName.trim().length < 2) e.companyName = "Company name is required";
    if (!form.contactPerson.trim() || form.contactPerson.trim().length < 2) e.contactPerson = "Contact person is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) e.mobile = "Enter a valid 10-digit mobile number";
    if (!form.state) e.state = "Please select a state";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.deliveryLocation.trim()) e.deliveryLocation = "Delivery location is required";
    if (!form.productCategory) e.productCategory = "Please select a product category";
    if (!form.budgetRange) e.budgetRange = "Please select a budget range";
    if (!form.quantityRequired || form.quantityRequired < 50) e.quantityRequired = "Minimum order quantity is 50 units";
    return e;
  };

  const scrollToFirstError = (errs: Partial<Record<keyof FormFields, string>>) => {
    const firstKey = Object.keys(errs)[0] as keyof FormFields | undefined;
    if (!firstKey) return;
    const el = fieldRefs.current[firstKey];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
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
      // Shake the button
      if (btnRef.current) {
        gsap.fromTo(btnRef.current, { x: -6 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" });
      }
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

  // ── Reusable field builder ────────────────────────────────────────────────
  const Field = ({
    label, name, type = "text", required = true, placeholder = "", icon: Icon,
  }: {
    label: string; name: keyof FormFields; type?: string;
    required?: boolean; placeholder?: string; icon: React.ElementType;
  }) => (
    <div className={`anim-field flex flex-col gap-1.5 ${errors[name] ? "field-error" : ""}`}>
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}{required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon size={16} weight="duotone" />
        </span>
        <input
          ref={el => { fieldRefs.current[name] = el; }}
          name={name} type={type}
          value={form[name] as string}
          onChange={e => set(name, e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!errors[name]}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-white text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200
            ${errors[name]
              ? "border-red-300 ring-2 ring-red-100 focus:border-red-400"
              : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            }`}
        />
      </div>
      {errors[name] && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
          <WarningCircle size={12} weight="fill" /> {errors[name]}
        </p>
      )}
    </div>
  );

  const SelectField = ({
    label, name, required = true, options, placeholder, icon: Icon,
  }: {
    label: string; name: keyof FormFields; required?: boolean;
    options: { value: string; label: string }[]; placeholder: string; icon: React.ElementType;
  }) => (
    <div className={`anim-field flex flex-col gap-1.5`}>
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}{required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          <Icon size={16} weight="duotone" />
        </span>
        <select
          ref={el => { fieldRefs.current[name] = el; }}
          value={form[name] as string}
          onChange={e => set(name, e.target.value)}
          aria-invalid={!!errors[name]}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-white text-slate-800 appearance-none outline-none transition-all duration-200 cursor-pointer
            ${errors[name]
              ? "border-red-300 ring-2 ring-red-100 focus:border-red-400"
              : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            }`}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {errors[name] && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
          <WarningCircle size={12} weight="fill" /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <>
      {RECAPTCHA_SITE_KEY && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} />
      )}

      <div ref={containerRef}>
        {/* ── SECTION DIVIDER ── */}
        <div className="anim-section flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Company Information</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-10">

          {/* ── COMPANY INFO ── */}
          <div className="anim-section grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company Name" name="companyName" icon={Buildings} placeholder="Infosys Limited" />
            <Field label="Contact Person" name="contactPerson" icon={User} placeholder="Rajesh Kumar" />
            <Field label="Designation" name="designation" icon={Briefcase} required={false} placeholder="HR Manager" />
            <Field label="Email Address" name="email" type="email" icon={Envelope} placeholder="rajesh@infosys.com" />
            <Field label="Mobile Number" name="mobile" type="tel" icon={Phone} placeholder="9876500000" />
            <SelectField
              label="State" name="state" icon={MapPin} placeholder="Select State"
              options={INDIAN_STATES.map(s => ({ value: s, label: s }))}
            />
            <Field label="City" name="city" icon={MapPin} placeholder="Mumbai" />
            <Field label="Delivery Location" name="deliveryLocation" icon={Truck} placeholder="All offices pan-India" />
          </div>

          {/* ── ORDER DETAILS ── */}
          <div className="anim-section">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Order Details</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Product Category" name="productCategory" icon={Gift} placeholder="Select Category"
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
              />
              <SelectField
                label="Budget Range" name="budgetRange" icon={CurrencyInr} placeholder="Select Budget"
                options={BUDGET_RANGES.map(b => ({ value: b.value, label: b.label }))}
              />
              <div className="flex flex-col gap-1.5 anim-field">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Quantity Required<span className="text-amber-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Hash size={16} weight="duotone" />
                  </span>
                  <input
                    ref={el => { fieldRefs.current.quantityRequired = el; }}
                    type="number" min={50} max={500000}
                    value={form.quantityRequired}
                    onChange={e => set("quantityRequired", Number(e.target.value))}
                    aria-invalid={!!errors.quantityRequired}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-white text-slate-800 outline-none transition-all duration-200
                      ${errors.quantityRequired
                        ? "border-red-300 ring-2 ring-red-100"
                        : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                      }`}
                  />
                </div>
                {errors.quantityRequired && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
                    <WarningCircle size={12} weight="fill" /> {errors.quantityRequired}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 anim-field">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Expected Delivery Date
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Calendar size={16} weight="duotone" />
                  </span>
                  <input
                    type="date"
                    value={form.expectedDeliveryDate}
                    onChange={e => set("expectedDeliveryDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Branding Checkbox */}
            <label
              className="anim-field flex items-start gap-4 mt-5 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 cursor-pointer group hover:border-amber-300 hover:bg-amber-50/40 transition-all duration-200"
            >
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox" id="branding"
                  checked={form.brandingRequired}
                  onChange={e => set("brandingRequired", e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all duration-200 flex items-center justify-center">
                  <svg className="hidden peer-checked:block w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  Custom Branding Required
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Logo printing, embroidery, engraving on products</p>
              </div>
              <PaintBucket size={20} weight="duotone" className="ml-auto text-slate-300 group-hover:text-amber-400 transition-colors shrink-0 mt-0.5" />
            </label>
          </div>

          {/* ── PACKAGING & NOTES ── */}
          <div className="anim-section">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Additional Details</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: "packagingRequirement" as keyof FormFields, label: "Packaging Requirement", placeholder: "Standard / premium box / custom packaging..." },
                { name: "additionalNotes" as keyof FormFields, label: "Additional Notes", placeholder: "Any other specific requirements..." },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className="flex flex-col gap-1.5 anim-field">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</label>
                  <textarea
                    value={form[name] as string}
                    onChange={e => set(name, e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 placeholder:text-slate-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── FEEDBACK BANNERS ── */}
          {status === "error" && (
            <div className="anim-section flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
              <WarningCircle size={18} weight="fill" className="shrink-0 text-red-400" />
              {errorMsg || "Submission failed. Please try again or call us at +91 62688 99194."}
            </div>
          )}
          {status === "success" && (
            <div className="anim-section flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
              <CheckCircle size={18} weight="fill" className="shrink-0 text-emerald-500" />
              Inquiry submitted! Redirecting to your confirmation...
            </div>
          )}

          {/* ── CTA ── */}
          <div className="anim-section">
            <button
              ref={btnRef}
              type="submit"
              disabled={status === "submitting"}
              className="relative w-full overflow-hidden group flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold text-base bg-amber-500 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:bg-amber-600 active:scale-[0.98] shadow-lg shadow-amber-200"
            >
              {/* Shimmer */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              {status === "submitting" ? (
                <>
                  <Spinner size={20} className="animate-spin" />
                  Submitting your inquiry...
                </>
              ) : (
                <>
                  <Package size={20} weight="duotone" />
                  Submit Bulk Requirement
                  <ArrowRight size={18} className="ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>

            {/* Trust strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 justify-center text-xs text-slate-400 font-medium">
                  <Icon size={14} weight="duotone" className="text-amber-400 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

        </form>
      </div>
    </>
  );
}