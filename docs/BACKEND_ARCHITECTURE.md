# YouBet Backend Architecture - Critical Analysis & Design

**Date:** November 2, 2025  
**Version:** 1.0.0  
**Focus:** Cost-Effective, Efficient, Scalable

---

## 📊 Frontend Analysis

### Current Frontend Features

#### 1. **Authentication Flow**
- Email + Phone + OTP verification
- Apple Sign-In
- Google Sign-In
- Age verification (18+)
- Location capture
- Permission management

**Backend Needs:**
- OAuth 2.0 integration (Apple, Google)
- OTP generation and verification
- Session management
- JWT token issuance
- User profile storage

#### 2. **Messaging System**
- Direct messages (1-on-1)
- Group chats
- 6 message types (text, image, file, voice, bet slip, analysis)
- Read receipts
- Typing indicators
- Reactions
- Message editing/deletion
- Search functionality
- Contact management

**Backend Needs:**
- Real-time WebSocket server
- Message persistence
- File storage (images, files, voice)
- Full-text search
- Presence tracking
- Message status tracking

#### 3. **Social Features**
- Home feed with posts
- Betting picks with proof
- Comments and reactions
- Follow/unfollow
- User profiles with stats
- Leaderboards (ROI, win rate)

**Backend Needs:**
- Feed generation (fan-out on write)
- Stats computation
- Social graph storage
- Activity feeds
- Ranking algorithms

#### 4. **Betting Features**
- Create picks with proof
- Share betting slips
- Track wins/losses
- ROI calculations
- Analytics dashboard
- Deep links to sportsbooks

**Backend Needs:**
- Pick locking (at event start)
- Outcome settlement
- Statistics aggregation
- External sports data integration
- Affiliate link generation

### Data Flow Analysis

**High-Traffic Endpoints:**
- `GET /feed` - Every user, every session
- `POST /messages` - Real-time, frequent
- `GET /messages/:conversationId` - Very frequent
- `GET /users/:handle` - Moderate
- `GET /leaderboard` - Moderate, cacheable

**Write-Heavy Operations:**
- Message creation
- Reactions/comments
- Pick creation
- Status updates

**Compute-Intensive:**
- Feed generation
- Stats computation
- Leaderboard ranking
- Search indexing

---

## 🎯 Backend Architecture Design

### **Cost-Effective Tech Stack**

#### **Core: NestJS + PostgreSQL + Redis + S3**

**Why This Stack?**
- ✅ **NestJS**: TypeScript, great structure, efficient, good DX
- ✅ **PostgreSQL**: Powerful, free, handles complex queries, JSONB support
- ✅ **Redis**: Fast caching, pub/sub, session storage
- ✅ **S3-compatible**: Cheap file storage (use MinIO locally, S3/R2 in prod)

**Cost Comparison (Monthly for 10K users):**

| Option | Cost | Notes |
|--------|------|-------|
| **Our Stack** (Supabase + Redis Cloud + Cloudflare R2) | **$25-50** | PostgreSQL free tier, Redis $10, R2 $5 |
| Firebase | $100-200 | Gets expensive with reads |
| MongoDB Atlas + AWS | $80-150 | More complex, higher costs |
| Pure AWS (RDS + EC2 + S3) | $150-300 | Full control, higher management |

---

## 🏗️ Detailed Architecture

### 1. **Database Design (PostgreSQL)**

**Why PostgreSQL over MongoDB?**
- ✅ ACID transactions (critical for betting)
- ✅ Complex queries (leaderboards, analytics)
- ✅ JSONB for flexibility where needed
- ✅ Full-text search built-in
- ✅ Better cost at scale
- ✅ Row-level security

**Schema Strategy:**
```
Users & Auth
├── users (core user data)
├── auth_providers (OAuth links)
└── sessions (JWT blacklist)

Social Graph
├── follows
├── blocks
└── mutes

Betting
├── events (sports events)
├── picks (user predictions)
├── pick_proof (images/links)
└── pick_outcomes (results)

Messaging
├── conversations
├── conversation_members
├── messages
├── message_reactions
└── message_read_receipts

Content
├── posts
├── comments
├── reactions
└── media

Stats & Leaderboards
├── user_stats (materialized)
├── daily_stats (time-series)
└── leaderboard_cache (pre-computed)
```

