import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
    email: z.string().email("Valid email required"),
    phone: z
        .string()
        .min(10, "Enter a valid 10-digit mobile number")
        .max(10, "Enter a valid 10-digit mobile number"),
    companyName: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const API = process.env.NEXT_PUBLIC_API_URL ?? "";
const UNLOCK_KEY = "tcc_catalog_unlocked";

export function isCatalogUnlocked(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(UNLOCK_KEY) === "true";
}

// NEW — called by CatalogRequestForm on successful /api/inquiry submit
export function markCatalogUnlocked(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(UNLOCK_KEY, "true");
}

export type RequestStatus = "idle" | "submitting" | "success" | "error";

export function useCatalogueRequest() {
    const [status, setStatus] = useState<RequestStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = form.handleSubmit(async (values) => {
        setStatus("submitting");
        setErrorMessage("");

        try {
            const res = await fetch(`${API}/api/catalogue/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    source: "catalog_page",
                    pageUrl: typeof window !== "undefined"
                        ? window.location.href
                        : undefined,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(
                    json.message ?? "Something went wrong. Please try again."
                );
            }

            markCatalogUnlocked();
            setStatus("success");
        } catch (err) {
            setStatus("error");
            setErrorMessage(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        }
    });

    return { form, onSubmit, status, errorMessage };
}