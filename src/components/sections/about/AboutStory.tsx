// "use client";

// import { useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// export default function AboutStory({
//     imageSrc = "/Office Reception.png",
// }: {
//     imageSrc?: string;
// }) {
//     const sectionRef = useRef<HTMLElement>(null);
//     const textRef = useRef<HTMLDivElement>(null);
//     const imageRef = useRef<HTMLDivElement>(null);

//     useGSAP(
//         () => {
//             const mm = gsap.matchMedia();

//             mm.add("(prefers-reduced-motion: no-preference)", () => {
//                 if (textRef.current) {
//                     gsap.fromTo(
//                         textRef.current.children,
//                         { opacity: 0, y: 16 },
//                         {
//                             opacity: 1,
//                             y: 0,
//                             duration: 0.6,
//                             stagger: 0.08,
//                             ease: "power2.out",
//                             scrollTrigger: { trigger: textRef.current, start: "top 82%", once: true },
//                         }
//                     );
//                 }

//                 if (imageRef.current) {
//                     gsap.fromTo(
//                         imageRef.current,
//                         { opacity: 0, y: 20 },
//                         {
//                             opacity: 1,
//                             y: 0,
//                             duration: 0.7,
//                             ease: "power2.out",
//                             scrollTrigger: { trigger: imageRef.current, start: "top 82%", once: true },
//                         }
//                     );
//                 }
//             });

//             return () => mm.revert();
//         },
//         { scope: sectionRef }
//     );

//     return (
//         <section ref={sectionRef} className="bg-white" style={{ padding: "100px 0" }}>
//             <div className="container-site">
//                 <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-center">
//                     <div ref={textRef}>
//                         <span
//                             className="block text-xs font-semibold uppercase"
//                             style={{ color: "var(--gold, #D4A63A)", letterSpacing: "3px" }}
//                         >
//                             Our Story
//                         </span>
//                         <h2
//                             className="font-playfair font-bold mt-2 mb-4"
//                             style={{ color: "var(--text-primary, #102235)", fontSize: "36px", lineHeight: 1.1 }}
//                         >
//                             Corporate Gifting, Built for Scale
//                         </h2>
//                         <span
//                             className="block mb-6"
//                             style={{ width: 42, height: 2, background: "var(--gold, #D4A63A)" }}
//                         />

//                         <p
//                             className="text-base leading-relaxed mb-5"
//                             style={{ color: "var(--text-secondary, #647386)" }}
//                         >
//                             The Choice Company is a corporate gifting and merchandise partner
//                             helping businesses create meaningful experiences for their
//                             employees, customers, dealers, partners and stakeholders.
//                         </p>
//                         <p
//                             className="text-base leading-relaxed mb-10"
//                             style={{ color: "var(--text-secondary, #647386)" }}
//                         >
//                             We serve organizations across Mobility, Telecommunications, FMCG,
//                             Pharmaceuticals, Manufacturing, Industrial Operations and Events,
//                             combining the right products, professional customization and
//                             dependable execution into a single corporate gifting process.
//                         </p>

//                         <Link
//                             href="/about/journey"
//                             className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02]"
//                             style={{ background: "var(--gold, #D4A63A)", color: "var(--navy, #071827)" }}
//                         >
//                             Our Journey →
//                         </Link>
//                     </div>

//                     <div ref={imageRef} className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
//                         <Image
//                             src={imageSrc}
//                             alt="The Choice Company office reception"
//                             fill
//                             className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }


"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutStory({
    imageSrc = "/Office Reception.png",
}: {
    imageSrc?: string;
}) {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                if (textRef.current) {
                    gsap.fromTo(
                        textRef.current.children,
                        { opacity: 0, y: 16 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.08,
                            ease: "power2.out",
                            scrollTrigger: { trigger: textRef.current, start: "top 82%", once: true },
                        }
                    );
                }

                if (imageRef.current) {
                    gsap.fromTo(
                        imageRef.current,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: "power2.out",
                            scrollTrigger: { trigger: imageRef.current, start: "top 82%", once: true },
                        }
                    );
                }
            });

            return () => mm.revert();
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="bg-white" style={{ padding: "100px 0" }}>
            <div className="container-site">
                <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-16 items-center">
                    {/* IMAGE ON LEFT */}
                    <div ref={imageRef} className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                        <Image
                            src={imageSrc}
                            alt="The Choice Company office reception"
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                    </div>

                    {/* TEXT ON RIGHT */}
                    <div ref={textRef}>
                        <span
                            className="block text-xs font-semibold uppercase"
                            style={{ color: "var(--gold, #D4A63A)", letterSpacing: "3px" }}
                        >
                            Our Story
                        </span>
                        <h2
                            className="font-playfair font-bold mt-2 mb-4"
                            style={{ color: "var(--text-primary, #102235)", fontSize: "36px", lineHeight: 1.1 }}
                        >
                            Corporate Gifting, Built for Scale
                        </h2>
                        <span
                            className="block mb-6"
                            style={{ width: 42, height: 2, background: "var(--gold, #D4A63A)" }}
                        />

                        <p
                            className="text-base leading-relaxed mb-5"
                            style={{ color: "var(--text-secondary, #647386)" }}
                        >
                            The Choice Company is a corporate gifting and merchandise partner
                            helping businesses create meaningful experiences for their
                            employees, customers, dealers, partners and stakeholders.
                        </p>
                        <p
                            className="text-base leading-relaxed mb-10"
                            style={{ color: "var(--text-secondary, #647386)" }}
                        >
                            We serve organizations across Mobility, Telecommunications, FMCG,
                            Pharmaceuticals, Manufacturing, Industrial Operations and Events,
                            combining the right products, professional customization and
                            dependable execution into a single corporate gifting process.
                        </p>

                        <Link
                            href="/products"
                            className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02]"
                            style={{ background: "var(--gold, #D4A63A)", color: "var(--navy, #071827)" }}
                        >
                            Our Products →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}