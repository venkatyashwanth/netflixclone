"use client";
import "@/styles/globals.scss";
import { useAuth } from "@/components/contexts/Authcontext";

export default function AppContainer({ children }) {
    const { isAuthenticated } = useAuth();
    return (
        <div className={isAuthenticated ? "app app-auth" : "app app-guest"}>
            {children}
        </div>
    );
}
