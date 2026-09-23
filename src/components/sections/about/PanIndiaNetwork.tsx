"use client";

import React, { useEffect, useRef, useState } from "react";
import { Truck, Clock3, PackageCheck, MapPin, Building2, Network, Map } from "lucide-react";
// npm install @svg-maps/india
import indiaMap from "@svg-maps/india";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const NAVY = "#0D2233";
const DARK_NAVY = "#081A29";
const GOLD = "#C99632";
const GOLD_EYEBROW = "#B17A18";
const TEXT = "#172B3A";
const MUTED = "#687786";
const BORDER = "#DDD9D0";
const BG = "#FAF8F3";
const WHITE = "#FFFFFF";
const MAP_FILL = "#F2EBD9";
const MAP_FILL_MP = "#EDE3CE"; // Madhya Pradesh — slightly distinct (our hub state)

// ─── Data ──────────────────────────────────────────────────────────────────────
const deliveryStats = [
    { value: "28+", label: "States Covered" },
    { value: "8", label: "Union Territories" },
    { value: "5000+", label: "Cities & Towns" },
];

const deliveryCapabilities = [
    { title: "Reliable Logistics", description: "Trusted courier and logistics partners", icon: Truck },
    { title: "Same-Day Dispatch", description: "Quick turnaround for urgent orders", icon: Clock3 },
    { title: "Safe & Secure", description: "Careful packaging for safe delivery", icon: PackageCheck },
    { title: "Real-Time Tracking", description: "Stay updated at every step", icon: MapPin },
];

const networkCities = ["Indore",
    "Delhi", "Mumbai", "Bengaluru", "Hyderabad",
    "Chennai", "Kolkata", "Ahmedabad", "Pune", "Bhopal", "Gaudgaon"
];

// ─── City nodes ────────────────────────────────────────────────────────────────
// Positions derived from geographic lat/lon projected onto the
// @svg-maps/india viewBox (0 0 612 696).
// Mapping: lon 68–98°E → x 40–570  |  lat 8–37°N → y 100–660 (y inverted)
//
// These markers represent approximate geographic positions for
// visual representation of nationwide reach only.
// They do NOT indicate warehouses or office locations.
const HUB = { cx: 178, cy: 376, city: "Indore, M.P." };

const cityNodes = [
    { name: "Delhi", cx: 203, cy: 178 },
    { name: "Ahmedabad", cx: 121, cy: 354 },
    { name: "Mumbai", cx: 127, cy: 430 },
    { name: "Kolkata", cx: 400, cy: 360 },
    { name: "Guwahati", cx: 459, cy: 298 },
    { name: "Hyderabad", cx: 226, cy: 462 },
    { name: "Chennai", cx: 257, cy: 546 },
    { name: "Bengaluru", cx: 210, cy: 549 },
];

// States to highlight slightly (optional — hub's home state)
const HUB_STATE_ID = "mp"; // Madhya Pradesh

