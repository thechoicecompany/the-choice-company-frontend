"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TopUtilityBar from "./TopUtilityBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import StickyMobileBar from "@/components/ui/StickyMobileBar";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    // Admin routes → no public navbar/footer, admin/layout.tsx handles its own shell
    if (isAdmin) return <>{children}</>;

    // Public site routes → full chrome
    return (
        <>
            <TopUtilityBar />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
            <StickyMobileBar />
            <ExitIntentPopup />
        </>
    );
}