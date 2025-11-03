# YouBet Backend - Implementation Guide

**Status:** 🚀 Ready to Implement  
**Date:** November 2, 2025  
**Time to Complete:** ~3-4 weeks

---

## 📦 What's Been Prepared

### ✅ Completed
1. **Database Schema** - Complete Prisma schema with 20+ models
2. **Architecture Document** - Full backend design ($16-350/month cost)
3. **Package Dependencies** - All NestJS packages added
4. **Environment Template** - Configuration variables documented

### 🏗️ Ready to Build
- Authentication system (JWT + OAuth)
- Core API endpoints (Users, Picks, Feed, Messaging)
- WebSocket server (Real-time chat)
- Redis caching layer
- File upload handling
- Background jobs (BullMQ)
- Rate limiting & security

---

## 🚀 Quick Start Implementation

### Step 1: Install Dependencies (5 minutes)

```bash
# From project root
cd /Users/stephen/Downloads/code

# Install all dependencies
pnpm install

# Generate Prisma client
cd packages/database
pnpm exec prisma generate

# Create migration
pnpm exec prisma migrate dev --name init
```

### Step 2: Start Services (2 minutes)

```bash
# Start Docker services (Postgres, Redis, MinIO)
pnpm db:up

# Verify services are running
docker ps
```

### Step 3: Seed Database (1 minute)

```bash
# Seed with sample data
cd packages/database
pnpm exec ts-node seed.ts
```

### Step 4: Start API Server (1 minute)

```bash
# From root
cd apps/api
pnpm dev

# API will be available at http://localhost:3001
```

---

## 📂 Backend File Structure

```
apps/api/src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
│
├── config/                    # Configuration
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── jwt.config.ts
│
├── common/                    # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
│
├── auth/                      # Authentication
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── apple.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
│
├── users/                     # User management
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│
├── picks/                     # Betting picks
│   ├── picks.module.ts
│   ├── picks.controller.ts
│   ├── picks.service.ts
│   └── dto/
│
├── feed/                      # Social feed
│   ├── feed.module.ts
│   ├── feed.controller.ts
│   └── feed.service.ts
│
├── messaging/                 # Chat system
│   ├── messaging.module.ts
│   ├── messaging.gateway.ts  # WebSocket
│   ├── messaging.service.ts
│   ├── conversations.controller.ts
│   └── messages.controller.ts
│
├── contacts/                  # Contact management
│   ├── contacts.module.ts
│   ├── contacts.controller.ts
│   └── contacts.service.ts
│
├── uploads/                   # File storage
│   ├── uploads.module.ts
│   ├── uploads.controller.ts
│   └── uploads.service.ts
│
├── events/                    # Sports events
│   ├── events.module.ts
│   ├── events.controller.ts
│   └── events.service.ts
│
├── leaderboard/              # Rankings
│   ├── leaderboard.module.ts
│   ├── leaderboard.controller.ts
│   └── leaderboard.service.ts
│
├── jobs/                      # Background tasks
│   ├── jobs.module.ts
│   └── processors/
│       ├── pick-lock.processor.ts
│       ├── stats-compute.processor.ts
│       └── feed-fanout.processor.ts
│
└── prisma/                    # Database service
    ├── prisma.module.ts
    └── prisma.service.ts
```

---

## 🔑 Core Implementation Files

### 1. Authentication Module

**File:** `apps/api/src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
    PrismaModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

**Key Features:**
- JWT token generation
- Google OAuth integration
- Apple Sign In
- Phone/OTP verification
- Session management

### 2. Messaging Gateway (WebSocket)

**File:** `apps/api/src/messaging/messaging.gateway.ts`

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: process.env.CORS_ORIGIN },
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // Handle client connection
    // Join user to their conversation rooms
  }

  async handleDisconnect(client: Socket) {
    // Handle client disconnection
    // Update online status
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send-message')
  async handleMessage(client: Socket, payload: any) {
    // Process and broadcast message
  }

  @SubscribeMessage('typing')
  async handleTyping(client: Socket, payload: any) {
    // Broadcast typing indicator
  }

  @SubscribeMessage('read')
  async handleRead(client: Socket, payload: any) {
    // Mark messages as read
  }
}
```

**Key Features:**
- Real-time message delivery
- Typing indicators
- Read receipts
- Online presence
- Room management

### 3. Redis Cache Service

**File:** `apps/api/src/cache/cache.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.redis.zadd(key, score, member);
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.zrevrange(key, start, stop);
  }
}
```

**Use Cases:**
- User session caching
- Feed caching
- Leaderboard storage
- Rate limiting
- Pub/sub for real-time events

---

## 🎯 Implementation Priority

### Week 1: Core Backend
- [x] Database schema
- [x] Package setup
- [ ] Prisma service
- [ ] Auth module (JWT)
- [ ] User CRUD
- [ ] Basic API structure

### Week 2: Social Features
- [ ] Picks CRUD
- [ ] Feed generation
- [ ] Comments & reactions
- [ ] Follow system
- [ ] File uploads (S3)

### Week 3: Messaging
- [ ] WebSocket gateway
- [ ] Message persistence
- [ ] Conversations
- [ ] Contact system
- [ ] Real-time delivery

### Week 4: Polish
- [ ] Background jobs
- [ ] Stats computation
- [ ] Leaderboards
- [ ] Rate limiting
- [ ] Testing
- [ ] Documentation

