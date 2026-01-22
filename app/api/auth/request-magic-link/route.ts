import { NextRequest, NextResponse } from 'next/server';
import { generateMagicLinkToken, storeMagicLinkToken } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Rate limiting check - max 5 requests per hour per email
    const supabase = createServiceClient();
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const { data: recentTokens } = await supabase
      .from('magic_link_tokens')
      .select('id')
      .eq('email', email)
      .gte('created_at', oneHourAgo.toISOString());

    if (recentTokens && recentTokens.length >= 5) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Generate token and store
    const token = generateMagicLinkToken();
    await storeMagicLinkToken(email, token);

    // Create magic link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const magicLink = `${appUrl}/auth/verify?token=${token}`;

    // Send email
    await sendMagicLinkEmail(email, magicLink);

    return NextResponse.json({ 
      success: true,
      message: 'Magic link sent! Check your email.' 
    });

  } catch (error) {
    console.error('Magic link request error:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendMagicLinkEmail(email: string, magicLink: string): Promise<void> {
  // For MVP: Use Supabase's built-in email
  // Later: Can switch to Resend for custom branding
  
  const supabase = createServiceClient();

  // Option 1: Use Supabase Auth's magic link (simplest)
  // This will send using Supabase's email templates
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: magicLink,
    }
  });

  if (error) {
    // Fallback: Log the magic link (for development)
    console.log('='.repeat(60));
    console.log('MAGIC LINK FOR:', email);
    console.log(magicLink);
    console.log('='.repeat(60));
    
    // In production, you'd want to throw an error here
    // For MVP, we'll just log it
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to send email');
    }
  }

  // Option 2: Custom email with Resend (for Phase 2)
  /*
  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
        to: email,
        subject: 'Your recipe submission link',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Share Your Recipe</h2>
            <p>We're excited to hear from you.</p>
            <p>Click the button below to share your recipe. This link will work for the next 15 minutes.</p>
            <p style="margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background-color: #7c3aed; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Share My Recipe
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't request this, you can ignore this email.
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              With gratitude,<br>
              The Special Olympics Cookbook Team
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email via Resend');
    }
  }
  */
}