**Optimization Strategies:**
- **Partitioning**: Messages by date (monthly partitions)
- **Indexes**: Strategic on query patterns
- **Materialized Views**: For complex stats
- **JSONB**: For flexible data (message metadata)

### 2. **Caching Layer (Redis)**

**Cache Strategy:**

```
Hot Data (Redis)
├── User sessions (1h TTL)
├── Online presence (5min TTL)
├── Feed cache (10min TTL)
├── Leaderboards (1h TTL)
├── User profiles (30min TTL)
└── Conversation lists (5min TTL)

Rate Limiting
├── API rate limits (per user/IP)
├── Message rate limits
└── OTP attempts

Pub/Sub
├── Typing indicators
├── Online status
└── New message notifications
```

**Cache Invalidation:**
- Write-through for critical data
- TTL-based for reads
- Event-driven for updates

**Memory Estimates:**
- 10K active users = ~500MB
- Message cache = ~200MB
- Feed cache = ~300MB
- **Total: ~1GB Redis** (Redis Cloud free tier!)

### 3. **File Storage (S3-compatible)**

**Storage Strategy:**

```
Buckets
├── profile-images/
│   ├── originals/
│   └── thumbnails/ (auto-generated)
├── betting-slips/
│   └── {userId}/{pickId}/proof.{ext}
├── chat-media/
│   ├── images/
│   ├── files/
│   └── voice/
└── temp-uploads/
    └── (24h auto-delete)
```

**Cost Optimization:**
- **Cloudflare R2**: $0.015/GB storage, FREE egress (huge saving!)
- **Image optimization**: Compress on upload
- **CDN**: Cloudflare (free tier)
- **Lifecycle policies**: Delete temp files

**Estimates:**
- 10K users, 5 images each = 50K images × 500KB = 25GB
- 1K picks/day × 1MB = 30GB/month
- **Total: ~55GB = $0.83/month on R2!**

### 4. **Real-Time (WebSocket)**

**Socket.IO Architecture:**

```
WebSocket Server (Socket.IO)
├── Namespace: /chat
│   ├── Room: conversation-{id}
│   ├── Events: message, typing, read
│   └── Presence: join/leave
├── Namespace: /presence
│   ├── Room: global
│   └── Events: online, offline
└── Namespace: /notifications
    └── Events: new-follower, new-comment
```

**Scaling Strategy:**
- **Redis Adapter**: Share state across instances
- **Sticky Sessions**: Route user to same server
- **Horizontal Scaling**: Add more socket servers

**Performance:**
- 10K concurrent users = 2-3 servers (4GB RAM each)
- Average message: 1KB
- 100 messages/sec = 100KB/sec (manageable)

### 5. **Background Jobs (BullMQ)**

**Job Queues:**

```
Critical (High Priority)
├── otp-send (immediate)
├── email-verification (1min)
└── password-reset (immediate)

Standard
├── pick-lock (at event start)
├── outcome-settlement (on event end)
├── stats-computation (hourly)
└── feed-fanout (async)

Low Priority
├── leaderboard-update (every 15min)
├── analytics-aggregation (daily)
└── old-data-archive (weekly)
```

**Job Scheduling:**
```typescript
// Pick locking
queue.add('lock-pick', 
  { pickId, eventId }, 
  { delay: calculateDelay(eventStartTime) }
)

// Stats computation
queue.add('compute-stats', 
  { userId }, 
  { repeat: { cron: '0 * * * *' } } // Hourly
)
```

---

## 🔒 Security & Compliance

### Authentication Strategy

