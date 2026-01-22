# Testing the Authentication System

## Prerequisites
Make sure you have:
1. Supabase project set up
2. Database schema run (supabase-schema.sql)
3. Environment variables configured (.env.local)
4. Dependencies installed (`npm install`)
5. Development server running (`npm run dev`)

## Quick Test (5 minutes)

### Test 1: Request a Magic Link

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open the app:**
   Go to http://localhost:3000

3. **Click "Share Your Recipe"**
   You'll see the email form

4. **Enter your email:**
   Use any email (it doesn't need to be real for testing)

5. **Click "Get Started"**
   You should see "Check Your Email" confirmation

### Test 2: Find the Magic Link

**Option A: Check Server Console**
Look in your terminal where `npm run dev` is running. You'll see:
```
============================================================
MAGIC LINK FOR: your@email.com
http://localhost:3000/auth/verify?token=abc123...
============================================================
```

**Option B: Check Supabase Logs** (if email is configured)
1. Go to Supabase Dashboard
2. Authentication → Logs
3. Find the recent email sent
4. Copy the verification link

### Test 3: Click the Magic Link

1. **Copy the full URL** from the console
2. **Paste it in your browser**
3. **You should be redirected to:** http://localhost:3000/submit/step-1
4. **You'll see:** "Welcome, [your email]! You're successfully logged in."

### Test 4: Verify Session

1. **Open browser DevTools** (F12)
2. **Go to Application tab** (Chrome) or Storage tab (Firefox)
3. **Look at Cookies**
4. **You should see:** `cookbook_session` cookie with a long random value
5. **Refresh the page** - you should stay logged in

### Test 5: Log Out

1. **Click "Log out"** at the bottom of the page
2. **Try to visit** http://localhost:3000/submit/step-1 again
3. **You should get an error** (Unauthorized) - this means logout worked!

## Advanced Testing

### Test Rate Limiting

Try requesting 6 magic links in a row with the same email:
```bash
# Run this 6 times
curl -X POST http://localhost:3000/api/auth/request-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

The 6th request should return:
```json
{
  "error": "Too many requests. Please try again later."
}
```

### Test Token Expiry

1. Request a magic link
2. **Wait 16 minutes** (or modify the expiry time in the code)
3. Try to use the link
4. Should see "Link Expired" error page

### Test Single-Use Tokens

1. Request a magic link
2. Use it to log in (works)
3. **Copy the same URL** and try to use it again
4. Should see "Link Expired" error (already used)

### Test Session Persistence

1. Log in via magic link
2. Close your browser completely
3. Open browser again
4. Go to http://localhost:3000/submit/step-1
5. **You should still be logged in** (session persists for 30 days)

## Database Verification

### Check Contributors Table
```sql
SELECT id, email, display_name, session_token, last_active 
FROM contributors;
```

You should see your email with a session_token value.

### Check Magic Link Tokens
```sql
SELECT email, token, expires_at, used, created_at 
FROM magic_link_tokens 
ORDER BY created_at DESC 
LIMIT 10;
```

You should see your recent tokens, with `used: true` for the ones you clicked.

### Check Session Cookie Matches
1. Get your session cookie value from browser DevTools
2. Run:
```sql
SELECT email, session_token 
FROM contributors 
WHERE session_token = 'your-cookie-value-here';
```
Should return your contributor record.

## Troubleshooting

### "Failed to send magic link"
**Problem:** API route is failing
**Solution:** 
- Check server console for errors
- Verify Supabase connection
- Check environment variables

### Can't find magic link in console
**Problem:** Email sending is working (not logging to console)
**Solution:**
- Check your email (if Supabase email is configured)
- Check Supabase logs
- Temporarily disable Supabase email to see console logs

### "Unauthorized" on step-1
**Problem:** Session not being created
**Solution:**
- Check cookies in DevTools
- Verify `cookbook_session` cookie exists
- Check database - does contributor have session_token?

### Session not persisting
**Problem:** Cookie being deleted
**Solution:**
- Check cookie settings (HttpOnly, Secure, etc.)
- In production, must use HTTPS
- Check browser isn't blocking cookies

### "Link Expired" immediately
**Problem:** Token marked as used or expired
**Solution:**
- Check magic_link_tokens table
- Verify expires_at is in the future
- Verify used is false
- Request a fresh link

## Production Testing Checklist

Before going live, test:

- [ ] Magic links work with real email addresses
- [ ] Email deliverability (check spam folder)
- [ ] HTTPS is enforced (Secure cookie flag)
- [ ] Sessions persist across page refreshes
- [ ] Sessions persist across browser restarts (30 days)
- [ ] Rate limiting prevents abuse
- [ ] Expired tokens show proper error
- [ ] Used tokens can't be reused
- [ ] Logout works completely
- [ ] Protected pages redirect to login
- [ ] Admin-only pages check admin status

## Next Steps

Once authentication is tested and working:
1. ✅ Authentication system is solid
2. → Build Step 1 of submission form
3. → Build remaining 6 steps
4. → Add image upload
5. → Build contributor dashboard
6. → Build admin dashboard

---

**Current Status:** Authentication is complete and ready for submission form!
