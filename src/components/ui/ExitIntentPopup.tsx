"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TEAL_DARK = "#0c2622";
const TEAL = "#173f3b";
const TEAL_LIGHT = "#1f5951";
const TEAL_TOP = "#2a6b62";
const GOLD_DARK = "#956c25";
const GOLD = "#c99a3d";
const GOLD_LIGHT = "#e8c874";

type GiftType = "mug" | "bottle" | "diary" | "bag" | "gift" | "hamper";

const RADIUS_DESKTOP = 195;
const RADIUS_MOBILE = 112;

const GIFT_DEFS: { id: number; label: string; type: GiftType; angle: number; delay: number; spin: number }[] = [
  { id: 1, label: "BOTTLE", type: "bottle", angle: 15, delay: 0, spin: 240 },
  { id: 2, label: "DIARY", type: "diary", angle: 46, delay: 0.06, spin: -260 },
  { id: 3, label: "GIFT", type: "gift", angle: 78, delay: 0.12, spin: 300 },
  { id: 4, label: "HAMPER", type: "hamper", angle: 102, delay: 0.18, spin: -300 },
  { id: 5, label: "MUG", type: "mug", angle: 134, delay: 0.24, spin: 260 },
  { id: 6, label: "BAG", type: "bag", angle: 165, delay: 0.3, spin: -240 },
];

function arcPosition(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: -Math.sin(rad) * radius };
}

const CONFETTI = Array.from({ length: 26 }).map((_, i) => {
  const angle = (i / 26) * 360 + (i % 2 === 0 ? 8 : -8);
  const dist = 90 + (i % 5) * 34;
  const rad = (angle * Math.PI) / 180;
  const palette = [GOLD, GOLD_LIGHT, TEAL_LIGHT, "#ffffff"];
  return {
    id: i,
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist * 0.75 - 20,
    color: palette[i % palette.length],
    rotate: (i % 2 === 0 ? 1 : -1) * (180 + i * 12),
    delay: (i % 6) * 0.02,
    size: i % 3 === 0 ? 7 : 4,
    round: i % 4 === 0,
  };
});

function GiftProduct({ type, label }: { type: GiftType; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#d6a743]/30 bg-white shadow-[0_8px_22px_rgba(0,0,0,.22)] md:h-14 md:w-14">
        {type === "gift" && (
          <div className="relative h-7 w-8 rounded-md" style={{ background: GOLD }}>
            <div className="absolute left-1/2 top-0 h-full w-[4px] -translate-x-1/2" style={{ background: TEAL }} />
            <div className="absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2" style={{ background: TEAL }} />
          </div>
        )}
        {type === "hamper" && (
          <div className="relative h-7 w-9 rounded-b-md border-2" style={{ borderColor: TEAL, background: "#ead7a7" }}>
            <div className="absolute -top-3 left-1/2 h-4 w-6 -translate-x-1/2 rounded-t-full border-2 border-b-0" style={{ borderColor: TEAL }} />
          </div>
        )}
        {type === "mug" && (
          <div className="relative h-7 w-8 rounded-b-md border-[2.5px]" style={{ borderColor: TEAL, background: "#f7f1df" }}>
            <div className="absolute -right-2 top-1/2 h-3.5 w-2.5 -translate-y-1/2 rounded-r-full border-[2.5px] border-l-0" style={{ borderColor: TEAL }} />
            <div className="absolute left-1/2 top-1/2 h-1 w-4 -translate-x-1/2" style={{ background: GOLD }} />
          </div>
        )}
        {type === "bottle" && (
          <div className="relative h-8 w-5 rounded-b-lg rounded-t-md" style={{ background: TEAL }}>
            <div className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-t-sm" style={{ background: GOLD }} />
            <div className="absolute left-1/2 top-3.5 h-1 w-3 -translate-x-1/2" style={{ background: GOLD_LIGHT }} />
          </div>
        )}
        {type === "diary" && (
          <div className="relative h-8 w-6 rounded-sm" style={{ background: TEAL }}>
            <span className="absolute inset-0 flex items-center justify-center text-[5px] font-bold tracking-widest" style={{ color: GOLD }}>TCC</span>
          </div>
        )}
        {type === "bag" && (
          <div className="relative mt-2 h-7 w-8 rounded-b-md" style={{ background: GOLD }}>
            <div className="absolute -top-3 left-1/2 h-4 w-5 -translate-x-1/2 rounded-t-full border-2 border-b-0" style={{ borderColor: GOLD }} />
            <span className="absolute inset-0 flex items-center justify-center text-[5px] font-bold text-white">TCC</span>
          </div>
        )}
      </div>
      <span className="mt-1 text-[6px] font-semibold tracking-[.16em] text-white/60 md:text-[7px]">{label}</span>
    </div>
  );
}

