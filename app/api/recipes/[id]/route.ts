import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contributor = await requireAuth();
    const recipeId = params.id;

    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Verify the recipe belongs to this contributor
    const { data: recipe } = await supabase
      .from('recipes')
      .select('id, contributor_id')
      .eq('id', recipeId)
      .single();

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    if (recipe.contributor_id !== contributor.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this recipe' },
        { status: 403 }
      );
    }

    // Delete the recipe (cascade will delete athletes and images)
    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contributor = await requireAuth();
    const recipeId = params.id;
    const updates = await request.json();

    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Verify the recipe belongs to this contributor
    const { data: recipe } = await supabase
      .from('recipes')
      .select('id, contributor_id')
      .eq('id', recipeId)
      .single();

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    if (recipe.contributor_id !== contributor.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this recipe' },
        { status: 403 }
      );
    }

    // Update the recipe
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        title: updates.title,
        original_author: updates.original_author,
        ingredients: updates.ingredients,
        instructions: updates.instructions,
        tips_substitutions: updates.tips_substitutions,
        what_you_love: updates.what_you_love,
        when_you_make_it: updates.when_you_make_it,
        story: updates.story,
        updated_at: new Date().toISOString(),
      })
      .eq('id', recipeId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}
