// // PAGE HERO — SERVER COMPONENT
// // Reusable hero for all inner pages. Auto-injects BreadcrumbList JSON-LD.
// // Six variants, matching the design reference:
// //   premium  – dark, big photo on the right, vertical tagline      (About)
// //   minimal  – cream, line-art + script tagline                    (Products)
// //   overlay  – dark, photo with gradient overlay                   (Sample Shop)
// //   pattern  – deep green, subtle leaf pattern, vertical tagline   (Industries, Contact)
// //   center   – cream, centered                                     (Gallery)
// //   visual   – dark, photo + gold tagline                          (Blog / resources)

// import Image from "next/image";
// import Link from "next/link";
// import {
//     Building2,
//     Clock,
//     Crown,
//     FileText,
//     Gift,
//     Handshake,
//     Image as ImageIcon,
//     Lightbulb,
//     Package,
//     Settings,
//     ShieldCheck,
//     ShoppingCart,
//     Star,
//     Tag,
//     Truck,
//     Users,
//     type LucideIcon,
// } from "lucide-react";
// import SchemaMarkup from "@/components/ui/SchemaMarkup";
// import HeroMotion from "./HeroMotion";

// /* ------------------------------------------------------------------ */
// /* Types                                                               */
// /* ------------------------------------------------------------------ */

// export type HeroVariant =
//     | "premium"
//     | "minimal"
//     | "overlay"
//     | "pattern"
//     | "center"
//     | "visual";

// // Icons are referenced by name so this stays a server component
// // (no component functions have to cross the server/client boundary).
// const ICONS = {
//     crown: Crown,
//     gift: Gift,
//     handshake: Handshake,
//     package: Package,
//     tag: Tag,
//     truck: Truck,
//     shield: ShieldCheck,
//     cart: ShoppingCart,
//     star: Star,
//     building: Building2,
//     users: Users,
//     settings: Settings,
//     image: ImageIcon,
//     file: FileText,
//     lightbulb: Lightbulb,
//     clock: Clock,
// } satisfies Record<string, LucideIcon>;

// export type HeroIconName = keyof typeof ICONS;

// export interface Crumb {
//     label: string;
//     href?: string;
// }

// export interface HeroFeature {
//     icon: HeroIconName;
//     label: string; // first line,  e.g. "People"
//     sublabel?: string; // second line, e.g. "We Value"
// }

// export interface PageHeroProps {
//     variant?: HeroVariant;
//     title: string;
//     subtitle?: string;
//     breadcrumbs?: Crumb[];
//     features?: HeroFeature[];
//     /** One string per line, e.g. ["More", "than gifts", "a brighter", "tomorrow"] */
//     tagline?: string[];
//     /** Optional small gold line above the title (off by default to match the reference). */
//     eyebrow?: string;
//     /** Image variants only (premium / overlay / visual). Path under /public. */
//     image?: string;
//     imageAlt?: string;
//     /** CSS object-position for cropping, e.g. "center 40%". */
//     imagePosition?: string;
//     /** Override the variant's background (any CSS background value). */
//     bg?: string;
//     /** Text theme to pair with a custom bg: "light" bg = dark text, "dark" bg = white text. */
//     theme?: "light" | "dark";
// }

// /* ------------------------------------------------------------------ */
// /* Design tokens                                                       */
// /* ------------------------------------------------------------------ */

// const C = {
//     navy: "var(--navy, #071827)",
//     green: "#0D2A28",
//     gold: "var(--gold, #D4A63A)",
//     cream: "#FAF8F3",
// };

// const SCRIPT =
//     "var(--font-script, 'Dancing Script', 'Brush Script MT', cursive)";

// const DARK_BG = `linear-gradient(115deg, ${C.navy} 0%, #0A2226 60%, ${C.green} 100%)`;

