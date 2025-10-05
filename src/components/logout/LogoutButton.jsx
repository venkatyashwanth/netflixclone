// components/LogoutButton.jsx
"use client";
import { useAuth } from '@/contexts/Authcontext';
import { useRouter } from '@/i18n/navigation';

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

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

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}