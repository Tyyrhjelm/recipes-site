import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';

export default async function Step1Page() {
  const contributor = await requireAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {contributor.email}!
          </h1>
          <p className="text-gray-600 mb-6">
            You're successfully logged in. The recipe submission form will go here.
          </p>
          <p className="text-sm text-gray-500">
            (This is Step 1 - we'll build the full form in the next sprint)
          </p>
          
          <div className="mt-8 pt-8 border-t">
            <form action="/api/auth/logout" method="POST">
              <button 
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
