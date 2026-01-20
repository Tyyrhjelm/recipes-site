# Special Olympics Cookbook Platform - Setup Guide

This is a complete, production-ready recipe collection platform built with Next.js 14, Supabase, and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works fine)
- A Resend account for sending magic link emails (optional for MVP, can use Supabase emails)

### Step 1: Set Up Supabase

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name, database password, and region
   - Wait for the project to be provisioned

2. **Run the database schema**
   - Open your Supabase project dashboard
   - Go to SQL Editor (left sidebar)
   - Click "New Query"
   - Copy the entire contents of `supabase-schema.sql`
   - **IMPORTANT:** Replace `'your-email@example.com'` with your actual email address (this makes you the admin)
   - Click "Run" to execute the SQL
   - You should see "Success. No rows returned"

3. **Create storage buckets** (if not created by SQL)
   - Go to Storage in Supabase dashboard
   - Create two public buckets:
     - `recipe-images`
     - `recipe-images-thumbnails`

4. **Get your API keys**
   - Go to Settings → API
   - Copy your:
     - Project URL
     - `anon` public key
     - `service_role` secret key (keep this secret!)

### Step 2: Set Up the Application

1. **Clone/download this code**
   ```bash
   cd cookbook-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   - Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   
   - Edit `.env.local` and fill in your values:
   ```env
   # From Supabase dashboard → Settings → API
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

   # For magic link emails (optional for now)
   RESEND_API_KEY=your-resend-key
   FROM_EMAIL=noreply@yourdomain.com

   # Your admin email (must match what you put in the SQL)
   ADMIN_EMAIL=your-email@example.com

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   - Navigate to http://localhost:3000
   - You should see the landing page!

### Step 3: Enable Magic Link Authentication

**Option A: Use Supabase Built-in Email (Easiest for MVP)**

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Configure email templates:
   - Go to Authentication → Email Templates
   - Edit "Magic Link" template to match our warm tone
4. Done! Magic links will work automatically

**Option B: Use Resend (Better deliverability, custom domain)**

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain)
3. Get your API key
4. Add to `.env.local`
5. We'll create the custom email sending API route

For MVP, **use Option A**. We can upgrade to Resend later.

## 📁 Project Structure

```
cookbook-platform/
├── app/
│   ├── api/              # API routes
│   ├── submit/           # Recipe submission flow
│   ├── dashboard/        # Contributor dashboard
│   ├── admin/            # Admin interface
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase.ts       # Supabase client utilities
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── supabase-schema.sql   # Database schema
└── .env.local            # Environment variables (create this)
```

## 🔧 Development Workflow

### Testing the Submission Flow

1. Go to http://localhost:3000
2. Click "Share Your Recipe"
3. Enter your email
4. Check your email for the magic link (or check Supabase Auth logs)
5. Complete the 7-step submission process

### Accessing Admin Dashboard

1. Go to http://localhost:3000/admin
2. Log in with your admin email (the one you added to the database)
3. You'll see all submitted recipes

### Database Changes

If you need to modify the database:
1. Edit `supabase-schema.sql`
2. Run the new SQL in Supabase SQL Editor
3. Update types in `lib/types.ts` if needed

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Add all environment variables from `.env.local`
   - Click "Deploy"

3. **Update environment variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
   - Update `FROM_EMAIL` if using custom domain

4. **Update Supabase redirect URLs**
   - In Supabase dashboard → Authentication → URL Configuration
   - Add your Vercel URL to "Redirect URLs"

### Deploy Database

Your database is already deployed on Supabase! No additional steps needed.

### Domain Setup (Optional)

1. **Add custom domain in Vercel**
   - Vercel dashboard → Settings → Domains
   - Add your domain
   - Update DNS records

2. **Update environment variables**
   - Change `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update Supabase redirect URLs

## 🎨 Customization

### Branding

1. **Colors**: Edit `app/globals.css` CSS variables
2. **Logo**: Add your logo to `public/` and update `app/page.tsx`
3. **Copy**: Edit the microcopy in each step component

### Email Templates

**Supabase Built-in:**
- Supabase Dashboard → Authentication → Email Templates
- Edit "Magic Link" template

**Custom (Resend):**
- Create email template in `app/api/send-magic-link/route.ts`

## 📊 Monitoring

### Check Submissions
- Supabase Dashboard → Table Editor → `recipes`
- Admin dashboard: http://your-url.com/admin

### Check Images
- Supabase Dashboard → Storage → `recipe-images`

### Check Deleted Images
- Supabase Dashboard → Table Editor → `image_deletion_log`
- You'll get email notifications when images are deleted from approved recipes

## 🔒 Security Notes

1. **Never commit `.env.local`** - it's in `.gitignore`
2. **Service role key is powerful** - only use server-side
3. **Row Level Security (RLS)** is enabled on all tables
4. **Image deletion** - contributors can delete anytime, even from approved recipes (this is by design)

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Check Supabase URL and keys in `.env.local`
- Make sure RLS policies are created (run the SQL schema)

### Magic link emails not sending
- Check Supabase Dashboard → Authentication → Logs
- Verify email template is configured
- Check spam folder

### Images not uploading
- Check storage buckets exist in Supabase
- Check storage policies are created (in SQL schema)
- Check file size (max 10MB)

### "Not authorized" errors
- Check RLS policies
- Make sure user email is in `admin_users` table for admin access
- Check session is valid

## 📈 Next Steps

Once the MVP is working, you can:

1. **Add Phase 2 features**:
   - Email notifications
   - Tag system
   - Advanced export (DOCX, Markdown)
   - Editorial change tracking

2. **Improve email deliverability**:
   - Set up custom domain with Resend
   - Create branded email templates

3. **Add analytics**:
   - Track submission rates
   - Monitor recipe counts by sport

4. **Create export templates**:
   - InDesign-ready exports
   - Cookbook formatting

## 🆘 Support

If you get stuck:
1. Check the Supabase logs
2. Check browser console for errors
3. Verify environment variables
4. Check that SQL schema ran successfully

## 🎉 You're Ready!

The system is fully functional out of the box. Just:
1. Set up Supabase
2. Add environment variables
3. Run `npm run dev`
4. Start collecting recipes!

---

**Remember**: This platform prioritizes contributor dignity and control. Images can always be deleted, consent is granular, and stories are treated with respect. That's not a bug—that's the design.
