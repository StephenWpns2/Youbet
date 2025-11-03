# 📱 Contact Management System - Design & Implementation

## 🎯 Overview

A phone-based contact system where users can add others by phone number. When added, the contact receives an invitation notification to approve the connection.

---

## 🔍 System Analysis

### Key Requirements

1. **Phone-Based Discovery** - Add users by phone number
2. **Invitation System** - Invitees must approve before appearing in contacts
3. **In-App Notifications** - All approvals happen within the app
4. **Signup Flow Integration** - Non-users can sign up to approve
5. **Two-Way Approval** - Both parties must consent to connection

### User Flows

#### Flow 1: Add Contact (User Exists)
```
1. User A enters phone number: "+1 (555) 123-4567"
2. System finds User B with that number
3. System sends invitation notification to User B
4. User B receives notification: "John Doe wants to add you as a contact"
5. User B clicks notification → Opens approval screen
6. User B clicks [Approve] or [Decline]
7a. If Approve: Both users now see each other in contacts
7b. If Decline: Request removed, User A notified
```

#### Flow 2: Add Contact (User Doesn't Exist)
```
1. User A enters phone number: "+1 (555) 999-8888"
2. System doesn't find user with that number
3. System creates pending invitation
4. System sends SMS: "John Doe invited you to YouBet! Tap to join: [link]"
5. User B clicks link → Signs up with that phone number
6. After signup, User B sees pending invitation
7. User B approves → Connection established
```

#### Flow 3: Manage Contacts
```
1. User opens Contacts screen
2. Sees tabs: [Contacts] [Pending] [Invitations]
3. Contacts: List of approved connections
4. Pending: Invitations sent waiting for response
5. Invitations: Requests received from others
```

---

## 💾 Database Schema

### Enhanced Schema

```prisma
model User {
  id                String   @id @default(cuid())
  name              String
  email             String   @unique
  phone             String   @unique    // Required for contact system
  phoneVerified     Boolean  @default(false)
  
  // Contacts
  contactsInitiated ContactRequest[] @relation("ContactInitiator")
  contactsReceived  ContactRequest[] @relation("ContactRecipient")
  contacts          Contact[] @relation("UserContacts")
  contactOf         Contact[] @relation("ContactOfUser")
}

model ContactRequest {
  id           String        @id @default(cuid())
  from         User          @relation("ContactInitiator", fields: [fromId], references: [id])
  fromId       String
  toPhone      String        // Phone number (may not be registered yet)
  toUser       User?         @relation("ContactRecipient", fields: [toUserId], references: [id])
  toUserId     String?       // Null if user hasn't signed up yet
  
  status       ContactStatus @default(PENDING)
  message      String?       // Optional message from sender
  
  createdAt    DateTime      @default(now())
  respondedAt  DateTime?
  expiresAt    DateTime      // Expires after 30 days
  
  @@unique([fromId, toPhone])
  @@index([toPhone])
  @@index([toUserId, status])
  @@index([status, expiresAt])
  @@map("contact_requests")
}

enum ContactStatus {
  PENDING      // Waiting for response
  APPROVED     // Accepted
  DECLINED     // Rejected
  EXPIRED      // Request expired
}

model Contact {
  id         String   @id @default(cuid())
  user       User     @relation("UserContacts", fields: [userId], references: [id])
  userId     String
  contact    User     @relation("ContactOfUser", fields: [contactId], references: [id])
  contactId  String
  
  nickname   String?  // Custom name for contact
  isFavorite Boolean  @default(false)
  isBlocked  Boolean  @default(false)
  
  createdAt  DateTime @default(now())
  
  @@unique([userId, contactId])
  @@index([userId])
  @@index([contactId])
  @@map("contacts")
}

model Notification {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  
  type       NotificationType
  title      String
  message    String
  actionUrl  String?
  
  // For contact requests
  requestId  String?
  fromUserId String?
  
  isRead     Boolean  @default(false)
  createdAt  DateTime @default(now())
  
  @@index([userId, isRead])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  CONTACT_REQUEST
  CONTACT_APPROVED
  CONTACT_DECLINED
  NEW_FOLLOWER
  PICK_LIKED
  // ... other types
}
```