---

## 🔒 Security Implementation

### JWT Authentication

```typescript
// JWT Strategy
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
```

### Rate Limiting

```typescript
// In main.ts
import { ThrottlerGuard } from '@nestjs/throttler';

app.useGlobalGuards(new ThrottlerGuard());

// Throttler config
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 100,
})
```

### Input Validation

```typescript
// DTO with class-validator
export class CreatePickDto {
  @IsString()
  @MinLength(1)
  market: string;

  @IsNumber()
  @Min(1.01)
  oddsDecimal: number;

  @IsNumber()
  @Min(1)
  stake: number;

  @IsString()
  eventId: string;
}
```

---

## 📊 Performance Optimizations

### 1. Database Queries

```typescript
// ❌ Bad: N+1 query
const picks = await prisma.pick.findMany();
for (const pick of picks) {
  pick.user = await prisma.user.findUnique({ where: { id: pick.userId } });
}

// ✅ Good: Single query with include
const picks = await prisma.pick.findMany({
  include: {
    user: true,
    event: true,
  },
});
```

### 2. Feed Caching

```typescript
async getFeed(userId: string) {
  // Try cache first
  const cached = await this.cache.get(`feed:${userId}`);
  if (cached) return cached;

  // Generate feed
  const feed = await this.generateFeed(userId);

  // Cache for 10 minutes
  await this.cache.set(`feed:${userId}`, feed, 600);

  return feed;
}
```

### 3. Leaderboard Pre-computation

```typescript
@Cron('*/15 * * * *') // Every 15 minutes
async updateLeaderboard() {
  const topUsers = await this.prisma.$queryRaw`
    SELECT user_id, roi, total_picks
    FROM user_stats
    WHERE total_picks >= 10
    ORDER BY roi DESC
    LIMIT 100
  `;

  // Store in Redis sorted set
  for (const user of topUsers) {
    await this.redis.zadd('leaderboard:roi:30d', user.roi, user.user_id);
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should generate JWT token', async () => {
    const user = { id: '123', email: 'test@example.com' };
    const token = await service.generateToken(user);
    expect(token).toBeDefined();
  });
});
```

### E2E Tests

```typescript
describe('Picks (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    // Setup test app
  });

  it('/picks (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/picks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        market: 'Moneyline',
        selection: 'Lakers',
        oddsDecimal: 1.5,
        stake: 100,
        eventId: 'event-123',
      })
      .expect(201);
  });
});
```

---

## 🚀 Deployment

### Docker Compose (Development)

Already configured in `/docker/docker-compose.yml`

### Serverless (Production - Recommended)

**Railway Deployment:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
railway up
```

**Environment Variables:**
- Set all vars from ENV_TEMPLATE.md
- Use Railway's PostgreSQL addon
- Use Upstash Redis
- Use Cloudflare R2 for storage

### Traditional Cloud (Alternative)

**AWS Fargate:**
- Container: NestJS API
- Database: RDS PostgreSQL
- Cache: ElastiCache Redis
- Storage: S3

---

## 💰 Cost Estimates (10K Users)

| Service | Development | Production |
|---------|-------------|------------|
| **Database** | Free (local) | $0-19/mo |
| **Redis** | Free (local) | $10/mo |
| **Storage** | Free (local) | $1-5/mo |
| **API Server** | Free (local) | $20-50/mo |
| **SMS (Twilio)** | Pay as you go | ~$75/mo |
| **Total** | **$0** | **$106-159/mo** |

**Per User:** $0.01/month 🎯

---

## 📖 Next Steps

### Immediate (Do Now)
1. ✅ Review architecture document
2. ✅ Check database schema
3. ⏭️ Install dependencies: `pnpm install`
4. ⏭️ Start Docker services: `pnpm db:up`
5. ⏭️ Run migrations: `pnpm db:migrate`
6. ⏭️ Seed database: `pnpm db:seed`

### Short Term (This Week)
1. Implement auth module
2. Build user endpoints
3. Add JWT guards
4. Test authentication flow

### Medium Term (This Month)
1. Complete all API endpoints
2. Add WebSocket messaging
3. Implement caching
4. Set up background jobs
5. Add comprehensive tests

### Long Term (Next Month)
1. Deploy to production
2. Set up monitoring
3. Add analytics
4. Optimize performance
5. Scale as needed

---

## 🎉 Summary

**What's Ready:**
- ✅ Complete database schema (20+ models)
- ✅ Architecture design ($16-350/month)
- ✅ All dependencies configured
- ✅ Docker services ready
- ✅ Environment template
- ✅ Implementation roadmap

**What to Build:**
- Auth system (JWT + OAuth)
- Core API endpoints
- WebSocket messaging
- Redis caching
- File uploads
- Background jobs
- Tests & docs

**Estimated Timeline:** 3-4 weeks to full MVP

**Ready to start coding!** 🚀

---

## 📚 Helpful Commands

```bash
# Install dependencies
pnpm install

# Start Docker services
pnpm db:up

# Stop Docker services
pnpm db:down

# Generate Prisma client
pnpm db:generate

# Create migration
pnpm db:migrate

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Start API dev server
cd apps/api && pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

**Last Updated:** November 2, 2025  
**Status:** 🟢 Ready for Implementation

