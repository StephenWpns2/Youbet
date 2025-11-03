# 🤝 User Connection System - Design & Implementation Plan

## 📋 Analysis: Best Approach for YouBet

### Option Comparison

| Feature | Follow Model (Twitter/Instagram) | Friend Request Model (Facebook) | Invite System |
|---------|----------------------------------|----------------------------------|---------------|
| **Friction** | Low - one-click | Medium - requires acceptance | High - needs external contact |
| **Privacy** | Public by default | Controlled | Very controlled |
| **UX Speed** | Instant | Delayed | Very delayed |
| **Use Case Fit** | ✅ Perfect for discovery | ⚠️ Too private for betting community | ❌ Too slow |
| **Social Proof** | Strong (follower count) | Weak (friends hidden) | None |
| **Spam Risk** | Medium | Low | Very low |

---

## 🎯 Recommended Approach: **Hybrid Follow + Privacy Model**

### Why This Works Best for YouBet:

1. **Social Discovery** - Users want to find and follow winning bettors
2. **Public Credibility** - Followers = social proof of expertise
3. **Privacy Control** - Private accounts option for cautious users
4. **Low Friction** - One-click follow like Twitter/Instagram
5. **Asymmetric** - You can follow without being followed back

---

## 🏗️ System Design

### Core Concepts

#### 1. **Follow System (Primary)**
```
User A clicks "Follow" on User B
↓
- If User B is PUBLIC → Follow immediately ✅
- If User B is PRIVATE → Send follow request (pending) ⏳
- User B gets notification
- User B can Accept/Reject
```

#### 2. **Account Types**
- **Public** (default): Anyone can follow, see picks
- **Private**: Requires approval to follow and see picks
- Users can toggle in settings

#### 3. **Connection States**
```typescript
enum ConnectionStatus {
  NOT_FOLLOWING = "not_following"      // No connection
  FOLLOWING = "following"              // User A follows User B
  PENDING = "pending"                  // Waiting for approval (private account)
  BLOCKED = "blocked"                  // User B blocked User A
}
```

---

## 🎨 User Flows

### Flow 1: Follow Public User
```
1. User discovers profile (search, leaderboard, feed)
2. Clicks "Follow" button
3. Button changes to "Following" ✅
4. User B gets notification: "John Doe started following you"
5. User A now sees User B's picks in their feed
6. User B's follower count increases
```

### Flow 2: Request to Follow Private User
```
1. User A clicks "Follow" on private profile
2. Button changes to "Requested" ⏳
3. User B gets notification: "John Doe requested to follow you"
4. User B opens notification → [Accept] [Reject]
5a. If Accept: User A sees picks, button → "Following"
5b. If Reject: Request removed, User A can't see picks
```

### Flow 3: Unfollow
```
1. User A clicks "Following" button
2. Confirmation: "Unfollow [Username]?" → [Yes] [No]
3. Connection removed
4. User A no longer sees User B's picks in feed
5. User B's follower count decreases
```

### Flow 4: Remove Follower (Private accounts)
```
1. User B (private account) opens Followers list
2. Clicks "Remove" on User A
3. User A no longer follows User B
4. User A needs to request again to follow
```

### Flow 5: Block User
```
1. User B opens User A's profile
2. Clicks menu → "Block User"
3. User A can't follow, see picks, or interact
4. Existing follow removed
5. User A doesn't see User B in search/discovery
```

---

## 💾 Database Schema

### Tables Needed

```prisma
// Already exists in schema.prisma
model Follow {
  id          String   @id @default(cuid())
  follower    User     @relation("Follower", fields: [followerId], references: [id])
  followerId  String
  following   User     @relation("Following", fields: [followingId], references: [id])
  followingId String
  status      FollowStatus @default(FOLLOWING)
  createdAt   DateTime @default(now())
  
  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
  @@index([status])
  @@map("follows")
}

enum FollowStatus {
  FOLLOWING   // Active follow
  PENDING     // Waiting for approval (private account)
  BLOCKED     // User blocked the follower
}

model User {
  // ... existing fields ...
  isPrivate      Boolean  @default(false)  // Private account toggle
  followerCount  Int      @default(0)      // Cached count
  followingCount Int      @default(0)      // Cached count
  
  followers      Follow[] @relation("Following")
  following      Follow[] @relation("Follower")
}

model Notification {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  type       NotificationType
  title      String
  message    String
  actionUrl  String?   // Link to profile/request
  isRead     Boolean  @default(false)
  createdAt  DateTime @default(now())
  
  // For follow requests
  fromUserId String?
  fromUser   User?    @relation("NotificationFrom", fields: [fromUserId], references: [id])
  
  @@index([userId, isRead])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  NEW_FOLLOWER
  FOLLOW_REQUEST
  FOLLOW_ACCEPTED
  PICK_LIKED
  PICK_COMMENTED
  MENTION
}
```

