import Link from "next/link";

const HOME_FAQS = [
    {
        q: "Do you offer bulk or corporate gifting?",
        a: "Yes — bulk and corporate gifting is a core part of what we do. We've supplied 500+ corporate clients since 2025. Share your requirement and we'll send a custom quotation.",
    },
    {
        q: "Can I add my company logo or branding to products?",
        a: "Yes, most of our drinkware, bags, apparel, and office essentials can be branded with your logo. We'll confirm a proof before production begins.",
    },
    {
        q: "Is there a minimum order quantity (MOQ) for bulk orders?",
        a: "MOQs vary by product and customization type. Share your requirement through our Bulk Orders page and our team will confirm pricing and MOQ.",
    },
    {
        q: "How long does delivery take?",
        a: "Since many products are customized to order, production takes a little longer than ready-made items. Timelines are shared at checkout or in your quotation.",
    },
    {
        q: "Do you offer refunds or returns?",
        a: "Custom/branded items generally aren't returnable for change of mind, but if something arrives with a genuine manufacturing defect, we'll replace or refund it.",
    },
];

/**
 * Condensed FAQ section for the homepage.
 * Reuses the site's --navy / --gold variables and container-site class.
 * Links out to the full /faq page for anything not covered here.
 */
export default function HomeFAQSection() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: HOME_FAQS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
    };

    return (
        <section className="py-16 bg-gray-50/60">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container-site max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--gold)" }}>
                    Support
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--navy)" }}>
                    Frequently asked questions
                </h2>
                <p className="text-gray-600 text-sm mb-8 max-w-xl">
                    A few things customers ask us most often — for the full list, visit our FAQ page.
                </p>

                <div className="divide-y divide-gray-200 border-t border-gray-200 bg-white rounded-lg border border-gray-100 px-5 sm:px-6">
                    {HOME_FAQS.map((item) => (
                        <details key={item.q} className="group py-4">
                            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-sm" style={{ color: "var(--navy)" }}>
                                {item.q}
                                <span className="shrink-0 transition-transform group-open:rotate-45" style={{ color: "var(--gold)" }}>
                                    +
                                </span>
                            </summary>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.a}</p>
                        </details>
                    ))}
                </div>

                <Link
                    href="/faq"
                    className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold hover:gap-2.5 transition-all"
                    style={{ color: "var(--navy)" }}
                >
                    View all FAQs
                    <span style={{ color: "var(--gold)" }}>→</span>
                </Link>
            </div>
        </section>
    );
}