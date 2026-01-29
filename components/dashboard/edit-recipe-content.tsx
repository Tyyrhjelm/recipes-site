'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X, Save } from 'lucide-react';

interface Ingredient {
  amount: string;
  item: string;
}

interface Instruction {
  step: number;
  text: string;
}

interface EditRecipeContentProps {
  recipe: any; // Full recipe with relations
}

export function EditRecipeContent({ recipe }: EditRecipeContentProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Initialize form state
  const [title, setTitle] = useState(recipe.title);
  const [originalAuthor, setOriginalAuthor] = useState(recipe.original_author || '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe.ingredients || [{ amount: '', item: '' }]
  );
  const [instructions, setInstructions] = useState<string[]>(
    recipe.instructions?.map((inst: Instruction) => inst.text) || ['']
  );
  const [tips, setTips] = useState(recipe.tips_substitutions || '');
  const [whatYouLove, setWhatYouLove] = useState(recipe.what_you_love || '');
  const [whenYouMakeIt, setWhenYouMakeIt] = useState(recipe.when_you_make_it || '');
  const [story, setStory] = useState(recipe.story || '');

  // Ingredient management
  const addIngredient = () => {
    setIngredients([...ingredients, { amount: '', item: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: 'amount' | 'item', value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  // Instruction management
  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleSave = async () => {
    // Validate
    if (!title.trim()) {
      alert('Please enter a recipe title');
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.item.trim());
    if (validIngredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    const validInstructions = instructions.filter(inst => inst.trim());
    if (validInstructions.length === 0) {
      alert('Please add at least one instruction');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          original_author: originalAuthor.trim() || null,
          ingredients: validIngredients,
          instructions: validInstructions.map((text, index) => ({
            step: index + 1,
            text,
          })),
          tips_substitutions: tips.trim() || null,
          what_you_love: whatYouLove.trim() || null,
          when_you_make_it: whenYouMakeIt.trim() || null,
          story: story.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Redirect back to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save changes. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Recipe
          </h1>
          <p className="text-gray-600">
            Make changes to your recipe
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Recipe Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Original Author */}
          <div className="space-y-2">
            <Label htmlFor="original-author">Original Author (optional)</Label>
            <Input
              id="original-author"
              value={originalAuthor}
              onChange={(e) => setOriginalAuthor(e.target.value)}
            />
          </div>

          {/* What You Love */}
          <div className="space-y-2">
            <Label htmlFor="what-you-love">What You Love About This Recipe</Label>
            <Textarea
              id="what-you-love"
              value={whatYouLove}
              onChange={(e) => setWhatYouLove(e.target.value)}
              rows={3}
            />
          </div>

          {/* When You Make It */}
          <div className="space-y-2">
            <Label htmlFor="when-you-make-it">When You Make It</Label>
            <Textarea
              id="when-you-make-it"
              value={whenYouMakeIt}
              onChange={(e) => setWhenYouMakeIt(e.target.value)}
              rows={2}
            />
          </div>

          {/* Story */}
          <div className="space-y-2">
            <Label htmlFor="story">Story</Label>
            <Textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={5}
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <Label>Ingredients *</Label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    placeholder="2 cups"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    className="sm:col-span-1"
                  />
                  <Input
                    placeholder="flour"
                    value={ingredient.item}
                    onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                    required
                    className="sm:col-span-2"
                  />
                </div>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addIngredient}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <Label>Instructions *</Label>
            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-shrink-0 w-8 h-12 flex items-center justify-center font-medium text-gray-500">
                  {index + 1}.
                </div>
                <Textarea
                  placeholder="Step instruction..."
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  required
                  rows={2}
                  className="flex-1"
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addInstruction}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <Label htmlFor="tips">Tips & Substitutions</Label>
            <Textarea
              id="tips"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              rows={3}
            />
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
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
