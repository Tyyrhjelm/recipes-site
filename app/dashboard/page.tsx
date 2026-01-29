import { requireAuth } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { RecipeWithRelations } from '@/lib/types';

export default async function DashboardPage() {
  const contributor = await requireAuth();
  const supabase = createServiceClient();

  // Fetch contributor's recipes with athletes
  const { data: recipes } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_athletes (
        athlete_name,
        sports,
        team_or_program
      )
    `)
    .eq('contributor_id', contributor.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardContent 
      contributorEmail={contributor.email}
      recipes={recipes as RecipeWithRelations[] || []}
    />
  );
}
