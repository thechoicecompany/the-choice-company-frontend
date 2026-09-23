// "use client";

// import { useState } from "react";

// export default function NewsletterForm() {
//     const [email, setEmail] = useState("");
//     const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
//     const [message, setMessage] = useState("");

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         setStatus("loading");
//         setMessage("");

//         try {
//             const res = await fetch("/api/newsletter", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 setStatus("error");
//                 setMessage(data.error ?? "Subscription failed");
//                 return;
//             }

//             setStatus("success");
//             setEmail("");
//         } catch {
//             setStatus("error");
//             setMessage("Something went wrong. Please try again.");
//         }
//     }

//     return (
//         <div>
//             <form onSubmit={handleSubmit} className="flex">
//                 <input
//                     type="email"
//                     name="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Your email address"
//                     required
//                     disabled={status === "loading"}
//                     className="flex-1 px-3 py-2 text-xs text-gray-800 rounded-l-lg outline-none border-0"
//                 />
//                 <button
//                     type="submit"
//                     disabled={status === "loading"}
//                     className="px-4 py-2 text-white text-sm rounded-r-lg font-medium flex-shrink-0 transition-opacity hover:opacity-90 disabled:opacity-50"
//                     style={{ background: "var(--gold)" }}
//                     aria-label="Subscribe to newsletter"
//                 >
//                     {status === "loading" ? "..." : "→"}
//                 </button>
//             </form>
//             {status === "success" && (
//                 <p className="text-xs text-green-400 mt-2">Subscribed! Thanks for joining.</p>
//             )}
//             {status === "error" && (
//                 <p className="text-xs text-red-400 mt-2">{message}</p>
//             )}
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Replace with your actual newsletter API call
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        className="flex items-center gap-2"
        style={{ color: "#22C76F", fontSize: 13 }}
      >
        <CheckCircle size={16} />
        <span>You're subscribed! Thank you.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: "relative" }}>
      <div className="flex" style={{ borderRadius: 8, overflow: "hidden" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          style={{
            flex: 1,
            height: 52,
            padding: "0 16px",
            background: "#FFFFFF",
            color: "#071827",
            fontSize: 13,
            border: "none",
            outline: "none",
            borderRadius: "8px 0 0 8px",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{
            width: 60,
            height: 52,
            background: "#D4A63A",
            border: "none",
            cursor: "pointer",
            borderRadius: "0 8px 8px 0",
          }}
        >
          {status === "loading" ? (
            <Loader size={18} color="#071827" className="animate-spin" />
          ) : (
            <ArrowRight size={18} color="#071827" />
          )}
        </button>
      </div>
    </form>
  );
}