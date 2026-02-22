"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PremiumLoader from "./PremiumLoader";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Check if the current path starts with /admin
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return (
            <>
                <PremiumLoader />
                {children}
            </>
        );
    }

    return (
        <>
            <PremiumLoader />
            <Navbar />
            <main className="pt-20 min-h-screen">{children}</main>
            {pathname !== "/dashboard" && <Footer />}
        </>
    );
}