---

## 🎨 UI Components

### 1. Add Contact Modal

```
┌─────────────────────────────────────────┐
│  Add Contact                    [×]     │
├─────────────────────────────────────────┤
│                                         │
│  📱 Enter Phone Number                  │
│  ┌─────────────────────────────────┐   │
│  │ +1 (555) 123-4567               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📝 Add Message (Optional)              │
│  ┌─────────────────────────────────┐   │
│  │ Hey! Let's connect on YouBet... │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Send Invitation]                      │
│                                         │
│  ℹ️  They'll receive a notification     │
│     to approve your request             │
└─────────────────────────────────────────┘
```

### 2. Contacts Screen (Tabs)

```
┌─────────────────────────────────────────┐
│  Contacts                [+] [Search]   │
├─────────────────────────────────────────┤
│  [Contacts] [Pending] [Invitations]     │
├─────────────────────────────────────────┤
│                                         │
│  📱 Contacts (24)                       │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Sarah Chen                   │   │
│  │    @sarahc • ROI: +18.2%        │   │
│  │    [Message] [View Profile]     │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Mike Johnson                 │   │
│  │    @mikej • ROI: +23.5%         │   │
│  │    [Message] [View Profile]     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Pending Requests Tab

```
┌─────────────────────────────────────────┐
│  Pending Invitations (3)                │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ 📱 +1 (555) 999-8888            │   │
│  │    Sent 2 days ago              │   │
│  │    ⏳ Waiting for response...   │   │
│  │    [Cancel Request]             │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Alex Rivera                  │   │
│  │    Sent 1 hour ago              │   │
│  │    ⏳ Pending approval          │   │
│  │    [Cancel Request]             │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 4. Invitations Received Tab

```
┌─────────────────────────────────────────┐
│  Invitations (2)                        │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ 👤 John Doe                     │   │
│  │    @johnd • ROI: +15.3%         │   │
│  │    "Hey! Let's connect..."      │   │
│  │    2 hours ago                  │   │
│  │    [Approve] [Decline]          │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Emma Wilson                  │   │
│  │    @emmaw • ROI: +28.1%         │   │
│  │    1 day ago                    │   │
│  │    [Approve] [Decline]          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 5. Notification Card (In-App)

```
┌─────────────────────────────────────────┐
│  🔔 Contact Request                     │
├─────────────────────────────────────────┤
│  👤 John Doe wants to add you as a      │
│     contact                             │
│                                         │
│  "Hey! Let's connect on YouBet and      │
│   share betting tips!"                  │
│                                         │
│  [View Profile] [Approve] [Decline]     │
│                                         │
│  2 hours ago                            │
└─────────────────────────────────────────┘
```

---

## 🔔 Notification System

### In-App Notifications

```typescript
// When User B logs in, check for pending invitations
GET /api/notifications?type=CONTACT_REQUEST&unread=true

// Show banner at top of app
"You have 2 new contact requests"
[View Requests]
```

### Push Notifications (Future)

```typescript
// Via Firebase/OneSignal
{
  title: "New Contact Request",
  body: "John Doe wants to add you on YouBet",
  data: {
    type: "CONTACT_REQUEST",
    requestId: "req_123",
    fromUserId: "user_456"
  },
  action: "OPEN_INVITATIONS"
}
```

### SMS Notifications (For Non-Users)

```
Hey! John Doe invited you to YouBet, the sports betting community.

Tap here to join and connect: https://youbet.app/invite/abc123

- Track bets together
- Share winning picks
- Build your reputation

Reply STOP to opt out.
```

---

## 🎯 API Endpoints

### Contact Requests

```typescript
// Send contact request
POST /api/contacts/request
{
  phone: "+15551234567",
  message: "Hey! Let's connect..."
}
Response: { requestId, status, userExists }

