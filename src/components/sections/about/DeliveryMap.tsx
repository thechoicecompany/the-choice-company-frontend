// // export default function DeliveryMap() {
// //   return (
// //     <section className="section-py bg-white">
// //       <div className="container-site">
// //         <div className="text-center mb-10">
// //           <span className="section-label">NATIONWIDE REACH</span>
// //           <h2 className="section-title">Pan-India Delivery Network</h2>
// //           <p className="section-subtitle mx-auto">Delivering to all 28 states and 8 union territories across India</p>
// //         </div>
// //         <div className="card-flat p-8 text-center">
// //           <div className="text-8xl mb-6">🗺</div>
// //           <p className="text-gray-500 mb-6">India delivery map — connect your mapping provider</p>
// //           <div className="flex flex-wrap justify-center gap-3">
// //             {["Maharashtra","Karnataka","Delhi","Tamil Nadu","Gujarat","Rajasthan","West Bengal","Uttar Pradesh","Telangana","Madhya Pradesh"].map(state => (
// //               <span key={state} className="badge-gray">{state}</span>
// //             ))}
// //             <span className="badge-navy">+ 18 more states</span>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// const STATES = [
//   "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
//   "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
//   "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
//   "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
// ];

// export default function DeliveryMap() {
//   return (
//     <section className="section-py bg-white">
//       <div className="container-site">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//           <div>
//             <span className="section-label">NATIONWIDE REACH</span>
//             <h2 className="section-title mb-4">Pan-India Delivery Network</h2>
//             <span className="gold-rule mb-5 block" />
//             <p className="text-gray-600 leading-relaxed mb-8">
//               Delivering to all 28 states and 8 union territories across
//               India, with fast and same-day dispatch supported wherever
//               feasible for time-sensitive requirements.
//             </p>
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <div className="font-playfair text-3xl font-bold text-gold">28+</div>
//                 <div className="text-xs text-gray-500 mt-1">States Served</div>
//               </div>
//               <div>
//                 <div className="font-playfair text-3xl font-bold text-gold">8</div>
//                 <div className="text-xs text-gray-500 mt-1">Union Territories</div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-2">
//             <div className="border border-gray-200 rounded-2xl p-8">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-5">
//                 Coverage Index
//               </div>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
//                 {STATES.map((state) => (
//                   <div
//                     key={state}
//                     className="text-sm text-gray-600 border-b border-gray-100 pb-2"
//                   >
//                     {state}
//                   </div>
//                 ))}
//               </div>
//               <div className="text-xs text-gray-400 mt-6">
//                 + all remaining states and union territories
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export default function DeliveryMap() {
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div>
            <span className="section-label">NATIONWIDE REACH</span>
            <h2 className="section-title mb-4">Pan-India Delivery Network</h2>
            <span className="gold-rule mb-5 block" />
            <p className="text-gray-600 leading-relaxed mb-8">
              Delivering to all 28 states and 8 union territories across
              India, with fast and same-day dispatch supported wherever
              feasible for time-sensitive requirements.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="font-playfair text-3xl font-bold text-gold">28+</div>
                <div className="text-xs text-gray-500 mt-1">States Served</div>
              </div>
              <div>
                <div className="font-playfair text-3xl font-bold text-gold">8</div>
                <div className="text-xs text-gray-500 mt-1">Union Territories</div>
              </div>
            </div>

            <div className="hidden lg:block mt-10 pt-8 border-t border-gray-200 text-sm text-gray-500 leading-relaxed">
              Same-day dispatch available on request for time-critical
              campaigns and events, subject to product and location.
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-5">
                Coverage Index
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
                {STATES.map((state) => (
                  <div
                    key={state}
                    className="text-sm text-gray-600 border-b border-gray-100 pb-2"
                  >
                    {state}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-6">
                + all remaining states and union territories
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}