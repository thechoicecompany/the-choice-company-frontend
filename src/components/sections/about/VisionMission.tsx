// export default function VisionMission() {
//   return (
//     <section className="section-py" style={{ background: "var(--cream)" }}>
//       <div className="container-site">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="card p-8">
//             <div className="text-4xl mb-4">🔭</div>
//             <h3 className="font-playfair text-2xl font-bold text-navy mb-3">Our Vision</h3>
//             <p className="text-gray-600 leading-relaxed">To be India's most trusted and innovative corporate gifting partner — making every business relationship stronger through the art of meaningful gifting.</p>
//           </div>
//           <div className="card p-8">
//             <div className="text-4xl mb-4">🎯</div>
//             <h3 className="font-playfair text-2xl font-bold text-navy mb-3">Our Mission</h3>
//             <p className="text-gray-600 leading-relaxed">To deliver premium, custom-branded corporate gifts at scale — combining quality craftsmanship, creative design, and seamless logistics to exceed every client's expectations.</p>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
//           {[["🏆","Quality First"],["🤝","Client-Centric"],["♻️","Sustainable"],["🚀","Innovation"]].map(([icon,label]) => (
//             <div key={label as string} className="card-flat p-5 text-center">
//               <div className="text-3xl mb-2">{icon}</div>
//               <div className="text-sm font-bold text-navy">{label as string}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

const COMMITMENTS = [
  { label: "Quality", copy: "Products selected with purpose and care." },
  { label: "Scale", copy: "Capabilities for requirements running into thousands." },
  { label: "Availability", copy: "A broad range for everyday and large-scale needs." },
  { label: "Customization", copy: "Branding and presentation tailored to your requirement." },
  { label: "Speed", copy: "Responsive execution for time-sensitive requirements." },
  { label: "Partnership", copy: "A dependable approach built for long-term relationships." },
];

export default function VisionMission() {
  return (
    // <section className="section-py bg-white">
    <section className="section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site">
        {/* Vision / Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-20">
          <div>
            <span className="section-label">OUR VISION</span>
            <h3 className="font-playfair text-2xl font-bold text-navy mt-2 mb-4 leading-snug">
              India's most trusted corporate gifting partner.
            </h3>
            <span className="gold-rule mb-4 block" />
            <p className="text-gray-600 leading-relaxed">
              To make every business relationship stronger through gifting
              that is considered, well-executed and consistent — at whatever
              scale a client needs.
            </p>
          </div>
          <div>
            <span className="section-label">OUR MISSION</span>
            <h3 className="font-playfair text-2xl font-bold text-navy mt-2 mb-4 leading-snug">
              One partner, from sourcing to delivery.
            </h3>
            <span className="gold-rule mb-4 block" />
            <p className="text-gray-600 leading-relaxed">
              To deliver corporate gifting at scale — combining sourcing,
              customization, branding and logistics into a single,
              dependable process for every client.
            </p>
          </div>
        </div>

        {/* Commitment list */}
        <div className="pt-14 border-t border-gray-200">
          <div className="mb-10">
            <span className="section-label">OUR COMMITMENT</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            {COMMITMENTS.map(({ label, copy }) => (
              <div key={label} className="border-l-2 border-gold/30 pl-5">
                <h4 className="font-bold text-navy text-sm mb-1">{label}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
