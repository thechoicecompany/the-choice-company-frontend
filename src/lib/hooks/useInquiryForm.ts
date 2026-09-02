"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { InquirySchema, type InquiryFormData } from "@/lib/validations/inquiry.schema";

export function useInquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [refNumber, setRefNumber] = useState<string | null>(null);

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(InquirySchema),
    defaultValues: {
      companyName: "", contactPerson: "", designation: "",
      email: "", mobile: "", city: "", state: "",
      productCategory: "", quantityRequired: 100,
      budgetRange: "", deliveryLocation: "",
      brandingRequired: false, additionalNotes: "",
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setRefNumber(json.refNumber);
      setStatus("success");
      form.reset();

      // GA4 event
      if (typeof window !== "undefined") {
        const w = window as unknown as Record<string, unknown>;
        if (typeof w.gtag === "function") {
          (w.gtag as Function)("event", "inquiry_submitted", {
            event_category: "Lead",
            event_label: data.productCategory,
            value: data.quantityRequired,
          });
        }
      }
    } catch {
      setStatus("error");
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), status, refNumber };
}
