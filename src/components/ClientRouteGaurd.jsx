// components/ClientRouteGuard.jsx
"use client";
import { useAuth } from '@/components/contexts/Authcontext';
import { useRouter } from '@/i18n/navigation';
import { useLayoutEffect } from 'react';

export function AuthGuard({ children, redirectTo = '/dashboard' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading || isAuthenticated) {
    return <div>Redirecting...</div>; // Or a loading spinner
  }

  return children;
}

export function GuestGuard({ children, redirectTo = '/login' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading || !isAuthenticated) {
    return <div>Redirecting...</div>; // Or a loading spinner
  }

  return children;
}