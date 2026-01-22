import { cookies } from 'next/headers';
import { createServiceClient } from './supabase';
import { Contributor } from './types';

const SESSION_COOKIE_NAME = 'cookbook_session';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Create a session for a contributor
 */
export async function createSession(contributorId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const supabase = createServiceClient();

  // Store session token in database
  await supabase
    .from('contributors')
    .update({ 
      session_token: sessionToken,
      last_active: new Date().toISOString()
    })
    .eq('id', contributorId);

  // Set cookie
  cookies().set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return sessionToken;
}

/**
 * Get current session (contributor) from cookie
 */
export async function getSession(): Promise<Contributor | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const supabase = createServiceClient();
  const { data: contributor } = await supabase
    .from('contributors')
    .select('*')
    .eq('session_token', sessionToken)
    .single();

  if (!contributor) {
    return null;
  }

  // Update last active timestamp
  await supabase
    .from('contributors')
    .update({ last_active: new Date().toISOString() })
    .eq('id', contributor.id);

  return contributor;
}

/**
 * Delete current session (logout)
 */
export async function deleteSession(): Promise<void> {
  const contributor = await getSession();
  
  if (contributor) {
    const supabase = createServiceClient();
    await supabase
      .from('contributors')
      .update({ session_token: null })
      .eq('id', contributor.id);
  }

  cookies().delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is admin
 */
export async function isAdminSession(): Promise<boolean> {
  const contributor = await getSession();
  if (!contributor) return false;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', contributor.email)
    .single();

  return !!data;
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(): Promise<Contributor> {
  const contributor = await getSession();
  
  if (!contributor) {
    throw new Error('Unauthorized');
  }

  return contributor;
}

/**
 * Require admin - throw error if not admin
 */
export async function requireAdmin(): Promise<Contributor> {
  const contributor = await requireAuth();
  const isAdmin = await isAdminSession();

  if (!isAdmin) {
    throw new Error('Forbidden - Admin access required');
  }

  return contributor;
}

/**
 * Generate a secure random session token
 */
function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a magic link token
 */
export function generateMagicLinkToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store magic link token in database
 */
export async function storeMagicLinkToken(email: string, token: string): Promise<void> {
  const supabase = createServiceClient();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minute expiry

  await supabase
    .from('magic_link_tokens')
    .insert({
      email,
      token,
      expires_at: expiresAt.toISOString(),
      used: false,
    });
}

/**
 * Verify and consume magic link token
 */
export async function verifyMagicLinkToken(token: string): Promise<string | null> {
  const supabase = createServiceClient();

  // Find the token
  const { data: tokenData } = await supabase
    .from('magic_link_tokens')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .single();

  if (!tokenData) {
    return null; // Token not found or already used
  }

  // Check if expired
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);
  if (now > expiresAt) {
    return null; // Token expired
  }

  // Mark token as used
  await supabase
    .from('magic_link_tokens')
    .update({ used: true })
    .eq('id', tokenData.id);

  return tokenData.email;
}

/**
 * Get or create contributor by email
 */
export async function getOrCreateContributor(email: string): Promise<Contributor> {
  const supabase = createServiceClient();

  // Try to find existing contributor
  const { data: existing } = await supabase
    .from('contributors')
    .select('*')
    .eq('email', email)
    .single();

  if (existing) {
    return existing;
  }

  // Create new contributor
  const { data: newContributor, error } = await supabase
    .from('contributors')
    .insert({ email })
    .select()
    .single();

  if (error || !newContributor) {
    throw new Error('Failed to create contributor');
  }

  return newContributor;
}
