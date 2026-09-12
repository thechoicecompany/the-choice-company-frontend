"use client";
import { useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InquirySchema, type InquiryFormData } from "@/lib/validations/inquiry.schema";
import { useRecaptcha } from "@/lib/hooks/useRecaptcha";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Fixed marker — lets admins filter these out in /admin/inquiries
// via the existing Category filter, with zero backend changes.
const CATALOG_REQUEST_CATEGORY = "Catalog Request";

const BUDGET_RANGES = [
    "Under ₹500/unit",
    "₹500 – ₹1,000/unit",
    "₹1,000 – ₹2,500/unit",
    "₹2,500 – ₹5,000/unit",
    "Above ₹5,000/unit",
    "Not sure yet",
];

export default function CatalogRequestForm() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const { getToken } = useRecaptcha();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InquiryFormData>({
        resolver: zodResolver(InquirySchema),
        defaultValues: {
            brandingRequired: false,
            productCategory: CATALOG_REQUEST_CATEGORY, // fixed, hidden from user
        },
    });

    async function onSubmit(data: InquiryFormData) {
        setSubmitting(true);
        setServerError(null);
        setSuccess(null);

        try {
            // Guarded: getToken() rejects cleanly with "reCAPTCHA not loaded"
            // instead of throwing a raw TypeError if the user submits before
            // the <Script> below has finished loading window.grecaptcha.
            // Skipped entirely when no site key is configured (e.g. local dev).
            const recaptchaToken = RECAPTCHA_SITE_KEY
                ? await getToken("catalog_request")
                : "";

            const payload: Record<string, unknown> = {
                ...data,
                productCategory: CATALOG_REQUEST_CATEGORY, // enforce, ignore any tampering
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

            setSuccess(
                `Thanks! Your request (ref: ${json.refNumber}) has been received. We'll send the full catalogue and get back to you shortly.`
            );
            reset({ productCategory: CATALOG_REQUEST_CATEGORY, brandingRequired: false });
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
                {/* Fixed category — sent automatically, not user-editable.
                    Moved inside <form> so it's part of the actual form tree
                    (correct HTML semantics; also keeps it associated with the
                    form if native submission is ever triggered as a fallback). */}
                <input type="hidden" {...register("productCategory")} value={CATALOG_REQUEST_CATEGORY} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Your Name *" error={errors.contactPerson?.message}>
                        <input {...register("contactPerson")} className="input" />
                    </Field>

                    <Field label="Company Name *" error={errors.companyName?.message}>
                        <input {...register("companyName")} className="input" />
                    </Field>

                    <Field label="Designation">
                        <input {...register("designation")} className="input" />
                    </Field>

                    <Field label="Email *" error={errors.email?.message}>
                        <input type="email" {...register("email")} className="input" />
                    </Field>

                    <Field label="Mobile *" error={errors.mobile?.message}>
                        <input
                            type="tel"
                            maxLength={10}
                            placeholder="10-digit mobile number"
                            {...register("mobile")}
                            className="input"
                        />
                    </Field>

                    <Field label="City *" error={errors.city?.message}>
                        <input {...register("city")} className="input" />
                    </Field>

                    <Field label="State *" error={errors.state?.message}>
                        <input {...register("state")} className="input" />
                    </Field>

                    <Field label="Quantity Required (min 50) *" error={errors.quantityRequired?.message}>
                        <input
                            type="number"
                            min={50}
                            max={500000}
                            {...register("quantityRequired", { valueAsNumber: true })}
                            className="input"
                        />
                    </Field>

                    <Field label="Budget Range *" error={errors.budgetRange?.message}>
                        <select {...register("budgetRange")} className="input" defaultValue="">
                            <option value="" disabled>
                                Select a budget range
                            </option>
                            {BUDGET_RANGES.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Delivery Location *" error={errors.deliveryLocation?.message}>
                        <input {...register("deliveryLocation")} className="input" />
                    </Field>

                    <Field label="Expected Delivery Date">
                        <input type="date" {...register("expectedDeliveryDate")} className="input" />
                    </Field>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" {...register("brandingRequired")} />
                    I need custom branding / logo on the products
                </label>

                <Field label="Packaging Requirements">
                    <input
                        placeholder="e.g. Gift-wrapped, branded boxes…"
                        {...register("packagingRequirement")}
                        className="input"
                    />
                </Field>

                <Field label="What are you looking for? *" error={errors.additionalNotes?.message}>
                    <textarea
                        rows={4}
                        placeholder="e.g. Employee kits for 500 staff, festive hampers under ₹800/unit, need samples before bulk order…"
                        {...register("additionalNotes")}
                        className="input resize-none"
                    />
                </Field>

                {serverError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">⚠ {serverError}</div>
                )}
                {success && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">✓ {success}</div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#0D1B2A,#1A5C4A)" }}
                >
                    {submitting ? "Sending…" : "Request Full Catalogue"}
                </button>
            </form>
        </>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
            {children}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}