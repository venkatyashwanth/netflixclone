// components/LogoutButton.jsx
"use client";
import { useAuth } from '@/components/contexts/Authcontext';
import { useRouter } from '@/i18n/navigation';

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}