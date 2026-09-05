import Link from "next/link";

export default function ClosingStatement() {
    return (
        <section
            style={{ background: "var(--navy)" }}
            className="section-py relative overflow-hidden pb-20 md:pb-24"
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 0%, rgba(176,141,87,0.12), transparent 60%)",
                }}
            />

            <div className="container-site relative text-center max-w-3xl mx-auto">
                <span className="text-gold text-xs font-bold uppercase tracking-widest">
                    Our Approach
                </span>
                <span className="gold-rule my-6 block mx-auto" />

                <p className="font-playfair text-2xl md:text-3xl text-white leading-snug mb-10">
                    We're not just a gifting store — we deliver corporate gifting
                    solutions, from sourcing to customization, packaging and delivery,
                    at the scale your business requires.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/contact" className="btn-gold inline-block px-8 py-3.5">
                        Talk to Our Team
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