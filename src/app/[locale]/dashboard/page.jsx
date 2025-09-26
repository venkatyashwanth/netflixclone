"use client";
import { useAuth } from "@/components/contexts/Authcontext";
import { useRouter } from "@/i18n/navigation";
import { useLayoutEffect } from "react";

const Dashboard = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // IMMEDIATE REDIRECT if not authenticated
    useLayoutEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    // DON'T RENDER if not authenticated
    if (!isAuthenticated) {
        return (
            <div style={{padding: "100px 0",textAlign: "center"}}>
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <>
            <div style={{padding: "100px 0",textAlign: "center"}}>
                <p>I am dashing...</p>
            </div>
        </>
    )
}

export default Dashboard;