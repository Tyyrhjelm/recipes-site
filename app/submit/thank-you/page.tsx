import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ThankYouPage() {
  const contributor = await requireAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Thank you message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          
          <p className="text-lg text-gray-700 mb-6">
            Your recipe has been submitted successfully.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-purple-900 mb-3">What happens next?</h2>
            <ul className="text-sm text-purple-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <span>Our team will review your submission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">2.</span>
                <span>We may reach out if we have questions or need clarification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">3.</span>
                <span>Your recipe will be included in the upcoming cookbook edition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">4.</span>
                <span>You'll be notified when the cookbook is published</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View My Recipes
              </Button>
            </Link>

            <Link href="/submit/step-1">
              <Button size="lg" className="w-full sm:w-auto">
                Submit Another Recipe
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Return Home
              </Button>
            </Link>
          </div>

          {/* Additional info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              You can edit or delete your submission anytime from your dashboard.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Signed in as: {contributor.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