---

## 🎯 UI Components

### 1. Follow Button (Smart Component)
```tsx
<FollowButton 
  targetUser={user}
  currentUserId={currentUser.id}
/>

States:
- "Follow" (default)
- "Requested" (pending approval)
- "Following" (active)
- "Follow Back" (they follow you)
- "Blocked" (can't follow)
```

### 2. Followers/Following Lists
```
Profile → [123 Followers] [45 Following]
        ↓
Opens modal with searchable list:
- Avatar + Name + Username
- Follow status indicator
- Quick follow/unfollow button
- "Remove" option (for your followers)
```

### 3. Notification Center
```
Bell icon (top-right) with badge count
        ↓
Dropdown/Page showing:
- New followers
- Follow requests (if private)
- Accepted requests
- Likes, comments, etc.
```

### 4. Privacy Settings
```
Profile → Settings → Privacy
        ↓
[Toggle] Private Account
         When on: "People must request to follow you"
         
[Toggle] Hide Follower Count
[Toggle] Hide Following Count
```

---

## 🚀 Implementation Steps

### Phase 1: Basic Follow System (Core)
1. ✅ Update Prisma schema (Follow model exists)
2. Create Follow/Unfollow API endpoints
3. Implement FollowButton component
4. Add follower/following counts to profiles
5. Update feed to show followed users' picks

### Phase 2: Private Accounts
1. Add `isPrivate` field to User model
2. Implement follow request flow
3. Add Accept/Reject actions
4. Create pending requests UI

### Phase 3: Notifications
1. Create Notification model
2. Real-time notifications (WebSocket)
3. Notification center UI
4. In-app + push notifications

### Phase 4: Discovery & Social Features
1. Suggested users to follow
2. Follower/Following lists
3. Mutual followers indicator
4. "Follow Back" suggestions

### Phase 5: Privacy & Safety
1. Block/Unblock functionality
2. Remove followers (private accounts)
3. Report system
4. Privacy settings

---

## 🎨 Mockups

### Profile Header with Follow Button
```
┌─────────────────────────────────────────┐
│  ← Back                          [⋯]    │
├─────────────────────────────────────────┤
│           [Avatar: MJ]                  │
│         Mike Johnson                     │
│         @mikejohnson                     │
│                                          │
│   [Follow] or [Following ✓]             │
│                                          │
│   123 Followers • 45 Following           │
│   ROI: +23.5% • Win Rate: 62%           │
└─────────────────────────────────────────┘
```

### Notification Center
```
┌─────────────────────────────────────────┐
│  🔔 Notifications            [Mark all] │
├─────────────────────────────────────────┤
│  👤 Sarah Chen started following you    │
│     2 minutes ago                        │
├─────────────────────────────────────────┤
│  📩 Alex Rivera requested to follow     │
│     [Accept] [Reject]     5 min ago     │
├─────────────────────────────────────────┤
│  ❤️  John liked your pick "Lakers +150" │
│     1 hour ago                           │
└─────────────────────────────────────────┘
```

### Followers List
```
┌─────────────────────────────────────────┐
│  Followers (123)            [×]          │
│  [Search followers...]                   │
├─────────────────────────────────────────┤
│  👤 Sarah Chen                           │
│     @sarahc • Follows you back           │
│     [Following ✓]                        │
├─────────────────────────────────────────┤
│  👤 Alex Rivera                          │
│     @alexr • ROI: +31%                   │
│     [Follow]                             │
└─────────────────────────────────────────┘
```

---

## 🎯 Next Steps

**Should we implement?**

1. ✅ **Recommended**: Start with Phase 1 (Basic Follow System)
   - Simple, fast, works like Twitter/Instagram
   - Users can discover and follow winners immediately
   - Build on this foundation later

2. 🔄 **Optional**: Add Phase 2 (Private Accounts) later
   - Only if users request more privacy
   - Can be added without breaking existing follows

3. 🚀 **Essential**: Phase 3 (Notifications) ASAP
   - Critical for engagement
   - Real-time updates drive user retention

---

## ✅ My Recommendation

**Start with: Public Follow System (like Twitter)**

**Why:**
- ✅ Fastest to implement
- ✅ Best for discovery and social proof
- ✅ Matches betting community culture (transparency)
- ✅ Easy to add privacy features later
- ✅ Low friction = higher engagement

**Implementation Order:**
1. FollowButton component
2. Follow/Unfollow API
3. Update feed algorithm
4. Follower/Following counts
5. Notifications (basic)
6. Follower/Following lists
7. Private accounts (later)

---

**Ready to implement Phase 1?** Let me know and I'll start building! 🚀

