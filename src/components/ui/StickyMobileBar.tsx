"use client";
export default function StickyMobileBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] md:hidden bg-white border-t border-gray-200 grid grid-cols-3">
      <a href="/bulk-orders#inquiry-form" className="flex flex-col items-center py-3 text-[11px] font-medium gap-1 text-navy">
        <span className="text-xl">📋</span>Inquiry
      </a>
      <a href="tel:+918109000100" className="flex flex-col items-center py-3 text-[11px] font-medium gap-1 border-x border-gray-100 text-navy">
        <span className="text-xl">📞</span>Call
      </a>
      <a href="https://wa.me/918109000100" target="_blank" rel="noopener noreferrer"
        className="flex flex-col items-center py-3 text-[11px] font-medium gap-1" style={{ color: "#25D366" }}>
        <span className="text-xl">💬</span>WhatsApp
      </a>
    </div>
  );
}
