# YouBet Messaging System - Demo Guide

**Quick Start Guide for Testing**  
**Last Updated:** November 2, 2025

---

## 🚀 Getting Started

### Launch the App
```bash
cd /Users/stephen/Downloads/code/apps/web
pnpm dev
```

Visit: http://localhost:3000

---

## 📱 Navigation to Chat

### Step 1: Complete Onboarding
1. Wait for loading screen
2. Sign in (Email/Phone/Apple)
3. Accept privacy policy
4. Complete permissions
5. Skip or complete tutorial

### Step 2: Navigate to Chat
1. Look at bottom navigation bar
2. Tap **"Chat"** icon (💬)
3. You're now in the messaging system!

---

## 🎯 Feature Testing Checklist

### ✅ Contacts Management

#### View Contacts
```
1. In Messages tab, tap 👥 icon (top right)
2. See list of 3 mock contacts:
   - Sarah Chen (Online)
   - Mike Johnson (Offline)
   - Alex Thompson (Online)
```

#### Add Contact
```
1. On Contacts screen, tap + icon
2. Modal opens: "Add Contact"
3. Enter "@newuser"
4. Tap "Send Contact Request"
5. Alert confirms request sent
```

#### Contact Details
```
1. Tap any contact card
2. Modal shows:
   - Large avatar with online status
   - Name, handle, bio
   - Mutual followers count
   - Email (if available)
   - Action buttons: Message, Call, Video
   - Toggle favorite (⭐)
   - Remove contact option
```

#### Accept Contact Request
```
1. Tap "Requests" tab (top filter)
2. See 2 pending requests:
   - Emma Wilson (Online)
   - James Lee (Offline)
3. Tap green ✓ to accept
4. Or tap X to reject
5. Contact moves to "All" list
```

#### Favorite Contacts
```
1. Go to "All" tab
2. Tap any contact to open details
3. Tap "Add to Favorites"
4. Star icon ⭐ appears next to name
5. Go to "Favorites" tab
6. See your favorited contacts
```

---

### ✅ Messaging Features

#### Open Conversation
```
1. Back to Messages (← or bottom nav)
2. See 4 mock conversations
3. Notice:
   - "NBA Betting Squad" is pinned (at top)
   - Unread badges (2, 5, 12)
   - Typing indicator on group chat
   - Online status on profiles
4. Tap "Sarah Chen" to open chat
```

#### View Message Types
```
In Sarah's chat, you'll see:
1. Text message: "Hey! Did you see..."
2. Text with reaction: "Yeah! I'm thinking..." (has 👍)
3. Bet Slip card: "Lakers vs Warriors"
   - Shows odds, stake
   - Green border = WIN
   - Shows profit: +$75
4. Reply thread: "Nice hit!" (replying to bet slip)
5. Game analysis: LeBron/AD analysis
```

#### Send Text Message
```
1. Type in bottom input: "Testing message"
2. Press Enter or tap Send button (→)
3. Message appears on right (blue bubble)
4. Status shows: Sending... → Sent ✓✓
```

#### Reply to Message
```
1. Hover over any message
2. Tap ⋮ (three dots) that appears
3. Select "Reply"
4. See reply bar appear at bottom
5. Type response
6. Send
7. Message shows with reply context
```

#### Add Reaction
```
Method 1 - Quick React:
1. Hover over any message
2. See emoji buttons appear: 👍❤️😂🔥
3. Tap any emoji
4. Reaction appears below message

Method 2 - Existing Reactions:
1. See "👍2" on message
2. Tap it to add your reaction
3. Count increases to "👍3"
4. Tap again to remove
```

#### Edit Message
```
1. Hover over YOUR message
2. Tap ⋮ menu
3. Select "Edit"
4. Text populates input field
5. Modify text
6. Press Send
7. Message updates with "Edited" label
```

#### Delete Message
```
1. Tap ⋮ on YOUR message
2. Select "Delete"
3. Confirmation dialog appears
4. Confirm deletion
5. Message removed from chat
```

