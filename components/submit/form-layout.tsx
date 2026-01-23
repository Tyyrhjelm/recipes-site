'use client';

import { ReactNode } from 'react';
import { ProgressIndicator } from './progress-indicator';

interface FormLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
  title: string;
  description?: string;
}

export function FormLayout({
  children,
  currentStep,
  totalSteps = 7,
  title,
  description,
}: FormLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 text-base md:text-lg">
                {description}
              </p>
            )}
          </div>

          {children}
        </div>

        {/* Save draft link */}
        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Save and come back later
          </a>
        </div>
      </div>
    </div>
  );
}
