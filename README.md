# AI @ WU — Website

Next.js 15 site for the AI @ WU student society. Dark/neon design, CSS-driven hero choreography, Sanity CMS for content editing.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Content editing (Sanity CMS)

The site renders built-in placeholder content until a Sanity project is connected. Once connected, mission statement, hero stats, team members and events are editable in the browser at `/studio` — no code changes needed.

### One-time setup

1. Create a free project at [sanity.io/manage](https://sanity.io/manage) (dataset: `production`).
2. Copy `.env.local.example` to `.env.local` and paste the Project ID into `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. In sanity.io/manage → **API → CORS origins**, add `http://localhost:3000` with credentials allowed (add the production domain the same way after deploying).
4. Restart the dev server and open [localhost:3000/studio](http://localhost:3000/studio), log in with your Sanity account.
5. Create one **Site Settings** document, your **Team Members** and **Events**.

Content types:

| Type | Drives | Notes |
| --- | --- | --- |
| Site Settings | Hero mission + stats | single document |
| Team Member | "Our Team" section | `order` field controls sorting |
| Event | "Program & Events" section | only future events are shown, sorted by date |

The landing page revalidates every 60 seconds, so published changes appear within a minute without a redeploy.

## Structure

- `app/` — routes: landing, `/join`, `/studio` (embedded Sanity Studio)
- `components/` — sections and UI (hero choreography is pure CSS, see `app/globals.css`)
- `lib/site.ts`, `lib/content.ts` — placeholder/fallback content
- `lib/data.ts` — data layer: Sanity fetch with graceful fallback
- `sanity/` — schema types and env