// Get my contact requests (sent)
GET /api/contacts/requests/sent
Response: { requests: [...] }

// Get invitations received
GET /api/contacts/requests/received
Response: { invitations: [...] }

// Approve contact request
POST /api/contacts/requests/:requestId/approve
Response: { contactId, contact: {...} }

// Decline contact request
POST /api/contacts/requests/:requestId/decline
Response: { success: true }

// Cancel sent request
DELETE /api/contacts/requests/:requestId
Response: { success: true }
```

### Contacts Management

```typescript
// Get all my contacts
GET /api/contacts
Response: { contacts: [...], count: 24 }

// Get contact details
GET /api/contacts/:contactId
Response: { contact: {...} }

// Remove contact
DELETE /api/contacts/:contactId
Response: { success: true }

// Block contact
POST /api/contacts/:contactId/block
Response: { success: true }

// Update contact (nickname, favorite)
PATCH /api/contacts/:contactId
{
  nickname: "Best Bettor",
  isFavorite: true
}
Response: { contact: {...} }
```

### Search & Discovery

```typescript
// Search by phone number
GET /api/users/search?phone=+15551234567
Response: { user: {...} } | { exists: false }

// Find contacts from phone book (sync)
POST /api/contacts/sync
{
  phones: ["+15551111111", "+15552222222", ...]
}
Response: { 
  existing: [...],  // Users already on YouBet
  pending: [...]    // Can send invites
}
```

---

## 🔒 Security & Privacy

### Phone Number Verification

```typescript
// Step 1: Request OTP
POST /api/auth/phone/verify/send
{ phone: "+15551234567" }

// Step 2: Verify OTP
POST /api/auth/phone/verify/confirm
{ phone: "+15551234567", code: "123456" }
Response: { verified: true }
```

### Privacy Controls

```typescript
model User {
  // Privacy settings
  allowContactDiscovery  Boolean @default(true)  // Can be found by phone
  allowContactRequests   Boolean @default(true)  // Can receive requests
  showPhoneToContacts    Boolean @default(false) // Show phone to contacts
}
```

### Rate Limiting

- Max 10 contact requests per day per user
- Max 50 contacts total (can be increased)
- Invitation expires after 30 days
- Can't re-invite for 7 days after decline

---

## 📊 State Management

### Contact Request States

```typescript
interface ContactRequest {
  id: string
  from: User
  toPhone: string
  toUser?: User
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'EXPIRED'
  message?: string
  createdAt: Date
  respondedAt?: Date
  expiresAt: Date
}

// State transitions
PENDING → APPROVED (User accepts)
PENDING → DECLINED (User rejects)
PENDING → EXPIRED (30 days pass)
APPROVED → Contact created
DECLINED → Request deleted after 7 days
```

---

## 🎨 Implementation Steps

### Phase 1: Core Contact Request System
1. ✅ Create database schema (ContactRequest, Contact)
2. Create AddContactModal component
3. Phone number input with validation
4. API endpoint: Send contact request
5. API endpoint: Check if phone exists

### Phase 2: Invitations Management  
6. Create ContactsScreen with tabs
7. Pending requests list
8. Received invitations list
9. Approve/Decline actions
10. Cancel sent request

### Phase 3: Contacts List
11. Display approved contacts
12. Search contacts
13. View contact profile
14. Message contact (link to chat)
15. Remove/Block contact

### Phase 4: Notifications
16. In-app notification system
17. Real-time updates (WebSocket)
18. Notification badges
19. Push notifications (Firebase)
20. SMS for non-users (Twilio)

### Phase 5: Privacy & Settings
21. Privacy settings page
22. Contact discovery toggle
23. Block list management
24. Phone number visibility
25. Rate limiting

---

## 🚀 Ready to Implement!

**Start with Phase 1?**

Let me know and I'll build:
1. AddContactModal component
2. ContactsScreen with tabs
3. Contact request API endpoints (mock)
4. Integration with existing user system

This will give us a working contact system that can be connected to the backend later!

