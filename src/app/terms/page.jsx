import LegalLayout, { LegalSection, ContactCard } from "@/components/LegalLayout";

export const metadata = {
    title: "Terms and Conditions | The Choice Company",
    description:
        "Terms and Conditions for ordering corporate gifts, hampers, and branded merchandise from The Choice Company — covering bulk orders, customization, payment, shipping, and refunds.",
    alternates: { canonical: "https://www.thechoicecompany.in/terms" },
    openGraph: {
        title: "Terms and Conditions | The Choice Company",
        description:
            "Ordering, customization, payment, shipping, and refund terms for retail and bulk/corporate orders.",
        url: "https://www.thechoicecompany.in/terms",
        type: "website",
    },
};

const TOC = [
    { id: "general", label: "General" },
    { id: "products", label: "Products & customization" },
    { id: "bulk", label: "Bulk & corporate orders" },
    { id: "orders", label: "Orders & payment" },
    { id: "shipping", label: "Shipping & delivery" },
    { id: "returns", label: "Returns, refunds & cancellations" },
    { id: "ip", label: "Intellectual property" },
    { id: "conduct", label: "User conduct" },
    { id: "liability", label: "Limitation of liability" },
    { id: "law", label: "Governing law" },
    { id: "changes-t", label: "Changes to these terms" },
];

export default function TermsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: "Terms and Conditions",
                        url: "https://www.thechoicecompany.in/terms",
                        publisher: {
                            "@type": "Organization",
                            name: "The Choice Company",
                            email: "info@thechoicecompany.in",
                            telephone: "+91-6268899194",
                            address: {
                                "@type": "PostalAddress",
                                streetAddress: "393, Sant Nagar, Part I, Scheme No 114",
                                addressLocality: "Indore",
                                addressRegion: "Madhya Pradesh",
                                postalCode: "452010",
                                addressCountry: "IN",
                            },
                        },
                    }),
                }}
            />

            <LegalLayout
                eyebrow="Legal"
                title="Terms and Conditions"
                intro="These Terms govern your use of thechoicecompany.in and your purchase of products from us — whether an individual gift order or a bulk/corporate order. By using our website or placing an order, you agree to these Terms."
                lastUpdated="September 10, 2026"
                activeHref="/terms"
                toc={TOC}
            >
                <LegalSection id="general" number={1} title="General">
                    <p>
                        These Terms and Conditions (&quot;Terms&quot;) apply to all visitors and customers of
                        The Choice Company (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a Indore-based,
                        GST-registered corporate and personal gifting company operating since 2025. By
                        browsing our site or placing an order — retail or bulk — you agree to be bound by
                        these Terms.
                    </p>
                </LegalSection>

                <LegalSection id="products" number={2} title="Products & customization">
                    <p>
                        We offer gift hampers, drinkware, bags, apparel, office essentials, travel kits, and
                        other merchandise, with options for branding or personalization (logos, names, text,
                        or artwork) that you provide at the time of order or through our Build Your Kit tool.
                    </p>
                    <p>
                        Product photos are representative — because many items are customized or
                        branded to order, minor variations in colour, material, or print finish may occur.
                        You are responsible for the accuracy of logos, artwork, spellings, and other details
                        you submit. Once production begins, changes can no longer be made.
                    </p>
                    <p>
                        If content you provide infringes someone else&apos;s intellectual property or is
                        unlawful, we reserve the right to refuse or cancel the order.
                    </p>
                </LegalSection>

                <LegalSection id="bulk" number={3} title="Bulk & corporate orders">
                    <p>
                        Bulk and corporate orders may be subject to a minimum order quantity, a separate
                        quotation, and a production timeline communicated to you at the time of enquiry.
                        Artwork/logo approval is typically required before production begins.
                    </p>
                    <p>
                        For corporate accounts, we may require an advance payment or purchase order before
                        confirming production, with the balance due prior to dispatch, as agreed in your
                        quotation. GST invoices are provided for all corporate purchases.
                    </p>
                </LegalSection>

                <LegalSection id="orders" number={4} title="Orders & payment">
                    <p>
                        An order is confirmed once payment (or an agreed advance, for bulk orders) is
                        received and you receive a confirmation from us. We reserve the right to refuse or
                        cancel an order — for example, in cases of pricing errors, suspected fraud, or where
                        the requested customization cannot be produced.
                    </p>
                    <p>
                        Prices are listed in Indian Rupees (INR) and are exclusive of applicable taxes unless
                        stated otherwise; GST is added as per current rates. We accept payment through the
                        methods shown at checkout or agreed in your quotation, processed via secure payment
                        gateways or bank transfer.
                    </p>
                </LegalSection>

                <LegalSection id="shipping" number={5} title="Shipping & delivery">
                    <p>
                        We deliver pan-India. Because many products are customized or branded to order,
                        production and delivery timelines are longer than off-the-shelf items and will be
                        communicated at the time of order or quotation. You can track dispatched orders using
                        our Track Order page.
                    </p>
                    <p>
                        Delivery dates are estimates and may be affected by courier delays, incorrect address
                        details, or circumstances beyond our control. Please ensure shipping and billing
                        details are accurate — we are not responsible for delays caused by incorrect
                        information provided by you.
                    </p>
                </LegalSection>

                <LegalSection id="returns" number={6} title="Returns, refunds & cancellations">
                    <p>
                        As many of our products are customized or branded to your specifications, we
                        generally do not accept returns or exchanges for change of mind, incorrect
                        personalization/artwork details submitted by you, or minor natural variations in
                        handcrafted or printed items.
                    </p>
                    <p>
                        <strong>Manufacturing defects:</strong> if an item arrives with a genuine
                        manufacturing defect or is damaged in production or transit, we will offer a
                        replacement or refund. Contact us within a reasonable time of delivery with your
                        order number and photos of the issue.
                    </p>
                    <p>
                        Cancellations are only possible before production begins. For bulk/corporate orders,
                        any advance payment made may be non-refundable once artwork is approved and
                        production has started, as specified in your quotation.
                    </p>
                </LegalSection>

                <LegalSection id="ip" number={7} title="Intellectual property">
                    <p>
                        All content on our website — designs, logos, photographs, and text — is the property
                        of The Choice Company unless otherwise stated and may not be copied or reused without
                        written permission. Any client logos or artwork supplied to us for branding remain
                        the property of the respective client and are used solely to fulfil that order.
                    </p>
                </LegalSection>

                <LegalSection id="conduct" number={8} title="User conduct">
                    <p>
                        You agree not to misuse our website, attempt unauthorized access, submit unlawful or
                        infringing content for customization, or use the site in a way that could impair its
                        functionality.
                    </p>
                </LegalSection>

                <LegalSection id="liability" number={9} title="Limitation of liability">
                    <p>
                        To the extent permitted by law, The Choice Company is not liable for indirect,
                        incidental, or consequential losses arising from the use of our website or products.
                        Our total liability for any claim relating to an order is limited to the amount paid
                        for that order.
                    </p>
                </LegalSection>

                <LegalSection id="law" number={10} title="Governing law">
                    <p>
                        These Terms are governed by the laws of India, and any disputes are subject to the
                        exclusive jurisdiction of the courts of Indore, Madhya Pradesh.
                    </p>
                </LegalSection>

                <LegalSection id="changes-t" number={11} title="Changes to these terms">
                    <p>
                        We may revise these Terms from time to time. Changes take effect as soon as they are
                        posted on this page, so please review them periodically.
                    </p>
                </LegalSection>

                <ContactCard />
            </LegalLayout>
        </>
    );
}