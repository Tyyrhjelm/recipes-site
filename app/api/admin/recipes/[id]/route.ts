import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    
    const recipeId = params.id;
    const updates = await request.json();

    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Update recipe editorial fields
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        editorial_status: updates.editorial_status,
        editorial_notes: updates.editorial_notes,
        cookbook_assignments: updates.cookbook_assignments,
        updated_at: new Date().toISOString(),
      })
      .eq('id', recipeId);

    if (updateError) {
      console.error('Admin update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin recipe update error:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}