function BrandGiftBox({ stage }: { stage: "hidden" | "dropped" | "charging" | "blasted" }) {
  const opened = stage === "blasted";

  return (
    <div className="relative h-[170px] w-[190px] [perspective:900px] md:h-[196px] md:w-[218px]">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[46px] z-40 h-6 w-6 -translate-x-1/2 rounded-full bg-white"
        initial={{ opacity: 0, scale: 0 }}
        animate={opened ? { opacity: [0, 1, 0], scale: [0.2, 9, 13] } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[46px] z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
        style={{ borderColor: GOLD_LIGHT }}
        initial={{ opacity: 0, width: 0, height: 0 }}
        animate={opened ? { opacity: [0.9, 0], width: [0, 340], height: [0, 340] } : { opacity: 0, width: 0, height: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
        style={{ background: `${GOLD}33` }}
        animate={opened ? { opacity: [0, 0.9, 0.28], scale: [0.5, 1.35, 1] } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {CONFETTI.map((c) => (
        <motion.span
          key={c.id}
          className="pointer-events-none absolute left-1/2 top-[46px] z-40"
          style={{ width: c.size, height: c.size, background: c.color, borderRadius: c.round ? "50%" : "1px" }}
          initial={{ x: "-50%", y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
          animate={
            opened
              ? { x: `calc(-50% + ${c.x}px)`, y: c.y, opacity: [0, 1, 1, 0], rotate: c.rotate, scale: [0.4, 1, 1, 0.6] }
              : { x: "-50%", y: 0, opacity: 0, scale: 0.4 }
          }
          transition={{ duration: 1.1, delay: c.delay, ease: "easeOut" }}
        />
      ))}

      <motion.div
        className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2"
        initial={{ y: -260, opacity: 0, scale: 0.7 }}
        animate={
          stage === "hidden"
            ? { y: -260, opacity: 0, scale: 0.7 }
            : stage === "dropped"
              ? { y: [-260, 12, -6, 0], opacity: 1, scale: [0.7, 1.08, 0.97, 1] }
              : stage === "charging"
                ? { y: 0, opacity: 1, scale: [1, 1.015, 1, 1.02, 1], x: [0, -2, 2, -1.5, 1.5, 0] }
                : { y: 0, opacity: 1, scale: 1 }
        }
        transition={
          stage === "dropped"
            ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
            : stage === "charging"
              ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
        }
      >
        <svg width="130" height="100" viewBox="0 0 130 100" className="md:w-[156px] md:h-[120px]" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 18 L65 4 L122 18 L110 24 L20 24 Z" fill={TEAL_TOP} />
          <rect x="10" y="24" width="110" height="72" rx="6" fill={TEAL} />
          <rect x="10" y="24" width="110" height="72" rx="6" fill={`url(#frontShade)`} />
          <defs>
            <linearGradient id="frontShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL_LIGHT} stopOpacity="0.35" />
              <stop offset="100%" stopColor={TEAL_DARK} stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <rect x="57" y="10" width="16" height="86" fill={GOLD} />
          <rect x="10" y="52" width="110" height="16" fill={GOLD} />
          <rect x="10" y="90" width="110" height="6" rx="3" fill={GOLD_DARK} />
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-[16px] z-30 -translate-x-1/2 [transform-origin:bottom_center] [transform-style:preserve-3d] md:top-[19px]"
        animate={
          opened
            ? { rotateX: -110, rotateZ: -18, y: -120, x: -40, opacity: 0 }
            : { rotateX: 0, rotateZ: 0, y: 0, x: 0, opacity: 1 }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg width="132" height="26" viewBox="0 0 132 26" className="md:w-[158px] md:h-[31px]" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 20 L66 2 L128 20 L120 25 L12 25 Z" fill={TEAL_LIGHT} />
          <rect x="59" y="0" width="14" height="26" fill={GOLD} />
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-[26px] top-[-6px] z-40 md:left-[30px]"
        animate={
          opened
            ? { y: -70, x: 34, rotate: 30, scale: 0.55, opacity: 0 }
            : stage === "charging"
              ? { y: [0, -3, 0], x: 0, rotate: 0, scale: 1, opacity: 1 }
              : { y: 0, x: 0, rotate: 0, scale: 1, opacity: stage === "hidden" ? 0 : 1 }
        }
        transition={stage === "charging" ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5, ease: "easeOut" }}
      >
        <svg width="78" height="66" viewBox="0 0 78 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={GOLD_LIGHT} />
              <stop offset="100%" stopColor={GOLD_DARK} />
            </linearGradient>
          </defs>
          <path d="M34 38 C23 25, 10 25, 7 36 C10 45, 22 44, 34 38 Z" fill="url(#goldRibbon)" stroke={GOLD_DARK} strokeWidth="0.5" />
          <path d="M34 38 C45 25, 58 25, 61 36 C58 45, 47 44, 34 38 Z" fill="url(#goldRibbon)" stroke={GOLD_DARK} strokeWidth="0.5" />
          <circle cx="34" cy="38" r="5.5" fill={GOLD_DARK} />
          <circle cx="34" cy="38" r="2.8" fill={GOLD_LIGHT} />
          <path d="M34 34 C44 22, 50 13, 58 3" stroke="url(#goldRibbon)" strokeWidth="2" strokeLinecap="round" fill="none" />
          {[
            { cx: 40, cy: 28, r: 24 },
            { cx: 45, cy: 21, r: -18 },
            { cx: 50, cy: 13, r: 20 },
            { cx: 54, cy: 6, r: -16 },
          ].map((leaf, i) => (
            <ellipse key={i} cx={leaf.cx} cy={leaf.cy} rx="6.5" ry="2.9" fill="url(#goldRibbon)" transform={`rotate(${leaf.r} ${leaf.cx} ${leaf.cy})`} />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

type Stage = "hidden" | "dropped" | "charging" | "blasted";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<Stage>("hidden");
  const [giftsVisible, setGiftsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      setStage("hidden");
      setGiftsVisible(false);
      setContentVisible(false);
      setShake(false);
      return;
    }
    const dropTimer = window.setTimeout(() => setStage("dropped"), 250);
    const chargeTimer = window.setTimeout(() => setStage("charging"), 950);
    const blastTimer = window.setTimeout(() => {
      setStage("blasted");
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
    }, 1650);
    const giftsTimer = window.setTimeout(() => setGiftsVisible(true), 1720);
    const contentTimer = window.setTimeout(() => setContentVisible(true), 2500);
    return () => {
      window.clearTimeout(dropTimer);
      window.clearTimeout(chargeTimer);
      window.clearTimeout(blastTimer);
      window.clearTimeout(giftsTimer);
      window.clearTimeout(contentTimer);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const keyHandler = (e: KeyboardEvent) => e.key === "Escape" && setVisible(false);
    document.addEventListener("keydown", keyHandler);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", keyHandler);
      document.body.style.overflow = oldOverflow;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#061715]/60 p-3 backdrop-blur-[3px] md:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => setVisible(false)}
        >
          <motion.div
            className="relative flex max-h-[90vh] w-full max-w-[720px] flex-col items-center overflow-y-auto rounded-[24px] border border-white/10 px-4 pb-6 pt-5 shadow-[0_30px_90px_rgba(0,0,0,.4)] md:px-8 md:pb-8 md:pt-6"
            style={{ background: `${TEAL}f5` }}
            initial={{ scale: 0.96, y: 10, opacity: 0 }}
            animate={shake ? { scale: 1, y: 0, opacity: 1, x: [0, -6, 6, -4, 4, -2, 0] } : { scale: 1, y: 0, opacity: 1, x: 0 }}
            exit={{ scale: 0.97, y: 8, opacity: 0 }}
            transition={shake ? { duration: 0.4, ease: "easeOut" } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Free corporate gifting catalog"
          >
            <button
              type="button"
              aria-label="Close popup"
              onClick={() => setVisible(false)}
              className="absolute right-3 top-3 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg leading-none text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>

            <div className="pointer-events-none absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full blur-[90px]" style={{ background: `${GOLD}1a` }} />

            {/* Stage: flex-centers a RELATIVE (not absolute) anchor wrapper.
                An absolutely-positioned child with no inset ignores flex
                alignment entirely — that was the actual bug. */}
            <div className="relative mt-2 h-[270px] w-full flex items-center justify-center md:h-[300px]">
              <div className="relative z-10">
                {giftsVisible &&
                  GIFT_DEFS.map((gift) => {
                    const desktop = arcPosition(gift.angle, RADIUS_DESKTOP);
                    const mobile = arcPosition(gift.angle, RADIUS_MOBILE);
                    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
                    const target = isDesktop ? desktop : mobile;
                    return (
                      <motion.div
                        key={gift.id}
                        className="absolute left-0 top-0 z-20"
                        initial={{ x: 0, y: -30, opacity: 0, scale: 0.1, rotate: 0 }}
                        animate={{
                          x: target.x,
                          y: target.y,
                          opacity: 1,
                          scale: [0.1, 1.25, 1],
                          rotate: [0, gift.spin, 0],
                        }}
                        transition={{ delay: gift.delay, duration: 0.75, type: "spring", stiffness: 160, damping: 13 }}
                      >
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2.8 + gift.id * 0.12, repeat: Infinity, ease: "easeInOut", delay: gift.delay + 0.75 }}
                        >
                          <GiftProduct type={gift.type} label={gift.label} />
                        </motion.div>
                      </motion.div>
                    );
                  })}

                <div className="absolute left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
                  <BrandGiftBox stage={stage} />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {contentVisible && (
                <motion.div
                  className="relative z-50 w-full text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[9px] font-semibold uppercase tracking-[.38em]" style={{ color: GOLD }}>
                    THE CHOICE COMPANY
                  </div>
                  <h2 className="mt-1 font-playfair text-2xl font-bold text-white md:text-4xl">Make Every Gift Count.</h2>
                  <p className="mx-auto mt-2 max-w-md text-xs text-white/65 md:text-sm">
                    Explore 200+ corporate gifting ideas with pricing.
                  </p>

                  <div className="mt-4 flex flex-col items-center gap-2">
                    <button
                      type="button"
                      className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(201,154,61,.25)] transition hover:-translate-y-0.5"
                      style={{ background: GOLD }}
                      onClick={() => console.log("Get Free Catalog")}
                    >
                      Get Free Catalog <span className="ml-1">→</span>
                    </button>
                    <button type="button" onClick={() => setVisible(false)} className="pb-1 text-xs text-white/45 transition hover:text-white">
                      No thanks
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}