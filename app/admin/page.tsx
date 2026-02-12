import { requireAdmin } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import { AdminDashboardContent } from '@/components/admin/admin-dashboard-content';

export default async function AdminDashboardPage() {
  // Require admin access
  await requireAdmin();

  const supabase = createServiceClient();

  // Fetch all recipes with related data
  const { data: recipes } = await supabase
    .from('recipes')
    .select(`
      *,
      contributors (
        email,
        display_name
      ),
      recipe_athletes (
        athlete_name,
        sports,
        team_or_program
      )
    `)
    .order('created_at', { ascending: false });

  return <AdminDashboardContent recipes={recipes || []} />;
}