// const VARIANTS: Record<
//     HeroVariant,
//     { theme: "dark" | "light"; bg: string; image: boolean; big: boolean; size: string }
// > = {
//     premium: { theme: "dark", bg: DARK_BG, image: true, big: true, size: "py-16 md:py-20 md:min-h-[420px]" },
//     overlay: { theme: "dark", bg: DARK_BG, image: true, big: false, size: "py-14 md:py-16 md:min-h-[340px]" },
//     visual: { theme: "dark", bg: DARK_BG, image: true, big: false, size: "py-14 md:py-16 md:min-h-[320px]" },
//     pattern: {
//         theme: "dark",
//         bg: `linear-gradient(120deg, #0A2321 0%, ${C.green} 100%)`,
//         image: false,
//         big: false,
//         size: "py-12 md:py-16 md:min-h-[300px]",
//     },
//     minimal: { theme: "light", bg: C.cream, image: false, big: false, size: "py-12 md:py-16 md:min-h-[300px]" },
//     center: { theme: "light", bg: C.cream, image: false, big: false, size: "py-12 md:py-16 md:min-h-[300px]" },
// };

// // Full literal class names so Tailwind can see them.
// const THEME = {
//     dark: {
//         crumb: "text-white/55",
//         crumbHover: "hover:text-[#D4A63A]",
//         current: "text-white/90",
//         title: "text-white",
//         sub: "text-white/80",
//         feat: "text-white/85",
//     },
//     light: {
//         crumb: "text-[#071827]/55",
//         crumbHover: "hover:text-[#B8892A]",
//         current: "text-[#071827]/90",
//         title: "text-[#071827]",
//         sub: "text-[#071827]/70",
//         feat: "text-[#071827]/80",
//     },
// } as const;

// /* ------------------------------------------------------------------ */
// /* Decorative pieces                                                   */
// /* ------------------------------------------------------------------ */

// /** Soft champagne circles used on the two light variants. */
// function SoftCircles() {
//     return (
//         <>
//             <div
//                 aria-hidden
//                 className="pointer-events-none absolute -right-28 -top-32 h-[26rem] w-[26rem] rounded-full"
//                 style={{ background: "rgba(212,166,58,0.07)", border: "1px solid rgba(212,166,58,0.14)" }}
//             />
//             <div
//                 aria-hidden
//                 className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full"
//                 style={{ background: "rgba(212,166,58,0.06)", border: "1px solid rgba(212,166,58,0.12)" }}
//             />
//         </>
//     );
// }

// /** Faint gift-box line art (minimal variant). */
// function GiftLineArt() {
//     return (
//         <svg
//             aria-hidden
//             viewBox="0 0 200 200"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinejoin="round"
//             strokeLinecap="round"
//             className="pointer-events-none absolute right-[9%] top-8 hidden h-60 w-60 text-[#D4A63A] opacity-25 lg:block"
//         >
//             <rect x="30" y="92" width="140" height="88" rx="4" />
//             <rect x="20" y="66" width="160" height="28" rx="4" />
//             <path d="M100 66v114" />
//             <path d="M100 66C100 40 62 22 56 44c-4 17 30 22 44 22Z" />
//             <path d="M100 66C100 40 138 22 144 44c4 17-30 22-44 22Z" />
//         </svg>
//     );
// }

// /** One botanical branch, built from a stem + alternating leaves. */
// function Branch({ className }: { className: string }) {
//     const leaves = Array.from({ length: 9 }, (_, i) => {
//         const t = (i + 1) / 9;
//         const side = i % 2 === 0 ? -1 : 1;
//         return {
//             x: 20 + 250 * t,
//             y: 290 - 270 * t,
//             angle: i === 8 ? -47 : -47 + side * 42,
//             scale: 1.15 - t * 0.55,
//         };
//     });

//     return (
//         <svg aria-hidden viewBox="0 0 300 300" className={className} fill="currentColor">
//             <line x1="20" y1="290" x2="270" y2="20" stroke="currentColor" strokeWidth="2" />
//             {leaves.map((l, i) => (
//                 <path
//                     key={i}
//                     d="M0 0C14-18 48-18 66 0C48 18 14 18 0 0Z"
//                     transform={`translate(${l.x} ${l.y}) rotate(${l.angle}) scale(${l.scale})`}
//                 />
//             ))}
//         </svg>
//     );
// }

// function LeafPattern() {
//     return (
//         <>
//             <Branch className="pointer-events-none absolute -right-6 -top-12 h-[24rem] w-[24rem] text-[#7fbf9c] opacity-[0.09]" />
//             <Branch className="pointer-events-none absolute -bottom-20 -left-10 h-[20rem] w-[20rem] rotate-180 text-[#7fbf9c] opacity-[0.07]" />
//             <Branch className="pointer-events-none absolute right-[30%] -top-24 hidden h-[16rem] w-[16rem] rotate-90 text-[#7fbf9c] opacity-[0.05] md:block" />
//         </>
//     );
// }

