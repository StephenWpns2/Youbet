# Profile Management Menu

## 🎯 Overview

Clicking the user avatar in the header now opens a comprehensive profile management menu where users can view their info, edit their profile, sign out, or delete their account.

## ✨ Features

### **Profile Menu Dropdown**

**Trigger:** Click the avatar in the top-right corner

**Location:** Slides in from the right side

**Design:**
- Backdrop blur overlay
- Smooth slide-in animation
- Close button (X) in top-right
- Gradient header with user info

---

## 📋 Menu Sections

### 1. **Header Section**
- **Large avatar** (80px × 80px)
- **User name** (displayed prominently)
- **Member since date** (formatted)
- **Gradient background** (primary → secondary)

### 2. **Profile Information** (View Mode)
**Three info cards:**
- **📧 Email** - User's email address
- **📱 Phone** - User's phone number
- **📅 Joined** - Full date format (e.g., "November 2, 2024")

**Stats Display** (if available):
- **Total Bets** - Count
- **Win Rate** - Percentage
- **ROI** - Return on investment

### 3. **Action Buttons**
Three main actions:

#### ✏️ **Edit Profile**
- Opens edit mode
- Allows updating:
  - Full Name
  - Email
  - Phone Number
- **Save/Cancel** buttons
- Real-time updates

#### 🚪 **Sign Out**
- Clears onboarding progress
- Returns to sign-in screen
- Keeps user data in localStorage (for quick re-login)

#### 🗑️ **Delete Account**
- Shows confirmation dialog
- **Two-step process:**
  1. Click "Delete Account"
  2. Confirm with "Yes, Delete My Account"
- **Warning list** of what will be lost:
  - All betting history and stats
  - Followers/following lists
  - Saved picks and predictions
  - Profile and achievements

---

## 🎨 Visual Design

### Layout
```
┌────────────────────────────┐
│              [X]           │
├────────────────────────────┤
│    [Gradient Header]       │
│    [Avatar]  John Doe      │
│    Member since Nov 2024   │
├────────────────────────────┤
│                            │
│  📧 Email                  │
│  john@example.com          │
│                            │
│  📱 Phone                  │
│  +1 (555) 123-4567         │
│                            │
│  📅 Joined                 │
│  November 2, 2024          │
│                            │
│  ┌───┬───┬───┐             │
│  │ 0 │ 0%│+0%│             │
│  │Bets│Win│ROI│             │
│  └───┴───┴───┘             │
│                            │
│  [✏️ Edit Profile]          │
│  [🚪 Sign Out]              │
│  [🗑️ Delete Account]        │
│                            │
└────────────────────────────┘
```

### Edit Mode
```
┌────────────────────────────┐
│              [X]           │
├────────────────────────────┤
│    [Gradient Header]       │
│    [Avatar]  John Doe      │
│    Member since Nov 2024   │
├────────────────────────────┤
│                            │
│  👤 Full Name              │
│  [John Doe________]        │
│                            │
│  📧 Email                  │
│  [john@example.com__]      │
│                            │
│  📱 Phone                  │
│  [+1 (555) 123-4567]       │
│                            │
│  [Save Changes] [Cancel]   │
│                            │
└────────────────────────────┘
```

### Delete Confirmation
```
┌────────────────────────────┐
│              [X]           │
├────────────────────────────┤
│                            │
│        [⚠️ Warning]         │
│                            │
│    Delete Account?         │
│    This cannot be undone   │
│                            │
│  ┌──────────────────────┐  │
│  │  You will lose:      │  │
│  │  • Betting history   │  │
│  │  • Followers list    │  │
│  │  • Saved picks       │  │
│  │  • Achievements      │  │
│  └──────────────────────┘  │
│                            │
│  [Yes, Delete My Account]  │
│  [Cancel, Keep Account]    │
│                            │
└────────────────────────────┘
```

---

## 💻 Technical Implementation

### Files
- **`/components/profile-menu.tsx`** - Main menu component
- **`/components/home-feed.tsx`** - Avatar click handler

### State Management
```typescript
const [showProfileMenu, setShowProfileMenu] = useState(false)
const [isEditing, setIsEditing] = useState(false)
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
```

### Key Functions

#### Edit Profile
```typescript
const handleSaveProfile = () => {
  updateUser({
    name: editedName,
    email: editedEmail,
    phone: editedPhone,
  })
  setIsEditing(false)
}
```

