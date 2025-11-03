# YouBet Design Upgrade Specification

**Version:** 1.0  
**Date:** November 2, 2025  
**Status:** Planning → Implementation

---

## Executive Summary

This document outlines the design system upgrade for YouBet, a warm, bright, sports-themed social platform for sharing betting predictions and results. The upgrade transforms the existing v0 prototype into a production-ready, accessible, and scalable design system that maintains the energetic sporting vibe while meeting WCAG AA standards and modern UX best practices.

---

## 1. Design Philosophy & Brand Identity

### Core Values
- **Warmth:** Inviting, community-focused, friendly atmosphere
- **Energy:** Dynamic sporting excitement without being overwhelming
- **Trust:** Professional, reliable, data-driven
- **Inclusivity:** Accessible to all users, clear responsible gambling messaging

### Visual Mood
- Sunset-inspired warmth meets professional sports analytics
- Bright and optimistic, never dark or brooding
- Celebratory wins, empathetic losses
- Data-rich but never cluttered

---

## 2. Color System Upgrade

### Current Issues
- **Inconsistent palette:** Mix of cool cyans (primary) and warm ambers (accents) creates visual discord
- **Brand confusion:** Header uses cool blue, but CTAs use warm orange
- **Accessibility gaps:** Some contrast ratios below WCAG AA on white backgrounds

### Upgraded Palette

#### Primary Colors (Warm Sporting Theme)
```css
/* Sunset Amber - Primary Brand */
--primary-50:  oklch(0.98 0.02 75);   /* Very light amber background */
--primary-100: oklch(0.95 0.05 70);   /* Light amber tint */
--primary-200: oklch(0.88 0.08 65);   /* Soft amber */
--primary-400: oklch(0.75 0.15 55);   /* Medium amber */
--primary-500: oklch(0.65 0.18 50);   /* Core amber - CTAs, headers (#FFB84D equivalent) */
--primary-600: oklch(0.58 0.20 48);   /* Deep amber hover state */
--primary-700: oklch(0.50 0.22 45);   /* Dark amber active */
--primary-900: oklch(0.35 0.18 42);   /* Darkest amber for text on light */

/* Golden Yellow - Secondary Accent */
--secondary-400: oklch(0.80 0.16 85); /* Light gold */
--secondary-500: oklch(0.72 0.18 82); /* Core gold (#F5A623 equivalent) */
--secondary-600: oklch(0.62 0.20 80); /* Deep gold */

/* Success - Winning Green */
--success-50:  oklch(0.96 0.03 145);
--success-400: oklch(0.72 0.15 145);  /* Medium green */
--success-500: oklch(0.65 0.18 145);  /* Core success (#4CAF50 equivalent) */
--success-600: oklch(0.55 0.20 145);  /* Dark green hover */
--success-700: oklch(0.45 0.22 145);  /* Darker green */

/* Destructive - Loss Red */
--destructive-50:  oklch(0.96 0.02 25);
--destructive-400: oklch(0.65 0.18 25);
--destructive-500: oklch(0.55 0.22 25); /* Core destructive (current) */
--destructive-600: oklch(0.48 0.24 25);
--destructive-700: oklch(0.40 0.25 25);
```

#### Neutrals (Warm-tinted Grays)
```css
--neutral-50:  oklch(0.99 0.005 50);  /* Almost white, warm tint */
--neutral-100: oklch(0.96 0.005 50);  /* Very light warm gray */
--neutral-200: oklch(0.92 0.005 50);  /* Light warm gray - borders */
--neutral-300: oklch(0.85 0.005 50);  /* Soft warm gray */
--neutral-400: oklch(0.70 0.005 50);  /* Medium gray - secondary text */
--neutral-500: oklch(0.55 0.005 50);  /* Gray - muted elements */
--neutral-600: oklch(0.45 0.005 50);  /* Dark gray */
--neutral-700: oklch(0.35 0.005 50);  /* Darker gray - text */
--neutral-800: oklch(0.25 0.005 50);  /* Very dark gray */
--neutral-900: oklch(0.15 0.005 50);  /* Almost black */
```