// /** Right-hand tagline: vertical gold rule + spaced caps (dark), or script (minimal). */
// function Tagline({ lines, variant }: { lines: string[]; variant: HeroVariant }) {
//     if (variant === "minimal") {
//         return (
//             <div data-hero-item className="hidden shrink-0 self-end pr-2 lg:block">
//                 <div className="-rotate-6" style={{ fontFamily: SCRIPT, color: C.gold }}>
//                     {lines.map((line) => (
//                         <span key={line} className="block whitespace-nowrap text-2xl leading-snug">
//                             {line}
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div
//             data-hero-item
//             className="hidden shrink-0 border-l pl-6 lg:block"
//             style={{ borderColor: "rgba(212,166,58,0.55)" }}
//         >
//             {lines.map((line) => (
//                 <span
//                     key={line}
//                     className="block text-[11px] font-medium uppercase leading-[1.9] tracking-[0.3em]"
//                     style={{ color: variant === "visual" ? C.gold : "rgba(255,255,255,0.75)" }}
//                 >
//                     {line}
//                 </span>
//             ))}
//         </div>
//     );
// }

// /* ------------------------------------------------------------------ */
// /* Component                                                           */
// /* ------------------------------------------------------------------ */

// export default function PageHero({
//     variant = "premium",
//     title,
//     subtitle,
//     breadcrumbs = [],
//     features = [],
//     tagline,
//     eyebrow,
//     image,
//     imageAlt = "",
//     imagePosition = "center",
//     bg,
//     theme,
// }: PageHeroProps) {
//     const base = VARIANTS[variant];
//     const cfg = { ...base, bg: bg ?? base.bg, theme: theme ?? base.theme };
//     const t = THEME[cfg.theme];
//     const centered = variant === "center";
//     const hasImage = cfg.image && Boolean(image);

//     const schema = {
//         "@context": "https://schema.org",
//         "@type": "BreadcrumbList",
//         itemListElement: breadcrumbs.map((c, i) => ({
//             "@type": "ListItem",
//             position: i + 1,
//             name: c.label,
//             ...(c.href ? { item: `https://thechoicecompany.in${c.href}` } : {}),
//         })),
//     };

//     return (
//         <section
//             data-hero
//             data-variant={variant}
//             className={`relative isolate flex items-center overflow-hidden ${cfg.size}`}
//             style={{ background: cfg.bg }}
//         >
//             {breadcrumbs.length > 0 && <SchemaMarkup schema={schema} />}

//             {/* ---------- background layers ---------- */}
//             {hasImage && image && (
//                 <>
//                     {/* Parallax wrapper is taller than the section so it never shows a gap.
//               The left-edge fade is a CSS mask (see globals.css) so the photo
//               melts into the dark background with no visible seam. */}
//                     <div
//                         data-hero-parallax
//                         aria-hidden={imageAlt ? undefined : true}
//                         className="absolute -top-[10%] right-0 h-[120%] w-full will-change-transform md:w-[62%]"
//                     >
//                         <div data-hero-image className="relative h-full w-full">
//                             <Image
//                                 src={image}
//                                 alt={imageAlt}
//                                 fill
//                                 priority
//                                 sizes="(min-width: 768px) 62vw, 100vw"
//                                 className="object-cover"
//                                 style={{ objectPosition: imagePosition }}
//                             />
//                             <div className="absolute inset-0" style={{ background: "rgba(7,24,39,0.25)" }} />
//                         </div>
//                     </div>
//                     {/* Mobile: photo sits behind an even navy wash so text stays readable */}
//                     <div
//                         aria-hidden
//                         className="absolute inset-0 md:hidden"
//                         style={{ background: "linear-gradient(180deg, rgba(7,24,39,0.84), rgba(7,24,39,0.74))" }}
//                     />
//                 </>
//             )}

//             {variant === "pattern" && <LeafPattern />}
//             {(variant === "minimal" || variant === "center") && <SoftCircles />}
//             {variant === "minimal" && <GiftLineArt />}

