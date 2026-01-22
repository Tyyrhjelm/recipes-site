import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { MagicLinkForm } from '@/components/auth/magic-link-form';

export default async function SubmitPage() {
  // Check if user is already logged in
  const session = await getSession();
  
  if (session) {
    // Already logged in - redirect to step 1
    redirect('/submit/step-1');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto">
        <MagicLinkForm />
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
