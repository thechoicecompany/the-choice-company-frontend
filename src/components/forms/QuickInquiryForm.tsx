"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRecaptcha } from "@/lib/hooks/useRecaptcha";
import {
  BuildingOffice,
  User,
  Phone,
  EnvelopeSimple,
  Package,
  CheckCircle,
  WarningCircle,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

gsap.registerPlugin(useGSAP);

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

interface QuickInquiryFormProps {
  productName: string;
  productId: string | number;
  moq?: number;
  onClose?: () => void;
  isModal?: boolean;
}

interface FormState {
  company: string;
  contact: string;
  mobile: string;
  email: string;
  quantity: string;
  notes: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function QuickInquiryForm({ productName, productId, moq = 1, onClose, isModal = false }: QuickInquiryFormProps) {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { getToken } = useRecaptcha();

  const [form, setForm] = useState<FormState>({
    company: "",
    contact: "",
    mobile: "",
    email: "",
    quantity: String(moq),
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");

  useGSAP(() => {
    gsap.from(".form-field", {
      opacity: 0,
      y: 12,
      stagger: 0.07,
      duration: 0.45,
      ease: "power2.out",
      delay: 0.6,
    });
  }, { scope: ref });

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.company.trim()) errs.company = "Company name is required";
    if (!form.contact.trim()) errs.contact = "Contact person is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) errs.mobile = "Enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    const qty = parseInt(form.quantity);
    if (isNaN(qty) || qty < moq) errs.quantity = `Minimum order is ${moq} units`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const recaptchaToken = RECAPTCHA_SITE_KEY
        ? await getToken("quick_inquiry")
        : "";

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: typeof productId === "string" ? parseInt(productId) : productId,
          companyName: form.company,
          contactPerson: form.contact,
          mobile: form.mobile,
          email: form.email,
          quantityRequired: parseInt(form.quantity),
          additionalNotes: form.notes,
          productCategory: productName,
          budgetRange: "To be discussed",
          deliveryLocation: "To be confirmed",
          city: "N/A",
          state: "N/A",
          designation: "",
          recaptchaToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setStatus("success");
      gsap.fromTo(
        ".success-msg",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      setTimeout(() => {
        onClose?.();
        router.push(
          `/thank-you?ref=${data.refNumber}&company=${encodeURIComponent(form.company)}`
        );
      }, 1500);
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200";
  const errInput = "border-red-300 bg-red-50 focus:ring-red-300/50 focus:border-red-400";

  const formContent = (
    <div ref={ref}>
      {status === "success" ? (
        <div className="success-msg rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
          <CheckCircle size={40} weight="fill" className="text-emerald-500 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-900 text-lg mb-1">Inquiry Received</h3>
          <p className="text-sm text-zinc-500">Our team will reach out within 24 hours.</p>
          {isModal && onClose && (
            <button onClick={onClose} className="mt-4 text-sm text-zinc-500 hover:text-zinc-800 underline">
              Close
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/60 flex items-center gap-3">
            <Package size={18} weight="fill" className="text-amber-500" />
            <div>
              <p className="text-xs text-zinc-400 font-medium">Requesting bulk quote for</p>
              <p className="text-sm font-semibold text-zinc-800 leading-tight">{productName}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            {RECAPTCHA_SITE_KEY && (
              <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} />
            )}

            {status === "error" && (
              <div className="form-field flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                <WarningCircle size={16} weight="fill" className="flex-shrink-0" />
                Something went wrong. Please try again or call us directly.
              </div>
            )}

            {/* Row 1 */}
            <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                  <BuildingOffice size={12} weight="bold" className="text-zinc-400" />
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Infosys Ltd."
                  className={`${inputBase} ${errors.company ? errInput : ""}`}
                />
                {errors.company && (
                  <span className="text-[11px] text-red-500 flex items-center gap-1">
                    <WarningCircle size={11} weight="fill" /> {errors.company}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                  <User size={12} weight="bold" className="text-zinc-400" />
                  Contact Person <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={set("contact")}
                  placeholder="Rajesh Kumar"
                  className={`${inputBase} ${errors.contact ? errInput : ""}`}
                />
                {errors.contact && (
                  <span className="text-[11px] text-red-500 flex items-center gap-1">
                    <WarningCircle size={11} weight="fill" /> {errors.contact}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                  <Phone size={12} weight="bold" className="text-zinc-400" />
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={set("mobile")}
                  placeholder="9876500000"
                  className={`${inputBase} ${errors.mobile ? errInput : ""}`}
                />
                {errors.mobile && (
                  <span className="text-[11px] text-red-500 flex items-center gap-1">
                    <WarningCircle size={11} weight="fill" /> {errors.mobile}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                  <EnvelopeSimple size={12} weight="bold" className="text-zinc-400" />
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="rajesh@infosys.com"
                  className={`${inputBase} ${errors.email ? errInput : ""}`}
                />
                {errors.email && (
                  <span className="text-[11px] text-red-500 flex items-center gap-1">
                    <WarningCircle size={11} weight="fill" /> {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Qty */}
            <div className="form-field flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                <Package size={12} weight="bold" className="text-zinc-400" />
                Quantity Required <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={set("quantity")}
                min={moq}
                placeholder={String(moq)}
                className={`${inputBase} ${errors.quantity ? errInput : ""}`}
              />
              {errors.quantity ? (
                <span className="text-[11px] text-red-500 flex items-center gap-1">
                  <WarningCircle size={11} weight="fill" /> {errors.quantity}
                </span>
              ) : (
                <span className="text-[11px] text-zinc-400">Minimum order: {moq} units</span>
              )}
            </div>

            {/* Notes */}
            <div className="form-field flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-600">Additional Notes</label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                placeholder="Any specific branding, packaging or delivery requirements..."
                className={`${inputBase} resize-none`}
              />
            </div>

            {/* CTA */}
            <div className="form-field pt-1">
              <button
                ref={btnRef}
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] active:-translate-y-px text-white font-semibold text-sm rounded-xl px-6 py-3.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_12px_-2px_rgba(245,158,11,0.45)]"
              >
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PaperPlaneTilt size={16} weight="fill" />
                    Submit Inquiry
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 mt-3">
                {[
                  { icon: "🔒", label: "Your data is secure" },
                  { icon: "⚡", label: "Response within 24 hrs" },
                  { icon: "🚚", label: "Pan-India Delivery" },
                ].map(({ icon, label }) => (
                  <span key={label} className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <span>{icon}</span>{label}
                  </span>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  if (!isModal) return formContent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal close button */}
        <div className="flex justify-end px-4 pt-4 bg-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
}
