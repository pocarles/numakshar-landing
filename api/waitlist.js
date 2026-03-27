import { Resend } from 'resend';

// Allow CORS
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  console.log('Waitlist signup:', { firstName, email });

  // Send welcome email via Resend if API key is present
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (RESEND_API_KEY) {
    const resend = new Resend(RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: 'NumAkshar <onboarding@resend.dev>',
        to: email,
        subject: `Your life path number awaits, ${firstName}.`,
        text: `Thank you ${firstName} for joining the NumAkshar waitlist.\n\nAs a founding member, you'll have access to our premium numerology portrait at the launch price of ₹1499.\n\nWe'll let you know the moment early access opens. You'll be first in line.\n\n— The NumAkshar team`,
        html: `<p>Thank you ${firstName} for joining the NumAkshar waitlist.</p>
<p>As a founding member, you'll have access to our premium numerology portrait at the launch price of ₹1499.</p>
<p>We'll let you know the moment early access opens. You'll be first in line.</p>
<p>— The NumAkshar team</p>`
      });
      console.log('Welcome email sent to', email);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }
  } else {
    console.warn('RESEND_API_KEY not set, skipping email');
  }

  // Return success
  res.status(200).json({ success: true, message: 'You are on the waitlist!' });
}

export default allowCors(handler);