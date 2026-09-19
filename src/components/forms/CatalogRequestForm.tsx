"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InquirySchema, type InquiryFormData } from "@/lib/validations/inquiry.schema";
import { useRecaptcha } from "@/lib/hooks/useRecaptcha";
import { markCatalogUnlocked } from "@/lib/hooks/useCatalogueRequest";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const CATALOG_REQUEST_CATEGORY = "Catalog Request";

const BUDGET_RANGES = [
    "Under ₹500/unit",
    "₹500 – ₹1,000/unit",
    "₹1,000 – ₹2,500/unit",
    "₹2,500 – ₹5,000/unit",
    "Above ₹5,000/unit",
    "Not sure yet",
];

// ── Shared input class ────────────────────────────────────────────────────────
const inputCls = [
    "w-full rounded-xl px-3.5 py-2.5 text-sm",
    "bg-white/[0.06] border border-white/[0.12] text-white",
    "placeholder:text-white/30",
    "focus:outline-none focus:border-[#b8922a]/60 focus:bg-white/[0.09]",
    "focus:ring-2 focus:ring-[#b8922a]/15",
    "transition-all duration-200",
    "autofill:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.06)]",
].join(" ");

const selectCls = [
    inputCls,
    "[&>option]:bg-[#1e1608] [&>option]:text-white",
].join(" ");

