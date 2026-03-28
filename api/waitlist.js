import postmark from 'postmark';

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Missing firstName or email' });
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  console.log('Waitlist signup:', { firstName, email });

  const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN;
  if (!POSTMARK_TOKEN) {
    console.error('POSTMARK_SERVER_TOKEN not set');
    return res.status(200).json({ success: true, message: 'You are on the waitlist!' });
  }

  const client = new postmark.ServerClient(POSTMARK_TOKEN);

  try {
    await client.sendEmail({
      From: 'NumAkshar <hello@numakshar.com>',
      To: email,
      Subject: `Welcome to NumAkshar, ${firstName}.`,
      TextBody: `${firstName},

You're on the list.

When NumAkshar launches, you'll be among the first to receive your complete numerological portrait: 33 personalised sections covering personality, career alignment, timing cycles, relationships, blind spots, and name vibration analysis.

As a waitlist member, your price is locked at ₹1,749 (30% off the launch price of ₹2,499).

Built on a Swiss methodology refined over 30 years. Designed for Indian professionals who want clarity, not predictions.

We'll reach out the moment early access opens.

NumAkshar
numakshar.com`,
      HtmlBody: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; color: #1A1D1B; line-height: 1.7;">
  <div style="padding: 2rem 0; border-bottom: 1px solid #eee;">
    <span style="font-size: 1.3rem; font-weight: 400; letter-spacing: -0.01em;">Num<span style="color: #B87333;">Akshar</span></span>
  </div>

  <div style="padding: 2rem 0;">
    <p style="font-size: 1rem; margin-bottom: 1.2rem;">${firstName},</p>

    <p style="font-size: 1rem; margin-bottom: 1.2rem;">You're on the list.</p>

    <p style="font-size: 1rem; margin-bottom: 1.2rem;">When NumAkshar launches, you'll be among the first to receive your complete numerological portrait: <strong>33 personalised sections</strong> covering personality, career alignment, timing cycles, relationships, blind spots, and name vibration analysis.</p>

    <p style="font-size: 1rem; margin-bottom: 1.2rem;">As a waitlist member, your price is locked at <strong style="color: #B87333;">₹1,749</strong> <span style="color: #888; text-decoration: line-through;">₹2,499</span> — 30% off the launch price.</p>

    <p style="font-size: 1rem; margin-bottom: 1.2rem; color: #5A5550;">Built on a Swiss methodology refined over 30 years. Designed for Indian professionals who want clarity, not predictions.</p>

    <p style="font-size: 1rem; margin-bottom: 0;">We'll reach out the moment early access opens.</p>
  </div>

  <div style="padding: 1.5rem 0; border-top: 1px solid #eee; font-size: 0.82rem; color: #999;">
    <a href="https://numakshar.com" style="color: #B87333; text-decoration: none;">numakshar.com</a>
  </div>
</div>`,
      MessageStream: 'outbound'
    });
    console.log('Welcome email sent to', email);
  } catch (err) {
    console.error('Failed to send welcome email:', err);
    // Don't fail the signup if email fails
  }

  return res.status(200).json({ success: true, message: 'You are on the waitlist!' });
}

export default allowCors(handler);
