import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function useProtectedRoute(redirectTo: string = '/') {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading && !session) {
      // Wait 1 second before redirecting, in case session is restored
      timerRef.current = setTimeout(() => {
        setShouldRedirect(true);
      }, 1000);
    } else if (session) {
      // If session is restored, clear timer
      if (timerRef.current) clearTimeout(timerRef.current);
      setShouldRedirect(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [session, isLoading]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectTo);
    }
  }, [shouldRedirect, router, redirectTo]);

  return {
    session,
    isLoading: isLoading || (!session && !shouldRedirect),
    isAuthenticated: !!session,
  };
} 