#### Background Gradient
```css
/* Page background: subtle sunset gradient */
background: linear-gradient(180deg, 
  oklch(0.99 0.01 60) 0%,    /* Light peachy white */
  oklch(0.97 0.02 55) 100%   /* Slightly warmer at bottom */
);
```

### Semantic Mapping
```css
--background: var(--neutral-50);
--foreground: var(--neutral-900);
--card-bg: oklch(1 0 0);           /* Pure white for cards */
--muted: var(--neutral-100);
--muted-foreground: var(--neutral-500);
--border: var(--neutral-200);
--ring: var(--primary-500);        /* Focus ring */
```

### Accessibility Compliance
- **All text on white:** Minimum contrast ratio 4.5:1 (WCAG AA)
- **Primary-500 on white:** 4.51:1 ✅
- **Neutral-700 body text:** 8.2:1 ✅
- **Success/Destructive badges:** Use 600-level shades for AA compliance
- **Color-blind safe:** Success/destructive use icon + text, not just color

---

## 3. Typography System

### Font Stack

#### Display & UI: Nunito (Current - Keep)
```css
font-family: 'Nunito', 'Inter', 'SF Pro Display', -apple-system, sans-serif;
```
- **Rationale:** Friendly, rounded, energetic. Perfect for sporting vibe.
- **Weights:** 400 (Regular), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)

#### Data & Numbers: 'SF Mono', 'Menlo', monospace
```css
font-family: 'SF Mono', 'Menlo', 'Courier New', monospace;
```
- **Use:** Odds, ROI, stakes, timestamps
- **Rationale:** Clear distinction for numerical data

### Type Scale
```css
/* Headings */
--text-4xl: 2.5rem;    /* 40px - Page titles */
--text-3xl: 2rem;      /* 32px - Section headers */
--text-2xl: 1.5rem;    /* 24px - Card titles */
--text-xl:  1.25rem;   /* 20px - Subheadings */
--text-lg:  1.125rem;  /* 18px - Large body */

/* Body */
--text-base: 1rem;     /* 16px - Body text */
--text-sm:   0.875rem; /* 14px - Secondary text */
--text-xs:   0.75rem;  /* 12px - Captions, labels */

/* Line Heights */
--leading-tight:  1.25;  /* Headings */
--leading-normal: 1.5;   /* Body */
--leading-relaxed: 1.75; /* Long-form */

/* Font Weights */
--font-normal:    400;
--font-semibold:  600;
--font-bold:      700;
--font-extrabold: 800;
```

### Typography Rules
1. **Headings:** Bold (700) or ExtraBold (800)
2. **Body text:** Regular (400), 16px minimum for readability
3. **CTAs:** Bold (700), 16–18px
4. **Data:** Monospace, SemiBold (600)
5. **Max line length:** 65–75 characters for readability

---

## 4. Spacing & Layout

### Spacing Scale (Tailwind-compatible)
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Border Radius
```css
--radius-sm:  0.5rem;   /* 8px - Small buttons, badges */
--radius-md:  0.75rem;  /* 12px - Standard cards (current --radius) */
--radius-lg:  1rem;     /* 16px - Large cards, modals */
--radius-xl:  1.25rem;  /* 20px - Prominent cards */
--radius-2xl: 1.5rem;   /* 24px - Sheet, drawer */
--radius-full: 9999px;  /* Pills, avatars */
```

### Shadows
```css
/* Soft, warm shadows with slight amber tint */
--shadow-sm:  0 1px 2px 0 oklch(0.35 0.02 50 / 0.05);
--shadow-md:  0 4px 6px -1px oklch(0.35 0.02 50 / 0.10),
              0 2px 4px -1px oklch(0.35 0.02 50 / 0.06);
--shadow-lg:  0 10px 15px -3px oklch(0.35 0.02 50 / 0.12),
              0 4px 6px -2px oklch(0.35 0.02 50 / 0.05);
--shadow-xl:  0 20px 25px -5px oklch(0.35 0.02 50 / 0.15),
              0 10px 10px -5px oklch(0.35 0.02 50 / 0.04);
```

