"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CatalogueRequestSchema, type CatalogueRequestFormData } from "@/lib/validations/catalogue.schema";

const UNLOCK_KEY = "tcc_catalog_unlocked";

/** Has this visitor already passed the contact gate? Unlocks all gallery PDFs once true. */
export function isCatalogUnlocked(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(UNLOCK_KEY) === "true";
}

export function useCatalogueRequest() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<CatalogueRequestFormData>({
        resolver: zodResolver(CatalogueRequestSchema),
        defaultValues: { email: "", companyName: "", phone: "", source: "catalog_page" },
    });

    const onSubmit = async (data: CatalogueRequestFormData) => {
        setStatus("submitting");
        setErrorMessage(null);
        try {
            const payload = {
                ...data,
                pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
            };

            const res = await fetch("/api/catalogue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.error || "Something went wrong");

            // Old static-catalogue flow returns a downloadUrl; gallery gate doesn't need one.
            setDownloadUrl(json.data?.downloadUrl ?? null);
            setStatus("success");

            if (typeof window !== "undefined") {
                localStorage.setItem(UNLOCK_KEY, "true");
            }

            form.reset();
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
            setStatus("error");
        }
    };

    return { form, onSubmit: form.handleSubmit(onSubmit), status, downloadUrl, errorMessage };
}