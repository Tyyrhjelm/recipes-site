'use client';

import { useRouter } from 'next/navigation';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';

export function Step4PlaceholderContent() {
  const router = useRouter();

  return (
    <FormLayout
      currentStep={4}
      title="Great progress!"
      description="Steps 1-3 are complete and working. The recipe details form (Step 4) will be built in the next sprint."
    >
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2">✅ What's Working:</h3>
          <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
            <li>Step 1: Athletes and contributor info (with multi-athlete support!)</li>
            <li>Step 2: Reflective questions (what you love, when you make it)</li>
            <li>Step 3: Optional story</li>
            <li>Progress indicator and navigation</li>
            <li>Form state management (data persists across steps)</li>
            <li>LocalStorage draft saving</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔨 Coming Next:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Step 4: Recipe details (ingredients, instructions, tips)</li>
            <li>Step 5: Photo upload</li>
            <li>Step 6: Consent checkboxes</li>
            <li>Step 7: Confirmation and submission</li>
          </ul>
        </div>

        <div className="pt-6 flex gap-3">
          <Button
            onClick={() => router.push('/submit/step-1')}
            variant="outline"
          >
            ← Back to Step 1
          </Button>
          
          <Button
            onClick={() => router.push('/api/auth/logout')}
            variant="secondary"
            className="flex-1"
          >
            Log Out
          </Button>
        </div>
      </div>
    </FormLayout>
  );
}