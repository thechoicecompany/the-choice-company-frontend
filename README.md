# The Choice Company — Frontend

> Modern Next.js 15 frontend for **The Choice Company**, a bulk corporate gifting platform designed for businesses to discover, customize, and request corporate gift solutions.

The platform provides product browsing, bulk-order inquiries, industry-specific gifting solutions, gallery/blog pages, and an AI-powered **Kit Builder** that helps users create customized corporate gift combinations based on occasion, budget, quantity, selected products, and company branding.

---

## 📌 Project Overview

The Choice Company Frontend is built using **Next.js 15 with the App Router** and TypeScript.

The application is responsible for:

- Corporate gifting product catalogue
- Product details and filtering
- Bulk order inquiries
- Industry-specific gifting pages
- Corporate gifting gallery
- Blog and blog details
- Contact forms
- WhatsApp integration
- Company logo uploads
- AI-powered gift kit generation
- Server-side API integration
- SEO and sitemap generation
- Responsive mobile and desktop UI
- ISR-based product and blog content updates

---

# 🚀 Technology Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework and application architecture |
| React | UI development |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive UI |
| React Hook Form | Form management |
| Zod | Form validation |
| Axios | HTTP/API communication |
| Framer Motion | Animations |
| React Dropzone | File and logo uploads |
| Yet Another React Lightbox | Gallery/lightbox |
| Lucide React | UI icons |

## Backend Integration

| Technology | Purpose |
|------------|---------|
| Spring Boot | Backend REST API |
| PostgreSQL | Application database |
| REST API | Frontend/backend communication |
| JWT / Authentication | Secure API communication |

## AI & External Services

| Service | Purpose |
|---------|---------|
| Anthropic Claude API | AI-powered gift kit generation |
| WhatsApp Business API | Customer notifications |
| AWS S3 | Company logo/file storage |
| Email Service | Inquiry/ACK email communication |

## Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Next.js frontend deployment |
| AWS EC2 | Spring Boot backend |
| AWS S3 | File/logo storage |
| PostgreSQL | Production database |

---

# 🏗️ Application Architecture

