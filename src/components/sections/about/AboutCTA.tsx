import Link from "next/link";

export default function AboutCTA() {
    return (
        <section
            style={{ background: "var(--navy, #071827)", borderTop: "1px solid var(--gold, #D4A63A)" }}
            className="relative overflow-hidden pt-14 pb-20 md:pb-24"
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,58,0.12), transparent 60%)",
                }}
            />

            <div className="container-site relative text-center max-w-3xl mx-auto">
                <span
                    className="text-xs font-semibold uppercase"
                    style={{ color: "var(--gold, #D4A63A)", letterSpacing: "3px" }}
                >
                    Our Approach
                </span>
                <span
                    className="my-6 block mx-auto"
                    style={{ width: 42, height: 2, background: "var(--gold, #D4A63A)" }}
                />

                <p className="font-playfair text-2xl md:text-3xl text-white leading-snug mb-10">
                    We&apos;re not just a gifting store — we deliver corporate gifting
                    solutions, from sourcing to customization, packaging and delivery,
                    at the scale your business requires.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02]"
                        style={{ background: "var(--gold, #D4A63A)", color: "var(--navy, #071827)" }}
                    >
                        Talk to Our Team →
                    </Link>
                    <Link
                        href="/products"
                        className="text-sm text-white/70 hover:text-white transition-colors underline underline-offset-4"
                    >
                        Explore our capabilities
                    </Link>
                </div>
            </div>
        </section>
    );
}