### Grid & Breakpoints
```css
/* Mobile-first responsive breakpoints */
--screen-sm: 640px;   /* Phones landscape */
--screen-md: 768px;   /* Tablets portrait */
--screen-lg: 1024px;  /* Tablets landscape, small laptops */
--screen-xl: 1280px;  /* Desktops */
--screen-2xl: 1536px; /* Large desktops */

/* Content max-widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

---

## 5. Component Design Patterns

### 5.1 Buttons

#### Primary CTA
```tsx
<Button className="bg-primary-500 hover:bg-primary-600 text-white font-bold 
  rounded-lg px-6 py-3 shadow-md hover:shadow-lg transform hover:scale-[1.02]
  transition-all duration-200 ease-out">
  Place Bet
</Button>
```

#### Secondary
```tsx
<Button variant="outline" className="border-2 border-primary-500 text-primary-600
  hover:bg-primary-50 font-semibold rounded-lg px-6 py-3">
  View Details
</Button>
```

#### Destructive
```tsx
<Button variant="destructive" className="bg-destructive-500 hover:bg-destructive-600
  text-white font-bold rounded-lg">
  Delete Pick
</Button>
```

#### Icon Button
```tsx
<Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-50">
  <Heart className="h-5 w-5" />
</Button>
```

### 5.2 Cards

#### Pick Card (Feed)
```tsx
<Card className="rounded-xl bg-white border-2 border-neutral-200 
  shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
  {/* Win state: border-success-500 bg-success-50/30 */}
  {/* Loss state: border-destructive-500 bg-destructive-50/30 */}
</Card>
```

#### Stat Card
```tsx
<Card className="rounded-lg bg-gradient-to-br from-white to-primary-50
  border border-neutral-200 p-4 shadow-sm">
  {/* Content */}
</Card>
```

### 5.3 Badges

#### Sport Badge
```tsx
<Badge className="bg-primary-100 text-primary-700 font-semibold 
  rounded-md px-2 py-0.5 text-xs uppercase tracking-wide">
  NBA
</Badge>
```

#### Result Badge (Win)
```tsx
<Badge className="bg-success-500 text-white font-bold rounded-lg px-3 py-1
  shadow-sm flex items-center gap-1">
  <Check className="h-4 w-4" /> WON
</Badge>
```

#### Result Badge (Loss)
```tsx
<Badge className="bg-destructive-500 text-white font-bold rounded-lg px-3 py-1
  shadow-sm flex items-center gap-1">
  <X className="h-4 w-4" /> LOST
</Badge>
```

### 5.4 Inputs

#### Text Input
```tsx
<Input className="rounded-lg border-2 border-neutral-200 focus:border-primary-500
  focus:ring-4 focus:ring-primary-500/20 px-4 py-3 text-base
  placeholder:text-neutral-400" />
```

#### Select
```tsx
<Select>
  <SelectTrigger className="rounded-lg border-2 border-neutral-200 
    focus:border-primary-500">
    {/* Content */}
  </SelectTrigger>
</Select>
```

### 5.5 Avatar

```tsx
<Avatar className="h-12 w-12 border-2 border-primary-500/30 shadow-sm">
  <AvatarImage src={user.avatar} />
  <AvatarFallback className="bg-primary-100 text-primary-700 font-bold">
    {initials}
  </AvatarFallback>
</Avatar>
```

### 5.6 Toast Notifications

```tsx
{/* Success */}
<Toast className="bg-success-500 text-white border-success-600 shadow-lg">
  <Check className="h-5 w-5" />
  <ToastTitle>Pick posted successfully!</ToastTitle>
</Toast>

{/* Error */}
<Toast className="bg-destructive-500 text-white border-destructive-600 shadow-lg">
  <AlertCircle className="h-5 w-5" />
  <ToastTitle>Failed to post pick</ToastTitle>