```text
                         ┌─────────────────────┐
                         │       Browser       │
                         │   Desktop / Mobile  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Next.js 15      │
                         │     App Router      │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             Route Handlers      REST API          Static Pages
                    │               │                │
                    │               ▼                │
                    │       ┌───────────────┐        │
                    │       │ Spring Boot   │        │
                    │       │ Backend API   │        │
                    │       └───────┬───────┘        │
                    │               │                │
                    │               ▼                │
                    │        ┌─────────────┐          │
                    │        │ PostgreSQL  │          │
                    │        └─────────────┘          │
                    │
          ┌─────────┼───────────┬────────────┐
          ▼         ▼           ▼            ▼
       Claude     AWS S3     WhatsApp      Email
        API       Upload       API          API

```
📂 Project Structure
```
the-choice-company/
│
├── public/
│   ├── logo.png
│   ├── Poster1.png
│   ├── Poster2.png
│   └── Poster3.png
│
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── sitemap.ts
│   │   │
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── blog/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/page.tsx
│   │   │       │   └── [id]/edit/page.tsx
│   │   │       ├── catalogue/page.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── inquiries/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── inventory/page.tsx
│   │   │       ├── login/page.tsx
│   │   │       └── products/
│   │   │           ├── page.tsx
│   │   │           ├── new/page.tsx
│   │   │           └── [id]/
│   │   │               ├── page.tsx
│   │   │               └── pricing/page.tsx
│   │   │
│   │   ├── about/page.tsx
│   │   ├── api/
│   │   │   ├── admin/upload/
│   │   │   │   ├── image/route.ts
│   │   │   │   └── logo/route.ts
│   │   │   ├── ai/generate-combo/route.ts
│   │   │   ├── inquiry/route.ts
│   │   │   ├── newsletter/route.ts
│   │   │   ├── products/route.ts
│   │   │   └── revalidate/route.ts
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── build-your-kit/page.tsx
│   │   ├── bulk-orders/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── industries/
│   │   │   ├── page.tsx
│   │   │   └── [industry]/page.tsx
│   │   ├── order-success/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── thank-you/page.tsx
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminBadge.tsx
│   │   │   ├── AdminModal.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminStatCard.tsx
│   │   │   ├── AdminTopbar.tsx
│   │   │   ├── DashboardCharts.tsx
│   │   │   ├── ImagePreviewCard.tsx
│   │   │   ├── ImageUploadZone.tsx
│   │   │   ├── InventoryActionModal.tsx
│   │   │   ├── PricingTierForm.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── blog/
│   │   │   ├── BlogEditor.tsx
│   │   │   └── BlogForm.tsx
│   │   ├── cart/CartIcon.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageHero.tsx
│   │   │   └── TopUtilityBar.tsx
│   │   ├── sections/
│   │   │   ├── about/
│   │   │   │   ├── CompanyOverview.tsx
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── DeliveryMap.tsx
│   │   │   │   ├── Infrastructure.tsx
│   │   │   │   ├── TeamGrid.tsx
│   │   │   │   └── VisionMission.tsx
│   │   │   ├── blog/
│   │   │   ├── gallery/GalleryGrid.tsx
│   │   │   ├── home/
│   │   │   │   ├── BudgetFilter.tsx
│   │   │   │   ├── CategoryGrid.tsx
│   │   │   │   ├── CtaBanner.tsx
│   │   │   │   ├── FeaturedProducts.tsx
│   │   │   │   ├── HeroBanner.tsx
│   │   │   │   ├── IndustriesStrip.tsx
│   │   │   │   ├── OccasionCarousel.tsx
│   │   │   │   ├── ProcessFlow.tsx
│   │   │   │   ├── SocialProof.tsx
│   │   │   │   ├── TrustStrip.tsx
│   │   │   │   └── WhyChooseUs.tsx
│   │   │   ├── kit-builder/
│   │   │   │   ├── KitSidebar.tsx
│   │   │   │   ├── Step1OccasionBudget.tsx
│   │   │   │   ├── Step2PickProducts.tsx
│   │   │   │   ├── Step3LogoUpload.tsx
│   │   │   │   ├── Step4AICombo.tsx
│   │   │   │   ├── Step5ReviewQuote.tsx
│   │   │   │   └── StepperNav.tsx
│   │   │   └── products/
│   │   │       ├── BulkInquiryForm.tsx
│   │   │       ├── PricingTiers.tsx
│   │   │       ├── ProductCard.tsx
│   │   │       ├── ProductFilters.tsx
│   │   │       ├── ProductGallery.tsx
│   │   │       ├── ProductGrid.tsx
│   │   │       ├── QuickInquiryForm.tsx
│   │   │       └── RelatedProducts.tsx
│   │   ├── shared/ImageCarousel.tsx
│   │   ├── shop/
│   │   │   ├── ShopBanner.tsx
│   │   │   ├── ShopGrid.tsx
│   │   │   └── ShopProductDetail.tsx
│   │   └── ui/
│   │       ├── ExitIntentPopup.tsx
│   │       ├── SchemaMarkup.tsx
│   │       ├── StickyMobileBar.tsx
│   │       ├── Toast.tsx
│   │       └── WhatsAppButton.tsx
│   │
│   └── lib/
│       ├── api/
│       │   ├── admin.ts
│       │   ├── blog.ts
│       │   ├── client.ts
│       │   ├── gallery.ts
│       │   ├── products.ts
│       │   └── admin/blog.ts
│       ├── constants/
│       │   ├── budgetRanges.ts
│       │   ├── industries.ts
│       │   ├── occasions.ts
│       │   └── sampleProducts.ts
│       ├── hooks/
│       │   ├── useAdminAuth.tsx
│       │   ├── useCart.tsx
│       │   ├── useInquiryForm.ts
│       │   ├── useKitBuilder.ts
│       │   ├── useProductFilter.ts
│       │   └── useScrollReveal.ts
│       ├── types/
│       │   ├── admin.types.ts
│       │   ├── blog.types.ts
│       │   ├── cart.types.ts
│       │   ├── product-image.types.ts
│       │   └── product.types.ts
│       ├── utils/
│       │   ├── buildAIPrompt.ts
│       │   ├── formatCurrency.ts
│       │   ├── generateRef.ts
│       │   ├── sendEmail.ts
│       │   ├── sendOrderEmail.ts
│       │   ├── sendWhatsApp.ts
│       │   ├── uploadToCloudinary.ts
│       │   └── verifyRecaptcha.ts
│       └── validations/
│           ├── contact.schema.ts
│           └── inquiry.schema.ts
│
├── .env.local
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── postcss.config.js
├── eslint.config.js
├── README.md
└── .gitignore

```
📄 Folder Responsibilities
public/

