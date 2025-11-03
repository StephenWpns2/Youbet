# YouBet - Social Sports Betting Community

**A warm, bright, sports-themed social platform where users share betting predictions, track wins/losses, follow creators, and deep-link to sportsbooks (no in-app wagering).**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.4-blue.svg)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 8.0.0
- **Docker** & Docker Compose

### One-Command Setup

```bash
# Clone repository
git clone https://github.com/youbet/youbet.git
cd youbet

# Install dependencies
pnpm install

# Start Docker services (Postgres, Redis, MinIO)
pnpm db:up

# Run database migrations
pnpm db:migrate

# Seed database with sample data
pnpm db:seed

# Start all apps in development mode
pnpm dev
```

**Access:**
- 🌐 **Web App:** http://localhost:3000
- 🔧 **API:** http://localhost:4000
- 📚 **API Docs:** http://localhost:4000/api
- 🗄️ **Prisma Studio:** `pnpm db:studio`

---

## 📁 Project Structure

```
youbet/
├── apps/
│   ├── web/              # Next.js 15 App Router (User-facing)
│   └── api/              # NestJS REST API + WebSockets
├── packages/
│   ├── database/         # Prisma schema, migrations, seed
│   ├── ui/               # Shared React components (future)
│   ├── config/           # Shared configs (future)
│   └── sdk/              # Type-safe API client (future)
├── docker/
│   └── docker-compose.yml
├── docs/
│   ├── design-upgrade.md
│   └── architecture.md
├── .github/workflows/
│   └── ci.yml
├── package.json          # Root workspace
├── turbo.json            # Turbo pipeline config
└── pnpm-workspace.yaml
```

---

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript 5.4
- **Styling:** Tailwind CSS 4.x + shadcn/ui
- **State:** TanStack Query v5, Zustand
- **Auth:** Clerk
- **Charts:** Recharts

### Backend (`apps/api`)
- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.4
- **API:** REST + OpenAPI 3.1
- **WebSockets:** Socket.IO
- **Validation:** class-validator

### Data (`packages/database`)
- **ORM:** Prisma 5.x
- **Database:** PostgreSQL 16
- **Cache:** Redis 7.x
- **Storage:** S3-compatible (MinIO local, AWS S3 prod)

---

## 📖 Documentation

- **[Design Upgrade Specification](docs/design-upgrade.md)** - UI/UX design system, accessibility, motion
- **[Architecture Overview](docs/architecture.md)** - System design, data flow, security, scalability

---

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps for production
pnpm lint             # Lint all packages
pnpm typecheck        # TypeScript type checking
pnpm test             # Run all unit tests
pnpm test:e2e         # Run end-to-end tests

# Database
pnpm db:up            # Start Docker services
pnpm db:down          # Stop Docker services
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio GUI
pnpm db:push          # Push schema changes (dev only)

# Code Quality
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm ci               # Run all CI checks locally
```

### Workspace Commands

```bash
# Run command in specific package
pnpm --filter @youbet/web dev
pnpm --filter @youbet/api build

