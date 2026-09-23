"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function FooterBottom() {
    return (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div
                className="mx-auto flex flex-col md:flex-row items-center justify-between gap-3 px-10 py-5"
                style={{ maxWidth: 1400 }}
            >
                {/* Left */}
                <p style={{ color: "#788797", fontSize: 13 }}>
                    © {new Date().getFullYear()} The Choice Company. All Rights Reserved.
                </p>

                {/* Center */}
                <div className="flex items-center gap-4">
                    {[
                        { label: "Privacy Policy", href: "/privacy-policy" },
                        { label: "Terms & Conditions", href: "/terms" },
                        { label: "FAQ", href: "/faq" },
                    ].map(({ label, href }, i, arr) => (
                        <span key={label} className="flex items-center gap-4">
                            <Link
                                href={href}
                                className="transition-colors duration-200 hover:text-white"
                                style={{ color: "#788797", fontSize: 13, textDecoration: "none" }}
                            >
                                {label}
                            </Link>
                            {i < arr.length - 1 && (
                                <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Right */}
                <p
                    className="flex items-center gap-1.5"
                    style={{ color: "#788797", fontSize: 13 }}
                >
                    Made with{" "}
                    <Heart size={13} fill="#e05252" color="#e05252" />{" "}
                    in India{" "}
                    <span role="img" aria-label="Indian flag" style={{ fontSize: 16 }}>
                        🇮🇳
                    </span>
                </p>
            </div>
        </div>
    );
}