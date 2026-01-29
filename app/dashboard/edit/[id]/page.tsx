import { requireAuth } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { EditRecipeContent } from '@/components/dashboard/edit-recipe-content';

interface EditRecipePageProps {
  params: { id: string };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const contributor = await requireAuth();
  const supabase = createServiceClient();

  // Fetch the recipe with athletes
  const { data: recipe } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_athletes (
        athlete_name,
        sports,
        team_or_program,
        display_order
      )
    `)
    .eq('id', params.id)
    .single();

  // Check if recipe exists and belongs to this contributor
  if (!recipe || recipe.contributor_id !== contributor.id) {
    redirect('/dashboard');
  }

  return <EditRecipeContent recipe={recipe} />;
}
