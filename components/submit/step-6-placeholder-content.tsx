'use client';

import { useRouter } from 'next/navigation';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';

export function Step6PlaceholderContent() {
  const router = useRouter();

  return (
    <FormLayout
      currentStep={6}
      title="Excellent progress!"
      description="Steps 1-5 are complete. Consent checkboxes and final submission (Steps 6-7) coming next."
    >
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2">✅ What's Working:</h3>
          <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
            <li>Step 1: Athletes and contributor info (multi-athlete support!)</li>
            <li>Step 2: Reflective questions</li>
            <li>Step 3: Optional story</li>
            <li>Step 4: Recipe details with dynamic ingredients/instructions</li>
            <li>Step 5: Photo upload with preview and deletion</li>
            <li>Progress indicator and navigation</li>
            <li>Form state management (data persists!)</li>
            <li>LocalStorage draft saving</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔨 Coming Next:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Step 6: Granular consent checkboxes</li>
            <li>Step 7: Review and submit to database</li>
            <li>Thank you page</li>
            <li>Contributor dashboard</li>
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
            onClick={() => router.push('/submit/step-5')}
            variant="outline"
            className="flex-1"
          >
            ← Back to Photos
          </Button>
        </div>
      </div>
    </FormLayout>
  );
}
