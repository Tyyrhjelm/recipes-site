'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, Download, Eye } from 'lucide-react';

interface AdminDashboardContentProps {
  recipes: any[];
}

export function AdminDashboardContent({ recipes }: AdminDashboardContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hasStoryFilter, setHasStoryFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');

  // Get unique sports for filter
  const allSports = useMemo(() => {
    const sports = new Set<string>();
    recipes.forEach(recipe => {
      recipe.recipe_athletes?.forEach((athlete: any) => {
        athlete.sports?.forEach((sport: string) => sports.add(sport));
      });
    });
    return Array.from(sports).sort();
  }, [recipes]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesTitle = recipe.title?.toLowerCase().includes(search);
        const matchesAthlete = recipe.recipe_athletes?.some((a: any) => 
          a.athlete_name?.toLowerCase().includes(search)
        );
        const matchesContributor = recipe.contributors?.email?.toLowerCase().includes(search);
        
        if (!matchesTitle && !matchesAthlete && !matchesContributor) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && recipe.editorial_status !== statusFilter) {
        return false;
      }

      // Has story filter
      if (hasStoryFilter === 'yes' && !recipe.story) return false;
      if (hasStoryFilter === 'no' && recipe.story) return false;

      // Sport filter
      if (sportFilter !== 'all') {
        const hasSport = recipe.recipe_athletes?.some((a: any) => 
          a.sports?.includes(sportFilter)
        );
        if (!hasSport) return false;
      }

      return true;
    });
  }, [recipes, searchTerm, statusFilter, hasStoryFilter, sportFilter]);

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Title', 'Athletes', 'Status', 'Contributor', 'Has Story', 'Submitted Date'];
    const rows = filteredRecipes.map(recipe => [
      recipe.title,
      recipe.recipe_athletes?.map((a: any) => a.athlete_name).join('; ') || '',
      recipe.editorial_status,
      recipe.contributors?.email || '',
      recipe.story ? 'Yes' : 'No',
      new Date(recipe.created_at).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipes-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredRecipes.length} of {recipes.length} recipes
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              
              <Link href="/">
                <Button variant="ghost">
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Title, athlete, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="needs_followup">Needs Followup</option>
                <option value="excerpt_only">Excerpt Only</option>
                <option value="do_not_publish">Do Not Publish</option>
              </select>
            </div>

            {/* Has Story */}
            <div className="space-y-2">
              <Label htmlFor="story">Has Story</Label>
              <select
                id="story"
                value={hasStoryFilter}
                onChange={(e) => setHasStoryFilter(e.target.value)}
                className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
              >
                <option value="all">All Recipes</option>
                <option value="yes">With Story</option>
                <option value="no">Without Story</option>
              </select>
            </div>

            {/* Sport */}
            <div className="space-y-2">
              <Label htmlFor="sport">Sport</Label>
              <select
                id="sport"
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
              >
                <option value="all">All Sports</option>
                {allSports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear filters */}
          {(searchTerm || statusFilter !== 'all' || hasStoryFilter !== 'all' || sportFilter !== 'all') && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setHasStoryFilter('all');
                  setSportFilter('all');
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Recipe List */}
        <div className="space-y-4">
          {filteredRecipes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">No recipes match your filters</p>
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <AdminRecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AdminRecipeCard({ recipe }: { recipe: any }) {
  const athleteNames = recipe.recipe_athletes?.map((a: any) => a.athlete_name).join(', ') || 'No athletes';
  const allSports = recipe.recipe_athletes?.flatMap((a: any) => a.sports || []).join(', ') || 'No sports';

  const statusColors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    needs_followup: 'bg-orange-100 text-orange-800',
    excerpt_only: 'bg-purple-100 text-purple-800',
    do_not_publish: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {recipe.title}
            </h3>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[recipe.editorial_status] || 'bg-gray-100 text-gray-800'}`}>
              {recipe.editorial_status.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Athletes:</strong> {athleteNames}</p>
            <p><strong>Sports:</strong> {allSports}</p>
            <p><strong>Contributor:</strong> {recipe.contributors?.email || 'Unknown'}</p>
            <p>
              <strong>Content:</strong> {recipe.ingredients?.length || 0} ingredients, {recipe.instructions?.length || 0} steps
              {recipe.story && ' • Has story'}
              {recipe.consent_photo_inclusion && ' • Has photos'}
            </p>
            <p className="text-xs text-gray-400">
              Submitted: {new Date(recipe.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link href={`/admin/recipe/${recipe.id}`}>
            <Button size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
