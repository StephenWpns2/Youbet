# YouBet Architecture Overview

## System Architecture

### Monorepo Structure (Turborepo)

```
youbet/
├── apps/
│   ├── web/                 # Next.js 15 App Router (User-facing)
│   └── api/                 # NestJS REST API + WebSockets
├── packages/
│   ├── ui/                  # Shared React components
│   ├── database/            # Prisma schema + migrations
│   ├── config/              # ESLint, TypeScript, Tailwind configs
│   └── sdk/                 # Type-safe API client
├── docker/
│   ├── docker-compose.yml   # Local dev services
│   └── Dockerfile.api       # API container
├── docs/
│   ├── design-upgrade.md
│   ├── architecture.md
│   └── api.md
├── .github/
│   └── workflows/
│       ├── ci.yml           # Lint, typecheck, test
│       └── deploy.yml       # Preview + production deploy
├── package.json             # Root workspace
├── turbo.json              # Turbo pipeline config
└── pnpm-workspace.yaml     # pnpm workspaces
```

## Technology Stack

### Frontend (apps/web)
- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x + shadcn/ui
- **State:** TanStack Query v5 (server state), Zustand (client state)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Auth:** Clerk (or Auth0)
- **Testing:** Vitest (unit), Playwright (e2e)

### Backend (apps/api)
- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.x
- **API Style:** REST + OpenAPI 3.1
- **WebSockets:** Socket.IO (for real-time chat, feed updates)
- **Validation:** class-validator, class-transformer
- **Testing:** Jest (unit), Supertest (integration)

### Data Layer (packages/database)
- **ORM:** Prisma 5.x
- **Primary DB:** PostgreSQL 16
- **Cache:** Redis 7.x (feed fan-out, sessions, rate limiting)
- **Storage:** S3-compatible (MinIO for local, AWS S3 for prod)
- **Job Queue:** BullMQ (background jobs, stat computation)

### Shared Packages
- **packages/ui:** React components, hooks, design tokens
- **packages/sdk:** Generated TypeScript client from OpenAPI spec
- **packages/config:** Shared configs (eslint, tsconfig, tailwind)

### DevOps & Infrastructure
- **CI/CD:** GitHub Actions
- **Container:** Docker + Docker Compose
- **Hosting (suggested):**
  - Web: Vercel / Netlify
  - API: Railway / Fly.io / AWS ECS
  - DB: Supabase / Neon / RDS
- **Monitoring:** Sentry (errors), Vercel Analytics (web vitals)
- **Observability:** OpenTelemetry → Grafana Cloud (optional)

## Data Flow

### User Posts a Pick
```
1. User submits form in web app
2. Web app uploads slip image → presigned S3 URL (from API)
3. Web app POSTs pick data + S3 key → API
4. API validates, creates Pick record in Prisma
5. API fans out to Redis feed cache (followers' feeds)
6. API emits WebSocket event to online followers
7. Web app shows optimistic update → refetches on success
```

### Event Starts → Lock Picks
```
1. Cron job (or external webhook) triggers every minute
2. API queries Events where startTime < now() AND status = 'scheduled'
3. For each event, update related Picks: set lockedAt = now()
4. Mark Event.status = 'live'
5. Emit WebSocket notification to affected users
```

### Event Settles → Compute Results
```
1. Webhook from odds provider (or manual admin action)
2. API receives Event result (winner, final score)
3. API queries all Picks for that Event
4. For each Pick, compute outcome (win/loss/void) + profit
5. Update Pick.status and Pick.profit
6. Recompute User stats (ROI, win rate) via BullMQ job
7. Send push notification to users with settled picks
```

## Security & Compliance

### Authentication
- **Provider:** Clerk (JWT, OAuth, passwordless)
- **Flow:** Web app → Clerk login → JWT in httpOnly cookie
- **API:** Validates JWT via Clerk public key, extracts userId

### Authorization
- Users can only edit/delete their own Picks
- Admin role can moderate content, settle events manually

### Age Verification
- Collected during signup (DOB or ID upload)
- Stored in User.ageVerified boolean
- Enforced: All deep-link CTAs hidden if ageVerified = false

### Geofencing
- Captured via browser Geolocation API + IP-based GeoIP lookup (MaxMind)
- Stored in User.geoRegion (ISO 3166-2 code)
- Enforced: Sportsbook links filtered by region legality