**Multi-Provider Auth:**
```typescript
// Unified auth flow
POST /auth/register
  ├── email/phone + OTP
  ├── OAuth (Google/Apple)
  └── → Returns JWT

POST /auth/verify-otp
  └── → Returns JWT

GET /auth/oauth/google
  └── Redirect to Google

GET /auth/oauth/google/callback
  └── Exchange code → JWT
```

**JWT Strategy:**
```typescript
{
  accessToken: {
    payload: { userId, role, permissions },
    expiry: 15min
  },
  refreshToken: {
    payload: { userId, sessionId },
    expiry: 7days,
    stored: true // In database
  }
}
```

**Why Short-Lived Access Tokens?**
- Better security
- Force refresh = check banned users
- Minimal overhead with refresh tokens

### Rate Limiting

```typescript
// API Rate Limits
{
  anonymous: 10 req/min,
  authenticated: 100 req/min,
  premium: 500 req/min
}

// Specific Endpoints
{
  'POST /auth/otp': 3 req/hour,
  'POST /messages': 20 req/min,
  'POST /picks': 10 req/hour,
  'GET /feed': 30 req/min
}
```

### Data Protection

**PII Handling:**
- Encrypt phone numbers at rest
- Hash passwords (bcrypt, 12 rounds)
- Minimal data collection
- User data export API
- Right to deletion

**Betting Slip Proof:**
- EXIF strip on upload
- Virus scan (ClamAV)
- SHA-256 hash for tamper detection
- Immutable after event start

### Age & Geo Compliance

```typescript
// Middleware
async function checkCompliance(req, res, next) {
  const user = req.user
  const geoip = await getGeoIP(req.ip)
  
  if (!user.ageVerified || user.age < 18) {
    throw new ForbiddenError('Age verification required')
  }
  
  if (RESTRICTED_REGIONS.includes(geoip.region)) {
    throw new ForbiddenError('Service not available in your region')
  }
  
  next()
}
```

---

## 📈 Performance Optimization

### Database Optimization

**Indexes:**
```sql
-- Frequently queried
CREATE INDEX idx_picks_user_created ON picks(user_id, created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_follows_follower ON follows(follower_id, created_at);

-- Full-text search
CREATE INDEX idx_users_search ON users USING GIN(to_tsvector('english', name || ' ' || bio));
CREATE INDEX idx_messages_search ON messages USING GIN(to_tsvector('english', content));

-- Composite for leaderboard
CREATE INDEX idx_user_stats_roi ON user_stats(roi DESC, total_picks) WHERE total_picks >= 10;
```

**Query Optimization:**
```sql
-- ❌ BAD: N+1 queries
SELECT * FROM picks;
for (pick of picks) {
  SELECT * FROM users WHERE id = pick.user_id;
}

-- ✅ GOOD: Join
SELECT picks.*, users.* 
FROM picks 
JOIN users ON picks.user_id = users.id;

-- ✅ BETTER: Materialized view
CREATE MATERIALIZED VIEW picks_with_users AS
SELECT picks.*, users.name, users.avatar
FROM picks JOIN users ON picks.user_id = users.id;
```

### Feed Generation Strategy

**Fan-Out on Write (Hybrid):**

```typescript
// When user creates post
async function createPost(userId, content) {
  const post = await db.posts.create({ userId, content })
  
  // Get followers
  const followers = await getFollowers(userId)
  
  if (followers.length < 1000) {
    // Fan-out on write (immediate)
    await Promise.all(
      followers.map(followerId => 
        redis.zadd(`feed:${followerId}`, Date.now(), post.id)
      )
    )
  } else {
    // Fan-out on read (lazy)
    // Influencer with many followers
    await queue.add('fan-out-large', { userId, postId })
  }
}

// When user requests feed
async function getFeed(userId) {
  // Get from cache
  let feed = await redis.zrevrange(`feed:${userId}`, 0, 20)
  
  if (!feed.length) {
    // Rebuild from database
    feed = await db.query(`
      SELECT posts.* FROM posts
      JOIN follows ON posts.user_id = follows.followee_id
      WHERE follows.follower_id = $1
      ORDER BY posts.created_at DESC
      LIMIT 20
    `, [userId])
    
    // Cache it
    await cacheFeed(userId, feed)
  }
  
  return feed
}
```

