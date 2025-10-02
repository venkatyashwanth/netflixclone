"use client";
import "@/styles/globals.scss";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppContainer({ children }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isDashboard, setIsDashboard] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log(pathname);
        setIsDashboard(pathname?.startsWith("/en/dashboard"))
    }, [pathname]);

    if (!mounted) {
        return (
            <div className="app app-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className={isDashboard ? "app app-auth" : "app app-guest"}>
            {children}
        </div>
    );
}
