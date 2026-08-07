# The Choice Company — Frontend

Next.js 15 App Router frontend for India's trusted bulk corporate gifting platform.

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/your-org/the-choice-company-frontend.git
cd the-choice-company-frontend
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Fill in all values — see .env.local comments for guidance

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev with Turbopack (hot reload) |
| `npm run build` | Production build — runs SSG, shows bundle sizes |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint check — must pass before every commit |
| `npm run type-check` | TypeScript check — must pass before every commit |

---

## 🏗 Architecture

```
Browser → Next.js (Vercel) → Spring Boot API (AWS EC2) → PostgreSQL
                   ↓
           Route Handlers
           ├── /api/inquiry       → Spring Boot + WhatsApp + Email
           ├── /api/ai/generate-combo → Anthropic Claude API
           ├── /api/upload/logo   → AWS S3
           └── /api/revalidate    → Next.js ISR rebuild
```

### Rendering strategy

| Page | Strategy | Rebuilds when |
|---|---|---|
| Home, About, Bulk Orders | SSG | On every deploy |
| Products, Blog, Gallery | ISR (1–2 hr) | Admin webhook or timer |
| Industries (9 pages) | SSG | On every deploy |
| Kit Builder, Contact | SSR | Every request |
| Thank-you | SSR (noindex) | Every request |

---

## 📁 Key Files

```
src/
├── app/                          # Next.js App Router — all routes
│   ├── layout.tsx                # Root layout (navbar, footer, fonts)
│   ├── page.tsx                  # Home page (SSG)
│   ├── products/page.tsx         # Products listing (ISR 1hr)
│   ├── products/[slug]/page.tsx  # Product detail (ISR 30min)
│   ├── build-your-kit/page.tsx   # AI Kit Builder (SSR)
│   └── api/
│       ├── inquiry/route.ts      # POST — form submission
│       ├── ai/generate-combo/    # POST — Claude AI combo
│       ├── upload/logo/          # POST — S3 logo upload
│       └── revalidate/           # POST — ISR webhook
│
├── components/
│   ├── layout/                   # Navbar, Footer, PageHero, TopUtilityBar
│   ├── sections/
│   │   ├── home/                 # 12 homepage sections
│   │   ├── products/             # ProductGrid, ProductCard, Filters, Forms
│   │   └── kit-builder/          # 5-step wizard + sidebar
│   └── ui/                       # WhatsAppButton, Toast, SchemaMarkup, etc.
│
└── lib/
    ├── api/                      # Axios client + typed API functions
    ├── hooks/                    # useKitBuilder, useInquiryForm, useScrollReveal
    ├── utils/                    # formatINR, generateRef, buildAIPrompt, etc.
    ├── validations/              # Zod schemas (shared client + server)
    ├── types/                    # TypeScript interfaces
    └── constants/                # occasions, industries, budgetRanges
```

---

## 🔑 Environment Variables

See `.env.local` for the full list. Key variables:

| Variable | Side | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Public | Spring Boot backend URL |
| `ANTHROPIC_API_KEY` | Server | Claude AI for kit builder |
| `WHATSAPP_TOKEN` | Server | WhatsApp Business API |
| `REVALIDATE_SECRET` | Server | ISR webhook security |
| `AWS_ACCESS_KEY_ID` | Server | S3 logo uploads |

> **Never** put secrets in `NEXT_PUBLIC_` variables — they are exposed in the browser.

---

## 🤖 AI Kit Builder

The AI Kit Builder is the platform's key differentiator. Flow:

1. **Step 1** — User selects occasion + budget + quantity
2. **Step 2** — User picks products from catalogue
3. **Step 3** — User uploads company logo (→ S3)
4. **Step 4** — AI generates optimal combo via Claude API
5. **Step 5** — User reviews + submits inquiry

The AI call is made server-side in `/api/ai/generate-combo/route.ts` using `ANTHROPIC_API_KEY`. The prompt is built by `src/lib/utils/buildAIPrompt.ts`.

---

## 📡 ISR Revalidation Webhook

When the Spring Boot admin updates a product or blog post, it should call:

```bash
POST https://thechoicecompany.in/api/revalidate
Content-Type: application/json

{
  "secret": "<REVALIDATE_SECRET>",
  "path": "/products/laptop-bag"
}
```

This immediately rebuilds the cached Next.js page without a full redeploy.

---

## 🚀 Deployment

```bash
# Deploy to Vercel
vercel deploy --prod

# Pull env vars from Vercel dashboard to local
vercel env pull .env.local
```

**Vercel setup:**
1. Connect GitHub repository to Vercel project
2. Set all env vars in Vercel Dashboard → Settings → Environment Variables
3. Every push to `main` triggers automatic deploy
4. Every PR gets a preview URL automatically

---

## ✅ Pre-deploy Checklist

- [ ] `npm run lint` — 0 errors
- [ ] `npm run type-check` — 0 errors
- [ ] `npm run build` — builds successfully
- [ ] All env vars set in Vercel dashboard
- [ ] Test form submission on preview URL
- [ ] Verify WhatsApp notification received
- [ ] Verify ACK email received
- [ ] Run Lighthouse — target: Performance > 90, SEO = 100
- [ ] Check `/sitemap.xml` renders all pages
- [ ] Test mobile — hamburger menu + sticky bar

---

## 🐛 Common Issues

| Issue | Cause | Fix |
|---|---|---|
| Page shows stale content | ISR cache not refreshed | Call `/api/revalidate` with correct path |
| WhatsApp not received | Token expired | Regenerate in Meta Business Dashboard |
| Logo upload fails | S3 credentials wrong | Check `AWS_ACCESS_KEY_ID` in Vercel env vars |
| AI combo fails | API key missing | Check `ANTHROPIC_API_KEY` in Vercel env vars |
| Build fails with type errors | Types outdated | Update `src/lib/types/` to match Spring Boot response |

---

## 📞 Support

**Stimulus Research Services**
📧 dev@stimulusresearch.in
📞 +91 XXXXX XXXXX
