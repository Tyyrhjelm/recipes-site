import { redirect } from 'next/navigation';
import { verifyMagicLinkToken, getOrCreateContributor, createSession } from '@/lib/auth';

interface VerifyPageProps {
  searchParams: { token?: string };
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            This magic link is invalid or incomplete.
          </p>
          <a 
            href="/" 
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Verify the token
  const email = await verifyMagicLinkToken(token);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This magic link has expired or has already been used. Magic links are valid for 15 minutes.
          </p>
          <a 
            href="/submit" 
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Request a New Link
          </a>
        </div>
      </div>
    );
  }

  // Token is valid - get or create contributor
  const contributor = await getOrCreateContributor(email);

  // Create session
  await createSession(contributor.id);

  // Redirect to submission flow
  redirect('/submit/step-1');
}
