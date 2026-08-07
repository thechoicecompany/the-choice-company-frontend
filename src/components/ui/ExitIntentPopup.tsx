"use client";
import { useEffect, useState } from "react";
export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("exit_popup_shown")) return;
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) { setVisible(true); sessionStorage.setItem("exit_popup_shown", "1"); document.removeEventListener("mouseleave", handler); }
    };
    const t = setTimeout(() => document.addEventListener("mouseleave", handler), 5000);
    return () => { clearTimeout(t); document.removeEventListener("mouseleave", handler); };
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/50" onClick={() => setVisible(false)}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl anim-fade-up" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4">🎁</div>
        <h3 className="font-playfair text-2xl font-bold text-navy mb-2">Get Our Free Catalog</h3>
        <p className="text-gray-500 text-sm mb-6">200+ corporate gifting ideas with pricing</p>
        <div className="flex gap-3">
          <input type="email" placeholder="Your email address" className="flex-1 text-sm" />
          <button className="btn-gold flex-shrink-0">Get It →</button>
        </div>
        <button onClick={() => setVisible(false)} className="mt-4 text-xs text-gray-400">No thanks</button>
      </div>
    </div>
  );
}