Contains static assets that can be accessed directly by the browser.
```
public/
├── images/
├── icons/
├── favicon.ico
├── robots.txt
└── catalog.pdf
```
```
Images:

images/
├── hero/
├── products/
├── gallery/
├── clients/
└── team/
```
Used for website banners, products, customer logos, gallery content, and team information.

📄 src/app/

Contains all Next.js App Router pages and server-side route handlers.

Main Pages
```
Route	Purpose
/	                      Homepage
/about	                Company information
/products	              Product catalogue
/products/[slug]	      Product details
/bulk-orders	          Bulk order information
/build-your-kit	        AI Kit Builder
/industries	            Industry categories
/industries/[industry]	Industry-specific gifting
/gallery	              Corporate gifting gallery
/blog	                  Blog listing
/blog/[slug]	          Blog details
/contact	              Contact page
/thank-you	            Inquiry confirmation
```

🔌 Next.js API Route Handlers

The frontend contains server-side Route Handlers under:

src/app/api/

Inquiry API
POST /api/inquiry

Purpose:

Receive customer inquiry
Validate submitted information
Forward inquiry to backend
Trigger WhatsApp notification
Trigger email acknowledgement


AI Combo API
POST /api/ai/generate-combo

Purpose:

Receive user requirements
Build AI prompt
Call Anthropic Claude API
Generate recommended gift combination
Return AI recommendation to frontend
Logo Upload API
POST /api/upload/logo

Purpose:

Receive company logo
Validate uploaded file
Upload file to AWS S3
Return uploaded file URL
Products API
GET /api/products

Purpose:

Retrieve product data
Provide product information to frontend components
Revalidation API
POST /api/revalidate

Purpose:

Secure ISR cache invalidation
Revalidate product pages
Revalidate blog pages
Refresh updated content without full deployment
🤖 AI Kit Builder

The AI Kit Builder is one of the primary features of The Choice Company.

It allows corporate customers to create a customized gifting kit based on their requirements.
```
AI Kit Builder Flow
Step 1
Occasion + Budget + Quantity
          │
          ▼
Step 2
Select Products
          │
          ▼
Step 3
Upload Company Logo
          │
          ▼
AWS S3
          │
          ▼
Step 4
AI Gift Combo Generation
          │
          ▼
Anthropic Claude API
          │
          ▼
Step 5
Review Recommended Kit
          │
          ▼
Submit Inquiry
          │
          ▼
Spring Boot Backend

```
🧩 AI Kit Builder Components
```
src/components/sections/kit-builder/

├── StepperNav.tsx
├── Step1OccasionBudget.tsx
├── Step2PickProducts.tsx
├── Step3LogoUpload.tsx
├── Step4AICombo.tsx
├── Step5ReviewQuote.tsx
└── KitSidebar.tsx
```
Step 1 — Occasion & Budget

Users select:

Occasion
Budget range
Quantity
Other requirements

Step 2 — Product Selection

Users browse and select products from the catalogue.

The selected products are managed using:

useKitBuilder.ts

Step 3 — Company Logo

Users upload their company logo.

