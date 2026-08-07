export default function DeliveryMap() {
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="text-center mb-10">
          <span className="section-label">NATIONWIDE REACH</span>
          <h2 className="section-title">Pan-India Delivery Network</h2>
          <p className="section-subtitle mx-auto">Delivering to all 28 states and 8 union territories across India</p>
        </div>
        <div className="card-flat p-8 text-center">
          <div className="text-8xl mb-6">🗺</div>
          <p className="text-gray-500 mb-6">India delivery map — connect your mapping provider</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Maharashtra","Karnataka","Delhi","Tamil Nadu","Gujarat","Rajasthan","West Bengal","Uttar Pradesh","Telangana","Madhya Pradesh"].map(state => (
              <span key={state} className="badge-gray">{state}</span>
            ))}
            <span className="badge-navy">+ 18 more states</span>
          </div>
        </div>
      </div>
    </section>
  );
}
