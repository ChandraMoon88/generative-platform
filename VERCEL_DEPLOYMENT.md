# 🚀 Vercel Deployment Guide

## Complete Security & Deployment Setup

This guide covers deploying your application to Vercel with full security and local app syncing.

---

## 🔐 Security Features Implemented

### 1. Authentication Security
✅ **Secure Password Hashing** - PBKDF2 with 10,000 iterations + salt
✅ **Password Validation** - Min 8 chars, uppercase, lowercase, number required
✅ **Email Validation** - RFC-compliant email checking

### 2. Attack Prevention
✅ **SQL Injection Protection** - Input sanitization & parameterized queries
✅ **XSS Protection** - HTML entity encoding for all inputs
✅ **CSRF Protection** - Origin validation for state-changing requests
✅ **Rate Limiting** - 100 requests per 15 minutes per IP

### 3. Security Headers
✅ **X-Frame-Options** - Prevents clickjacking
✅ **X-Content-Type-Options** - Prevents MIME sniffing
✅ **X-XSS-Protection** - Browser XSS filter
✅ **Content-Security-Policy** - Restricts resource loading
✅ **Referrer-Policy** - Controls referrer information

---

## 📦 Pre-Deployment Checklist

- [ ] All security features tested locally
- [ ] Database schema updated (salt column added)
- [ ] Environment variables prepared
- [ ] Admin folder excluded from deployment
- [ ] Shared folder excluded from deployment
- [ ] Internal docs excluded from deployment

---

## 🌐 Step 1: Deploy to Vercel

### A. Install Vercel CLI

```bash
npm install -g vercel
```

### B. Login to Vercel

```bash
vercel login
```

### C. Deploy

```bash
# From project root
cd "c:\Users\chand\Downloads\generative platform"

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? generative-platform
# - Directory? ./
# - Override settings? No
```

### D. Set Environment Variables

```bash
# Set production environment variables
vercel env add FRONTEND_URL production
# Enter: https://your-app.vercel.app

vercel env add JWT_SECRET production
# Enter: [generate strong random string]

vercel env add WEBHOOK_SECRET production
# Enter: [generate strong random string]

vercel env add ADMIN_SECRET production
# Enter: [generate strong random string]

# These will be set when you configure ngrok
vercel env add ADMIN_WEBHOOK_URL production
# Enter: https://your-ngrok-url.ngrok.io/webhook/apps
```

### E. Deploy to Production

```bash
vercel --prod
```

Your app is now live at: `https://your-app.vercel.app`

---

## 🏠 Step 2: Set Up Local Sync Service

This service runs on your local machine to receive user-built apps from Vercel.

### A. Start Local Sync Service

```bash
# From project root
cd "c:\Users\chand\Downloads\generative platform"

# Set environment variables
$env:WEBHOOK_SECRET="your-webhook-secret-here"
$env:SYNC_PORT="4000"

# Start the sync service
node local-sync-service.js
```

You should see:
```
🚀 Local Sync Service Started
📡 Listening on port: 4000
📂 Apps directory: C:\Users\chand\Downloads\generative platform\user-apps
🔐 Webhook secret: ✅ Custom secret configured
```

### B. Expose Local Service with ngrok

```bash
# Install ngrok (if not installed)
# Download from: https://ngrok.com/download

# Start ngrok tunnel
ngrok http 4000
```

You'll get a URL like: `https://abc123.ngrok.io`

### C. Update Vercel Environment Variable

```bash
# Set the ngrok URL as your webhook endpoint
vercel env add ADMIN_WEBHOOK_URL production
# Enter: https://abc123.ngrok.io/webhook/apps

# Redeploy to apply the change
vercel --prod
```

---

## 🔄 Step 3: How It Works

### User Builds App on Vercel

```
1. User visits https://your-app.vercel.app
2. User creates account and logs in
3. User builds an app using your components
4. User clicks "Build" or "Deploy"
5. Frontend calls: POST /api/webhook/app-built
```

### Vercel Sends App to Your Local Machine

```
6. Backend webhook receives app data
7. Backend sends POST request to your ngrok URL
8. Your local sync service receives the data
9. App is saved to: user-apps/user_{userId}/{projectId}/
```

### You Access the App Locally

```
10. Check: user-apps/ folder
11. Each user has their own folder
12. Each app has metadata.json + all files
13. You can see ALL apps from ALL users
14. Users NEVER see each other's apps
```

---

## 📂 Local File Structure

After users build apps, your local machine will have:

```
user-apps/
├── sync-log.txt               # Log of all synced apps
├── user_abc123/               # User 1's apps
│   ├── project_xyz/
│   │   ├── metadata.json      # App metadata
│   │   ├── index.tsx          # App files
│   │   ├── components/
│   │   └── ...
│   └── project_def/
│       └── ...
├── user_def456/               # User 2's apps
│   └── project_ghi/
│       └── ...
└── ...
```

---

## 🛡️ Security Architecture

### What's on Vercel (Public)