Flow:
```
Browser
   ↓
/api/upload/logo
   ↓
AWS S3
   ↓
Logo URL
```
Step 4 — AI Recommendation

The application sends the requirements to:

/api/ai/generate-combo

The server-side route communicates with:

Anthropic Claude API

The AI generates a suitable corporate gifting combination.

Step 5 — Review & Submit

The customer reviews the generated kit and submits an inquiry.
```
POST /api/inquiry
        ↓
Spring Boot API
        ↓
Inquiry Processing
        ↓
WhatsApp + Email
```
🔗 Backend Integration

The frontend communicates with the Spring Boot backend through REST APIs.
```
Next.js Frontend
       │
       │ HTTPS
       ▼
Spring Boot REST API
       │
       ▼
PostgreSQL
```
The API client is located at:

src/lib/api/client.ts

Additional API modules:
```
src/lib/api/
├── client.ts
├── products.ts
├── inquiries.ts
└── blog.ts
```
🪝 Custom React Hooks

Application-specific logic is organized under:

src/lib/hooks/
useKitBuilder.ts

Manages AI Kit Builder state and actions.

useInquiryForm.ts

Manages inquiry form state, validation, and submission.

useScrollReveal.ts

Handles scroll-based UI animations.

useProductFilter.ts

Handles product filtering and catalogue interactions.

🛠️ Utility Functions

Located under:
```
src/lib/utils/
File	                                Purpose
formatCurrency.ts	                  Formats Indian currency values
generateRef.ts	                    Generates inquiry/reference IDs
buildAIPrompt.ts	                  Builds AI kit recommendation prompts
uploadToS3.ts	                      Handles S3 upload utilities
```
✅ Validation

Form validation uses Zod.
```
src/lib/validations/

├── inquiry.schema.ts
└── kitBuilder.schema.ts
```
Validation is performed before sending data to backend APIs.

📦 TypeScript Types
```
Shared TypeScript interfaces are located under:

src/lib/types/
product.types.ts
inquiry.types.ts
kit.types.ts

This ensures consistent data structures between:

Components
    ↓
Hooks
    ↓
API Functions
    ↓
Route Handlers


📊 Rendering Strategy

The application uses different Next.js rendering strategies depending on the page.

Page	           Strategy	                Purpose
Home	            SSG	                Mostly static content
About           	SSG	                Company information
Bulk Orders	      SSG	                Static business information
Products	        ISR	                Periodically updated catalogue
Product Details	  ISR	                Product-specific content
Blog	            ISR	                Frequently updated content
Industries	      SSG	                Static industry content
Industry Details	SSG	                Industry-specific content
Gallery	          ISR	                Updated gallery content
Kit Builder	      SSR / Dynamic	      User-specific workflow
Contact	          SSR / Dynamic	      Form-based interaction
Thank You	        SSR / Dynamic	      User-specific confirmation
```
⚡ ISR Revalidation

Product and blog pages can use Incremental Static Regeneration.

When content changes in the backend, the frontend can trigger:

POST /api/revalidate
```
Example:

{
  "secret": "<REVALIDATE_SECRET>",
  "path": "/products/laptop-bag"
}
```
This allows updated pages to be regenerated without requiring a complete frontend deployment.

🔐 Environment Variables
```
Create:

.env.local

For new developers, provide:

.env.local.example

Example structure:

# Spring Boot Backend
NEXT_PUBLIC_API_URL=http://localhost:8080

# Anthropic Claude
ANTHROPIC_API_KEY=

# WhatsApp Business API
WHATSAPP_TOKEN=

# ISR Security
REVALIDATE_SECRET=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
```
⚠️ Never commit .env.local or any file containing real credentials to GitHub.

🔒 Environment Variable Security
Public Variables

Variables beginning with:

NEXT_PUBLIC_

are available in the browser.

Only use this prefix for values that are safe to expose publicly.

Example:

NEXT_PUBLIC_API_URL=https://api.example.com
Server-only Secrets

The following must remain server-side:

