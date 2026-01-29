'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeForm } from './recipe-form-context';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function Step6Form() {
  const router = useRouter();
  const { formData, updateFormData, setCurrentStep } = useRecipeForm();

  // Initialize with existing data or defaults
  const [consentPublish, setConsentPublish] = useState(
    formData.consent_publish ?? false
  );
  const [consentName, setConsentName] = useState(
    formData.consent_name_attribution ?? false
  );
  const [consentStory, setConsentStory] = useState(
    formData.consent_story_inclusion ?? false
  );
  const [consentPhoto, setConsentPhoto] = useState(
    formData.consent_photo_inclusion ?? false
  );

  const hasStory = !!formData.story;
  const hasPhotos = (formData.photos_count ?? 0) > 0;

  const handleNext = () => {
    // Must consent to publish
    if (!consentPublish) {
      alert('Please confirm that we can include your recipe in the cookbook.');
      return;
    }

    // Save consent choices
    updateFormData({
      consent_publish: consentPublish,
      consent_name_attribution: consentName,
      consent_story_inclusion: consentStory,
      consent_photo_inclusion: consentPhoto,
    });

    setCurrentStep(7);
    router.push('/submit/step-7');
  };

  const handleBack = () => {
    // Save current consent state
    updateFormData({
      consent_publish: consentPublish,
      consent_name_attribution: consentName,
      consent_story_inclusion: consentStory,
      consent_photo_inclusion: consentPhoto,
    });

    setCurrentStep(5);
    router.push('/submit/step-5');
  };

  return (
    <FormLayout
      currentStep={6}
      title="Your permissions"
      description="You decide what we can share and how we can use it"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
        {/* Main publish consent */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent-publish"
              checked={consentPublish}
              onChange={(e) => setConsentPublish(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <Label htmlFor="consent-publish" className="text-base font-semibold text-purple-900 cursor-pointer">
                Yes, you can include my recipe in the Special Olympics cookbook
              </Label>
              <p className="text-sm text-purple-800 mt-2">
                This gives us permission to publish your recipe. You can still choose below what 
                parts to include.
              </p>
            </div>
          </div>
        </div>

        {/* Additional consent options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">What can we include?</h3>
          <p className="text-sm text-gray-600">
            These are all optional. Check the ones you're comfortable with.
          </p>

          {/* Name attribution */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent-name"
                checked={consentName}
                onChange={(e) => setConsentName(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <Label htmlFor="consent-name" className="font-medium cursor-pointer">
                  Include my name with the recipe
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  We'll credit you as "{formData.contributor_name}" 
                  {formData.athletes && formData.athletes.length > 0 && 
                    ` along with ${formData.athletes.map(a => a.name).join(', ')}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Story inclusion */}
          {hasStory && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent-story"
                  checked={consentStory}
                  onChange={(e) => setConsentStory(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <Label htmlFor="consent-story" className="font-medium cursor-pointer">
                    Include my story
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    We can share the story you wrote alongside the recipe
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Photo inclusion */}
          {hasPhotos && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent-photo"
                  checked={consentPhoto}
                  onChange={(e) => setConsentPhoto(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <Label htmlFor="consent-photo" className="font-medium cursor-pointer">
                    Include my photos
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    We can use the {formData.photos_count} photo{formData.photos_count !== 1 ? 's' : ''} you uploaded
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Important information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Important to know:</h3>
          <ul className="text-sm text-blue-800 space-y-1.5">
            <li>• You can change these permissions anytime by contacting us</li>
            <li>• We'll edit lightly for clarity but preserve your voice</li>
            <li>• We won't share your contact information</li>
            <li>• You can delete your photos anytime, even after publication</li>
          </ul>
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

          <Button 
            type="submit" 
            size="lg"
            disabled={!consentPublish}
          >
            Review & Submit
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}
