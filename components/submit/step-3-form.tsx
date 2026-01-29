'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeForm } from './recipe-form-context';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Step3Form() {
  const router = useRouter();
  const { formData, updateFormData, setCurrentStep } = useRecipeForm();

  const [story, setStory] = useState(formData.story || '');

  const handleNext = () => {
    // Save to form context (story is optional)
    updateFormData({
      story: story.trim() || undefined,
    });

    setCurrentStep(4);
    router.push('/submit/step-4');
  };

  const handleBack = () => {
    // Save current data
    updateFormData({
      story: story.trim() || undefined,
    });
    
    setCurrentStep(2);
    router.push('/submit/step-2');
  };

  const handleSkip = () => {
    updateFormData({
      story: undefined,
    });
    
    setCurrentStep(4);
    router.push('/submit/step-4');
  };

  return (
    <FormLayout
      currentStep={3}
      title="Does this recipe have a story?"
      description="Some recipes come with memories. If this one does, we'd love to hear it — but only if you'd like to share."
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="story">
            If this recipe could tell a story, what would it say?
          </Label>
          <Textarea
            id="story"
            placeholder="This is my grandmother's recipe. She taught me how to make it the summer I learned to swim..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={8}
            className="min-h-[200px]"
          />
          <p className="text-sm text-gray-500">
            A few sentences or a few paragraphs — whatever feels right
          </p>
        </div>

        {/* Alternative prompts (just shown as examples) */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900 font-medium mb-2">
            Not sure where to start? Try thinking about:
          </p>
          <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
            <li>Does this recipe remind you of a person, place, or moment?</li>
            <li>What would you want someone to know about this recipe?</li>
            <li>Is there a memory connected to making or eating this?</li>
          </ul>
        </div>

        {/* Encouragement */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            Your story doesn't need to be polished. We'll treat your words with care.
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
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
            >
              Skip — I'll just share the recipe
            </Button>
            <Button type="submit" size="lg">
              Next
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
}
