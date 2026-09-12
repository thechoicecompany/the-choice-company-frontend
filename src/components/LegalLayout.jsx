import Link from "next/link";

const NAV_TABS = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "FAQ", href: "/faq" },
];

/**
 * Shared shell for legal / support pages (Privacy Policy, Terms, FAQ).
 * Reuses the site's existing --navy / --gold CSS variables and
 * .container-site utility class so it drops into the current design system.
 */
export default function LegalLayout({
    eyebrow,
    title,
    intro,
    lastUpdated,
    activeHref,
    toc,       // optional: [{ id, label }]
    children,
}) {
    return (
        <main className="bg-white">
            {/* Section tab bar */}
            <div className="border-b border-gray-100">
                <div className="container-site flex flex-wrap gap-6 py-4">
                    {NAV_TABS.map(({ label, href }) => {
                        const active = href === activeHref;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="text-xs font-medium pb-1 border-b-2 transition-colors"
                                style={{
                                    color: active ? "var(--navy)" : "#9CA3AF",
                                    borderColor: active ? "var(--gold)" : "transparent",
                                }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Hero */}
            <div className="container-site pt-14 pb-8 max-w-3xl">
                {eyebrow && (
                    <p className="text-xs font-semibold mb-3" style={{ color: "var(--gold)" }}>
                        {eyebrow}
                    </p>
                )}
                <h1
                    className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
                    style={{ color: "var(--navy)" }}
                >
                    {title}
                </h1>
                {intro && <p className="text-gray-600 text-base leading-relaxed max-w-xl">{intro}</p>}
                {lastUpdated && (
                    <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100 inline-block">
                        Last updated: {lastUpdated}
                    </p>
                )}
            </div>

            {/* Table of contents */}
            {toc && toc.length > 0 && (
                <div className="container-site max-w-3xl mb-4">
                    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-6">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-3">On this page</p>
                        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            {toc.map(({ id, label }, i) => (
                                <li key={id}>
                                    <a href={`#${id}`} className="text-gray-600 hover:text-[var(--navy)]">
                                        {i + 1}. {label}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}

            {/* Body */}
            <div className="container-site max-w-3xl pb-16">{children}</div>
        </main>
    );
}

export function LegalSection({ id, number, title, children }) {
    return (
        <section id={id} className="py-8 border-t border-gray-100 first:border-t-0 scroll-mt-6">
            <h2 className="text-xl font-bold mb-3 flex items-baseline gap-2" style={{ color: "var(--navy)" }}>
                {number && <span style={{ color: "var(--gold)" }}>{number}.</span>}
                {title}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 [&_h3]:font-semibold [&_h3]:text-sm [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:text-[var(--navy)] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
                {children}
            </div>
        </section>
    );
}

export function ContactCard() {
    return (
        <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-6 mt-4">
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--navy)" }}>
                Contact us
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Questions about this page? We&apos;re happy to help.
            </p>
            <div className="space-y-1.5 text-sm text-gray-700">
                <div>
                    <span className="text-gray-400 mr-2">Phone</span>
                    <a href="tel:+916268899194" className="hover:text-[var(--navy)]">+91 6268899194</a>
                </div>
                <div>
                    <span className="text-gray-400 mr-2">Email</span>
                    <a href="mailto:info@thechoicecompany.in" className="hover:text-[var(--navy)]">info@thechoicecompany.in</a>
                </div>
                <div>
                    <span className="text-gray-400 mr-2">Address</span>
                    393, Sant Nagar, Part I, Scheme No 114, Indore, Madhya Pradesh 452010
                </div>
            </div>
        </div>
    );
}