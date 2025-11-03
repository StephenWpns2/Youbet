# User Profile Click Navigation - Quick Guide

## 🎯 How It Works

### From Dashboard
1. Go to the **Dashboard** tab (bottom navigation)
2. Scroll to "Following Performance" section
3. **Click anywhere on a user's card** OR click "View Profile" button
4. Opens detailed profile page

### From Home Feed
1. Go to the **Home** tab
2. View any post in the feed
3. **Click on the user's avatar or name** (top of post)
4. Opens detailed profile page

## 📱 Profile Page Features

### Header Section
- **Profile Picture** - Large avatar with user's photo
- **Name & Handle** - Display name and @username
- **Bio** - User's description and emoji
- **Join Date** - When they joined YouBet
- **Action Buttons:**
  - **Follow/Following** - Toggle follow status
  - **Message** - Start a conversation
  - **Share** - Share profile on social media

### Statistics Overview (4 Cards)
1. **Win Rate** - Success percentage + total picks
2. **ROI** - Return on investment + amount staked
3. **Total Profit** - All-time earnings in $$$
4. **Streak** - Current win streak + best streak

### Social Stats Bar (3 Metrics)
- **Followers** - Number of followers
- **Following** - Number they follow
- **Avg Odds** - Average odds they bet on

### Tabbed Content

#### 📊 Picks Tab (Default)
- **Recent betting picks** displayed as cards
- Each pick shows:
  - ✅ Status badge (Won/Lost/Pending)
  - 🏀 League badge (NBA/NFL/etc.)
  - 📅 Event name and date
  - 🎯 Market and selection
  - 💰 Odds and stake
  - 💵 Profit/Loss amount
  - 🔒 Lock time
  - 📸 Proof image (if uploaded)
- **Color coded:**
  - Green background = Win
  - Blue background = Loss
  - Amber background = Pending

#### 💰 Earnings Tab
- **Profit Trend Chart**
  - 6-month area chart
  - Green = Profits
  - Blue = Losses
- **Expected Wins Card**
  - Potential profit from pending picks
  - Total amount in pending stakes
- **Win/Loss Distribution**
  - Pie chart showing ratio
  - Wins vs Losses vs Pending

#### 📈 Stats Tab
- **Sport Distribution**
  - Bar chart showing picks by sport
  - NBA, NFL, MLB, NHL breakdown
- **Additional Metrics:**
  - Average stake per bet
  - Total wins count
  - Total losses count  
  - Average win amount

## 🎨 Visual Design

### Color Scheme
- **Gradient Header:** Primary → Secondary
- **Win Cards:** Green tint
- **Loss Cards:** Blue tint (positive psychology!)
- **Pending Cards:** Amber tint

### Interactions
- **Hover Effects:** Cards lift on hover
- **Click Feedback:** Smooth transitions
- **Tab Switching:** Instant content swap
- **Back Button:** Returns to previous page

## 🔧 Developer Notes

### Routes
```
/profile/[handle]  →  User profile page
Example: /profile/alexjohnson
```

### Mock Users in Dashboard
```typescript
@sportyspice
@lebronsfan23
@pickmaster
```

### Navigation Code
```typescript
// From anywhere in the app
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/profile/username')
```

## ✅ Testing Checklist

Try these interactions:
- [ ] Click user card in dashboard → Opens profile
- [ ] Click "View Profile" button → Opens profile
- [ ] Click avatar in home feed → Opens profile
- [ ] Click back button → Returns to previous page
- [ ] Switch between Picks/Earnings/Stats tabs
- [ ] Hover over clickable elements (should show cursor change)
- [ ] Check mobile responsiveness
- [ ] Verify charts render correctly
- [ ] Test with different mock users

## 🚀 What's Next?

Currently showing **mock data**. In production:
- Real user data from API
- Live follow/unfollow functionality
- Real-time updates
- Messaging integration
- More detailed analytics

## 💡 Pro Tips

1. **Click the entire card** - You don't need to find the button
2. **Check the bio** - Users share their betting strategy there
3. **Look at the streak** - Indicates recent performance
4. **ROI is key** - Better indicator than just win rate
5. **Pending picks** - See what they're betting on now

---

**Enjoy exploring user profiles!** 🎉

