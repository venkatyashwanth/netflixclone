"use client";
import "@/styles/globals.scss";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Define all your protected routes here
const PROTECTED_ROUTES = [
  '/home',
  '/dashboard',
  '/profile',
  '/settings'
  // Add more protected routes as needed
];

// Helper function to check if current path is protected
const isProtectedRoute = (pathname) => {
  return PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route) || 
    pathname.startsWith(`/en${route}`) || 
    pathname.startsWith(`/hi${route}`) ||
    pathname.startsWith(`/te${route}`) 
    // Add other locales if needed
  );
};


export default function AppContainer({ children }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isProtected, setIsProtected] = useState(false);

    useEffect(() => {
        setMounted(true);
        const protectedCheck = isProtectedRoute(pathname);
        setIsProtected(protectedCheck);
    }, [pathname]);

    if (!mounted) {
        return (
            <div className="app app-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className={isProtected ? "app app-auth" : "app app-guest"}>
            {children}
        </div>
    );
}