//             {/* ---------- content ---------- */}
//             <div className="container-site relative z-10 w-full">
//                 <div
//                     className={`flex w-full items-center gap-10 ${centered ? "justify-center text-center" : "justify-between"
//                         }`}
//                 >
//                     <div className={`min-w-0 ${centered ? "mx-auto flex max-w-3xl flex-col items-center" : "max-w-2xl"}`}>
//                         {breadcrumbs.length > 0 && (
//                             <nav
//                                 data-hero-item
//                                 aria-label="Breadcrumb"
//                                 className={`mb-3 flex flex-wrap items-center gap-1.5 text-xs ${t.crumb} ${centered ? "justify-center" : ""
//                                     }`}
//                             >
//                                 {breadcrumbs.map((c, i) => (
//                                     <span key={i} className="flex items-center gap-1.5">
//                                         {i > 0 && <span aria-hidden>/</span>}
//                                         {c.href ? (
//                                             <Link href={c.href} className={`${t.crumbHover} transition-colors`}>
//                                                 {c.label}
//                                             </Link>
//                                         ) : (
//                                             <span aria-current="page" className={t.current}>
//                                                 {c.label}
//                                             </span>
//                                         )}
//                                     </span>
//                                 ))}
//                             </nav>
//                         )}

//                         {/* short gold rule under the breadcrumb */}
//                         <span
//                             data-hero-item
//                             aria-hidden
//                             className="mb-5 block h-[2px] w-8"
//                             style={{ background: C.gold }}
//                         />

//                         {eyebrow && (
//                             <p
//                                 data-hero-item
//                                 className="mb-2 text-xs font-semibold uppercase tracking-[0.25em]"
//                                 style={{ color: C.gold }}
//                             >
//                                 {eyebrow}
//                             </p>
//                         )}

//                         <h1
//                             data-hero-item
//                             className={`font-playfair font-bold leading-[1.1] ${t.title} ${cfg.big
//                                 ? "text-4xl md:text-5xl lg:text-[3.5rem]"
//                                 : "text-3xl md:text-4xl lg:text-[2.6rem]"
//                                 }`}
//                         >
//                             {title}
//                         </h1>

//                         {subtitle && (
//                             <p
//                                 data-hero-item
//                                 className={`mt-4 max-w-xl text-[15px] leading-relaxed md:text-base ${t.sub}`}
//                             >
//                                 {subtitle}
//                             </p>
//                         )}

//                         {features.length > 0 && (
//                             <ul
//                                 data-hero-item
//                                 className={`mt-8 flex flex-wrap gap-x-10 gap-y-5 ${centered ? "justify-center" : ""}`}
//                             >
//                                 {features.map((f) => {
//                                     const Icon = ICONS[f.icon];
//                                     return (
//                                         <li key={f.label} className="flex items-center gap-3">
//                                             <Icon
//                                                 aria-hidden
//                                                 className="h-7 w-7 shrink-0"
//                                                 strokeWidth={1.25}
//                                                 style={{ color: C.gold }}
//                                             />
//                                             <span className={`text-[13px] leading-snug ${t.feat}`}>
//                                                 <span className="block">{f.label}</span>
//                                                 {f.sublabel && <span className="block">{f.sublabel}</span>}
//                                             </span>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         )}
//                     </div>

//                     {tagline && tagline.length > 0 && !centered && (
//                         <Tagline lines={tagline} variant={variant} />
//                     )}
//                 </div>
//             </div>

//             <HeroMotion />
//         </section>
//     );
// }




// PAGE HERO — SERVER COMPONENT
// Reusable hero for all inner pages. Auto-injects BreadcrumbList JSON-LD.
// Six variants, matching the design reference:
//   premium  – dark, big photo on the right, vertical tagline      (About)
//   minimal  – cream, line-art + script tagline                    (Products)
//   overlay  – dark, photo with gradient overlay                   (Sample Shop)
//   pattern  – deep green, subtle leaf pattern, vertical tagline   (Industries, Contact)
//   center   – cream, centered                                     (Gallery)
//   visual   – dark, photo + gold tagline                          (Blog / resources)

import Image from "next/image";
import Link from "next/link";
import {
    Building2,
    Clock,
    Crown,
    FileText,
    Gift,
    Handshake,
    Image as ImageIcon,
    Lightbulb,
    Package,
    Settings,
    ShieldCheck,
    ShoppingCart,
    Star,
    Tag,
    Truck,
    Users,
    type LucideIcon,
} from "lucide-react";
import SchemaMarkup from "@/components/ui/SchemaMarkup";
import HeroMotion from "./HeroMotion";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type HeroVariant =
    | "premium"
    | "minimal"
    | "overlay"
    | "pattern"
    | "center"
    | "visual";