export default function CatalogRequestForm() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const { getToken } = useRecaptcha();
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InquiryFormData>({
        resolver: zodResolver(InquirySchema),
        defaultValues: {
            brandingRequired: false,
            productCategory: CATALOG_REQUEST_CATEGORY,
        },
    });

    async function onSubmit(data: InquiryFormData) {
        setSubmitting(true);
        setServerError(null);
        setSuccess(null);

        try {
            const recaptchaToken = RECAPTCHA_SITE_KEY
                ? await getToken("catalog_request")
                : "";

            const payload: Record<string, unknown> = {
                ...data,
                productCategory: CATALOG_REQUEST_CATEGORY,
                source: "CATALOG_PAGE",
                recaptchaToken,
            };
            if (!payload.logoUrl) delete payload.logoUrl;
            if (!payload.designation) delete payload.designation;
            if (!payload.packagingRequirement) delete payload.packagingRequirement;
            if (!payload.expectedDeliveryDate) delete payload.expectedDeliveryDate;

            const res = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.error || "Failed to send request. Please try again.");
            }

            markCatalogUnlocked();
            setSuccess(
                `Thanks! Your request (ref: ${json.refNumber}) has been received. Redirecting you back to download…`
            );
            reset({ productCategory: CATALOG_REQUEST_CATEGORY, brandingRequired: false });

            const returnTo = searchParams.get("returnTo") || "/gallery";
            setTimeout(() => router.push(returnTo), 1500);
        } catch (err: unknown) {
            setServerError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {RECAPTCHA_SITE_KEY && (
                <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <input type="hidden" {...register("productCategory")} value={CATALOG_REQUEST_CATEGORY} />

                {/* ── Grid fields ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                    <Field label="Your Name" required error={errors.contactPerson?.message}>
                        <input {...register("contactPerson")} className={inputCls} />
                    </Field>
                    <Field label="Company Name" required error={errors.companyName?.message}>
                        <input {...register("companyName")} className={inputCls} />
                    </Field>
                    <Field label="Designation" error={errors.designation?.message}>
                        <input {...register("designation")} className={inputCls} />
                    </Field>
                    <Field label="Email" required error={errors.email?.message}>
                        <input type="email" {...register("email")} className={inputCls} />
                    </Field>
                    <Field label="Mobile" required error={errors.mobile?.message}>
                        <input
                            type="tel"
                            maxLength={10}
                            placeholder="10-digit number"
                            {...register("mobile")}
                            className={inputCls}
                        />
                    </Field>
                    <Field label="City" required error={errors.city?.message}>
                        <input {...register("city")} className={inputCls} />
                    </Field>
                    <Field label="State" required error={errors.state?.message}>
                        <input {...register("state")} className={inputCls} />
                    </Field>
                    <Field label="Quantity Required (min 50)" required error={errors.quantityRequired?.message}>
                        <input
                            type="number"
                            min={50}
                            max={500000}
                            {...register("quantityRequired", { valueAsNumber: true })}
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Budget Range" required error={errors.budgetRange?.message}>
                        <select {...register("budgetRange")} defaultValue="" className={selectCls}>
                            <option value="" disabled>Select a budget range</option>
                            {BUDGET_RANGES.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Delivery Location" required error={errors.deliveryLocation?.message}>
                        <input {...register("deliveryLocation")} className={inputCls} />
                    </Field>
                    <Field label="Expected Delivery Date" error={errors.expectedDeliveryDate?.message}>
                        <input
                            type="date"
                            {...register("expectedDeliveryDate")}
                            className={inputCls}
                            style={{ colorScheme: "dark" }}
                        />
                    </Field>
                </div>

                {/* ── Branding checkbox ── */}
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <span className="relative flex-shrink-0">
                        <input
                            type="checkbox"
                            {...register("brandingRequired")}
                            className="peer sr-only"
                        />
                        {/* custom box */}
                        <span
                            className={[
                                "flex h-4.5 w-4.5 items-center justify-center rounded-[5px] border transition-all duration-200",
                                "border-white/20 bg-white/[0.06]",
                                "peer-checked:border-[#b8922a] peer-checked:bg-[#b8922a]/20",
                                "peer-focus-visible:ring-2 peer-focus-visible:ring-[#b8922a]/30",
                            ].join(" ")}
                            aria-hidden
                        >
                            {/* checkmark — always rendered, opacity toggled via peer */}
                            <svg
                                className="h-2.5 w-2.5 opacity-0 peer-checked:opacity-100 transition-opacity"
                                viewBox="0 0 10 8"
                                fill="none"
                                stroke="#d4a843"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M1 4l3 3 5-6" />
                            </svg>
                        </span>
                    </span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                        I need custom branding / logo on the products
                    </span>
                </label>

                {/* ── Packaging ── */}
                <Field label="Packaging Requirements">
                    <input
                        placeholder="e.g. Gift-wrapped, branded boxes…"
                        {...register("packagingRequirement")}
                        className={inputCls}
                    />
                </Field>

                {/* ── Notes ── */}
                <Field label="What are you looking for?" required error={errors.additionalNotes?.message}>
                    <textarea
                        rows={3}
                        placeholder="e.g. Employee kits for 500 staff, festive hampers under ₹800/unit…"
                        {...register("additionalNotes")}
                        className={`${inputCls} resize-none`}
                    />
                </Field>

                {/* ── Feedback banners ── */}
                {serverError && (
                    <div
                        className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm border"
                        style={{
                            background: "rgba(239,68,68,0.08)",
                            borderColor: "rgba(239,68,68,0.25)",
                            color: "rgba(252,165,165,0.95)",
                        }}
                    >
                        <svg className="mt-0.5 flex-shrink-0 h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 4a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 5zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        {serverError}
                    </div>
                )}
                {success && (
                    <div
                        className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm border"
                        style={{
                            background: "rgba(34,197,94,0.08)",
                            borderColor: "rgba(34,197,94,0.25)",
                            color: "rgba(134,239,172,0.95)",
                        }}
                    >
                        <svg className="mt-0.5 flex-shrink-0 h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.03 5.47a.75.75 0 00-1.06-1.06L7 8.38 6.03 7.41a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3.5-3.5z" />
                        </svg>
                        {success}
                    </div>
                )}

                {/* ── Submit button ── */}

                <button
                    type="submit"
                    disabled={submitting}
                    className="group relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background: submitting
                            ? "rgba(184,146,42,0.4)"
                            : "linear-gradient(135deg, #b8922a 0%, #d4a843 50%, #b8922a 100%)",
                        color: "#0d0c0b",
                    }}
                >
                    {/* shimmer sweep */}
                    {!submitting && (
                        <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
                        />
                    )}

                    <span className="relative flex items-center justify-center gap-2">
                        {submitting ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Sending…
                            </>
                        ) : (
                            <>
                                Request Full Catalogue
                                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 8h10M9 4l4 4-4 4" />
                                </svg>
                            </>
                        )}
                    </span>
                </button>
            </form>
        </>
    );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
    label,
    required,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                className="text-xs font-medium tracking-wide"
                style={{ color: "rgba(255,255,255,0.55)" }}
            >
                {label}
                {required && (
                    <span className="ml-1" style={{ color: "#b8922a" }}>*</span>
                )}
            </label>
            {children}
            {error && (
                <p className="text-xs" style={{ color: "rgba(252,165,165,0.9)" }}>
                    {error}
                </p>
            )}
        </div>
    );
}