# Add dependency to specific package
pnpm --filter @youbet/web add @tanstack/react-query
```

---

## 🗄️ Database Schema

### Core Models
- **User** - Profile, stats, compliance (age, region)
- **Event** - Sports fixtures/matches
- **Pick** - User predictions with proof (image/link)
- **Reaction** - Likes, fire, celebrate on picks
- **Comment** - Discussion on picks
- **Follow** - Social graph
- **Attribution** - Affiliate tracking
- **Report** - Content moderation

### Key Features
- Tamper-proof picks (locked at event start)
- Automated outcome settlement
- ROI & win-rate calculations
- Geofencing & age verification

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL="postgresql://youbet:youbet_dev@localhost:5432/youbet"

# Redis
REDIS_URL="redis://localhost:6379"

# S3 Storage
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY_ID="youbet"
S3_SECRET_ACCESS_KEY="youbet_dev_key"
S3_BUCKET="youbet-slips"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# API
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## 🧩 API Endpoints

### Core Routes
- `GET /api/v1/health` - Health check
- `GET /api/v1/users/:handle` - Get user profile
- `GET /api/v1/picks` - List picks (paginated)
- `POST /api/v1/picks` - Create pick
- `GET /api/v1/events` - Upcoming events
- `GET /api/v1/feed` - Personalized feed
- `POST /api/v1/uploads/sign` - Get presigned S3 URL

**Full API Docs:** http://localhost:4000/api (Swagger UI)

---

## 🎨 Design System

### Color Palette (Warm Sporting Theme)
- **Primary:** Sunset Amber (`oklch(0.65 0.18 50)`)
- **Secondary:** Golden Yellow (`oklch(0.72 0.18 82)`)
- **Success:** Winning Green (`oklch(0.65 0.18 145)`)
- **Destructive:** Loss Red (`oklch(0.55 0.22 25)`)

### Typography
- **Display:** Nunito (friendly, rounded)
- **Data:** SF Mono (odds, stakes, ROI)

### Accessibility
- ✅ WCAG AA compliant (4.5:1 contrast)
- ✅ Keyboard navigation
- ✅ Screen reader optimized
- ✅ Color-blind safe (icons + labels)

See **[Design Upgrade Spec](docs/design-upgrade.md)** for details.

---

## 🚢 Deployment

### Production Checklist
- [ ] Set up PostgreSQL (Supabase/Neon/RDS)
- [ ] Set up Redis (Upstash/ElastiCache)
- [ ] Set up S3 bucket + CloudFront
- [ ] Configure Clerk production keys
- [ ] Set environment variables in hosting platform
- [ ] Run migrations: `pnpm db:migrate`
- [ ] Deploy API (Railway/Fly.io/ECS)
- [ ] Deploy Web (Vercel/Netlify)
- [ ] Set up Sentry for error tracking
- [ ] Configure monitoring (Grafana/Datadog)

### Suggested Hosting
- **Web:** Vercel (zero-config Next.js)
- **API:** Railway / Fly.io
- **Database:** Supabase / Neon
- **Cache:** Upstash Redis
- **Storage:** AWS S3 + CloudFront

---

## 🛡️ Security & Compliance

### Age Verification
- DOB collected during signup
- Deep-link CTAs hidden if not verified

### Geofencing
- Captured via browser + IP lookup (MaxMind)
- Sportsbook links filtered by region legality

### Content Moderation
- Profanity filter (bad-words)
- User-reported content flagged for review
- Auto-hide "guaranteed win" claims

### Rate Limiting
- Redis-based: 10 picks/hour, 100 API calls/minute

### Data Privacy
- GDPR/CCPA export/delete endpoints
- No PII in logs
- Presigned S3 URLs expire in 7 days

---

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests (Playwright)
```bash
pnpm test:e2e
```

### Test Coverage
```bash
pnpm test:cov
```

---

## 📊 Performance Targets

### Web App (Lighthouse)
- **Performance:** 90+
- **Accessibility:** 100
- **Best Practices:** 100

### API
- **p50 latency:** < 100ms
- **p99 latency:** < 500ms
- **Throughput:** 1000 req/s per instance

---

## 🤝 Contributing

### Git Workflow
1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit with [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(api): add leaderboard endpoint
   fix(web): resolve feed infinite scroll bug
   docs: update README with deployment steps
   ```
3. Push and open PR
4. CI must pass (lint, typecheck, test, build)
5. Require 1+ approvals
6. Squash merge to `main`

### Code Quality
- ESLint + Prettier auto-fix on commit (Husky + lint-staged)
- TypeScript strict mode
- 80%+ test coverage target

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **v0.dev** - Initial UI prototype
- **shadcn/ui** - Component library
- **Prisma** - Database ORM
- **NestJS** - Backend framework
- **Next.js** - React framework

---

## 📞 Support

- **Email:** support@youbet.com
- **Discord:** https://discord.gg/youbet
- **Docs:** https://docs.youbet.com
- **Status:** https://status.youbet.com

---

**Built with ❤️ by the YouBet team**

