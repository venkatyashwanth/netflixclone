// components/RouteGuard.jsx
"use client";
import { useAuth } from '@/components/contexts/Authcontext';
import { useRouter } from '@/i18n/navigation';
import { useLayoutEffect } from 'react';

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useLayoutEffect(() => {
      if (!isLoading && isAuthenticated) {
        router.replace('/dashboard');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || isAuthenticated) {
      return <div>Redirecting...</div>;
    }

    return <Component {...props} />;
  };
}

export function withGuest(Component) {
  return function GuestComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useLayoutEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
      return <div>Redirecting...</div>;
    }

    return <Component {...props} />;
  };
}