---

### ✅ Advanced Features

#### Share Emoji
```
1. Tap 😊 emoji button (left of input)
2. Grid of 16 emojis appears
3. Tap any emoji
4. It's added to your message
5. Tap again on different emoji
6. Multiple emojis can be added
```

#### Media Sharing (UI Demo)
```
1. Tap + button (left of input)
2. Media options appear:
   - 🖼️  Image
   - 📎 File
3. Tap either option
4. Mock file/image message is sent
5. See preview in chat
```

#### Voice Message (UI Demo)
```
1. With empty input, see 🎤 icon
2. Tap and hold microphone button
3. See "Recording..." indicator
4. Red dot pulses
5. Release to send
6. Voice message appears with:
   - Play button
   - Waveform
   - Duration (15s)
```

#### Search Messages
```
1. In chat, tap 🔍 (top right)
2. Search bar appears below header
3. Type search term
4. Messages filter in real-time
```

#### Search Conversations
```
1. Back to Messages list
2. Tap 🔍 in header
3. Search bar appears
4. Type name
5. Conversations filter instantly
```

#### Group Info
```
1. Open "NBA Betting Squad" chat
2. Tap group name in header
3. Group Info modal opens
4. See:
   - Group avatar
   - Member count
   - List of all members with status
   - "Add Members" button
```

#### Pin Conversation
```
1. Messages list
2. Notice "NBA Betting Squad" at top
3. Label says "Pinned"
4. Pinned chats stay at top of list
```

---

### ✅ Communication Tools

#### Voice Call
```
1. Open any chat
2. Tap 📞 phone icon (top right)
3. UI ready for voice call integration
```

#### Video Call
```
1. Open any chat
2. Tap 📹 video icon (top right)
3. UI ready for video call integration
```

#### Share Betting Slip
```
1. In chat input area
2. Above the text input
3. Tap "Share Slip" button
4. UI ready to select your picks
5. Would send as rich card
```

#### Share Analysis
```
1. In chat input area
2. Tap "Share Analysis" button
3. UI ready to compose game analysis
4. Would send with special formatting
```

---

### ✅ New Chat Options

#### Start New DM
```
1. Messages list
2. Tap + icon (top right)
3. Options expand
4. Tap "New DM"
5. Navigates to Contacts
6. Select contact
7. Opens chat
```

#### Create Group
```
1. Messages list
2. Tap +
3. Tap "Create Group"
4. UI ready for member selection
```

#### View All Contacts
```
1. Messages list
2. Tap +
3. Tap "View Contacts"
4. Opens full contacts manager
```

---

## 🎨 Visual Elements to Notice

### Status Indicators

**Online Presence:**
- 🟢 Green dot = Online
- No dot = Offline
- "Last seen 2h ago" = Time since active

**Message Status (Your Messages):**
- ✓ Gray = Sending/Sent
- ✓✓ Gray = Delivered
- ✓✓ Blue = Read by recipient

**Conversation List:**
- Red badge = Unread count
- "typing..." = Someone is typing
- 📌 = Pinned conversation

### Message Styles

**Sent by You:**
- Right-aligned
- Blue/primary color bubble
- Rounded corner on top-right removed

**Received:**
- Left-aligned
- White/card color bubble
- Avatar on left
- Rounded corner on top-left removed

**Bet Slip (Win):**
- Green border
- Success background
- Win badge with profit

**Bet Slip (Loss):**
- Blue border
- Blue tinted background
- Loss badge

**Game Analysis:**
- Primary border
- Primary tinted background
- Special icon

---

## 🎬 Demo Flow (Complete)

### Full User Journey