ANTHROPIC_API_KEY=
WHATSAPP_TOKEN=
REVALIDATE_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

Never expose these through:

NEXT_PUBLIC_*


🚀 Getting Started

1. Clone Repository
git clone https://github.com/thechoicecompany/the-choice-company-frontend.git

Navigate into the project:

cd the-choice-company-frontend
2. Install Dependencies
npm install
3. Configure Environment Variables

Copy the example environment file.

Windows PowerShell
Copy-Item .env.local.example .env.local
Git Bash / Linux / macOS
cp .env.local.example .env.local

Then update:

.env.local

with the required development values.

4. Start Development Server
npm run dev

Application:

http://localhost:3000

📋 Available Commands

Command	            Description
npm run dev	        Start development server
npm run build	      Create production build
npm run start	      Start production server
npm run lint	      Run ESLint
npm run type-check	Run TypeScript validation

🧪 Development Workflow

Recommended development workflow:
```
1. Pull latest changes
        ↓
2. Create feature branch
        ↓
3. Develop feature
        ↓
4. Run lint
        ↓
5. Run type-check
        ↓
6. Run production build
        ↓
7. Test locally
        ↓
8. Commit changes
        ↓
9. Push branch
        ↓
10. Create Pull Request
```
🌿 Git Workflow
```
Create a feature branch:

git checkout -b feature/product-filter

Check changes:

git status

Stage files:

git add .

Commit:

git commit -m "Add product filtering"

Push:

git push -u origin feature/product-filter

After testing, create a Pull Request into:

main

```
🚨 Before Committing
```
Run:

npm run lint

Then:

npm run type-check

Then:

npm run build
```
All three should complete successfully before merging into main.

🚢 Deployment

The recommended frontend deployment platform is:
```
Vercel
Deployment Flow
Developer
    │
    ▼
GitHub
    │
    ▼
main branch
    │
    ▼
Vercel
    │
    ▼
Production Build
    │
    ▼
Live Website
```
☁️ Vercel Configuration
```
1. Connect GitHub Repository

Connect:

thechoicecompany/the-choice-company-frontend

to the Vercel project.

2. Configure Environment Variables

Add production environment variables in:

Vercel Dashboard
    ↓
Project
    ↓
Settings
    ↓
Environment Variables
```
Configure:
```
NEXT_PUBLIC_API_URL
ANTHROPIC_API_KEY
WHATSAPP_TOKEN
REVALIDATE_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET
```
3. Deploy
```
Every push to:

main

can trigger a production deployment.
```
Pull requests can generate preview deployments.

🔄 Production Data Flow

Product Browsing
```
User
 ↓
Products Page
 ↓
Next.js
 ↓
API Client
 ↓
Spring Boot
 ↓
PostgreSQL
 ↓
Product Response
 ↓
ProductGrid
 ↓
ProductCard
```

📩 Inquiry Flow
```
Customer
 ↓
Inquiry Form
 ↓
React Hook Form
 ↓
Zod Validation
 ↓
/api/inquiry
 ↓
Spring Boot API
 ↓
Inquiry Processing
 ├── WhatsApp Notification
 └── Email Acknowledgement

```
🖼️ Logo Upload Flow
```
Customer
 ↓
Logo Upload
 ↓
Step3LogoUpload.tsx
 ↓
/api/upload/logo
 ↓
AWS S3
 ↓
Public/Signed Logo URL
 ↓
Kit Builder
```
🤖 AI Recommendation Flow
```
User Requirements
        ↓
Occasion
Budget
Quantity
Products
Logo
        ↓
useKitBuilder
        ↓
buildAIPrompt.ts
        ↓
/api/ai/generate-combo
        ↓
Anthropic Claude API
        ↓
AI Recommendation
        ↓
Step4AICombo
        ↓
Step5ReviewQuote

```
📱 Responsive Design
The frontend is designed for:
```
Desktop
Laptop
Tablet
Mobile
```
Important responsive components include:
```
Navbar
StickyMobileBar
ProductGrid
ProductFilters
KitSidebar
QuickInquiryForm
```
Mobile-specific interactions should be tested before production deployment.

