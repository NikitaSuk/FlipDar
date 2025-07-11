import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export function useAuth() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user: session?.user || null,
    signOut,
    isAuthenticated: !!session,
  };
} 