### Content Moderation
- Profanity filter on pick captions, comments (library: bad-words or Perspective API)
- User-reported content flagged for manual review
- Auto-hide picks with "guaranteed win" claims (pattern matching)

### Data Privacy
- GDPR/CCPA: Export/delete endpoints
- No PII in logs
- S3 slip images: presigned URLs expire in 7 days
- User emails hashed in analytics

### Rate Limiting
- Redis-based (10 picks/hour, 100 API calls/minute per user)
- Stricter limits for unauthenticated users

## Scalability Considerations

### Feed Fan-Out (Hybrid Approach)
- **Write-time fan-out:** For users with < 10k followers, write to each follower's Redis feed cache
- **Read-time fan-out:** For power users (> 10k followers), aggregate on read from DB
- **Feed cache TTL:** 24 hours; refetch older items from DB

### Database
- Indexed on: User.handle, Pick.userId, Pick.eventId, Pick.createdAt, Event.startTime
- Partitioning (future): Picks table by month if > 10M rows

### CDN
- Static assets (images, CSS, JS) served via CDN (Cloudflare, Vercel Edge)
- Slip images in S3 with CloudFront distribution

### Horizontal Scaling
- Web: Stateless Next.js → scale horizontally on Vercel
- API: Stateless NestJS containers → scale via load balancer
- WebSocket: Sticky sessions or Redis adapter for Socket.IO

## API Design (OpenAPI)

See `docs/api.md` for full specification.

### Key Endpoints
- `POST /auth/webhook` - Clerk user creation
- `GET /events` - List upcoming events
- `POST /picks` - Create pick with proof
- `GET /picks/feed` - Paginated feed (cursor-based)
- `POST /picks/:id/reactions` - Like/fire/celebrate
- `POST /picks/:id/comments` - Add comment
- `GET /users/:handle` - Profile + stats
- `GET /leaderboard` - Top ROI/win-rate users
- `POST /deep-links` - Generate affiliate link
- `POST /uploads/sign` - Get presigned S3 URL

### WebSocket Events
- `feed:new_pick` - New pick from followed user
- `pick:settled` - Your pick won/lost
- `pick:locked` - Event started, pick locked
- `chat:message` - New message in channel

## Development Workflow

### Local Setup
```bash
# Install dependencies
pnpm install

# Start Docker services (Postgres, Redis, MinIO)
docker-compose up -d

# Run Prisma migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Start dev servers (all apps in parallel)
pnpm dev

# Web: http://localhost:3000
# API: http://localhost:4000
# API Docs: http://localhost:4000/api
```

### Code Quality Gates
```bash
# Lint
pnpm lint

# Typecheck
pnpm typecheck

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# All checks (CI simulation)
pnpm ci
```

### Git Workflow
1. Feature branch from `main`
2. Commits follow Conventional Commits
3. Pre-commit hook runs lint-staged (format, lint)
4. Push → GitHub Actions runs CI
5. PR → require approvals + passing CI
6. Merge → auto-deploy to preview environment
7. Tag → deploy to production

## Performance Targets

### Web App (Lighthouse)
- **Performance:** 90+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 90+

### API
- **p50 latency:** < 100ms (simple GET)
- **p99 latency:** < 500ms
- **Throughput:** 1000 req/s per instance

### Database
- **Query time (p99):** < 50ms
- **Connections:** Pool of 20 per API instance

## Disaster Recovery

### Backups
- **Postgres:** Daily snapshots, 30-day retention
- **S3 slip images:** Cross-region replication
- **Redis:** Not critical; rebuilt from DB on cold start

### Rollback
- Keep last 5 Docker images
- Database migrations: reversible with `down` scripts
- Feature flags: instant disable without deploy

## Future Enhancements

### Phase 2 (Q1 2026)
- Mobile app (React Native / Expo)
- Push notifications (Firebase Cloud Messaging)
- Creator tipping (Stripe Connect)
- Advanced analytics (CLV, EV calculations)

### Phase 3 (Q2 2026)
- AI pick suggestions (OpenAI API)
- Video proof (TikTok-style)
- Live streaming (Twitch integration)
- Fantasy leagues (group competitions)

---

**Last Updated:** November 2, 2025

