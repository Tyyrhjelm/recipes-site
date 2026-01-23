'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeForm } from './recipe-form-context';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Step2Form() {
  const router = useRouter();
  const { formData, updateFormData, setCurrentStep } = useRecipeForm();

  const [whatYouLove, setWhatYouLove] = useState(formData.what_you_love || '');
  const [whenYouMakeIt, setWhenYouMakeIt] = useState(formData.when_you_make_it || '');

  const handleNext = () => {
    // Save to form context (both fields are optional)
    updateFormData({
      what_you_love: whatYouLove.trim() || undefined,
      when_you_make_it: whenYouMakeIt.trim() || undefined,
    });

    setCurrentStep(3);
    router.push('/submit/step-3');
  };

  const handleBack = () => {
    // Save current data
    updateFormData({
      what_you_love: whatYouLove.trim() || undefined,
      when_you_make_it: whenYouMakeIt.trim() || undefined,
    });
    
    setCurrentStep(1);
    router.push('/submit/step-1');
  };

  const handleSkip = () => {
    updateFormData({
      what_you_love: undefined,
      when_you_make_it: undefined,
    });
    
    setCurrentStep(3);
    router.push('/submit/step-3');
  };

  return (
    <FormLayout
      currentStep={2}
      title="What makes this recipe special?"
      description="Before we get to the ingredients, we'd love to know what this recipe means to you."
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
        <div className="space-y-6">
          {/* What do you love */}
          <div className="space-y-2">
            <Label htmlFor="what-you-love">
              What do you love about this recipe?
            </Label>
            <Textarea
              id="what-you-love"
              placeholder="It reminds me of Sunday mornings with my family..."
              value={whatYouLove}
              onChange={(e) => setWhatYouLove(e.target.value)}
              rows={4}
            />
            <p className="text-sm text-gray-500">
              A few sentences is perfect
            </p>
          </div>

          {/* When you make it */}
          <div className="space-y-2">
            <Label htmlFor="when-you-make-it">
              When do you usually make it?
            </Label>
            <Textarea
              id="when-you-make-it"
              placeholder="After games, on birthdays, Tuesday nights..."
              value={whenYouMakeIt}
              onChange={(e) => setWhenYouMakeIt(e.target.value)}
              rows={3}
            />
            <p className="text-sm text-gray-500">
              Just a thought or two
            </p>
          </div>
        </div>

        {/* Helper text */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            There are no wrong answers here. We just want to know what makes this recipe yours.
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
              Skip this step
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
