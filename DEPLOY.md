# 🚀 EcoSphere Deployment Guide

This guide shows you how to deploy the EcoSphere game to production.

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Test all 15 levels locally
- [ ] Verify admin dashboard works on localhost:3002
- [ ] Check .gitignore excludes admin folder
- [ ] Run `.\check-public-release.ps1` to verify config
- [ ] Update environment variables
- [ ] Test user sequential progression
- [ ] Backup admin database

---

## 🌐 Deploy to Vercel (Frontend Only)

### Step 1: Prepare Repository

```bash
# Navigate to project root
cd "c:\Users\chand\Downloads\generative platform"

# Check what will be public
git status

# Verify admin is NOT in the list
# If you see "admin/" in git status, STOP and fix .gitignore first

# Add public files
git add frontend/ backend/ README.md .gitignore vercel_frontend.json

# Commit
git commit -m "EcoSphere: Public release v1.0"

# Push to GitHub
git push origin main
```

### Step 2: Deploy Frontend to Vercel

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy to production
vercel --prod

# Follow prompts:
# - Project name: ecosphere-game
# - Framework: Next.js
# - Build command: npm run build
# - Output directory: .next
```

### Step 3: Configure Environment Variables

In Vercel dashboard, add:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_GAME_NAME=EcoSphere
```

### Step 4: Deploy Backend

**Option A: Railway**
```bash
cd backend
railway login
railway init
railway up
```

**Option B: Render**
1. Connect GitHub repo to Render
2. Create new Web Service
3. Select `backend` directory
4. Add environment variables
5. Deploy

---

## 🔐 Security Reminders

### ✅ What IS public (on GitHub/Vercel):
- `frontend/` - User-facing game
- `backend/` - API server
- `README.md` - User documentation
- `.gitignore` - Exclusion rules
- `vercel_frontend.json` - Frontend deploy config

### 🔒 What stays PRIVATE (local only):
- `admin/` - Admin dashboard (localhost:3002 only)
- `plan.txt` - Development notes
- `ADMIN_*.md` - Admin documentation
- `*ADMIN*.md` - Security guides
- `ECOSPHERE_IMPLEMENTATION_CHECKLIST.txt` - Internal checklist
- `LEVEL_14_15_COMPLETE.md` - Implementation docs
- `VERCEL_DEPLOY_PUBLIC.md` - Deployment instructions
- `start-all.ps1` / `stop-all.ps1` - Local dev scripts

**CRITICAL**: Never commit admin folder to GitHub. It contains unrestricted access to all levels.

---

## 🧪 Testing Deployed Version

### Test User Flow:
1. Visit your Vercel URL (e.g., `ecosphere-game.vercel.app`)
2. Create a new user account
3. Start from Level 1
4. Try to skip to Level 5 - should be blocked
5. Complete Level 1 objectives
6. Verify Level 2 unlocks automatically
7. Check progress saves correctly

### Test Admin (Local Only):
1. Visit `http://localhost:3002/ecosphere`
2. Log in as admin
3. Click any level card - should open directly
4. Verify `?admin=true` parameter in URL
5. Test completion screen access
6. Export data functionality

### Expected Behavior:
- ✅ Users must complete levels sequentially
- ✅ Admin can access any level directly
- ✅ Admin dashboard NOT accessible on deployed site
- ✅ Progress saves to backend API
- ✅ Mobile responsive on all devices

---

## 🐛 Troubleshooting

### "Admin folder visible in GitHub"
```bash
# Fix .gitignore
echo "admin/" >> .gitignore
echo "admin/**" >> .gitignore

# Remove from git (but keep locally)
git rm -r --cached admin/
git commit -m "Remove admin from GitHub"
git push
```

### "User can skip levels"
- Check frontend game state logic
- Verify `completedLevels` array enforcement
- Ensure admin query param only works locally

### "Vercel build fails"
```bash
# Verify frontend builds locally
cd frontend
npm run build

# Check for TypeScript errors
npm run type-check

# Check logs in Vercel dashboard
```

### "Backend not connecting"
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check backend is deployed and running
- Test API endpoint directly: `curl https://your-backend.com/health`

---

## 📊 Post-Deployment

### Monitor
- Vercel Analytics dashboard
- Backend logs (Railway/Render)
- User feedback and bug reports
- Level completion rates

### Update
```bash
# Make changes to frontend
git add frontend/
git commit -m "Update: [description]"
git push

# Vercel auto-deploys from GitHub
# Or manually: vercel --prod
```

### Backup Admin Database
```bash
# Export admin user data
cd admin
npm run export-data

# Store securely (NOT in GitHub)
```

---

## 🎉 Success!

Your EcoSphere game is now live and accessible to players worldwide!

**Next Steps:**
- Share the game link with your community
- Monitor player progress through admin dashboard
- Gather feedback for future improvements
- Add more levels or features

---

## 📞 Support

Having issues? Check:
- [README.md](./README.md) - User guide
- [Backend Setup](./backend/README.md) - API configuration
- [Frontend Setup](./frontend/README.md) - Game setup
- GitHub Issues - Report bugs

---

**Remember**: Admin stays local. Users play sequentially. Security first. 🔐