**Cost Analysis:**
- Write: O(n) where n = followers (acceptable for most users)
- Read: O(1) from cache (very fast)
- Storage: ~1KB per user feed in Redis

### Leaderboard Strategy

**Pre-computed Rankings:**

```typescript
// Background job (every 15 minutes)
async function updateLeaderboard() {
  const topUsers = await db.query(`
    SELECT 
      user_id,
      COUNT(*) as total_picks,
      SUM(CASE WHEN outcome = 'win' THEN 1 ELSE 0 END) as wins,
      SUM(profit) as total_profit,
      (SUM(profit) / SUM(stake)) * 100 as roi,
      ROW_NUMBER() OVER (ORDER BY (SUM(profit) / SUM(stake)) DESC) as rank
    FROM picks
    WHERE outcome IS NOT NULL
      AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY user_id
    HAVING COUNT(*) >= 10
    ORDER BY roi DESC
    LIMIT 100
  `)
  
  // Cache in Redis (sorted set)
  await redis.del('leaderboard:roi:30d')
  for (const user of topUsers) {
    await redis.zadd('leaderboard:roi:30d', user.roi, user.user_id)
  }
}

// API endpoint (instant)
async function getLeaderboard(metric, timeframe) {
  return redis.zrevrange(`leaderboard:${metric}:${timeframe}`, 0, 99, 'WITHSCORES')
}
```

---

## 🚀 API Design

### RESTful Endpoints

```typescript
// Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/otp/send
POST   /api/v1/auth/otp/verify
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/oauth/:provider
GET    /api/v1/auth/oauth/:provider/callback

// Users
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/:handle
GET    /api/v1/users/:handle/picks
GET    /api/v1/users/:handle/stats
POST   /api/v1/users/:id/follow
DELETE /api/v1/users/:id/follow

// Picks
GET    /api/v1/picks
POST   /api/v1/picks
GET    /api/v1/picks/:id
PATCH  /api/v1/picks/:id
DELETE /api/v1/picks/:id
POST   /api/v1/picks/:id/react
POST   /api/v1/picks/:id/comment

// Feed
GET    /api/v1/feed
GET    /api/v1/feed/following
GET    /api/v1/feed/trending

// Conversations
GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:id
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
PATCH  /api/v1/messages/:id
DELETE /api/v1/messages/:id
POST   /api/v1/messages/:id/react

// Contacts
GET    /api/v1/contacts
POST   /api/v1/contacts/request
PUT    /api/v1/contacts/:id/accept
DELETE /api/v1/contacts/:id

// Leaderboard
GET    /api/v1/leaderboard?metric=roi&timeframe=30d

// Analytics
GET    /api/v1/analytics/me

// Sports Data
GET    /api/v1/events?sport=nba&date=2025-11-02
GET    /api/v1/events/:id

// Uploads
POST   /api/v1/uploads/presigned
POST   /api/v1/uploads/confirm

// Deep Links
POST   /api/v1/deeplinks/generate
```

### Response Format

```typescript
// Success
{
  success: true,
  data: { ... },
  meta: {
    pagination: { page, limit, total },
    timestamp: "2025-11-02T12:00:00Z"
  }
}

// Error
{
  success: false,
  error: {
    code: "INVALID_INPUT",
    message: "Email is required",
    details: { field: "email" }
  }
}
```

---

## 💰 Cost Breakdown (10K Active Users)

### Infrastructure Costs

**Option 1: Serverless (Recommended for Start)**
```
Supabase (PostgreSQL)      : Free tier (up to 500MB)
Upstash Redis              : $10/month (1GB)
Cloudflare R2 (Storage)    : $1/month (60GB)
Cloudflare Workers (API)   : $5/month
Cloudflare Pages (Frontend): Free
Total: $16/month
```

