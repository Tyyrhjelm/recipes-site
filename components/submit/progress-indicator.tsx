'use client';

import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Identity',
  'Meaning',
  'Story',
  'Recipe',
  'Photos',
  'Consent',
  'Complete'
];

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
          />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                step < currentStep && 'bg-primary text-white',
                step === currentStep && 'bg-primary text-white ring-4 ring-primary/20',
                step > currentStep && 'bg-gray-200 text-gray-500'
              )}
            >
              {step < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                step
              )}
            </div>
            <span className="text-xs mt-2 text-gray-600 hidden sm:block">
              {stepLabels[step - 1]}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile step label */}
      <div className="mt-4 text-center sm:hidden">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep}: {stepLabels[currentStep - 1]}
        </span>
      </div>

      {/* Helper text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}
