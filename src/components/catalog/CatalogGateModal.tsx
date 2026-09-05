"use client";
import { useEffect } from "react";
import { useCatalogueRequest } from "@/lib/hooks/useCatalogueRequest";

interface Props {
    onClose: () => void;
    /** Called once the gate is passed — e.g. gallery unlock, opens the item the user meant to view */
    onSuccess?: () => void;
}

export default function CatalogGateModal({ onClose, onSuccess }: Props) {
    const { form, onSubmit, status, downloadUrl, errorMessage } = useCatalogueRequest();
    const { register, formState: { errors } } = form;

    useEffect(() => {
        if (status !== "success") return;

        // Only the static "get full catalogue" flow returns a downloadUrl —
        // gallery-gate submissions won't, so this stays a no-op for that case.
        if (downloadUrl) {
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "the-choice-company-catalogue.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }

        if (typeof window !== "undefined") {
            const w = window as unknown as Record<string, unknown>;
            if (typeof w.gtag === "function") {
                (w.gtag as (...args: unknown[]) => void)("event", "catalogue_downloaded", {
                    event_category: "Lead",
                    event_label: "catalog_page",
                });
            }
        }

        onSuccess?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, downloadUrl]);

    return (
        <div className="fixed inset-0 z-[600] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-400 text-sm">✕</button>

                <h3 className="text-lg font-bold text-navy mb-1">Get our full catalogue</h3>
                <p className="text-sm text-gray-400 mb-4">A few quick details and it's yours.</p>

                <form onSubmit={onSubmit} className="space-y-3" noValidate>
                    <div>
                        <input type="email" placeholder="Email *" {...register("email")} className="input w-full" />
                        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input type="tel" maxLength={10} placeholder="Mobile number *" {...register("phone")} className="input w-full" />
                        {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                    </div>

                    <input placeholder="Company name (optional)" {...register("companyName")} className="input w-full" />

                    {status === "error" && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">⚠ {errorMessage}</div>
                    )}
                    {status === "success" && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                            ✓ {downloadUrl
                                ? "Download starting — we've also emailed you the link."
                                : "You're all set — you can now view and download our catalogues."}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg,#0D1B2A,#1A5C4A)" }}
                    >
                        {status === "submitting" ? "Preparing…" : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}