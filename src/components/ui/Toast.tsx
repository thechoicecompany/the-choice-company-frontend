"use client";
import { useEffect } from "react";
interface Props { message: string; type: "success"|"error"|"info"; onClose: () => void; duration?: number; }
const S = { success:{bg:"#16A34A",icon:"✅"}, error:{bg:"#DC2626",icon:"❌"}, info:{bg:"#1D4ED8",icon:"ℹ"} };
export default function Toast({ message, type, onClose, duration = 4000 }: Props) {
  useEffect(() => { const t = setTimeout(onClose, duration); return () => clearTimeout(t); }, [onClose, duration]);
  const { bg, icon } = S[type];
  return (
    <div className="fixed top-6 right-6 z-[600] flex items-center gap-3 text-white text-sm px-5 py-3.5 rounded-xl shadow-lg anim-slide-right max-w-sm"
      style={{ background: bg }}>
      <span>{icon}</span><span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg">×</button>
    </div>
  );
}
