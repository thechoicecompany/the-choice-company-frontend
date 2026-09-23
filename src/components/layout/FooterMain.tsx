"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const QUICK_LINKS = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Our Products", href: "/products" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Industries", href: "/industries" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
    { label: "Track Order", href: "/track-order" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "FAQ", href: "/faq" },
];

const CATEGORIES = [
    { label: "Diwali Gifts", href: "/products/category/diwali-gifts" },
    { label: "New Year Gifts", href: "/products/category/new-year-gifts" },
    { label: "Festive Hampers", href: "/products/category/festive-hampers" },
    { label: "Electronics", href: "/products/category/electronics" },
    { label: "Bags", href: "/products/category/bags" },
    { label: "Trolley Bags", href: "/products/category/trolley-bags" },
    { label: "Laptop Bags", href: "/products/category/laptop-bags" },
    { label: "Gift Hampers", href: "/products/category/gift-hampers" },
    { label: "Employee Kits", href: "/products/category/employee-kits" },
];

const SOCIALS = [
    { label: "Facebook", href: "https://www.facebook.com/thechoicecompany.in", icon: "/icons/facebook.png" },
    { label: "Instagram", href: "https://www.instagram.com/the_choice.company", icon: "/icons/instagram.png" },
    { label: "LinkedIn", href: "https://linkedin.com/company/thechoicecompany", icon: "/icons/linkedin.png" },
    { label: "WhatsApp", href: "https://wa.me/916268899194", icon: "/icons/whatsapp.png" },
];

const CONTACT = [
    { icon: Phone, label: "+91 6268 899194", href: "tel:+916268899194" },
    { icon: Mail, label: "info@thechoicecompany.in", href: "mailto:info@thechoicecompany.in" },
    { icon: MessageCircle, label: "WhatsApp Us", href: "https://wa.me/916268899194" },
    { icon: MapPin, label: "Indore, Madhya Pradesh, India", href: null },
    { icon: Clock, label: "Mon–Sat: 9AM – 6PM IST", href: null },
];

export default function FooterMain() {
    const mainRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from(".footer-col", {
                opacity: 0, y: 30, duration: 0.7, stagger: 0.08, ease: "power2.out",
                scrollTrigger: { trigger: mainRef.current, start: "top 85%" },
            });
        },
        { scope: mainRef }
    );

    return (
        <div ref={mainRef} style={{ maxWidth: 1400, margin: "0 auto", padding: "64px 40px" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">

                {/* Col 1 — Brand (no left border) */}
                <div className="footer-col" style={{ paddingRight: 32, paddingBottom: 32 }}>
                    <div className="mb-5">
                        <Image
                            src="/logo.png"
                            alt="The Choice Company"
                            width={180}
                            height={180}
                            className="object-contain"
                        />
                    </div>
                    <p style={{ color: "#AEB9C5", fontSize: 13, lineHeight: 1.7, marginBottom: 20, maxWidth: 250 }}>
                        India's trusted corporate gifting partner — customized gifts, branded solutions, and
                        seamless delivery across India.
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {SOCIALS.map(({ label, href, icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="transition-all duration-200 hover:-translate-y-1"
                                style={{
                                    width: 38, height: 38, borderRadius: "50%",
                                    border: "1px solid rgba(212,166,58,0.35)",
                                    background: "rgba(212,166,58,0.06)",
                                    overflow: "hidden", flexShrink: 0, display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                }}
                            >
                                <Image src={icon} alt={label} width={38} height={38} className="object-cover" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Col 2 — Quick Links */}
                <FooterCol heading="Quick Links">
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {QUICK_LINKS.map(({ label, href }) => (
                            <li key={label} style={{ marginBottom: 10 }}>
                                <Link
                                    href={href}
                                    className="footer-link group"
                                    style={{
                                        color: "#AEB9C5",
                                        fontSize: 13,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLAnchorElement).style.color = "#D4A63A";
                                        const span = (e.currentTarget as HTMLAnchorElement).querySelector("span");
                                        if (span) span.style.transform = "translateX(4px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLAnchorElement).style.color = "#AEB9C5";
                                        const span = (e.currentTarget as HTMLAnchorElement).querySelector("span");
                                        if (span) span.style.transform = "translateX(0)";
                                    }}
                                >
                                    <span style={{ transition: "transform 0.2s", display: "inline-block" }}>
                                        {label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </FooterCol>

                {/* Col 3 — Categories */}
                <FooterCol heading="Product Categories">
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {CATEGORIES.map(({ label, href }) => (
                            <li key={label} style={{ marginBottom: 10 }}>
                                <Link
                                    href={href}
                                    style={{
                                        color: "#AEB9C5", fontSize: 13,
                                        textDecoration: "none", display: "inline-block",
                                        transition: "color 0.2s, transform 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLAnchorElement).style.color = "#D4A63A";
                                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(4px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLAnchorElement).style.color = "#AEB9C5";
                                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
                                    }}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </FooterCol>

                {/* Col 4 — Contact */}
                <FooterCol heading="Contact Us">
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {CONTACT.map(({ icon: Icon, label, href }) =>
                            href ? (
                                <a
                                    key={label}
                                    href={href}
                                    target={href.startsWith("http") ? "_blank" : undefined}
                                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    style={{
                                        display: "flex", alignItems: "flex-start", gap: 10,
                                        color: "#AEB9C5", fontSize: 13, textDecoration: "none",
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#AEB9C5"; }}
                                >
                                    <Icon size={15} style={{ color: "#D4A63A", marginTop: 1, flexShrink: 0 }} />
                                    <span>{label}</span>
                                </a>
                            ) : (
                                <div
                                    key={label}
                                    style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "#AEB9C5", fontSize: 13 }}
                                >
                                    <Icon size={15} style={{ color: "#D4A63A", marginTop: 1, flexShrink: 0 }} />
                                    <span>{label}</span>
                                </div>
                            )
                        )}
                    </div>
                </FooterCol>

                {/* Col 5 — Newsletter */}
                <FooterCol heading="Subscribe to Our Newsletter">
                    <p style={{ color: "#AEB9C5", fontSize: 13, lineHeight: 1.65, marginBottom: 20 }}>
                        Get updates on new products, corporate gifting ideas and exclusive offers.
                    </p>
                    <NewsletterForm />
                </FooterCol>
            </div>
        </div>
    );
}

function FooterCol({
    heading,
    children,
}: {
    heading: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="footer-col"
            style={{
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                paddingLeft: 28,
                paddingRight: 16,
                paddingBottom: 32,
            }}
        >
            <h4
                style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#D4A63A",
                    marginBottom: 20,
                    letterSpacing: "0.01em",
                }}
            >
                {heading}
            </h4>
            {children}
        </div>
    );
}