🔍 SEO

The frontend supports SEO through:

Next.js metadata
Dynamic page metadata
Sitemap generation
robots.txt
Semantic HTML
Schema markup
Proper page titles
Meta descriptions
Open Graph metadata
Responsive design
Optimized images

Sitemap:

/sitemap.xml

Robots:

/robots.txt


📈 Performance

Recommended performance checks:
```
Lighthouse
├── Performance
├── Accessibility
├── Best Practices
└── SEO
```
Target:
```
Performance     > 90
Accessibility   > 90
SEO             = 100
Best Practices  > 90
```

🛡️ Security Guidelines

Never commit:
```
.env.local
API keys
AWS credentials
WhatsApp tokens
Claude API keys
Database credentials
JWT secrets
Private certificates

Ensure .gitignore contains:

node_modules/
.next/
.env
.env.local
.env.*.local
.vercel/
coverage/
*.log

```
🐛 Common Issues
1. Environment Variable Missing
Error
API key is undefined
Solution

Check:
```
.env.local

and restart the development server:

npm run dev
2. Backend API Not Working

Check:

NEXT_PUBLIC_API_URL=http://localhost:8080

Make sure the Spring Boot backend is running.
```
3. AI Kit Builder Not Working
```
Check:

ANTHROPIC_API_KEY=

Make sure the key exists and is available to the server-side Route Handler.
```
4. Logo Upload Failed
```

Check:

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
```
Also verify AWS S3 permissions.

5. WhatsApp Notification Failed
```
Check:

WHATSAPP_TOKEN=

Verify the WhatsApp Business API configuration and token validity.
```
6. Stale Product/Blog Data

If ISR content is stale, trigger:

POST /api/revalidate

with the correct secret and path.

7. TypeScript Errors

Run:

npm run type-check

Then check:

src/lib/types/

for mismatched API response types.

8. Build Failure

Run:

npm run build

Review the first actual error in the build output.

Do not ignore TypeScript or ESLint errors before production deployment.

🧹 Code Quality Standards

Follow these standards:

Use TypeScript instead of JavaScript where possible
Keep components small and reusable
Avoid duplicated API logic
Keep API calls inside src/lib/api
Keep reusable hooks inside src/lib/hooks
Keep validation schemas inside src/lib/validations
Keep shared interfaces inside src/lib/types
Use meaningful component and variable names
Avoid unnecessary client components
Keep secrets server-side
Validate external API responses
Handle loading and error states
Test responsive layouts


🧩 Component Organization
```
Components are divided into three major categories.

Layout Components
src/components/layout/

Contains:

Navbar
Footer
TopUtilityBar
PageHero
```
These components are reused throughout the application.
```
Section Components
src/components/sections/
```
Contains page-specific business sections.
```
home/
products/
kit-builder/
UI Components
src/components/ui/
```
Contains reusable interface components:
```
Button
Badge
Chip
Accordion
Toast
Lightbox
WhatsAppButton
StickyMobileBar

```
📊 Project Feature Summary

