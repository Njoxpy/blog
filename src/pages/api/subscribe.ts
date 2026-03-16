import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add contact to Resend audience
    // Get your API key from resend.com and your audience ID from the dashboard
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID;

    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: 'Subscription failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Optional: send a welcome email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Njox <hello@yourdomain.dev>', // ← update this
        to: email,
        subject: 'You\'re subscribed 🎉',
        html: `
          <p>Hey, thanks for subscribing!</p>
          <p>I write about building SaaS in East Africa, engineering decisions, and AI.
          You'll get an email whenever I publish something new.</p>
          <p>— Njox</p>
          <hr/>
          <p style="font-size:12px;color:#888;">
            <a href="https://yourdomain.dev">yourdomain.dev</a>
          </p>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
