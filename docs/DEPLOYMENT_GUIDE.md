# 🚀 YouBet - Deployment Guide

Complete guide for deploying YouBet to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Deployment Options](#deployment-options)
   - [Option A: Vercel + Railway (Recommended)](#option-a-vercel--railway-recommended)
   - [Option B: Docker Compose](#option-b-docker-compose)
   - [Option C: AWS/GCP/Azure](#option-c-awsgcpazure)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

- Node.js 20+ and pnpm 8+
- Docker and Docker Compose (for local development)
- Git
- PostgreSQL 14+ (production)
- Redis 7+ (production)
- S3-compatible storage (MinIO, AWS S3, etc.)

---

## Local Development Setup

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/yourusername/youbet.git
cd youbet

# Install dependencies
pnpm install

# Copy environment file
cp env.example .env
```

### 2. Start Services

```bash
# Start PostgreSQL, Redis, MinIO
docker-compose up -d

# Wait for services to be healthy
docker-compose ps
```

### 3. Database Migration

```bash
# Generate Prisma client
cd packages/database
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed database (optional)
pnpm prisma db seed
```

### 4. Start Development Servers

```bash
# Start API (Terminal 1)
cd apps/api
pnpm dev

# Start Web App (Terminal 2)
cd apps/web
pnpm dev
```

**Open:** http://localhost:3000

---

## Environment Configuration

### Required Environment Variables

#### Frontend (.env in apps/web)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

#### Backend (.env in apps/api)
```bash
# Database
DATABASE_URL=postgresql://youbet:youbet_password@localhost:5432/youbet_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m

# Port
PORT=3001
```

### Optional Services

```bash
# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+15551234567

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# Sentry
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## Database Setup

### Prisma Migrations

```bash
cd packages/database

# Create new migration
pnpm prisma migrate dev --name init

# Deploy to production
pnpm prisma migrate deploy

# Reset database (WARNING: Deletes all data)
pnpm prisma migrate reset
```

### Seed Data

```bash
# Run seed script
pnpm prisma db seed
```

---

## Deployment Options

## Option A: Vercel + Railway (Recommended)

**Best for:** Quick deployment, automatic scaling, minimal ops

### Step 1: Deploy Database & Redis (Railway)

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Add Redis service
5. Copy connection strings

### Step 2: Deploy API (Railway)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy API
cd apps/api
railway up
```

**Set Environment Variables in Railway:**
- `DATABASE_URL` (from PostgreSQL service)
- `REDIS_HOST` (from Redis service)
- `JWT_SECRET` (generate secure key)
- `PORT=3001`

### Step 3: Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel

# Set production environment variables
vercel env add NEXT_PUBLIC_API_URL
# Enter your Railway API URL
```

**Configure in Vercel Dashboard:**
- Build Command: `cd ../.. && pnpm build --filter=@youbet/web`
- Output Directory: `.next`
- Install Command: `pnpm install`

### Step 4: Configure Custom Domain

1. In Vercel: Settings → Domains → Add youbet.app
2. In Railway: Settings → Domain → Add api.youbet.app
3. Update environment variables with production URLs

---

## Option B: Docker Compose

**Best for:** Self-hosting, full control

### 1. Create Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://youbet:${DB_PASSWORD}@postgres:5432/youbet_db
      - REDIS_HOST=redis
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.youbet.app
    depends_on:
      - api

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api

volumes:
  pgdata:
  redisdata:
```

### 2. Deploy

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Option C: AWS/GCP/Azure

**Best for:** Enterprise, compliance requirements

### AWS Architecture

```
[CloudFront] → [ALB]
                ├─ [ECS: Web App]
                └─ [ECS: API]
                    ├─ [RDS PostgreSQL]
                    ├─ [ElastiCache Redis]
                    └─ [S3]
```

### Deploy with AWS CDK

```bash
cd infrastructure/aws
npm install
cdk deploy
```

### Required AWS Services

1. **ECS Fargate** - Container hosting
2. **RDS PostgreSQL** - Database
3. **ElastiCache** - Redis
4. **ALB** - Load balancer
5. **CloudFront** - CDN
6. **S3** - File storage
7. **Route53** - DNS
8. **ACM** - SSL certificates

---

## Post-Deployment

### 1. Database Migration

```bash
# SSH into API container or use Railway/Vercel CLI
pnpm prisma migrate deploy
```

### 2. Health Checks

```bash
# API Health
curl https://api.youbet.app/health

# Database connection
curl https://api.youbet.app/health/db

# Redis connection
curl https://api.youbet.app/health/redis
```

### 3. Smoke Tests

```bash
# Send OTP
curl -X POST https://api.youbet.app/auth/phone/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+15551234567"}'

# Get feed
curl https://api.youbet.app/feed
```

### 4. Configure DNS

```
youbet.app          → Vercel (Web)
api.youbet.app      → Railway/ECS (API)
cdn.youbet.app      → CloudFront/CDN (Assets)
ws.youbet.app       → Railway/ECS (WebSocket)
```

---

## Monitoring & Maintenance

### 1. Set Up Sentry

```bash
# Install Sentry
pnpm add @sentry/nextjs @sentry/node

# Configure in apps/web/sentry.config.js and apps/api/main.ts
```

### 2. Enable Logging

```bash
# Use Pino for structured logs
pnpm add pino pino-pretty

# Configure log aggregation (DataDog, LogRocket, etc.)
```

### 3. Performance Monitoring

- **Vercel Analytics** - Frontend performance
- **Railway Metrics** - API performance
- **Prisma Pulse** - Database query monitoring

### 4. Backup Strategy

```bash
# Automated PostgreSQL backups (Railway)
railway backup create

# Or use pg_dump
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_*.sql s3://youbet-backups/
```

### 5. Scaling

#### Horizontal Scaling
```bash
# Railway: Increase replicas in dashboard
# Vercel: Auto-scales

# Or with Docker Compose
docker-compose up --scale api=3 --scale web=2
```

#### Vertical Scaling
```bash
# Railway: Upgrade plan
# Docker: Update resource limits
```

---

## CI/CD with GitHub Actions

### Workflow (.github/workflows/deploy.yml)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - uses: railway/action@v1
        with:
          service: api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build --filter=@youbet/web
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check migrations
pnpm prisma migrate status
```

### API Not Starting

```bash
# Check logs
railway logs -s api
# or
docker logs youbet-api

# Common issues:
# - Missing environment variables
# - Database not migrated
# - Redis not connected
```

### Build Failures

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate secure JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable API authentication
- [ ] Configure CSP headers
- [ ] Set up DDoS protection
- [ ] Regular dependency updates
- [ ] Database backups enabled

---

## Cost Estimate (Monthly)

### Starter (Vercel + Railway Free Tier)
- Frontend: $0 (Vercel Hobby)
- API: $5 (Railway Starter)
- Database: $5 (Railway Postgres)
- Redis: $5 (Railway Redis)
- **Total: ~$15/month**

### Production (Vercel Pro + Railway Team)
- Frontend: $20 (Vercel Pro)
- API: $20 (Railway Professional)
- Database: $25 (Railway Postgres Pro)
- Redis: $15 (Railway Redis)
- S3/CloudFront: $10
- **Total: ~$90/month**

### Enterprise (AWS)
- ECS Fargate: $50+
- RDS: $100+
- ElastiCache: $50+
- ALB: $20+
- S3/CloudFront: $50+
- **Total: ~$270+/month**

---

## Support

- **Documentation**: [docs.youbet.app](https://docs.youbet.app)
- **GitHub Issues**: [github.com/yourusername/youbet/issues](https://github.com/yourusername/youbet/issues)
- **Discord**: [discord.gg/youbet](https://discord.gg/youbet)

---

**Last Updated:** November 2025
**Version:** 1.0.0

