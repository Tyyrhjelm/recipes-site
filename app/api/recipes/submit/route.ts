import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import { RecipeFormData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const contributor = await requireAuth();
    
    // Parse form data
    const formData: RecipeFormData = await request.json();

    // Validate required fields
    if (!formData.title || !formData.athletes || formData.athletes.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!formData.consent_publish) {
      return NextResponse.json(
        { error: 'Must consent to publish' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Convert instructions array to proper format
    const instructions = formData.instructions?.map((text, index) => ({
      step: index + 1,
      text: text
    })) || [];

    // Insert recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        contributor_id: contributor.id,
        original_author: formData.original_author || null,
        contributor_relationship: formData.contributor_relationship || null,
        title: formData.title,
        ingredients: formData.ingredients || [],
        instructions: instructions,
        tips_substitutions: formData.tips_substitutions || null,
        what_you_love: formData.what_you_love || null,
        when_you_make_it: formData.when_you_make_it || null,
        story: formData.story || null,
        consent_publish: formData.consent_publish,
        consent_name_attribution: formData.consent_name_attribution || false,
        consent_story_inclusion: formData.consent_story_inclusion || false,
        consent_photo_inclusion: formData.consent_photo_inclusion || false,
        editorial_status: 'submitted',
      })
      .select()
      .single();

    if (recipeError || !recipe) {
      console.error('Recipe insert error:', recipeError);
      return NextResponse.json(
        { error: 'Failed to save recipe' },
        { status: 500 }
      );
    }

    // Insert athletes
    if (formData.athletes && formData.athletes.length > 0) {
      const athleteInserts = formData.athletes.map((athlete, index) => ({
        recipe_id: recipe.id,
        athlete_name: athlete.name,
        sports: athlete.sports,
        team_or_program: athlete.team_or_program || null,
        display_order: index,
      }));

      const { error: athleteError } = await supabase
        .from('recipe_athletes')
        .insert(athleteInserts);

      if (athleteError) {
        console.error('Athlete insert error:', athleteError);
        // Non-fatal - recipe is already saved
      }
    }

    // In production, image upload would happen here
    // For MVP, images are not persisted to database yet

    return NextResponse.json({
      success: true,
      recipe_id: recipe.id,
    });

  } catch (error) {
    console.error('Submit recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to submit recipe' },
      { status: 500 }
    );
  }
}