// ─── India Network Map ─────────────────────────────────────────────────────────
function IndiaNetworkMap({ animate }: { animate: boolean }) {
    const prefersReduced =
        typeof window !== "undefined"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false;
    const doAnimate = animate && !prefersReduced;

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <svg
                viewBox={indiaMap.viewBox}        // "0 0 612 696" — from the npm package
                aria-hidden="true"
                role="img"
                style={{ width: "100%", maxWidth: 480, display: "block", margin: "0 auto" }}
            >
                <defs>
                    <filter id="hubGlow" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="markerShadow" x="-100%" y="-100%" width="300%" height="300%">
                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={GOLD} floodOpacity="0.4" />
                    </filter>
                </defs>

                {/* ── State paths from @svg-maps/india ── */}
                <g
                    style={{
                        opacity: doAnimate ? 0 : 1,
                        animation: doAnimate ? "india-fade 1s ease 0.1s forwards" : "none",
                    }}
                >
                    {indiaMap.locations.map((location) => (
                        <path
                            key={location.id}
                            d={location.path}
                            fill={location.id === HUB_STATE_ID ? MAP_FILL_MP : MAP_FILL}
                            stroke={GOLD}
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    ))}
                </g>

                {/* ── Network lines: Indore hub → destination cities ── */}
                {cityNodes.map((city, i) => (
                    <line
                        key={`ln-${city.name}`}
                        x1={HUB.cx} y1={HUB.cy}
                        x2={city.cx} y2={city.cy}
                        stroke={GOLD}
                        strokeWidth="0.9"
                        strokeDasharray="4 5"
                        style={{
                            opacity: doAnimate ? 0 : 0.5,
                            animation: doAnimate
                                ? `line-appear 0.5s ease ${0.55 + i * 0.07}s forwards`
                                : "none",
                        }}
                    />
                ))}

                {/* ── Destination city markers ── */}
                {cityNodes.map((city, i) => (
                    <g
                        key={`nd-${city.name}`}
                        style={{
                            opacity: doAnimate ? 0 : 1,
                            animation: doAnimate
                                ? `marker-in 0.38s ease ${0.78 + i * 0.08}s forwards`
                                : "none",
                        }}
                    >
                        {/* Outer halo */}
                        <circle cx={city.cx} cy={city.cy} r={11} fill={GOLD} opacity="0.14" />
                        {/* Pin */}
                        <circle
                            cx={city.cx} cy={city.cy} r={5.5}
                            fill={GOLD} opacity="0.9"
                            filter="url(#markerShadow)"
                        />
                        <circle cx={city.cx} cy={city.cy} r={2} fill={WHITE} />
                        {/* Label — shift east-side cities to avoid legend overlap */}
                        <text
                            x={city.cx + (city.cx > 340 ? 10 : 0)}
                            y={city.cy - 13}
                            textAnchor={city.cx > 340 ? "start" : "middle"}
                            fontSize="10"
                            fontWeight="500"
                            fill={NAVY}
                            fontFamily="inherit"
                            opacity="0.85"
                        >
                            {city.name}
                        </text>
                    </g>
                ))}

                {/* ── Indore Hub — The Choice Company HQ ── */}
                <g
                    style={{
                        opacity: doAnimate ? 0 : 1,
                        animation: doAnimate
                            ? "hub-pop 0.65s cubic-bezier(.22,1,.36,1) 0.38s forwards"
                            : "none",
                    }}
                >
                    {/* Outer pulse ring */}
                    <circle cx={HUB.cx} cy={HUB.cy} r={34} fill="none" stroke={NAVY} strokeWidth="0.7" opacity="0.18" />
                    {/* Hub circle */}
                    <circle cx={HUB.cx} cy={HUB.cy} r={20} fill={NAVY} filter="url(#hubGlow)" />
                    {/* Gold centre */}
                    <circle cx={HUB.cx} cy={HUB.cy} r={7.5} fill={GOLD} />
                    <circle cx={HUB.cx} cy={HUB.cy} r={3} fill={WHITE} />

                    {/* Callout pill */}
                    <rect
                        x={HUB.cx - 62} y={HUB.cy + 28}
                        width={124} height={30}
                        rx={8} fill={NAVY}
                    />
                    {/* Small stem */}
                    <polygon
                        points={`${HUB.cx - 5},${HUB.cy + 28} ${HUB.cx + 5},${HUB.cy + 28} ${HUB.cx},${HUB.cy + 22}`}
                        fill={NAVY}
                    />
                    <text
                        x={HUB.cx} y={HUB.cy + 40}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        fill={WHITE}
                        fontFamily="inherit"
                        letterSpacing="0.09em"
                    >
                        THE CHOICE COMPANY
                    </text>
                    <text
                        x={HUB.cx} y={HUB.cy + 52}
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="500"
                        fill={GOLD}
                        fontFamily="inherit"
                        letterSpacing="0.04em"
                    >
                        {HUB.city} — Our Hub
                    </text>
                </g>
            </svg>

            <style>{`
        @keyframes india-fade  { to { opacity: 1; } }
        @keyframes line-appear { to { opacity: 0.5; } }
        @keyframes marker-in   { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hub-pop     { from { opacity: 0; transform: scale(0.72); } to { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>
        </div>
    );
}

// ─── Network Legend ────────────────────────────────────────────────────────────
function NetworkLegend() {
    const items = [
        { icon: Building2, label: "1 Central Hub — Indore" },
        { icon: Network, label: "6 Regional Zones" },
        { icon: MapPin, label: "28+ States" },
        { icon: Map, label: "8 Union Territories" },
        { icon: MapPin, label: "5000+ Cities" },
    ];
    return (
        <div
            role="complementary"
            aria-label="Delivery network summary"
            style={{
                background: "rgba(255,255,255,0.97)",
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                boxShadow: "0 4px 20px rgba(13,34,51,0.08)",
                padding: "16px 18px",
                minWidth: 192,
            }}
        >
            {items.map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                    <Icon size={13} color={GOLD} strokeWidth={1.5} aria-hidden="true" />
                    <span style={{ fontSize: 12.5, color: TEXT, lineHeight: 1, fontFamily: "inherit" }}>
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Eyebrow ───────────────────────────────────────────────────────────────────
function Eyebrow() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 1.5, backgroundColor: GOLD_EYEBROW, flexShrink: 0 }} aria-hidden="true" />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", color: GOLD_EYEBROW, textTransform: "uppercase" as const }}>
                Nationwide Reach
            </span>
        </div>
    );
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
function DeliveryStats() {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" as const, marginBottom: 32 }}>
            {deliveryStats.map((stat, i) => (
                <React.Fragment key={stat.label}>
                    <div style={{ padding: i === 0 ? "0 24px 0 0" : "0 24px" }}>
                        <div style={{
                            fontSize: "clamp(26px, 2.8vw, 38px)", fontWeight: 700, color: NAVY,
                            fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.1,
                        }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>
                            {stat.label}
                        </div>
                    </div>
                    {i < deliveryStats.length - 1 && (
                        <div aria-hidden="true" style={{ width: 1, height: 44, backgroundColor: BORDER, alignSelf: "center", flexShrink: 0 }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

// ─── Capabilities ──────────────────────────────────────────────────────────────
function DeliveryCapabilities() {
    return (
        <div className="cap-grid" style={{ display: "grid", gap: 16 }}>
            {deliveryCapabilities.map(({ title, description, icon: Icon }) => (
                <div key={title}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        border: `1px solid ${BORDER}`, backgroundColor: WHITE,
                        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
                    }} aria-hidden="true">
                        <Icon size={17} color={GOLD} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{description}</div>
                </div>
            ))}
        </div>
    );
}


// ─── City Strip ────────────────────────────────────────────────────────────────
function CityNetworkStrip() {
    const LandmarkIcon = () => (
        <svg viewBox="0 0 32 26" width="26" height="20" aria-hidden="true"
            fill="none" stroke={MUTED} strokeWidth="1.15"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ display: "block", margin: "0 auto 7px" }}
        >
            <polygon points="16,2 27,13 5,13" />
            <rect x="11" y="13" width="10" height="9" />
            <rect x="14" y="16" width="4" height="6" />
            <line x1="1" y1="22" x2="31" y2="22" />
        </svg>
    );

    return (
        <div style={{
            marginTop: 44, borderTop: `1.5px solid ${GOLD}`,
            backgroundColor: WHITE, overflowX: "auto" as const,
            msOverflowStyle: "none" as any, scrollbarWidth: "none" as any,
        }}>
            <style>{`.city-strip::-webkit-scrollbar { display: none; }`}</style>
            <div className="city-strip" role="list" aria-label="Key delivery cities"
                style={{ display: "flex", alignItems: "stretch", minWidth: "max-content", padding: "18px 0" }}
            >
                {networkCities.map((city, i) => (
                    <React.Fragment key={city}>
                        <div role="listitem" style={{
                            display: "flex", flexDirection: "column" as const,
                            alignItems: "center", padding: "0 28px", textAlign: "center" as const,
                        }}>
                            <LandmarkIcon />
                            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: MUTED, textTransform: "uppercase" as const }}>
                                {city}
                            </span>
                        </div>
                        {i < networkCities.length - 1 && (
                            <div aria-hidden="true" style={{ width: 1, backgroundColor: BORDER, alignSelf: "stretch", flexShrink: 0 }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function PanIndiaNetwork() {
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold: 0.08 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <style>{`
        .pan-india * { box-sizing: border-box; }

        .pan-india-cols {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }
        .pan-india-left  { flex: 0 0 44%; max-width: 44%; }
        .pan-india-right {
          flex: 0 0 56%; max-width: 56%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Legend: floated to right inside the map column */
        .legend-wrap {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }

        .cap-grid { grid-template-columns: repeat(4, 1fr); }

        @media (max-width: 1100px) {
          .pan-india-left  { flex: 0 0 48%; max-width: 48%; }
          .pan-india-right { flex: 0 0 52%; max-width: 52%; }
          .legend-wrap { position: static; transform: none; margin-top: 14px; align-self: flex-end; }
        }

        @media (max-width: 767px) {
          .pan-india-cols   { flex-direction: column; gap: 28px; }
          .pan-india-left,
          .pan-india-right  { flex: none; max-width: 100%; width: 100%; }
          .cap-grid         { grid-template-columns: repeat(2, 1fr); }
          .legend-wrap      { position: static; transform: none; margin-top: 14px; width: 100%; }
          .cta-banner                  { flex-direction: column; }
          .cta-banner > *              { flex: none !important; width: 100% !important; border-right: none !important; border-bottom: 1px solid ${BORDER}; }
          .cta-banner > *:last-child   { border-bottom: none !important; }
        }
      `}</style>

            <section
                ref={sectionRef}
                className="pan-india"
                aria-labelledby="delivery-network-title"
                style={{ backgroundColor: BG, width: "100%", overflow: "hidden" }}
            >
                <div style={{
                    maxWidth: 1280, margin: "0 auto",
                    padding: "clamp(64px, 8vw, 110px) clamp(20px, 3vw, 32px)",
                }}>

                    {/* ── Two-column block ── */}
                    <div className="pan-india-cols">

                        {/* LEFT */}
                        <div className="pan-india-left">
                            <Eyebrow />
                            <h2
                                id="delivery-network-title"
                                style={{
                                    fontSize: "clamp(36px, 4.5vw, 60px)",
                                    fontWeight: 700, color: NAVY,
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    lineHeight: 1.0, margin: "0 0 18px",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Pan-India<br />
                                <span style={{ color: GOLD }}>Delivery Network</span>
                            </h2>
                            <p style={{
                                fontSize: "clamp(13.5px, 1.15vw, 15.5px)",
                                color: MUTED, lineHeight: 1.68, maxWidth: 460, margin: "0 0 30px",
                            }}>
                                From our central hub in Indore to six regional zones, we deliver
                                corporate gifting solutions across 28 states and 8 union territories
                                with speed, reliability and care — wherever your business is.
                            </p>
                            <DeliveryStats />
                            <DeliveryCapabilities />
                        </div>

                        {/* RIGHT — map + legend */}
                        <div className="pan-india-right">
                            <IndiaNetworkMap animate={inView} />
                            <div className="legend-wrap">
                                <NetworkLegend />
                            </div>
                        </div>

                    </div>


                    <CityNetworkStrip />

                </div>
            </section>
        </>
    );
}