import Link from "next/link";
export default function CtaBanner() {
  return (
    <section className="py-14" style={{ background:"var(--navy)" }}>
      <div className="container-site flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="text-5xl">🎁</div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-white">Need Corporate Gifts?</h2>
            <p className="text-white/60 text-sm mt-1">Let's Build Something Memorable.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="https://wa.me/918109000100" target="_blank" rel="noopener noreferrer"
            className="btn-md text-white rounded-lg font-medium" style={{ background:"#25D366" }}>
            💬 WhatsApp
          </a>
          <Link href="/bulk-orders#inquiry-form" className="btn-gold">📋 Get Quote</Link>
          <Link href="/contact" className="btn-outline-white">📅 Book Meeting</Link>
        </div>
      </div>
    </section>
  );
}
