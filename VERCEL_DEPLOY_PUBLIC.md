# 🚀 Vercel Deployment Guide

## Quick Deploy (Frontend Only - Recommended for Users)

### Step 1: Prepare Repository for Public Release

1. **Verify .gitignore** - Ensure admin folder and sensitive files are excluded:
```bash
# Check what will be committed
git status

# Admin folder should NOT appear in git status
# If it does, it means .gitignore isn't working
```

2. **Commit User-Facing Code Only**:
```bash
git add frontend/
git add backend/
git add README_USER.md
git add .gitignore
git add vercel_frontend.json
git commit -m "Release: EcoSphere game for public play"
git push origin main
```

### Step 2: Deploy Frontend to Vercel

1. **Sign Up/Login** to [vercel.com](https://vercel.com)

2. **Import Repository**:
   - Click "New Project"
   - Import your GitHub repository
   - Select the `main` branch

3. **Configure Build Settings**:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables** (Optional for now):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

5. **Click "Deploy"** - Your game will be live in ~30 seconds!

### Step 3: Deploy Backend (Optional - For Full Functionality)

**Recommended Services:**
- **Railway.app** (Easy, free tier)
- **Render.com** (Free tier available)
- **Heroku** (Requires credit card)

**Railway Deployment:**
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Configure:
   ```
   Root Directory: backend
   Start Command: npm start
   ```
5. Add PostgreSQL database (click + New → Database → PostgreSQL)
6. Copy the backend URL

**Update Frontend Environment:**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`
- Redeploy

---

## What Gets Deployed vs Hidden

### ✅ Public (GitHub & Vercel)
- `frontend/` - User game interface
- `backend/` - API endpoints (optional)
- `README_USER.md` - Public instructions
- `.gitignore` - Protects sensitive files

### 🔒 Private (Local Only)
- `admin/` - Admin dashboard with full level access
- All `*ADMIN*.md` files
- `plan.txt` - Design document
- `ECOSPHERE_IMPLEMENTATION_CHECKLIST.txt`
- Internal documentation
- Utility scripts

---

## Security Checklist Before Public Release

- [ ] `.gitignore` includes `admin/` folder
- [ ] `.gitignore` includes all internal docs
- [ ] No admin routes exposed in frontend
- [ ] No sensitive environment variables committed
- [ ] README_USER.md is user-focused (no admin info)
- [ ] Admin dashboard requires authentication
- [ ] Backend API has proper security (if deployed)

---

## Post-Deployment

### Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Register a new account**
3. **Play through Level 1** to verify functionality
4. **Check that levels must be completed sequentially** (no skipping)

### Update README

Replace placeholders in `README_USER.md`:
```markdown
**Visit:** https://your-actual-deployed-url.vercel.app
```

### Monitor

- Check Vercel Analytics for usage
- Monitor error logs in Vercel Dashboard
- Watch GitHub issues for bug reports

---

## Admin Access (Local Only)

**Admin dashboard stays local** - never deployed publicly.

To access admin locally:
```bash
# Terminal 1: Frontend (user game)
cd frontend && npm run dev

# Terminal 2: Admin dashboard  
cd admin && npm run dev

# Visit:
# http://localhost:3000 - User game
# http://localhost:3002 - Admin panel (all levels accessible)
```

---

## Troubleshooting

### Deployment Fails
- Check build logs in Vercel
- Ensure all dependencies in `package.json`
- Verify Node.js version compatibility

### Game Doesn't Load
- Check browser console for errors
- Verify environment variables
- Test locally first

### Admin Folder Visible in GitHub
- **CRITICAL:** Remove immediately!
- Add to `.gitignore`
- Remove from git history:
  ```bash
  git rm -r --cached admin/
  git commit -m "Remove admin folder"
  git push -f origin main
  ```

---

## Maintenance

### Update Game
```bash
# Make changes locally
git add frontend/
git commit -m "Update: description"
git push origin main
# Vercel auto-deploys
```

### Rollback
- Go to Vercel Dashboard → Deployments
- Find previous working deployment
- Click "..." → "Promote to Production"

---

## Cost Estimate

**Free Tier Sufficient For:**
- Vercel: Unlimited deployments, 100GB bandwidth/month
- Railway: 500 hours/month, 100GB egress
- Total: $0/month for moderate usage

**Upgrade When:**
- 10,000+ monthly active users
- High bandwidth usage
- Need custom domain with SSL

---

*Deploy with confidence! Your admin dashboard and sensitive code stay private.* 🔒