**Option 2: Container-Based (Scale Phase)**
```
Railway (NestJS + Workers) : $20/month (4GB RAM)
Neon PostgreSQL            : Free → $19/month (Pro)
Upstash Redis              : $10/month
Cloudflare R2              : $5/month (200GB)
Total: $54/month
```

**Option 3: Full Cloud (Growth Phase)**
```
AWS Fargate (2 containers) : $50/month
RDS PostgreSQL (t3.micro)  : $15/month
ElastiCache Redis          : $15/month
S3 + CloudFront            : $10/month
Total: $90/month
```

### External Services

```
Twilio (OTP SMS)           : $0.0075/SMS = $75/month (10K OTPs)
SendGrid (Emails)          : Free (100/day) → $15/month
Sports Data API            : $50-200/month
Sentry (Monitoring)        : Free → $26/month
Total: $140-316/month
```

### **Grand Total**

| Phase | Users | Monthly Cost |
|-------|-------|--------------|
| MVP (Serverless) | 0-10K | **$150-350** |
| Scale (Containers) | 10K-100K | **$200-500** |
| Growth (Cloud) | 100K+ | **$500-2K** |

**Per User Cost:** $0.015-0.035/month 🎯

---

## 📊 Capacity Planning

### Performance Targets

```
API Response Time
├── p50: < 100ms
├── p95: < 500ms
└── p99: < 1000ms

Database
├── Connection pool: 20-50
├── Query time p95: < 50ms
└── Concurrent queries: 100+

WebSocket
├── Concurrent connections: 10K
├── Message latency: < 50ms
└── Messages/sec: 1K+

Cache Hit Rate
├── User profiles: > 90%
├── Feed: > 80%
└── Leaderboards: > 95%
```

### Scaling Triggers

```typescript
// Auto-scale rules
{
  api: {
    trigger: 'cpu > 70% for 5min',
    action: 'add 1 instance',
    max: 5
  },
  database: {
    trigger: 'connections > 80%',
    action: 'increase pool size',
    alert: 'consider read replicas'
  },
  redis: {
    trigger: 'memory > 80%',
    action: 'upgrade tier',
    alert: 'review cache TTLs'
  }
}
```

---

## 🎯 Implementation Phases

### Phase 1: Core Backend (Week 1-2)
- [x] Database schema & migrations
- [ ] Auth system (JWT + OAuth)
- [ ] User management
- [ ] Basic API structure
- [ ] Rate limiting

### Phase 2: Social Features (Week 3-4)
- [ ] Picks CRUD
- [ ] Feed generation
- [ ] Comments & reactions
- [ ] Follow system
- [ ] File uploads

### Phase 3: Messaging (Week 5-6)
- [ ] WebSocket server
- [ ] Message persistence
- [ ] Real-time delivery
- [ ] Read receipts
- [ ] Media handling

### Phase 4: Analytics (Week 7)
- [ ] Stats computation
- [ ] Leaderboards
- [ ] Dashboard data
- [ ] Background jobs

### Phase 5: Polish (Week 8)
- [ ] Testing
- [ ] Documentation
- [ ] Monitoring
- [ ] Deployment

---

## 🎉 Summary

### Key Decisions

1. **PostgreSQL over MongoDB**
   - Better for complex queries
   - ACID transactions
   - Lower cost at scale

2. **Redis for Caching**
   - Essential for performance
   - Pub/sub for real-time
   - Session storage

3. **Cloudflare R2 over S3**
   - Free egress (huge saving)
   - Same S3 API
   - Better pricing

4. **NestJS over Express**
   - Better structure
   - TypeScript native
   - Built-in features

5. **Serverless Start**
   - Minimal cost
   - Fast deployment
   - Easy scaling

### Expected Performance

- **API:** < 100ms p50
- **Messages:** < 50ms delivery
- **Feed Load:** < 200ms
- **Cost:** $0.015/user/month

### Next Steps

1. Implement database schema
2. Build authentication
3. Create core APIs
4. Add WebSocket
5. Deploy to serverless

---

**Ready to implement!** 🚀


