"use client";
import "@/styles/globals.scss";
import { useAuth } from "@/components/contexts/Authcontext";
import Navigation from "@/components/navigation/Navigation";

export default function AppContainer({ children }) {
    const { isAuthenticated } = useAuth();
    return (
        <div className={isAuthenticated ? "app app-auth" : "app app-guest"}>
            <Navigation />
            <main className="pageContent">{children}</main>
        </div>
    );
}