</Toast>
```

---

## 6. Motion & Micro-interactions

### Design Principles
- **Purposeful:** Every animation conveys state or guides attention
- **Snappy:** 150–250ms for most interactions; longer (300–400ms) for page transitions
- **Natural:** Ease-out for entrances, ease-in for exits, ease-in-out for loops
- **Reduced motion:** Respect `prefers-reduced-motion` media query

### Animation Catalog

#### Button Hover/Press
```css
.button-interactive {
  transition: all 200ms ease-out;
  transform: scale(1);
}
.button-interactive:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
}
.button-interactive:active {
  transform: scale(0.98);
}
```

#### Card Lift on Hover
```css
.card-lift {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.card-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

#### Like "Burst" Animation
```css
@keyframes like-burst {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.like-button.active {
  animation: like-burst 300ms ease-out;
}
```

#### Pull-to-Refresh (Mobile)
- Ball icon scales and rotates during pull
- Threshold: 60px pull distance
- Haptic feedback on trigger (if available)
- 400ms ease-out spring animation on release

#### Skeleton Loading
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-100) 0%,
    var(--neutral-200) 50%,
    var(--neutral-100) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

#### Page Transitions
```tsx
/* Fade in + slide up */
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

#### Modal/Drawer Entrance
- Backdrop fades in: 200ms
- Content slides up from bottom (mobile) or scales in (desktop): 250ms ease-out
- Stagger child elements by 50ms for polish

---

## 7. Accessibility (WCAG AA Compliance)

### Color & Contrast
- ✅ All text meets 4.5:1 contrast (7:1 for small text is ideal)
- ✅ Interactive elements (buttons, links) have 3:1 against background
- ✅ Focus indicators: 2px solid ring at 4:1 contrast
- ✅ Color-blind safe: Never rely on color alone (use icons + labels)

### Keyboard Navigation
- ✅ All interactive elements accessible via Tab/Shift+Tab
- ✅ Skip links: "Skip to main content" at top
- ✅ Focus visible: 4px ring with `--ring` color, offset 2px
- ✅ Escape key closes modals/drawers
- ✅ Arrow keys navigate lists/menus

### Screen Readers
- ✅ Semantic HTML: `<main>`, `<nav>`, `<article>`, `<aside>`
- ✅ ARIA labels on icon-only buttons
- ✅ Live regions for dynamic content (feed updates, notifications)
- ✅ Alt text on all images
- ✅ Form labels properly associated with inputs

### Focus States
```css
.focus-visible:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

### Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Responsive Design

### Mobile-First Strategy
1. Design for 375px width (iPhone SE) as baseline
2. Scale up to tablet (768px), then desktop (1024px+)
3. Touch targets: Minimum 44×44px (48×48px preferred)
4. Bottom navigation on mobile; sidebar on desktop

### Breakpoint-Specific Patterns

#### Mobile (< 768px)
- Single column layout
- Bottom tab navigation (sticky)
- Full-width cards with 16px side padding
- Stacked stat grids (2×2)
- Drawer for create post, filters

#### Tablet (768px – 1024px)
- Two-column feed layout
- Persistent left sidebar (collapsed to icons)
- 3-column stat grids
- Modals instead of drawers

#### Desktop (> 1024px)
- Three-column layout: sidebar (240px) | feed (600px) | widgets (360px)
- Expanded sidebar with labels
- 4-column stat grids
- Hover interactions replace taps
- Inline create post in feed header

---

## 9. Empty States & Error Handling

### Empty States

#### No Picks Yet
```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <Trophy className="h-16 w-16 text-neutral-300 mb-4" />
  <h3 className="text-xl font-bold text-neutral-700 mb-2">
    No picks yet
  </h3>
  <p className="text-neutral-500 mb-6 max-w-sm">
    Share your first prediction and start building your track record
  </p>
  <Button className="bg-primary-500">Create Your First Pick</Button>
</div>
```

#### Network Error
```tsx
<Card className="border-2 border-destructive-200 bg-destructive-50 p-6">
  <AlertCircle className="h-12 w-12 text-destructive-500 mb-3" />
  <h3 className="font-bold text-destructive-700 mb-2">Connection Error</h3>
  <p className="text-destructive-600 mb-4">
    Couldn't load feed. Check your connection and try again.
  </p>
  <Button variant="outline" className="border-destructive-500 text-destructive-600">
    Retry
  </Button>
</Card>
```

### Loading States

