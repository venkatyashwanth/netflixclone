"use client";
import { useAuth } from "@/contexts/Authcontext";
import "@/styles/globals.scss";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppContainer({ children }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isHome,setIsHome] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log(pathname);
        setIsHome(pathname?.startsWith("/en/home"));
    }, [pathname]);

    if (!mounted) {
        return (
            <div className="app app-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className={isHome ? "app app-auth" : "app app-guest"}>
            {children}
        </div>
    );
}