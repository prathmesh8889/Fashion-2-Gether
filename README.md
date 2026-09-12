# Fashion2gether — Women & Girls Fashion Store

Production-style Vite + React website for Fashion2gether, Yavatmal.

## Included

- Responsive multipage routes: Home, Collections, Ethnic, Western, New Arrivals, Reels, About, Contact, Admin
- Women/girls-only product catalogue
- Category filtering and search
- WhatsApp product enquiry flow
- Instagram reel embed support
- Admin dashboard for products, reels and customer enquiries
- Local demo storage fallback
- Optional Supabase cloud database + Auth + RLS
- Vercel SPA rewrite configuration

## Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## Production build

```bash
npm run build
npm run preview
```

## Admin

Route: `/admin`

When Supabase is not configured, demo mode is enabled for local/client preview:

- Email: `admin@fashion2gether.in`
- Password: `F2G@2026`

**Do not use demo mode as the final client security model.** Connect Supabase for production admin access.

## Connect Supabase

1. Create a dedicated Supabase project for Fashion2gether.
2. Run `supabase/schema.sql` in the SQL editor.
3. Create an Auth user for the admin.
4. Set the user's `app_metadata.role` to `admin` using a trusted admin/server method.
5. Copy `.env.example` to `.env.local` and add:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

6. Restart Vite.

The SQL enables RLS and uses `app_metadata` for admin authorization. Never expose service-role or secret keys in the frontend.

## Add real Instagram reels

Go to `/admin` → **Reels** → **Add Instagram reel**. Paste a public URL in this format:

`https://www.instagram.com/reel/REEL_SHORTCODE/`

The website automatically converts valid public Reel links into embeds. The starter six reel cards link to the Fashion2gether Instagram profile until exact public Reel URLs are added.

## Deploy on Vercel

- Import GitHub repo: `prathmesh8889/Fashion-2-Gether`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Add Supabase environment variables if cloud mode is enabled

`vercel.json` already handles React Router deep links.

## Business details used

- Fashion2gether, Yavatmal
- Veer Vamanrao Chowk area, Yavatmal, Maharashtra 445001
- Instagram: `@fashion2gether_`
- Women's and girls' fashion focus

Before final client handoff, replace any starter catalogue photography with the shop's own product photos and add 5–6 exact Instagram Reel URLs from the public account.