#### Skeleton Cards
```tsx
<Card className="rounded-xl p-4 animate-pulse">
  <div className="flex items-center gap-3 mb-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="flex-1">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
  <Skeleton className="h-20 w-full rounded-lg mb-3" />
  <Skeleton className="h-4 w-full" />
</Card>
```

#### Spinner (Inline)
```tsx
<Spinner className="h-5 w-5 text-primary-500 animate-spin" />
```

---

## 10. Compliance & Responsible Gambling UI

### Age Gate (First Launch)
```tsx
<Card className="max-w-md p-8 text-center">
  <AlertCircle className="h-16 w-16 text-primary-500 mx-auto mb-4" />
  <h2 className="text-2xl font-bold mb-2">Age Verification Required</h2>
  <p className="text-neutral-600 mb-6">
    You must be 18+ to use YouBet. We take responsible gambling seriously.
  </p>
  {/* Date picker or ID verification */}
  <Button className="w-full bg-primary-500">Verify Age</Button>
</Card>
```

### Geolocation Banner
```tsx
<Banner className="bg-primary-50 border-l-4 border-primary-500 p-4">
  <MapPin className="h-5 w-5 text-primary-600" />
  <p className="text-sm text-primary-800">
    <strong>Location Required:</strong> Confirm your region to access sportsbook links.
  </p>
  <Button size="sm" variant="outline">Allow Location</Button>
</Banner>
```

### Responsible Gambling Footer (Persistent)
```tsx
<footer className="sticky bottom-20 bg-neutral-100 border-t border-neutral-200 p-4">
  <p className="text-xs text-neutral-600 text-center">
    Bet responsibly. 
    <a href="/responsible-gambling" className="underline text-primary-600">Learn more</a> |
    <a href="/help" className="underline text-primary-600">Get help</a>
  </p>
</footer>
```

### Affiliate Disclosure
```tsx
{/* On deep-link buttons */}
<Button className="relative">
  Place Bet at DraftKings
  <Tooltip>
    <TooltipContent className="text-xs">
      YouBet may earn a commission from this partner
    </TooltipContent>
  </Tooltip>
</Button>
```

---

## 11. Before/After Comparison

### Before (v0 Prototype)
- ❌ Inconsistent color palette (cyan + amber)
- ❌ No proper routing (single-page state)
- ❌ Mock data, no backend
- ❌ Accessibility gaps (contrast, focus states)
- ❌ No compliance surfaces
- ❌ Limited responsiveness
- ❌ No error/empty states

### After (Production System)
- ✅ Unified warm palette (sunset amber theme)
- ✅ Proper Next.js App Router with RSC
- ✅ Full-stack API + Prisma + Redis
- ✅ WCAG AA accessible (contrast, keyboard, screen readers)
- ✅ Age gate, geofencing, responsible gambling
- ✅ Fully responsive (mobile-first, 3 breakpoints)
- ✅ Comprehensive empty/error/loading states
- ✅ Motion system with reduced-motion support
- ✅ Design tokens for consistency
- ✅ Storybook component library

---

## 12. Implementation Checklist

### Phase 1: Design Tokens (Week 1)
- [ ] Update `globals.css` with new color system
- [ ] Create spacing, typography, shadow tokens
- [ ] Update Tailwind config
- [ ] Add design token exports for Storybook

### Phase 2: Component Upgrades (Week 1-2)
- [ ] Upgrade buttons (primary, secondary, destructive, ghost)
- [ ] Upgrade cards (pick, stat, profile)
- [ ] Upgrade badges (sport, result, ROI)
- [ ] Upgrade inputs, selects, textareas
- [ ] Add skeleton loaders
- [ ] Add empty state templates

### Phase 3: Animation System (Week 2)
- [ ] Implement button hover/press animations
- [ ] Add card lift transitions
- [ ] Create like burst animation
- [ ] Build skeleton shimmer
- [ ] Add page transition wrappers
- [ ] Test reduced-motion fallbacks

### Phase 4: Accessibility Audit (Week 2-3)
- [ ] Run axe DevTools on all pages
- [ ] Add skip links
- [ ] Verify keyboard navigation (Tab, Escape, Arrow)
- [ ] Add ARIA labels to icon buttons
- [ ] Test with VoiceOver/NVDA
- [ ] Ensure 4.5:1 contrast ratios

