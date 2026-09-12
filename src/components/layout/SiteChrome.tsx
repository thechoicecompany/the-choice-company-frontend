"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Footer from "./Footer";
import TopUtilityBar from "./TopUtilityBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import StickyMobileBar from "@/components/ui/StickyMobileBar";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
import AnimationProvider from "@/components/ui/AnimationProvider";
import PageTransition from "@/components/ui/PageTransition";

// Animated navbar — loaded client-side, replaces the static Navbar
const NavbarAnimated = dynamic(() => import("./Navbar"), { ssr: false });

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) return <>{children}</>;

    return (
        <AnimationProvider>
            <PageTransition />
            <TopUtilityBar />
            <NavbarAnimated />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
            <StickyMobileBar />
            <ExitIntentPopup />
        </AnimationProvider>
    );
}