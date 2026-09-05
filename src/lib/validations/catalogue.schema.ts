import { z } from "zod";

export const CatalogueRequestSchema = z.object({
    email: z.string().email("Enter a valid email"),
    companyName: z.string().max(100).optional().or(z.literal("")),
    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    source: z.string().default("catalog_page"),
    pageUrl: z.string().optional(),
});

export type CatalogueRequestFormData = z.infer<typeof CatalogueRequestSchema>;