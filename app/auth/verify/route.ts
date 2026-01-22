import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLinkToken, getOrCreateContributor, createSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/verify-error?reason=no-token', request.url));
  }

  // Verify the token
  const email = await verifyMagicLinkToken(token);

  if (!email) {
    return NextResponse.redirect(new URL('/auth/verify-error?reason=expired', request.url));
  }

  // Token is valid - get or create contributor
  const contributor = await getOrCreateContributor(email);

  // Create session
  await createSession(contributor.id);

  // Redirect to submission flow
  return NextResponse.redirect(new URL('/submit/step-1', request.url));
}