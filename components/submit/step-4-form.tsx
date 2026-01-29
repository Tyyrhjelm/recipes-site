'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeForm } from './recipe-form-context';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface IngredientRow {
  amount: string;
  item: string;
}

export function Step4Form() {
  const router = useRouter();
  const { formData, updateFormData, setCurrentStep } = useRecipeForm();

  // Initialize with existing data or defaults
  const [title, setTitle] = useState(formData.title || '');
  const [originalAuthor, setOriginalAuthor] = useState(formData.original_author || '');
  
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    formData.ingredients && formData.ingredients.length > 0
      ? formData.ingredients
      : [{ amount: '', item: '' }]
  );

  const [instructions, setInstructions] = useState<string[]>(
    formData.instructions && formData.instructions.length > 0
      ? formData.instructions
      : ['']
  );

  const [tips, setTips] = useState(formData.tips_substitutions || '');

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

  const handleNext = () => {
    // Validate required fields
    if (!title.trim()) {
      alert('Please give your recipe a name.');
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.item.trim());
    if (validIngredients.length === 0) {
      alert('Please add at least one ingredient.');
      return;
    }

    const validInstructions = instructions.filter(inst => inst.trim());
    if (validInstructions.length === 0) {
      alert('Please add at least one instruction step.');
      return;
    }

    // Save to form context
    updateFormData({
      title: title.trim(),
      original_author: originalAuthor.trim() || undefined,
      ingredients: validIngredients.map(ing => ({
        amount: ing.amount.trim(),
        item: ing.item.trim()
      })),
      instructions: validInstructions,
      tips_substitutions: tips.trim() || undefined,
    });

    setCurrentStep(5);
    router.push('/submit/step-5');
  };

  const handleBack = () => {
    // Save current data
    updateFormData({
      title: title.trim() || undefined,
      original_author: originalAuthor.trim() || undefined,
      ingredients: ingredients.filter(ing => ing.item.trim()),
      instructions: instructions.filter(inst => inst.trim()),
      tips_substitutions: tips.trim() || undefined,
    });

    setCurrentStep(3);
    router.push('/submit/step-3');
  };

  return (
    <FormLayout
      currentStep={4}
      title="Now for the recipe"
      description="The ingredients, the steps, the little details that make it yours"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-8">
        {/* Recipe Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            What do you call this recipe? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Grandma's Sunday Pancakes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Original Author (optional) */}
        <div className="space-y-2">
          <Label htmlFor="original-author">
            Who created this recipe? (optional)
          </Label>
          <Input
            id="original-author"
            placeholder="My grandmother, a family friend, I did..."
            value={originalAuthor}
            onChange={(e) => setOriginalAuthor(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            If this recipe came from someone specific
          </p>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>
              Ingredients <span className="text-red-500">*</span>
            </Label>
          </div>

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
                  placeholder="flour, sugar, eggs..."
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
          <Label>
            Instructions <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-500">
            Walk us through it, step by step
          </p>

          {instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-shrink-0 w-8 h-12 flex items-center justify-center font-medium text-gray-500">
                {index + 1}.
              </div>
              <Textarea
                placeholder="Mix the dry ingredients together..."
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

        {/* Tips & Substitutions (optional) */}
        <div className="space-y-2">
          <Label htmlFor="tips">
            Tips, tricks, or substitutions (optional)
          </Label>
          <Textarea
            id="tips"
            placeholder="You can use almond milk instead of regular milk. Don't overmix the batter..."
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Anything that would help someone make this successfully
          </p>
        </div>

        {/* Encouragement */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            You're almost done! Just photos and permissions left.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            Back
          </Button>

          <Button type="submit" size="lg">
            Next
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}