Feature	Status
```
Next.js App Router	✅
TypeScript	✅
Responsive UI	✅
Product Catalogue	✅
Product Details	✅
Product Filtering	✅
Bulk Orders	✅
Inquiry Forms	✅
Industry Pages	✅
Gallery	✅
Blog	✅
WhatsApp Integration	✅
AWS S3 Logo Upload	✅
AI Kit Builder	✅
Claude AI Integration	✅
ISR Revalidation	✅
SEO Sitemap	✅
Robots.txt	✅
Vercel Deployment	✅

```
🧠 AI Kit Builder — Technical Summary
```
Frontend
   │
   ├── Step1OccasionBudget
   │
   ├── Step2PickProducts
   │
   ├── Step3LogoUpload
   │
   ├── Step4AICombo
   │
   └── Step5ReviewQuote
            │
            ▼
      useKitBuilder
            │
            ▼
      buildAIPrompt
            │
            ▼
 /api/ai/generate-combo
            │
            ▼
    Anthropic Claude
            │
            ▼
    Recommended Kit
            │
            ▼
     Review & Submit
            │
            ▼
       /api/inquiry
            │
            ▼
     Spring Boot API

```
📌 Important Routes
```
Route               	    Description
/	                         Homepage
/about	                   About company
/products	                 Product catalogue
/products/[slug]	         Product details
/bulk-orders	             Bulk ordering
/build-your-kit	           AI Kit Builder
/industries	               Industries
/industries/[industry]	   Industry details
/gallery	                  Gallery
/blog	                      Blog
/blog/[slug]	              Blog article
/contact	                  Contact
/thank-you	                Inquiry confirmation
```
🔌 API Routes
```
Method	Endpoint	Purpose
POST	/api/inquiry	Submit inquiry
POST	/api/ai/generate-combo	Generate AI gift combo
POST	/api/upload/logo	Upload company logo
GET	/api/products	Retrieve products
POST	/api/revalidate	Revalidate ISR content
```
✅ Pre-Deployment Checklist
```
Before deploying to production:

[ ] npm install
[ ] npm run lint
[ ] npm run type-check
[ ] npm run build
[ ] Test homepage
[ ] Test product listing
[ ] Test product details
[ ] Test product filters
[ ] Test bulk order form
[ ] Test contact form
[ ] Test AI Kit Builder
[ ] Test logo upload
[ ] Test Claude AI response
[ ] Test WhatsApp notification
[ ] Test email acknowledgement
[ ] Verify environment variables
[ ] Verify AWS S3
[ ] Verify backend API
[ ] Verify sitemap.xml
[ ] Verify robots.txt
[ ] Test mobile responsiveness
[ ] Run Lighthouse
[ ] Verify production build
```
👨‍💻 Development Team

The Choice Company

Corporate Gifting Platform

Repository:

thechoicecompany/the-choice-company-frontend

📞 Support

For technical/project support, contact the project development team.

📜 License

This project is proprietary software developed for The Choice Company.

Unauthorized copying, redistribution, modification, or commercial use is not permitted without appropriate authorization.

⭐ Final Development Flow
```
Developer
    │
    ▼
VS Code
    │
    ▼
Next.js 15 + TypeScript
    │
    ├───────────────┐
    │               │
    ▼               ▼
React UI       Route Handlers
                    │
                    ▼
              Spring Boot API
                    │
                    ▼
                PostgreSQL
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      Claude       AWS        WhatsApp
       AI          S3           API
                    │
                    ▼
                  Email
                    │
                    ▼
                  User
```
🚀 Quick Start
```
# Clone repository
git clone https://github.com/thechoicecompany/the-choice-company-frontend.git

# Enter project
cd the-choice-company-frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Configure environment variables
# Edit .env.local

# Start development server
npm run dev

Open:

http://localhost:3000
```
⭐ AI Kit Builder — Quick Flow
```
Step 1: Occasion + Budget + Quantity
              ↓
Step 2: Pick Products
              ↓
Step 3: Upload Company Logo
              ↓
        AWS S3 Upload
              ↓
Step 4: Generate AI Combo
              ↓
      Anthropic Claude API
              ↓
Step 5: Review Recommended Kit
              ↓
        Submit Inquiry
              ↓
       Spring Boot API
              ↓
      WhatsApp + Email
```
The Choice Company — Corporate Gifting Made Simple.


### Important correction for your GitHub README

Your current GitHub screenshot shows the README being rendered as **one huge paragraph**. That happened because the Markdown formatting in the previous README was malformed/escaped.

The README above fixes that by using proper:

- `#` headings
- `##` sections
- Markdown tables
- fenced code blocks
- proper folder trees
- proper environment examples
- clean GitHub formatting

Also, because you're on **Windows PowerShell**, use this instead of `cp` when setting up the project:

```powershell
Copy-Item .env.local.example .env.local
