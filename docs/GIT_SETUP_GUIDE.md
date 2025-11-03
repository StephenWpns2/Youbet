# 📦 Git Repository Setup Guide

**Step-by-step guide to push YouBet to a new Git repository**

---

## 🎯 Quick Setup (3 Commands)

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "feat: initial commit - YouBet MVP with auth, contacts, and feed"

# 4. Add your remote repository
git remote add origin https://github.com/yourusername/youbet.git

# 5. Push to main branch
git branch -M main
git push -u origin main
```

---

## 📋 What Will Be Committed

### ✅ Included Files

**Frontend (`apps/web/`)**
- All React components
- Next.js pages and layouts
- Tailwind CSS configuration
- Public assets

**Backend (`apps/api/`)**
- NestJS modules and controllers
- Prisma configuration
- API services

**Packages (`packages/`)**
- Database schema and migrations
- API client SDK
- Shared configurations

**Configuration**
- `package.json` files
- `turbo.json`
- `pnpm-workspace.yaml`
- `tsconfig.json` files
- `docker-compose.yml`
- `.github/workflows/` (CI/CD)

**Documentation (`docs/`)**
- All markdown documentation
- Design specifications
- Architecture guides

### ❌ Excluded Files (via .gitignore)

- `node_modules/`
- `.env` files (except `.env.example`)
- `dist/` and `build/` directories
- `.next/` cache
- IDE-specific files (`.vscode/`, `.idea/`)
- Log files
- Database files (`.db`)

---

## 🔐 Before You Push

### 1. Review Sensitive Data

**Check for:**
- API keys in code
- Database credentials
- JWT secrets
- Service account keys

```bash
# Search for potential secrets
grep -r "sk_" apps/
grep -r "API_KEY" apps/
grep -r "SECRET" apps/

# Use git-secrets (recommended)
git secrets --scan
```

### 2. Verify .gitignore

```bash
# Check what will be committed
git status

# Should NOT see:
# - node_modules/
# - .env files
# - dist/ or build/ directories
```

### 3. Update env.example

```bash
# Make sure env.example has placeholder values only
cat env.example

# Should look like:
# JWT_SECRET="your-secret-key-change-in-production"
# NOT:
# JWT_SECRET="actual-secret-key-abc123"
```

---

## 🚀 Creating a New GitHub Repository

### Option 1: GitHub CLI (Fastest)

```bash
# Install GitHub CLI if not already
brew install gh  # macOS
# or download from https://cli.github.com/

# Login
gh auth login

# Create repository
gh repo create youbet --public --source=. --remote=origin --push

# Done! Your code is now on GitHub
```

### Option 2: GitHub Web Interface

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `youbet`
3. Description: "Social sports betting community - track picks, follow creators, win together"
4. Choose Public or Private
5. **Do NOT** initialize with README, .gitignore, or license (we have these already)
6. Click "Create repository"
7. Follow the commands shown (already provided above in Quick Setup)

---

## 📝 Recommended Commit Message

```bash
git commit -m "feat: initial commit - YouBet MVP

- Authentication system (Phone OTP, Google, Apple)
- Contact management with phone-based invites
- Home feed with betting picks
- User profiles and statistics
- Real-time messaging interface
- Analytics dashboard
- Complete NestJS API backend
- Docker Compose development environment
- Prisma database schema with migrations
- API client SDK with React hooks
- CI/CD pipeline with GitHub Actions
- Comprehensive documentation

Tech Stack:
- Frontend: Next.js 15, React, Tailwind CSS, shadcn/ui
- Backend: NestJS, Prisma, Redis, PostgreSQL
- Infrastructure: Docker, Turborepo
- Deployment: Vercel + Railway ready

Status: MVP ready for production deployment"
```

---

## 🌳 Branch Structure (Recommended)

```bash
# Create development branch
git checkout -b develop
git push -u origin develop

# Create staging branch
git checkout -b staging
git push -u origin staging

# Back to main
git checkout main
```

### Branch Strategy

- **main** - Production code (deployed)
- **staging** - Pre-production testing
- **develop** - Active development
- **feature/***  - New features
- **fix/** - Bug fixes
- **hotfix/** - Emergency production fixes

### Example Feature Branch

```bash
# Create feature branch
git checkout -b feature/notification-system
# ... make changes ...
git add .
git commit -m "feat(api): add push notification system"
git push -u origin feature/notification-system

