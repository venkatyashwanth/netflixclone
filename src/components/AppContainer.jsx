"use client";
import "@/styles/globals.scss";
import { useAuth } from "@/components/contexts/Authcontext";
import { useEffect, useState } from "react";

export default function AppContainer({ children }) {
    const { isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>
            <div className="app app-loading">
                <div className="loader"></div>
            </div>
        </>
    }
    return (
        <div className={isAuthenticated ? "app app-auth" : "app app-guest"}>
            {children}
        </div>
    );
}