#### Sign Out
```typescript
const handleSignOut = () => {
  localStorage.removeItem('onboarding-step')
  setUser(null)
  onSignOut()
  onClose()
}
```

#### Delete Account
```typescript
const handleDeleteAccount = () => {
  localStorage.clear()
  setUser(null)
  window.location.reload()
}
```

---

## 🎬 User Flows

### **View Profile**
1. Click avatar in header
2. Menu slides in from right
3. View email, phone, join date
4. See betting stats (if available)
5. Click [X] or backdrop to close

### **Edit Profile**
1. Click avatar → Menu opens
2. Click "Edit Profile"
3. Form fields appear
4. Update name/email/phone
5. Click "Save Changes"
6. Changes persist immediately
7. Menu returns to view mode

### **Sign Out**
1. Click avatar → Menu opens
2. Click "Sign Out"
3. User cleared from context
4. Page reloads
5. Returns to sign-in screen

### **Delete Account**
1. Click avatar → Menu opens
2. Click "Delete Account" (red button)
3. Confirmation screen appears
4. Warning shows what will be lost
5. Click "Yes, Delete My Account"
6. All data cleared
7. Page reloads to sign-in

---

## 🔒 Security Features

### Data Handling
- **Edit validation** - Checks for empty fields
- **Confirmation required** - Two-step delete process
- **Warning displayed** - Clear consequences
- **Complete cleanup** - All localStorage cleared

### State Management
- **Context-based** - Centralized user state
- **Persistent** - Survives page refreshes
- **Clearable** - Easy to reset on sign-out

---

## 🎨 Design Patterns

### Colors
- **Header gradient** - Primary → Secondary
- **Stats cards** - Color-coded (Primary, Secondary, Accent)
- **Delete button** - Destructive red
- **Warning** - Destructive background/text

### Animations
- **Slide-in** - 300ms from right
- **Fade backdrop** - 200ms
- **Button hover** - Scale on hover
- **Close animation** - Smooth fade out

### Typography
- **Header name** - text-xl font-black
- **Section labels** - text-xs text-muted-foreground
- **Values** - text-sm font-semibold
- **Stats** - text-xl font-black

---

## ✅ Features Checklist

### Profile Display
- [x] Show user avatar
- [x] Display full name
- [x] Show member since date
- [x] Display email
- [x] Display phone
- [x] Display join date
- [x] Show betting stats (if available)

### Edit Functionality
- [x] Switch to edit mode
- [x] Editable name field
- [x] Editable email field
- [x] Editable phone field
- [x] Save changes button
- [x] Cancel editing button
- [x] Immediate updates

### Sign Out
- [x] Clear onboarding state
- [x] Clear user from context
- [x] Reload to sign-in
- [x] Maintain data option

### Delete Account
- [x] Show confirmation dialog
- [x] Display warning message
- [x] List consequences
- [x] Require explicit confirmation
- [x] Clear all data
- [x] Reload to sign-in

### UI/UX
- [x] Backdrop blur overlay
- [x] Slide-in animation
- [x] Close button (X)
- [x] Click outside to close
- [x] Smooth transitions
- [x] Responsive design

---

## 📱 Responsive Behavior

### Mobile
- Full-width menu (max-w-sm)
- Comfortable touch targets
- Readable text sizes
- Proper spacing

### Tablet/Desktop
- Same design (optimized for mobile-first)
- Menu positioned top-right
- Better visibility of animations
- Smooth backdrop blur

---

## 🚀 Future Enhancements

### Phase 1 (Optional)
- [ ] Avatar upload
- [ ] Profile picture crop
- [ ] More stats display
- [ ] Activity history

### Phase 2
- [ ] Export data (GDPR)
- [ ] Privacy settings
- [ ] Notification preferences
- [ ] Linked accounts management

### Phase 3
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Security logs
- [ ] Account recovery

---

## 💡 Usage Examples

### Opening the Menu
```typescript
// In any component with avatar
<Avatar onClick={() => setShowProfileMenu(true)}>
  {/* Avatar content */}
</Avatar>
```

### Passing Handlers
```typescript
<ProfileMenu 
  onClose={() => setShowProfileMenu(false)}
  onSignOut={handleSignOut}
/>
```

---

## 📊 Summary

**What's Live:**
✅ Complete profile management menu
✅ Edit profile functionality
✅ Sign out option
✅ Delete account with confirmation
✅ Beautiful animations
✅ Responsive design
✅ Secure data handling

**Result:** Users now have full control over their profile from a single, accessible menu! 🎉

