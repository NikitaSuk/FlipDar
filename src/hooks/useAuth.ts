import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';

export function useAuth() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for session to be determined (either null or actual session)
    if (session !== undefined) {
      setIsLoading(false);
    }
  }, [session]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user: session?.user || null,
    session,
    signOut,
    isAuthenticated: !!session,
    isLoading,
  };
} 