### Phase 5: Responsive Testing (Week 3)
- [ ] Test 375px (iPhone SE)
- [ ] Test 390px (iPhone 14)
- [ ] Test 768px (iPad Mini)
- [ ] Test 1024px (iPad Pro)
- [ ] Test 1920px (Desktop)
- [ ] Verify touch targets (44×44px min)

### Phase 6: Storybook Setup (Week 3-4)
- [ ] Install Storybook 8
- [ ] Create stories for all components
- [ ] Document design tokens
- [ ] Add interaction tests
- [ ] Publish to Chromatic (or equivalent)

### Phase 7: Compliance UI (Week 4)
- [ ] Age gate modal
- [ ] Geolocation banner
- [ ] Responsible gambling page
- [ ] Affiliate disclosure tooltips
- [ ] Help/support links

---

## 13. Design Assets

### Required Exports
1. **Figma file:** Component library + design tokens
2. **Icon set:** Lucide (already integrated) + custom sport icons
3. **Illustrations:** Empty states (SVG)
4. **Logo:** YouBet wordmark + logomark (SVG, PNG @1x, @2x)
5. **Favicon:** 32×32, 192×192, 512×512

### Asset Guidelines
- **Image optimization:** WebP with JPEG fallback, lazy-load below fold
- **Icon size:** Use fixed sizes (16, 20, 24, 32px) for crispness
- **Avatar sizes:** 32, 40, 48, 64, 96px
- **Max card image:** 800px width for performance

---

## 14. Success Metrics

### Design Quality
- **WCAG AA:** 100% compliance (automated + manual audit)
- **Lighthouse:** 90+ Performance, 100 Accessibility
- **FCP:** < 1.5s (First Contentful Paint)
- **LCP:** < 2.5s (Largest Contentful Paint)
- **CLS:** < 0.1 (Cumulative Layout Shift)

### User Experience
- **Mobile usability:** No horizontal scroll, 44px touch targets
- **Keyboard navigation:** 100% of features accessible
- **Error recovery:** Clear messaging + actionable CTAs
- **Consistency:** 0 ad-hoc colors or spacing values

---

## 15. Maintenance & Evolution

### Design System Governance
- **Single source of truth:** Figma component library
- **Token updates:** globals.css → code review → deploy
- **Component updates:** Storybook story → test → merge
- **Breaking changes:** Major version bump, migration guide

### Feedback Loop
1. User testing (monthly)
2. Analytics review (A/B tests on CTAs, layouts)
3. Accessibility audits (quarterly)
4. Design system updates (as needed)

---

## Appendix A: Resources

- **Color tool:** [OKLCH Color Picker](https://oklch.com/)
- **Contrast checker:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Accessibility testing:** [axe DevTools](https://www.deque.com/axe/devtools/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Storybook:** [Storybook 8 Docs](https://storybook.js.org/)

---

## Appendix B: Component Inventory

**From v0 Prototype:**
1. LoadingScreen ✅
2. SignIn ✅
3. HomeFeed ✅ (upgrade needed)
4. CreatePost ✅ (upgrade needed)
5. UserProfile ✅ (upgrade needed)
6. Dashboard ✅ (upgrade needed)
7. Discovery ✅ (upgrade needed)
8. ChatCommunity ✅
9. BottomNav ✅
10. Button (shadcn) ✅
11. Card (shadcn) ✅
12. Avatar (shadcn) ✅
13. Badge (shadcn) ✅
14. Input (shadcn) ✅

**To Build:**
15. AgeGateModal
16. GeolocationBanner
17. ResponsibleGamblingFooter
18. PickCard (upgraded with proof, lock state)
19. LeaderboardRow
20. SkeletonCard
21. EmptyState
22. ErrorCard
23. DeepLinkButton (affiliate disclosure)
24. StatBadge
25. SportIcon
26. ROIChart (Recharts wrapper)
27. WinRateChart
28. FollowButton
29. LikeButton (with burst animation)
30. CommentInput

---

**End of Design Upgrade Specification v1.0**