```
1. Launch app → Complete onboarding
   
2. Navigate to Chat tab
   
3. Tap 👥 to view Contacts
   
4. Tap + to add new contact
   - Enter @username
   - Send request
   
5. Go to "Requests" tab
   - Accept Emma Wilson
   
6. Tap Emma to view details
   - Add to favorites ⭐
   - Tap "Message" to start chat
   
7. Send first message
   - Type "Hey Emma!"
   - Press Send
   - See status: Sending → Sent ✓✓
   
8. Back to Messages list
   - Tap "Sarah Chen"
   
9. Try all message actions:
   - Hover and react with 👍
   - Reply to bet slip
   - Edit your message
   - Delete a message
   
10. Try media features:
    - Tap 😊 add emoji
    - Tap + for media
    - Hold 🎤 for voice
    
11. Try search:
    - Search conversations
    - Search in chat
    
12. Open group chat:
    - "NBA Betting Squad"
    - View group info
    - See all members
    
13. Test presence:
    - Notice online indicators
    - See "typing..." status
    
14. Complete! ✅
```

---

## 🐛 Known Behaviors (Not Bugs)

### Expected Behaviors:
1. **Messages persist in UI only** - Not saved to database yet
2. **Voice recording is UI demo** - No actual audio recorded
3. **File/image uploads are mocked** - No actual file handling yet
4. **Online status is static** - No real-time WebSocket yet
5. **Typing indicator is static** - Shows on mock data only
6. **Read receipts are simulated** - Based on mock status
7. **Calls don't connect** - UI only, integration pending
8. **Contact requests are alerts** - No backend handling yet

These are all expected and will be connected to the backend API in the next phase.

---

## ✨ Bonus Features to Discover

### Hidden Details:
- **Long messages** - Text wraps beautifully
- **Multiple reactions** - Same message can have many
- **Group vs DM** - Groups show member count badge
- **Edited messages** - Shows "Edited" label
- **Reply context** - Shows original message being replied to
- **Smooth animations** - Hover states, transitions
- **Touch feedback** - All interactive elements respond
- **Keyboard shortcuts** - Enter to send
- **Auto-scroll** - Always shows latest message

---

## 📸 Screenshot Checklist

### Capture These Views:
1. ✅ Messages list with pinned chat
2. ✅ Contacts page with online status
3. ✅ Contact requests with accept/reject
4. ✅ Contact details modal
5. ✅ Chat with mixed message types
6. ✅ Message with reactions
7. ✅ Reply threading
8. ✅ Edit mode active
9. ✅ Emoji picker open
10. ✅ Media options expanded
11. ✅ Voice recording active
12. ✅ Group info modal
13. ✅ Search results
14. ✅ Bet slip in chat (win)
15. ✅ Bet slip in chat (loss)

---

## 🎉 Success Criteria

You've successfully tested the messaging system if you can:

- [x] Add a contact
- [x] Accept a contact request
- [x] Start a new conversation
- [x] Send a text message
- [x] Reply to a message
- [x] Add a reaction
- [x] Edit your message
- [x] Delete a message
- [x] Share an emoji
- [x] See message status (✓✓)
- [x] View online presence (🟢)
- [x] Search conversations
- [x] Open group info
- [x] View different message types
- [x] Access all features smoothly

---

## 💡 Tips

1. **Hover to reveal actions** - Many features appear on hover
2. **Click avatars/names** - Opens details/info
3. **Use keyboard** - Enter to send, Escape to close
4. **Try all tabs** - All, Favorites, Requests
5. **Test on mobile** - Responsive design adapts
6. **Notice animations** - Smooth transitions throughout
7. **Check status icons** - Many micro-interactions

---

## 🚀 Next Steps

After testing the UI:

1. **Backend Integration** - Connect to real API
2. **WebSocket** - Real-time messaging
3. **Database** - Message persistence
4. **File Uploads** - Actual media handling
5. **Voice Recording** - Real audio capture
6. **Video/Voice Calls** - WebRTC integration
7. **Push Notifications** - Mobile alerts

---

**Happy Testing!** 🎉

If you find any issues or have suggestions, document them for the next phase of development.

**Last Updated:** November 2, 2025

