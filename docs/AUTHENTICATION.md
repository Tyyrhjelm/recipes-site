# Authentication System Documentation

## Overview
The cookbook platform uses a passwordless magic link authentication system. Contributors simply enter their email and receive a secure link to access the platform.

## How It Works

### 1. User Flow
```
User enters email → Receives magic link → Clicks link → Logged in for 30 days
```

### 2. Components

**Frontend:**
- `/app/submit/page.tsx` - Landing page with email form
- `/components/auth/magic-link-form.tsx` - Email input component
- `/app/auth/verify/page.tsx` - Magic link verification page
- `/app/submit/step-1/page.tsx` - Protected page (post-login)

**Backend:**
- `/app/api/auth/request-magic-link/route.ts` - Generate and send magic link
- `/app/api/auth/logout/route.ts` - Logout endpoint
- `/lib/auth.ts` - Authentication utilities and session management

### 3. Security Features

**Rate Limiting:**
- Max 5 magic link requests per hour per email
- Prevents spam and abuse

**Token Expiry:**
- Magic links valid for 15 minutes
- Tokens are single-use (marked as used after verification)

**Session Management:**
- Sessions stored in database (not just cookies)
- 30-day session duration
- HttpOnly cookies (protected from XSS)
- Secure flag in production
- SameSite: lax (CSRF protection)

**Token Generation:**
- Cryptographically secure random tokens
- 32 bytes (256 bits) of entropy
- Hex encoded (64 characters)

## Database Tables Used

### `contributors`
```sql
id              UUID PRIMARY KEY
email           TEXT UNIQUE NOT NULL
session_token   TEXT (stores active session)
last_active     TIMESTAMPTZ
```

### `magic_link_tokens`
```sql
id          UUID PRIMARY KEY
email       TEXT NOT NULL
token       TEXT UNIQUE NOT NULL
expires_at  TIMESTAMPTZ NOT NULL
used        BOOLEAN DEFAULT FALSE
created_at  TIMESTAMPTZ DEFAULT NOW()
```

## API Endpoints

### POST `/api/auth/request-magic-link`
Request a magic link to be sent to an email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Magic link sent! Check your email."
}
```

**Response (Rate Limited):**
```json
{
  "error": "Too many requests. Please try again later."
}
```

### GET `/auth/verify?token=...`
Verify a magic link token and create a session.

**Success:** Redirects to `/submit/step-1`
**Failure:** Shows error page with explanation

### POST `/api/auth/logout`
Log out the current user.

**Response:**
```json
{
  "success": true
}
```

## Email Sending

### MVP: Supabase Built-in Email
For the MVP, we use Supabase's built-in authentication emails:
- Simple to set up (no API keys needed)
- Works out of the box
- Basic templates

**Setup:**
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Configure email templates if desired

**Development Mode:**
Magic links are logged to console when email fails (for testing).

### Phase 2: Custom Email with Resend
For production, switch to Resend for:
- Custom branding
- Better deliverability
- Custom domain emails
- More control over templates

Code is already prepared (commented out in route.ts).

## Helper Functions

### `getSession(): Promise<Contributor | null>`
Get the current logged-in contributor from the session cookie.

```typescript
const contributor = await getSession();
if (contributor) {
  console.log('Logged in as:', contributor.email);
}
```

### `requireAuth(): Promise<Contributor>`
Require authentication - throws error if not logged in.

```typescript
// In a Server Component or API route
const contributor = await requireAuth();
// contributor is guaranteed to exist here
```

### `isAdminSession(): Promise<boolean>`
Check if current user is an admin.

```typescript
const isAdmin = await isAdminSession();
if (isAdmin) {
  // Show admin features
}
```

### `requireAdmin(): Promise<Contributor>`
Require admin access - throws error if not admin.

```typescript
const admin = await requireAdmin();
// Only admins reach this code
```

### `createSession(contributorId): Promise<string>`
Create a new session for a contributor (called after magic link verification).

### `deleteSession(): Promise<void>`
Delete the current session (logout).

### `getOrCreateContributor(email): Promise<Contributor>`
Get existing contributor or create new one by email.

## Protecting Routes

### Server Components (Recommended)
```typescript
import { requireAuth } from '@/lib/auth';

export default async function ProtectedPage() {
  const contributor = await requireAuth();
  
  return (
    <div>
      Welcome, {contributor.email}!
    </div>
  );
}
```

### API Routes
```typescript
import { requireAuth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const contributor = await requireAuth();
  
  // Only authenticated users reach here
  return NextResponse.json({ success: true });
}
```

### Admin-Only Routes
```typescript
import { requireAdmin } from '@/lib/auth';

export default async function AdminPage() {
  const admin = await requireAdmin();
  
  return (
    <div>
      Admin Dashboard
    </div>
  );
}
```

## Testing the Flow

### 1. Test Magic Link Request
```bash
curl -X POST http://localhost:3000/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 2. Check Console for Magic Link
In development, the magic link is logged to the server console:
```
============================================================
MAGIC LINK FOR: test@example.com
http://localhost:3000/auth/verify?token=abc123...
============================================================
```

### 3. Visit the Magic Link
Open the URL in your browser - you should be redirected to step-1.

### 4. Verify Session Cookie
Open browser dev tools → Application → Cookies
Look for `cookbook_session` cookie.

### 5. Test Logout
Click logout button or POST to `/api/auth/logout`.

## Common Issues

### "Failed to send email"
- **Development:** Check console for logged magic link
- **Production:** Verify Supabase email is configured
- **Check:** Supabase Dashboard → Authentication → Email Templates

### "Token expired or invalid"
- Tokens expire after 15 minutes
- Tokens are single-use
- Request a new magic link

### "Unauthorized" errors
- Session cookie may have expired (30 days)
- User may have logged out
- Check browser console for auth errors

### Rate limiting
- Max 5 requests per hour per email
- Wait an hour or use different email for testing

## Security Best Practices

1. **Never store tokens in localStorage** - Uses httpOnly cookies
2. **Always use HTTPS in production** - Secure flag enabled
3. **Short token expiry** - 15 minutes for magic links
4. **Single-use tokens** - Prevents replay attacks
5. **Rate limiting** - Prevents brute force
6. **CSRF protection** - SameSite cookie attribute

## Next Steps

After authentication is working:
1. Build the 7-step submission form
2. Add email notifications for admins
3. (Phase 2) Switch to Resend for custom emails
4. (Phase 2) Add "remember this device" feature
5. (Phase 2) Add social login options

---

**Status:** ✅ Complete and ready to use
**Tested:** Locally with development magic links
**Production Ready:** Yes (with Supabase email configured)
