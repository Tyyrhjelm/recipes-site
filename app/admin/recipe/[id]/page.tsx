import { requireAdmin } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { AdminRecipeDetail } from '@/components/admin/admin-recipe-detail';

interface AdminRecipePageProps {
  params: { id: string };
}

export default async function AdminRecipePage({ params }: AdminRecipePageProps) {
  await requireAdmin();

  const supabase = createServiceClient();

  // Fetch recipe with all related data
  const { data: recipe } = await supabase
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
        team_or_program,
        display_order
      )
    `)
    .eq('id', params.id)
    .single();

  if (!recipe) {
    redirect('/admin');
  }

  return <AdminRecipeDetail recipe={recipe} />;
}
