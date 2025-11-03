# 🚀 Quick Start: Push to New Repository

**5-minute guide to get YouBet on GitHub and deployed**

---

## Step 1: Push to GitHub (2 minutes)

```bash
# Navigate to your project
cd /Users/stephen/Downloads/code

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: YouBet MVP - complete full-stack app with auth, contacts, feed, and messaging"

# Create new repository on GitHub (via CLI)
gh repo create youbet --public --source=. --remote=origin --push

# OR manually:
# 1. Go to github.com/new
# 2. Name: youbet
# 3. Create repository
# 4. Then run:
git remote add origin https://github.com/YOUR_USERNAME/youbet.git
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## Step 2: Deploy Backend on Railway (5 minutes)

### Option A: Using Railway Dashboard (Easiest)

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `youbet` repository
5. Select `apps/api` as root directory
6. Railway will auto-detect NestJS

### Add Services:

1. **Click "New" → "Database" → "PostgreSQL"**
   - Railway will auto-create and link
   - `DATABASE_URL` is auto-set

2. **Click "New" → "Database" → "Redis"**
   - Railway will auto-create and link
   - `REDIS_HOST` and `REDIS_PORT` are auto-set

### Set Environment Variables:

Click on API service → "Variables" → Add:
```
JWT_SECRET=<generate-random-32-char-string>
PORT=3001
NODE_ENV=production
```

Generate JWT_SECRET:
```bash
openssl rand -base64 32
```

### Deploy:

- Railway will automatically deploy
- Wait for build to complete (~2-3 minutes)
- Copy your API URL (e.g., `https://youbet-api.up.railway.app`)

---

## Step 3: Deploy Frontend on Vercel (3 minutes)

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your `youbet` repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && pnpm build --filter=@youbet/web`
   - **Install Command:** `pnpm install`

### Add Environment Variable:

Under "Environment Variables":
```
Name: NEXT_PUBLIC_API_URL
Value: <your-railway-api-url-from-step-2>
```

Example: `https://youbet-api.up.railway.app`

### Deploy:

- Click "Deploy"
- Wait for build (~2-3 minutes)
- Copy your app URL (e.g., `https://youbet.vercel.app`)

---

## Step 4: Initialize Database (2 minutes)

### Run Migrations:

**Option A: Via Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run pnpm prisma migrate deploy
```

**Option B: Via Railway Dashboard**
1. Click on API service
2. Go to "Settings" → "Deploy"
3. Under "Custom Start Command", temporarily set:
   ```
   pnpm prisma migrate deploy && pnpm start:prod
   ```
4. Redeploy

---

## Step 5: Test Your Deployment (1 minute)

### Test API:
```bash
curl https://your-railway-url.up.railway.app/health
# Should return: {"status":"ok"}
```

### Test Frontend:
1. Go to your Vercel URL
2. You should see the loading screen animation
3. Click through sign-in flow

---

## ✅ Done! Your App is Live

- **Frontend:** https://youbet.vercel.app
- **API:** https://youbet-api.up.railway.app
- **API Docs:** https://youbet-api.up.railway.app/api

---

## 🎯 What to Do Next

### 1. Configure Custom Domain (Optional)

**For Frontend (Vercel):**
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel Dashboard → Settings → Domains
3. Add `youbet.app` and `www.youbet.app`
4. Follow DNS instructions

**For Backend (Railway):**
1. Railway Dashboard → Settings → Domains
2. Add `api.youbet.app`
3. Update DNS records

### 2. Set Up Monitoring

**Add Sentry:**
```bash
pnpm add @sentry/nextjs @sentry/node

# Add to Railway environment variables
SENTRY_DSN=your_sentry_dsn
```

**Set Up Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com) (Free)
- Monitor: youbet.vercel.app and railway API URL

### 3. Enable SMS (Optional)

**Sign up for Twilio:**
1. Go to [twilio.com](https://twilio.com)
2. Get account SID and auth token
3. Buy a phone number
4. Add to Railway environment variables:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=xxxxx
   TWILIO_PHONE_NUMBER=+15551234567
   ```

### 4. Add Google/Apple OAuth (Optional)

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth credentials
3. Add to Railway:
   ```
   GOOGLE_CLIENT_ID=xxxxx
   GOOGLE_CLIENT_SECRET=xxxxx
   ```

**Apple Sign In:**
1. [Apple Developer](https://developer.apple.com)
2. Configure Sign in with Apple
3. Add credentials to Railway

---

## 🐛 Troubleshooting

### "API not responding"

1. Check Railway logs:
   ```bash
   railway logs
   ```

2. Common issues:
   - Migrations not run → Run `prisma migrate deploy`
   - Environment variables missing → Check Railway dashboard
   - Database not connected → Check `DATABASE_URL`

### "Frontend can't reach API"

1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Make sure it starts with `https://`
3. Check CORS in API (`apps/api/src/main.ts`)

### "Database connection failed"

1. Railway Dashboard → PostgreSQL service
2. Copy `DATABASE_URL`
3. Paste in API service environment variables
4. Redeploy

---

## 📊 Free Tier Limits

### Vercel (Free)
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments

### Railway (Free Trial)
- ✅ $5 credit (about 5-10 days)
- ✅ PostgreSQL + Redis included
- ⚠️ Upgrade to $5/month after trial

**Total Cost: $0-5/month for MVP** 💰

---

## 🎉 Success!

You now have:
- ✅ Code on GitHub
- ✅ Backend deployed (Railway)
- ✅ Frontend deployed (Vercel)
- ✅ Database running
- ✅ Redis caching
- ✅ CI/CD pipeline

**Time to launch:** ~15-20 minutes ⚡

---

## 📚 Next Reading

- **Detailed guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Full setup:** [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)
- **Pre-launch:** [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)

---

**Need help?** Open an issue on GitHub!

**Ready to scale?** Check the deployment guide for production setup.

**Let's build something amazing!** 🚀

