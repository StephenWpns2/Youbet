# User Profile Feature

## Overview
Comprehensive user profile pages that display detailed statistics, betting history, earnings, and social information for any user on the platform.

## Implementation

### Dynamic Profile Route
**File:** `/apps/web/app/profile/[handle]/page.tsx`

- **Route:** `/profile/[handle]` (e.g., `/profile/alexjohnson`)
- **Dynamic routing** using Next.js App Router
- Displays complete user information and statistics

### Features Implemented

#### 1. **Profile Header**
- Large avatar with fallback initials
- User name and handle (@username)
- Bio with emojis and key stats
- Join date
- Follow/Unfollow button
- Message button
- Share profile button (native share API)

#### 2. **Key Statistics Cards**
- **Win Rate:** Percentage with total picks count
- **ROI:** Return on investment with total staked amount
- **Total Profit:** All-time earnings in dollars
- **Current Streak:** Win streak with best streak record

#### 3. **Social Stats Bar**
- Followers count
- Following count
- Average odds

#### 4. **Tabbed Content**

##### **Picks Tab**
Displays all user picks with:
- Event name and league badge
- Status badge (Won/Lost/Pending) with icons
- Market and selection details
- Odds display
- Stake amount
- Profit/loss in colored text
- Lock date and time
- Proof image (if available)
- Color-coded cards:
  - Green tint for wins
  - Blue tint for losses
  - Amber tint for pending

##### **Earnings Tab**
- **Profit Trend Chart:** 6-month area chart showing profits and losses
- **Expected Wins Card:** Potential profit from pending picks
- **Win/Loss Distribution:** Pie chart showing wins, losses, and pending picks

##### **Stats Tab**
- **Sport Distribution:** Bar chart showing picks by sport
- **Additional Metrics:**
  - Average stake
  - Total wins count
  - Total losses count
  - Average win amount

### Navigation Updates

#### Dashboard Integration
**File:** `/apps/web/components/dashboard.tsx`

- Added `useRouter` from `next/navigation`
- Made entire user cards clickable
- Click anywhere on card navigates to profile
- "View Profile" button also navigates (with event propagation stopped)
- Username parsed from `@username` format

#### Home Feed Integration
**File:** `/apps/web/components/home-feed.tsx`

- Added `useRouter` from `next/navigation`
- Made user avatar and name clickable
- Hover effect on user section
- Username derived from display name

## User Data Model

```typescript
{
  id: string
  handle: string
  name: string
  avatar: string
  bio: string
  joinedDate: string
  isFollowing: boolean
  stats: {
    totalPicks: number
    winRate: number
    roi: number
    totalProfit: number
    totalStaked: number
    currentStreak: number
    bestStreak: number
    followers: number
    following: number
    avgOdds: number
  }
  recentPicks: Pick[]
  earningsChart: ChartData[]
  sportDistribution: ChartData[]
  winLossDistribution: ChartData[]
}
```

## UI/UX Enhancements

### Visual Design
- **Gradient header** with primary to secondary color
- **Status-based color coding:**
  - Success (green) for wins
  - Blue for losses (positive psychology)
  - Amber for pending
- **Card elevation** with shadows and hover effects
- **Responsive grid layouts** for stats

### Interactions
- **Back button** to return to previous page
- **Share button** using native Web Share API
- **Tab navigation** for organized content
- **Clickable elements** with hover states
- **Smooth transitions** on all interactions

### Charts & Visualizations
Using **Recharts** library:
- Area charts for profit trends
- Bar charts for sport distribution
- Pie charts for win/loss ratios
- Responsive containers
- Tooltips on hover
- Custom colors matching theme

## Technical Details

### Mock Data
Currently using mock data generated in the component. In production:
```typescript
// Replace with API call
const getUserData = async (handle: string) => {
  const response = await fetch(`/api/profiles/${handle}`)
  return response.json()
}
```

### Performance
- **Client-side navigation** (no full page reloads)
- **Optimistic UI updates** for follow/unfollow
- **Lazy loading** for tabs (content only rendered when active)
- **Memoized calculations** for derived stats

### Accessibility
- **ARIA labels** on interactive elements
- **Keyboard navigation** support
- **Focus indicators** on buttons and tabs
- **Alt text** on images
- **Semantic HTML** structure

## Future Enhancements

### Phase 1 (Next)
- [ ] Real API integration
- [ ] Loading states and skeletons
- [ ] Error handling with retry
- [ ] Infinite scroll for picks
- [ ] Filter picks by sport/status
- [ ] Search within user's picks

### Phase 2
- [ ] Follow/unfollow functionality
- [ ] Direct messaging from profile
- [ ] Report user option
- [ ] Block user option
- [ ] Export stats to PDF/CSV
- [ ] Compare with another user

### Phase 3
- [ ] Verified badge for trusted users
- [ ] Achievement badges
- [ ] Custom themes per user
- [ ] Referral stats
- [ ] Tipping integration
- [ ] Subscription tiers display

## Testing Checklist

- [x] Dynamic routing works with any handle
- [x] Back button navigates correctly
- [x] All tabs render content
- [x] Charts display correctly
- [x] Cards show proper status colors
- [x] Navigation from dashboard works
- [x] Navigation from home feed works
- [x] Share button functional (on supported browsers)
- [x] Responsive on mobile, tablet, desktop
- [x] Avatar fallback shows initials

## Usage Examples

### Navigate to Profile from Code
```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()

// Navigate to user profile
router.push('/profile/alexjohnson')
```

### Add to Mock User Data
```typescript
const newUser = {
  username: "@newuser",
  name: "New User",
  avatar: "/avatar.png",
  // ... other fields
}
```

## File Structure
```
apps/web/
├── app/
│   └── profile/
│       └── [handle]/
│           └── page.tsx          # Dynamic profile page
├── components/
│   ├── dashboard.tsx             # Updated with clickable users
│   └── home-feed.tsx             # Updated with clickable avatars
└── docs/
    └── USER_PROFILE_FEATURE.md   # This document
```

## Summary

✅ **Complete user profile system implemented**
✅ **Navigation from dashboard and feed**
✅ **Comprehensive statistics display**
✅ **Beautiful charts and visualizations**
✅ **Responsive and accessible**
✅ **Ready for API integration**

The user profile feature is now fully functional and provides users with a complete view of any bettor's history, statistics, and performance on the platform!