# Create Pull Request on GitHub
gh pr create --title "Add push notification system" --body "Implements Firebase Cloud Messaging for real-time notifications"
```

---

## 🔒 Repository Settings (Recommended)

### Branch Protection (for main branch)

1. Go to Settings → Branches
2. Add branch protection rule for `main`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass (CI)
   - ✅ Require branches to be up to date
   - ✅ Include administrators
   - ❌ Allow force pushes (keep disabled)
   - ❌ Allow deletions (keep disabled)

### Secrets for CI/CD

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `RAILWAY_TOKEN` - For API deployment
   - `VERCEL_TOKEN` - For frontend deployment
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID
   - `DISCORD_WEBHOOK_URL` - For deployment notifications (optional)

### Repository Settings

- ✅ Enable Issues
- ✅ Enable Discussions (for community Q&A)
- ✅ Enable Projects (for roadmap tracking)
- ✅ Enable Wiki (optional)
- ✅ Automatically delete head branches (cleanup after PR merge)

---

## 📦 GitHub Topics (for discoverability)

Add these topics to your repository:

```
nextjs, react, typescript, nestjs, prisma, postgresql, redis, 
sports-betting, social-network, turborepo, tailwindcss, 
shadcn-ui, pnpm, docker, vercel, railway, monorepo
```

---

## 📄 Repository Files to Add

### 1. LICENSE

```bash
# Create MIT License
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 YouBet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

git add LICENSE
git commit -m "docs: add MIT license"
```

### 2. CONTRIBUTING.md

```bash
cat > CONTRIBUTING.md << 'EOF'
# Contributing to YouBet

Thank you for your interest in contributing to YouBet!

## How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit using conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Code Quality

- All code must pass ESLint and TypeScript checks
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

## Questions?

Open an issue or start a discussion!
EOF

git add CONTRIBUTING.md
git commit -m "docs: add contributing guidelines"
```

### 3. CODE_OF_CONDUCT.md

```bash
# Use Contributor Covenant
curl -o CODE_OF_CONDUCT.md https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md

git add CODE_OF_CONDUCT.md
git commit -m "docs: add code of conduct"
```

---

## 🔍 Verify Your Repository

### Before Making Public

```bash
# 1. Check for secrets
git secrets --scan

# 2. Review all files
git ls-files

# 3. Check commit history
git log --oneline

# 4. Verify .gitignore is working
git status --ignored

# 5. Test clone in a separate directory
cd /tmp
git clone https://github.com/yourusername/youbet.git
cd youbet
pnpm install
```

---

## 📊 Add Badges to README

Add these to the top of your README.md:

```markdown
![CI/CD](https://github.com/yourusername/youbet/workflows/CI%2FCD%20Pipeline/badge.svg)
![License](https://img.shields.io/github/license/yourusername/youbet)
![Stars](https://img.shields.io/github/stars/yourusername/youbet?style=social)
![Issues](https://img.shields.io/github/issues/yourusername/youbet)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
```

---

## 🎯 Post-Push Checklist

- [ ] Repository is accessible
- [ ] README displays correctly
- [ ] CI/CD pipeline is running
- [ ] No sensitive data in commits
- [ ] Branch protection enabled
- [ ] Secrets configured for deployment
- [ ] Topics added for discoverability
- [ ] License file present
- [ ] Contributing guidelines added

---

## 🚀 Next Steps After Pushing

1. **Set up Deployment**
   ```bash
   # Deploy to Vercel
   cd apps/web
   vercel --prod
   
   # Deploy to Railway
   cd apps/api
   railway up
   ```

2. **Enable GitHub Actions**
   - Actions should run automatically on push
   - Check Actions tab for status

3. **Create First Release**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0 - MVP Launch"
   git push origin v1.0.0
   ```

4. **Share Your Project**
   - Tweet about it
   - Post on Reddit (r/webdev, r/reactjs)
   - Share on LinkedIn
   - Submit to Product Hunt

---

## 🆘 Troubleshooting

### "Permission denied (publickey)"

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
ssh-add ~/.ssh/id_ed25519

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy and paste to GitHub Settings → SSH Keys
```

### "Large files detected"

```bash
# Remove large files from history
git filter-branch --tree-filter 'rm -f path/to/large/file' HEAD

# Or use BFG Repo Cleaner
brew install bfg
bfg --strip-blobs-bigger-than 50M
```

### "Accidentally pushed .env file"

```bash
# Remove from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (DANGER: Only if repository is private and just created)
git push origin --force --all

# Rotate all secrets immediately!
```

---

## 📖 Additional Resources

- [GitHub Docs](https://docs.github.com/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

---

**Ready to push!** 🚀

```bash
git push -u origin main
```