// Icons are referenced by name so this stays a server component
// (no component functions have to cross the server/client boundary).
const ICONS = {
    crown: Crown,
    gift: Gift,
    handshake: Handshake,
    package: Package,
    tag: Tag,
    truck: Truck,
    shield: ShieldCheck,
    cart: ShoppingCart,
    star: Star,
    building: Building2,
    users: Users,
    settings: Settings,
    image: ImageIcon,
    file: FileText,
    lightbulb: Lightbulb,
    clock: Clock,
} satisfies Record<string, LucideIcon>;

export type HeroIconName = keyof typeof ICONS;

export interface Crumb {
    label: string;
    href?: string;
}

export interface HeroFeature {
    icon: HeroIconName;
    label: string; // first line,  e.g. "People"
    sublabel?: string; // second line, e.g. "We Value"
}

export interface PageHeroProps {
    variant?: HeroVariant;
    title: string;
    subtitle?: string;
    breadcrumbs?: Crumb[];
    features?: HeroFeature[];
    /** One string per line, e.g. ["More", "than gifts", "a brighter", "tomorrow"] */
    tagline?: string[];
    /** Optional small gold line above the title (off by default to match the reference). */
    eyebrow?: string;
    /** Image variants only (premium / overlay / visual). Path under /public. */
    image?: string;
    imageAlt?: string;
    /** CSS object-position for cropping, e.g. "center 40%". */
    imagePosition?: string;
    /** Override the variant's background (any CSS background value). */
    bg?: string;
    /** Text theme to pair with a custom bg: "light" bg = dark text, "dark" bg = white text. */
    theme?: "light" | "dark";
}

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

const C = {
    navy: "var(--navy, #071827)",
    green: "#0D2A28",
    gold: "var(--gold, #D4A63A)",
    cream: "#FAF8F3",
};

const SCRIPT =
    "var(--font-script, 'Dancing Script', 'Brush Script MT', cursive)";

const DARK_BG = `linear-gradient(115deg, ${C.navy} 0%, #0A2226 60%, ${C.green} 100%)`;

const VARIANTS: Record<
    HeroVariant,
    { theme: "dark" | "light"; bg: string; image: boolean; big: boolean; size: string }
> = {
    premium: { theme: "dark", bg: DARK_BG, image: true, big: true, size: "py-16 md:py-20 md:min-h-[420px]" },
    overlay: { theme: "dark", bg: DARK_BG, image: true, big: false, size: "py-14 md:py-16 md:min-h-[340px]" },
    visual: { theme: "dark", bg: DARK_BG, image: true, big: false, size: "py-14 md:py-16 md:min-h-[320px]" },
    pattern: {
        theme: "dark",
        bg: `linear-gradient(120deg, #0A2321 0%, ${C.green} 100%)`,
        image: false,
        big: false,
        size: "py-12 md:py-16 md:min-h-[300px]",
    },
    minimal: { theme: "light", bg: C.cream, image: false, big: false, size: "py-12 md:py-16 md:min-h-[300px]" },
    center: { theme: "light", bg: C.cream, image: false, big: false, size: "py-12 md:py-16 md:min-h-[300px]" },
};

// Full literal class names so Tailwind can see them.
const THEME = {
    dark: {
        crumb: "text-white/55",
        crumbHover: "hover:text-[#D4A63A]",
        current: "text-white/90",
        title: "text-white",
        sub: "text-white/80",
        feat: "text-white/85",
    },
    light: {
        crumb: "text-[#071827]/55",
        crumbHover: "hover:text-[#B8892A]",
        current: "text-[#071827]/90",
        title: "text-[#071827]",
        sub: "text-[#071827]/70",
        feat: "text-[#071827]/80",
    },
} as const;

