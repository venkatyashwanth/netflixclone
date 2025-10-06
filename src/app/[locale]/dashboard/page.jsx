"use client";
import { useAuth } from "@/contexts/Authcontext";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
// import { useLayoutEffect } from "react";

const Dashboard = () => {
    const { user, userData, logout } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const handleLogout = async () => {
        try {
            await logout();

            // Optional: Clear auth token cookie
            try {
                await fetch('/api/auth-token', { method: 'DELETE' });
            } catch (error) {
                // API route might not exist yet, that's ok
                console.log('Auth token cleanup optional');
            }

            router.push('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    // If no user, don't render anything (will redirect)
    if (!user) {
        return null;
    }
    return (
        <>
            <div style={{ padding: "100px 0", textAlign: "center" }}>
                <p>Welcome Boss, {userData?.displayName || user?.email}!!!.. ✌️</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </>
    )
}

export default Dashboard;