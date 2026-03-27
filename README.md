# NumAkshar Landing Page

Static pre-launch landing page for [numakshar.com](https://numakshar.com).

## Stack

- Plain HTML + CSS + vanilla JS (single `index.html`)
- Google Fonts: Playfair Display + Inter
- No build step, no dependencies

## Deploy to Vercel

### One-time setup

```bash
npm i -g vercel
vercel login
```

### Deploy (preview)

```bash
cd /root/numakshar/landing
vercel
```

### Deploy to production

```bash
vercel --prod
```

### Connect numakshar.com domain

In the Vercel dashboard:
1. Open the project → Settings → Domains
2. Add `numakshar.com` and `www.numakshar.com`
3. Follow the DNS instructions (add CNAME/A records in Cloudflare)
4. In Cloudflare: set the proxy status to **DNS only** (grey cloud) for the Vercel records

## Waitlist backend (next step)

Currently the waitlist form shows a visual confirmation only (no data is persisted).

To wire up real email capture:
- Create a Resend audience
- Add a Vercel serverless function at `api/waitlist.js` that POSTs to Resend `/audiences/{id}/contacts`
- Update the form `fetch` call in `index.html` to POST to `/api/waitlist`
