'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RecipeWithRelations } from '@/lib/types';
import { Plus, Clock, CheckCircle, Edit, Trash2 } from 'lucide-react';

interface DashboardContentProps {
  contributorEmail: string;
  recipes: RecipeWithRelations[];
}

export function DashboardContent({ contributorEmail, recipes }: DashboardContentProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  // Separate drafts and submitted
  const drafts = recipes.filter(r => !r.consent_publish);
  const submitted = recipes.filter(r => r.consent_publish);

  const handleDelete = async (recipeId: string, recipeTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${recipeTitle}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(recipeId);

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      // Reload page to refresh list
      window.location.reload();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete recipe. Please try again.');
      setDeleting(null);
    }
  };

  const getStatusBadge = (recipe: RecipeWithRelations) => {
    const statusColors = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      needs_followup: 'bg-orange-100 text-orange-800',
      excerpt_only: 'bg-purple-100 text-purple-800',
      do_not_publish: 'bg-red-100 text-red-800',
    };

    const color = statusColors[recipe.editorial_status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {recipe.editorial_status === 'submitted' && <Clock className="w-3 h-3" />}
        {recipe.editorial_status === 'approved' && <CheckCircle className="w-3 h-3" />}
        {recipe.editorial_status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Recipes
          </h1>
          <p className="text-gray-600">
            Signed in as: {contributorEmail}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/submit/step-1">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Share Another Recipe
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Return Home
            </Button>
          </Link>

          <form action="/api/auth/logout" method="POST" className="sm:ml-auto">
            <Button type="submit" variant="ghost" size="lg" className="w-full sm:w-auto">
              Log Out
            </Button>
          </form>
        </div>

        {/* No recipes state */}
        {recipes.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes yet
            </h2>
            <p className="text-gray-600 mb-6">
              Share your first recipe with our community!
            </p>
            <Link href="/submit/step-1">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        )}

        {/* Drafts Section */}
        {drafts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Drafts ({drafts.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These recipes haven't been submitted yet. You can continue editing or submit them.
            </p>
            <div className="space-y-4">
              {drafts.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isDraft={true}
                  onDelete={handleDelete}
                  deleting={deleting === recipe.id}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          </div>
        )}

        {/* Submitted Recipes Section */}
        {submitted.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Submitted Recipes ({submitted.length})
            </h2>
            <div className="space-y-4">
              {submitted.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isDraft={false}
                  onDelete={handleDelete}
                  deleting={deleting === recipe.id}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeCard({
  recipe,
  isDraft,
  onDelete,
  deleting,
  getStatusBadge,
}: {
  recipe: RecipeWithRelations;
  isDraft: boolean;
  onDelete: (id: string, title: string) => void;
  deleting: boolean;
  getStatusBadge: (recipe: RecipeWithRelations) => JSX.Element;
}) {
  const athleteNames = recipe.recipe_athletes?.map(a => a.athlete_name).join(', ') || 'No athletes';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {recipe.title}
            </h3>
            {!isDraft && getStatusBadge(recipe)}
          </div>

          <p className="text-gray-600 mb-2">
            Athletes: {athleteNames}
          </p>

          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span>{recipe.ingredients?.length || 0} ingredients</span>
            <span>•</span>
            <span>{recipe.instructions?.length || 0} steps</span>
            {recipe.story && (
              <>
                <span>•</span>
                <span>Has story</span>
              </>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {isDraft ? 'Draft saved' : 'Submitted'}: {new Date(recipe.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/dashboard/edit/${recipe.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(recipe.id, recipe.title)}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
