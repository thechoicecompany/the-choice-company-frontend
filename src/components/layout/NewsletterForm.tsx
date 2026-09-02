"use client";

import { useState } from "react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setMessage(data.error ?? "Subscription failed");
                return;
            }

            setStatus("success");
            setEmail("");
        } catch {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    disabled={status === "loading"}
                    className="flex-1 px-3 py-2 text-xs text-gray-800 rounded-l-lg outline-none border-0"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-4 py-2 text-white text-sm rounded-r-lg font-medium flex-shrink-0 transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--gold)" }}
                    aria-label="Subscribe to newsletter"
                >
                    {status === "loading" ? "..." : "→"}
                </button>
            </form>
            {status === "success" && (
                <p className="text-xs text-green-400 mt-2">Subscribed! Thanks for joining.</p>
            )}
            {status === "error" && (
                <p className="text-xs text-red-400 mt-2">{message}</p>
            )}
        </div>
    );
}