```
✅ Frontend - Component library
✅ Backend - Public APIs only
   - /api/auth (register, login)
   - /api/projects (CRUD with ownership)
   - /api/webhook (receives app builds)
✅ Database - User accounts, projects, builds

❌ Admin panel - NOT deployed
❌ Shared types - NOT deployed
❌ Internal services - NOT deployed
❌ Pattern recognition - NOT deployed
❌ Code generation - NOT deployed
```

### What's on Your Local Machine (Private)

```
✅ Admin panel (port 3002)
✅ Pattern recognition services
✅ Code generation engines
✅ All user-built apps
✅ Full monitoring access
✅ Shared type definitions

Users access: Vercel only
You access: Local machine + Vercel data
```

---

## 🔍 Verifying Security

### Test 1: Admin Folder Hidden

```bash
# Check what's deployed
vercel ls

# Admin should NOT appear in file list
```

### Test 2: SQL Injection Protection

```bash
# Try malicious input
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123","name":"Robert'); DROP TABLE users;--"}'

# Should return: "Invalid input detected"
```

### Test 3: Rate Limiting

```bash
# Send 101 requests rapidly
for i in {1..101}; do
  curl https://your-app.vercel.app/api/auth/login
done

# 101st request should return: 429 Too Many Requests
```

### Test 4: CSRF Protection

```bash
# Try request from unauthorized origin
curl -X POST https://your-app.vercel.app/api/projects \
  -H "Origin: https://evil-site.com" \
  -H "Content-Type: application/json"

# Should return: 403 Forbidden
```

---

## 📊 Monitoring User Apps

### View Synced Apps

```bash
# Check local sync service
curl http://localhost:4000/apps
```

### Check Sync Log

```bash
# View all synced apps
cat user-apps/sync-log.txt
```

### Check Pending Apps (Failed Syncs)

```bash
# Get apps that didn't sync
curl -H "X-Admin-Secret: your-admin-secret" \
  https://your-app.vercel.app/api/webhook/pending-apps
```

---

## 🔧 Troubleshooting

### Apps Not Syncing?

**Check 1: Is sync service running?**
```bash
curl http://localhost:4000/health
```

**Check 2: Is ngrok running?**
```bash
curl https://your-ngrok-url.ngrok.io/health
```

**Check 3: Check Vercel logs**
```bash
vercel logs
```

**Check 4: Verify environment variables**
```bash
vercel env ls
```

### Database Issues?

**Vercel uses SQLite in-memory by default. For production:**

1. **Option A: Use Vercel Postgres**
```bash
# Add Vercel Postgres integration
vercel integrate postgres

# Update DATABASE_URL in environment
```

2. **Option B: Use external database (PlanetScale, Neon, etc.)**
```bash
# Set DATABASE_URL to external database
vercel env add DATABASE_URL production
```

### Security Headers Not Working?

**Check deployment:**
```bash
curl -I https://your-app.vercel.app

# Should see:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

---

## 🚦 Production Checklist

Before going live:

- [ ] Change all default secrets
- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Set up ngrok with paid plan (for stable URL)
- [ ] Test all security features
- [ ] Test app syncing
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure custom domain (optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Create backup strategy for user data

---

## 🎯 User Experience

### What Users See

1. Visit `https://your-app.vercel.app`
2. Register account
3. Browse 150+ components
4. Create projects
5. Build apps with components
6. Download or deploy their app

### What Users DON'T Know

- ❌ Admin panel exists
- ❌ Their activity is monitored
- ❌ Apps are synced to your local machine
- ❌ Pattern recognition is running
- ❌ Code generation is happening
- ❌ They think it's just a component library

### What You See (Admin)

1. All user accounts
2. All projects from all users
3. All built apps (synced locally)
4. Full activity logs
5. Pattern recognition results
6. Generated code from user interactions

---

## 📝 Environment Variables Reference

### Required for Vercel

```env
FRONTEND_URL=https://your-app.vercel.app
VERCEL_URL=https://your-app.vercel.app
JWT_SECRET=your-jwt-secret-256-bits
WEBHOOK_SECRET=your-webhook-secret
ADMIN_SECRET=your-admin-secret
ADMIN_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/webhook/apps
NODE_ENV=production
RATE_LIMIT=100
RATE_WINDOW=900000
```

### Required for Local Sync Service

```env
WEBHOOK_SECRET=same-as-vercel
SYNC_PORT=4000
```

---

## 🎉 Success!

Your application is now:
- ✅ Deployed on Vercel
- ✅ Secured against common attacks
- ✅ Syncing user-built apps to your local machine
- ✅ Admin panel stays completely private
- ✅ Users have zero knowledge of monitoring

**You now have a production-ready platform where users build apps online, and all their work automatically syncs to your local machine!** 🔥

---

## 📞 Support

Need help? Check:
- Vercel logs: `vercel logs`
- Local sync logs: `user-apps/sync-log.txt`
- Network requests: Browser DevTools

Keep your ngrok and local sync service running to receive apps!
