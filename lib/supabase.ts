import { createClient } from '@supabase/supabase-js';

// Browser client (uses anon key, respects RLS)
export const createBrowserClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Server client (uses service role, bypasses RLS)
export const createServiceClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// Helper to get current user from browser
export const getCurrentUser = async () => {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper to check if user is admin
export const isAdmin = async (email: string): Promise<boolean> => {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .single();
  
  return !!data;
};
