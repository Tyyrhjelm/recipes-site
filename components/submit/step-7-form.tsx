'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeForm } from './recipe-form-context';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Step7FormProps {
  contributorEmail: string;
  contributorId: string;
}

export function Step7Form({ contributorEmail, contributorId }: Step7FormProps) {
  const router = useRouter();
  const { formData, clearFormData, setCurrentStep } = useRecipeForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/recipes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit recipe');
      }

      // Clear form data from localStorage
      clearFormData();

      // Redirect to thank you page
      router.push('/submit/thank-you');

    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(6);
    router.push('/submit/step-6');
  };

  const athletes = formData.athletes || [];
  const hasStory = !!formData.story;
  const hasPhotos = (formData.photos_count ?? 0) > 0;

  return (
    <FormLayout
      currentStep={7}
      title="Review your recipe"
      description="Everything look good? You can always edit after submitting."
    >
      <div className="space-y-6">
        {/* Athletes */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Athletes</h3>
          {athletes.map((athlete, index) => (
            <div key={index} className="text-gray-700 mb-2">
              <span className="font-medium">{athlete.name}</span>
              {athlete.sports && athlete.sports.length > 0 && (
                <span className="text-gray-600"> — {athlete.sports.join(', ')}</span>
              )}
              {athlete.team_or_program && (
                <span className="text-gray-500 text-sm"> ({athlete.team_or_program})</span>
              )}
            </div>
          ))}
          <p className="text-sm text-gray-600 mt-2">
            Submitted by: {formData.contributor_name}
            {formData.contributor_relationship && ` (${formData.contributor_relationship})`}
          </p>
        </div>

        {/* Recipe Title */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Recipe</h3>
          <p className="text-xl font-medium text-gray-900">{formData.title}</p>
          {formData.original_author && (
            <p className="text-sm text-gray-600 mt-1">Created by: {formData.original_author}</p>
          )}
        </div>

        {/* What You Love / When You Make It */}
        {(formData.what_you_love || formData.when_you_make_it) && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-2">About This Recipe</h3>
            {formData.what_you_love && (
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700">What you love:</p>
                <p className="text-gray-600">{formData.what_you_love}</p>
              </div>
            )}
            {formData.when_you_make_it && (
              <div>
                <p className="text-sm font-medium text-gray-700">When you make it:</p>
                <p className="text-gray-600">{formData.when_you_make_it}</p>
              </div>
            )}
          </div>
        )}

        {/* Story */}
        {hasStory && formData.consent_story_inclusion && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Story</h3>
            <p className="text-gray-700 whitespace-pre-line">{formData.story}</p>
          </div>
        )}

        {/* Ingredients */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
          <ul className="space-y-1">
            {formData.ingredients?.map((ing, index) => (
              <li key={index} className="text-gray-700">
                {ing.amount && <span className="font-medium">{ing.amount}</span>} {ing.item}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
          <ol className="space-y-2">
            {formData.instructions?.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-medium text-gray-600">{index + 1}.</span>
                <span className="text-gray-700 flex-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips */}
        {formData.tips_substitutions && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Tips & Substitutions</h3>
            <p className="text-gray-700">{formData.tips_substitutions}</p>
          </div>
        )}

        {/* Photos */}
        {hasPhotos && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Photos</h3>
            <p className="text-gray-600">
              {formData.photos_count} photo{formData.photos_count !== 1 ? 's' : ''} uploaded
              {formData.consent_photo_inclusion 
                ? ' (will be included)' 
                : ' (saved but not included in cookbook)'}
            </p>
          </div>
        )}

        {/* Consent Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Permissions Summary
          </h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✓ Recipe can be published in cookbook</li>
            {formData.consent_name_attribution && <li>✓ Include contributor name</li>}
            {formData.consent_story_inclusion && hasStory && <li>✓ Include story</li>}
            {formData.consent_photo_inclusion && hasPhotos && <li>✓ Include photos</li>}
          </ul>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-900">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">Submission failed</p>
            </div>
            <p className="text-sm text-red-800 mt-1">{error}</p>
          </div>
        )}

        {/* Important note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            By submitting, you confirm that you have the right to share this recipe and any photos. 
            You can edit or delete your submission anytime from your dashboard.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={submitting}
          >
            Back
          </Button>

          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={submitting}
            className="min-w-[200px]"
          >
            {submitting ? 'Submitting...' : 'Submit Recipe'}
          </Button>
        </div>
      </div>
    </FormLayout>
  );
}
