// SINGLE SOURCE OF TRUTH for inquiry validation.
// Imported in:
//   1. Client-side React Hook Form (field-level feedback)
//   2. Server-side Route Handler (/api/inquiry/route.ts)
// Never duplicate — change here and it applies everywhere.
import { z } from "zod";

const MOBILE_RE = /^[6-9]\d{9}$/;

export const InquirySchema = z.object({
  companyName:          z.string().min(2,  "Company name must be at least 2 characters").max(100),
  contactPerson:        z.string().min(2,  "Contact person name is required").max(100),
  designation:          z.string().max(100).optional(),
  email:                z.string().email("Please enter a valid email address"),
  mobile:               z.string().regex(MOBILE_RE, "Enter a valid 10-digit Indian mobile number"),
  city:                 z.string().min(2,  "City is required").max(60),
  state:                z.string().min(2,  "State is required").max(60),
  productCategory:      z.string().min(1,  "Please select a product category"),
  quantityRequired:     z.number().min(50, "Minimum order quantity is 50 units").max(500_000),
  budgetRange:          z.string().min(1,  "Please select a budget range"),
  deliveryLocation:     z.string().min(2,  "Delivery location is required").max(200),
  brandingRequired:     z.boolean().default(false),
  packagingRequirement: z.string().max(500).optional(),
  expectedDeliveryDate: z.string().optional(),
  additionalNotes:      z.string().max(1_000).optional(),
  logoUrl:              z.string().url().optional(),
  recaptchaToken:       z.string().optional(),
});

export type InquiryFormData = z.infer<typeof InquirySchema>;
