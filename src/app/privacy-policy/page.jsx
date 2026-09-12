import LegalLayout, { LegalSection, ContactCard } from "@/components/LegalLayout";

export const metadata = {
    title: "Privacy Policy | The Choice Company",
    description:
        "Learn how The Choice Company collects, uses, and protects your personal and business information when you order corporate gifts, hampers, or branded merchandise.",
    alternates: { canonical: "https://www.thechoicecompany.in/privacy-policy" },
    openGraph: {
        title: "Privacy Policy | The Choice Company",
        description:
            "How The Choice Company collects, uses, and protects your personal and business information.",
        url: "https://www.thechoicecompany.in/privacy-policy",
        type: "website",
    },
};

const TOC = [
    { id: "collection", label: "Information we collect" },
    { id: "use", label: "How we use your information" },
    { id: "security", label: "Data security" },
    { id: "thirdparty", label: "Third-party disclosure" },
    { id: "rights", label: "Your rights" },
    { id: "changes", label: "Changes to this policy" },
];

export default function PrivacyPolicyPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: "Privacy Policy",
                        url: "https://www.thechoicecompany.in/privacy-policy",
                        publisher: {
                            "@type": "Organization",
                            name: "The Choice Company",
                            email: "info@thechoicecompany.in",
                            telephone: "+91-6268899194",
                            foundingDate: "2025",
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
                title="Privacy Policy"
                intro="The Choice Company is committed to safeguarding the privacy of our website visitors, individual customers, and corporate clients. This policy explains what information we collect — including business details for bulk and corporate orders — how we use it, and the choices you have."
                lastUpdated="September 10, 2026"
                activeHref="/privacy-policy"
                toc={TOC}
            >
                <LegalSection id="collection" number={1} title="Information we collect">
                    <h3>Personal information</h3>
                    <p>
                        We collect information such as your name, email address, phone number, and delivery
                        address when you place an order, use our Build Your Kit tool, request a bulk order
                        quote, track an order, or contact us for support.
                    </p>
                    <h3>Business information</h3>
                    <p>
                        For corporate and bulk orders, we may also collect company name, GST/billing details,
                        designation, and purchase order or invoicing information necessary to process and
                        document your order.
                    </p>
                    <h3>Payment information</h3>
                    <p>
                        When you make a purchase, we collect payment details necessary to process your
                        transaction securely through our third-party, PCI-compliant payment gateway. We do
                        not store your full card details on our servers.
                    </p>
                    <h3>Cookies</h3>
                    <p>
                        We use cookies to enhance your browsing experience, understand how visitors use our
                        site and product pages, and personalize content. You can manage cookies through your
                        browser settings at any time.
                    </p>
                </LegalSection>

                <LegalSection id="use" number={2} title="How we use your information">
                    <p>
                        We use your information to process orders (individual and bulk/corporate), prepare
                        quotations and invoices, coordinate customization and branding on products, arrange
                        pan-India delivery, and respond to enquiries.
                    </p>
                    <p>
                        With your consent, we may use your details for marketing — such as our newsletter,
                        new collection updates, or seasonal corporate gifting offers. You can opt out of
                        marketing communications at any time.
                    </p>
                </LegalSection>

                <LegalSection id="security" number={3} title="Data security">
                    <p>
                        We implement reasonable technical and organisational measures — including secure
                        payment processing and access controls — to protect your personal and business
                        information from unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <p>
                        No method of transmission over the internet is completely secure, so while we work
                        hard to protect your data, we cannot guarantee absolute security.
                    </p>
                </LegalSection>

                <LegalSection id="thirdparty" number={4} title="Third-party disclosure">
                    <p>
                        We may share information with third parties who support our operations — payment
                        processors, courier and logistics partners, printing/branding vendors for
                        customization, and marketing service providers. These parties are required to keep
                        your information confidential and comply with applicable data protection laws.
                    </p>
                    <p>
                        We may also disclose information when required by law, or to protect our rights,
                        property, or safety, or that of others.
                    </p>
                </LegalSection>

                <LegalSection id="rights" number={5} title="Your rights">
                    <p>
                        You may access, update, or request deletion of the personal or business information
                        we hold about you, and can ask us to restrict certain processing or object to
                        specific uses. To exercise these rights, contact us using the details below.
                    </p>
                </LegalSection>

                <LegalSection id="changes" number={6} title="Changes to this policy">
                    <p>
                        We may update this Privacy Policy from time to time. Changes take effect as soon as
                        they are posted on this page, so please check back periodically.
                    </p>
                </LegalSection>

                <ContactCard />
            </LegalLayout>
        </>
    );
}