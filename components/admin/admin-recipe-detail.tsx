'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

interface AdminRecipeDetailProps {
  recipe: any;
}

export function AdminRecipeDetail({ recipe }: AdminRecipeDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(recipe.editorial_status);
  const [notes, setNotes] = useState(recipe.editorial_notes || '');
  const [cookbooks, setCookbooks] = useState<string[]>(recipe.cookbook_assignments || []);
  const [newCookbook, setNewCookbook] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editorial_status: status,
          editorial_notes: notes,
          cookbook_assignments: cookbooks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Show success message
      alert('Changes saved successfully!');
      
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCookbook = () => {
    if (newCookbook.trim() && !cookbooks.includes(newCookbook.trim())) {
      setCookbooks([...cookbooks, newCookbook.trim()]);
      setNewCookbook('');
    }
  };

  const handleRemoveCookbook = (cookbook: string) => {
    setCookbooks(cookbooks.filter(c => c !== cookbook));
  };

  const athleteNames = recipe.recipe_athletes?.map((a: any) => a.athlete_name).join(', ') || 'No athletes';
  const allSports = recipe.recipe_athletes?.flatMap((a: any) => a.sports || []).join(', ') || 'No sports';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {recipe.title}
          </h1>
          <p className="text-gray-600">
            Submitted by {recipe.contributors?.email || 'Unknown'} on {new Date(recipe.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipe Details</h2>

              {/* Athletes */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Athletes</h3>
                <p className="text-gray-700">{athleteNames}</p>
                <p className="text-sm text-gray-600">Sports: {allSports}</p>
              </div>

              {/* Contributor */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Submitted By</h3>
                <p className="text-gray-700">{recipe.contributor_relationship || 'Not specified'}</p>
              </div>

              {/* What You Love / When You Make It */}
              {(recipe.what_you_love || recipe.when_you_make_it) && (
                <div className="mb-4 pb-4 border-b">
                  {recipe.what_you_love && (
                    <div className="mb-2">
                      <h3 className="font-medium text-gray-900">What they love:</h3>
                      <p className="text-gray-700">{recipe.what_you_love}</p>
                    </div>
                  )}
                  {recipe.when_you_make_it && (
                    <div>
                      <h3 className="font-medium text-gray-900">When they make it:</h3>
                      <p className="text-gray-700">{recipe.when_you_make_it}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Story */}
              {recipe.story && recipe.consent_story_inclusion && (
                <div className="mb-4 pb-4 border-b">
                  <h3 className="font-medium text-gray-900 mb-2">Story</h3>
                  <p className="text-gray-700 whitespace-pre-line">{recipe.story}</p>
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-medium text-gray-900 mb-2">Ingredients</h3>
                <ul className="space-y-1">
                  {recipe.ingredients?.map((ing: any, index: number) => (
                    <li key={index} className="text-gray-700">
                      {ing.amount && <span className="font-medium">{ing.amount}</span>} {ing.item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
                <ol className="space-y-2">
                  {recipe.instructions?.map((inst: any, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="font-medium text-gray-600">{inst.step}.</span>
                      <span className="text-gray-700 flex-1">{inst.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {recipe.tips_substitutions && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Tips & Substitutions</h3>
                  <p className="text-gray-700">{recipe.tips_substitutions}</p>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Permissions</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${recipe.consent_publish ? 'text-green-600' : 'text-gray-300'}`} />
                  <span>Publish recipe</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${recipe.consent_name_attribution ? 'text-green-600' : 'text-gray-300'}`} />
                  <span>Include name</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${recipe.consent_story_inclusion ? 'text-green-600' : 'text-gray-300'}`} />
                  <span>Include story</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${recipe.consent_photo_inclusion ? 'text-green-600' : 'text-gray-300'}`} />
                  <span>Include photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Editorial Controls */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Editorial Status</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="needs_followup">Needs Followup</option>
                    <option value="excerpt_only">Excerpt Only</option>
                    <option value="do_not_publish">Do Not Publish</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Editorial Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Internal notes about this recipe..."
                  />
                </div>
              </div>
            </div>

            {/* Cookbook Assignments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cookbook Assignments</h2>
              
              <div className="space-y-4">
                {cookbooks.length > 0 && (
                  <div className="space-y-2">
                    {cookbooks.map(cookbook => (
                      <div key={cookbook} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{cookbook}</span>
                        <button
                          onClick={() => handleRemoveCookbook(cookbook)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new-cookbook">Add to Cookbook</Label>
                  <div className="flex gap-2">
                    <input
                      id="new-cookbook"
                      type="text"
                      value={newCookbook}
                      onChange={(e) => setNewCookbook(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCookbook()}
                      placeholder="Cookbook name"
                      className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <Button size="sm" onClick={handleAddCookbook}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