/* ------------------------------------------------------------------ */
/* Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

/** Soft champagne circles used on the two light variants. */
function SoftCircles() {
    return (
        <>
            <div
                aria-hidden
                className="pointer-events-none absolute -right-28 -top-32 h-[26rem] w-[26rem] rounded-full"
                style={{ background: "rgba(212,166,58,0.07)", border: "1px solid rgba(212,166,58,0.14)" }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full"
                style={{ background: "rgba(212,166,58,0.06)", border: "1px solid rgba(212,166,58,0.12)" }}
            />
        </>
    );
}

/** Faint gift-box line art (minimal variant). */
function GiftLineArt() {
    return (
        <svg
            aria-hidden
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="pointer-events-none absolute right-[9%] top-8 hidden h-60 w-60 text-[#D4A63A] opacity-25 lg:block"
        >
            <rect x="30" y="92" width="140" height="88" rx="4" />
            <rect x="20" y="66" width="160" height="28" rx="4" />
            <path d="M100 66v114" />
            <path d="M100 66C100 40 62 22 56 44c-4 17 30 22 44 22Z" />
            <path d="M100 66C100 40 138 22 144 44c4 17-30 22-44 22Z" />
        </svg>
    );
}

/** One botanical branch, built from a stem + alternating leaves. */
function Branch({ className }: { className: string }) {
    const leaves = Array.from({ length: 9 }, (_, i) => {
        const t = (i + 1) / 9;
        const side = i % 2 === 0 ? -1 : 1;
        return {
            x: 20 + 250 * t,
            y: 290 - 270 * t,
            angle: i === 8 ? -47 : -47 + side * 42,
            scale: 1.15 - t * 0.55,
        };
    });

    return (
        <svg aria-hidden viewBox="0 0 300 300" className={className} fill="currentColor">
            <line x1="20" y1="290" x2="270" y2="20" stroke="currentColor" strokeWidth="2" />
            {leaves.map((l, i) => (
                <path
                    key={i}
                    d="M0 0C14-18 48-18 66 0C48 18 14 18 0 0Z"
                    transform={`translate(${l.x} ${l.y}) rotate(${l.angle}) scale(${l.scale})`}
                />
            ))}
        </svg>
    );
}

function LeafPattern() {
    return (
        <>
            <Branch className="pointer-events-none absolute -right-6 -top-12 h-[24rem] w-[24rem] text-[#7fbf9c] opacity-[0.09]" />
            <Branch className="pointer-events-none absolute -bottom-20 -left-10 h-[20rem] w-[20rem] rotate-180 text-[#7fbf9c] opacity-[0.07]" />
            <Branch className="pointer-events-none absolute right-[30%] -top-24 hidden h-[16rem] w-[16rem] rotate-90 text-[#7fbf9c] opacity-[0.05] md:block" />
        </>
    );
}

/** Right-hand tagline: vertical gold rule + spaced caps (dark), or script (minimal). */
function Tagline({ lines, variant }: { lines: string[]; variant: HeroVariant }) {
    if (variant === "minimal") {
        return (
            <div data-hero-item className="hidden shrink-0 self-end pr-2 lg:block">
                <div className="-rotate-6" style={{ fontFamily: SCRIPT, color: C.gold }}>
                    {lines.map((line) => (
                        <span key={line} className="block whitespace-nowrap text-2xl leading-snug">
                            {line}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            data-hero-item
            className="hidden shrink-0 border-l pl-6 lg:block"
            style={{ borderColor: "rgba(212,166,58,0.55)" }}
        >
            {lines.map((line) => (
                <span
                    key={line}
                    className="block text-[11px] font-medium uppercase leading-[1.9] tracking-[0.3em]"
                    style={{ color: variant === "visual" ? C.gold : "rgba(255,255,255,0.75)" }}
                >
                    {line}
                </span>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function PageHero({
    variant = "pattern",
    title,
    subtitle,
    breadcrumbs = [],
    features = [],
    tagline,
    eyebrow,
    image,
    imageAlt = "",
    imagePosition = "center",
    bg,
    theme,
}: PageHeroProps) {
    const base = VARIANTS[variant];
    const cfg = { ...base, bg: bg ?? base.bg, theme: theme ?? base.theme };
    const t = THEME[cfg.theme];
    const centered = variant === "center";
    const hasImage = cfg.image && Boolean(image);

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `https://thechoicecompany.in${c.href}` } : {}),
        })),
    };

    return (
        <section
            data-hero
            data-variant={variant}
            className={`relative isolate flex items-center overflow-hidden ${cfg.size}`}
            style={{ background: cfg.bg }}
        >
            {breadcrumbs.length > 0 && <SchemaMarkup schema={schema} />}

            {/* ---------- background layers ---------- */}
            {hasImage && image && (
                <>
                    {/* Parallax wrapper is taller than the section so it never shows a gap.
              The left-edge fade is a CSS mask (see globals.css) so the photo
              melts into the dark background with no visible seam. */}
                    <div
                        data-hero-parallax
                        aria-hidden={imageAlt ? undefined : true}
                        className="absolute -top-[10%] right-0 h-[120%] w-full will-change-transform md:w-[62%]"
                    >
                        <div data-hero-image className="relative h-full w-full">
                            <Image
                                src={image}
                                alt={imageAlt}
                                fill
                                priority
                                sizes="(min-width: 768px) 62vw, 100vw"
                                className="object-cover"
                                style={{ objectPosition: imagePosition }}
                            />
                            <div className="absolute inset-0" style={{ background: "rgba(7,24,39,0.25)" }} />
                        </div>
                    </div>
                    {/* Mobile: photo sits behind an even navy wash so text stays readable */}
                    <div
                        aria-hidden
                        className="absolute inset-0 md:hidden"
                        style={{ background: "linear-gradient(180deg, rgba(7,24,39,0.84), rgba(7,24,39,0.74))" }}
                    />
                </>
            )}

            {variant === "pattern" && <LeafPattern />}
            {(variant === "minimal" || variant === "center") && <SoftCircles />}
            {variant === "minimal" && <GiftLineArt />}

            {/* ---------- content ---------- */}
            <div className="container-site relative z-10 w-full">
                <div
                    className={`flex w-full items-center gap-10 ${centered ? "justify-center text-center" : "justify-between"
                        }`}
                >
                    <div className={`min-w-0 ${centered ? "mx-auto flex max-w-3xl flex-col items-center" : "max-w-2xl"}`}>
                        {breadcrumbs.length > 0 && (
                            <nav
                                data-hero-item
                                aria-label="Breadcrumb"
                                className={`mb-3 flex flex-wrap items-center gap-1.5 text-xs ${t.crumb} ${centered ? "justify-center" : ""
                                    }`}
                            >
                                {breadcrumbs.map((c, i) => (
                                    <span key={i} className="flex items-center gap-1.5">
                                        {i > 0 && <span aria-hidden>/</span>}
                                        {c.href ? (
                                            <Link href={c.href} className={`${t.crumbHover} transition-colors`}>
                                                {c.label}
                                            </Link>
                                        ) : (
                                            <span aria-current="page" className={t.current}>
                                                {c.label}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </nav>
                        )}

                        {/* short gold rule under the breadcrumb */}
                        <span
                            data-hero-item
                            aria-hidden
                            className="mb-5 block h-[2px] w-8"
                            style={{ background: C.gold }}
                        />

                        {eyebrow && (
                            <p
                                data-hero-item
                                className="mb-2 text-xs font-semibold uppercase tracking-[0.25em]"
                                style={{ color: C.gold }}
                            >
                                {eyebrow}
                            </p>
                        )}

                        <h1
                            data-hero-item
                            className={`font-playfair font-bold leading-[1.1] ${t.title} ${cfg.big
                                ? "text-4xl md:text-5xl lg:text-[3.5rem]"
                                : "text-3xl md:text-4xl lg:text-[2.6rem]"
                                }`}
                        >
                            {title}
                        </h1>

                        {subtitle && (
                            <p
                                data-hero-item
                                className={`mt-4 max-w-xl text-[15px] leading-relaxed md:text-base ${t.sub}`}
                            >
                                {subtitle}
                            </p>
                        )}

                        {features.length > 0 && (
                            <ul
                                data-hero-item
                                className={`mt-8 flex flex-wrap gap-x-10 gap-y-5 ${centered ? "justify-center" : ""}`}
                            >
                                {features.map((f) => {
                                    const Icon = ICONS[f.icon];
                                    return (
                                        <li key={f.label} className="flex items-center gap-3">
                                            <Icon
                                                aria-hidden
                                                className="h-7 w-7 shrink-0"
                                                strokeWidth={1.25}
                                                style={{ color: C.gold }}
                                            />
                                            <span className={`text-[13px] leading-snug ${t.feat}`}>
                                                <span className="block">{f.label}</span>
                                                {f.sublabel && <span className="block">{f.sublabel}</span>}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {tagline && tagline.length > 0 && !centered && (
                        <Tagline lines={tagline} variant={variant} />
                    )}
                </div>
            </div>

            <HeroMotion />
        </section>
    );
}