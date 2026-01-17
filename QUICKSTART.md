# 🚀 Quick Start Guide

## Start Everything (Easy Way)

```powershell
cd "c:\Users\chand\Downloads\generative platform"
.\start-all.ps1
```

This will open 3 windows:
- Backend API (Port 3001)
- Client Server (Port 3000) 
- Admin Server (Port 3002)

## Stop Everything

```powershell
cd "c:\Users\chand\Downloads\generative platform"
.\stop-all.ps1
```

---

## Manual Start (If you prefer)

### Terminal 1 - Backend
```powershell
cd "c:\Users\chand\Downloads\generative platform\backend"
npm run dev
```

### Terminal 2 - Client
```powershell
cd "c:\Users\chand\Downloads\generative platform\frontend"
npm run dev
```

### Terminal 3 - Admin
```powershell
cd "c:\Users\chand\Downloads\generative platform\admin"
npm run dev
```

---

## 🔗 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Client** | http://localhost:3000 | Users register and "play" |
| **Admin** | http://localhost:3002 | Your admin dashboard |
| **API** | http://localhost:3001 | Backend services |

---

## 🔑 Your Admin Credentials

**URL:** http://localhost:3002/login

**Email:** `chandrashekarkuncham7@gmail.com`  
**Password:** `Moonstar@88Moon`

⚠️ **Never share these or commit to GitHub!**

---

## 📝 What Users See vs What You See

### Users (Port 3000)
- Colorful, gamified interface
- Think they're "playing" or "testing"
- Build restaurant features
- Don't know they're creating real apps

### You (Port 3002)
- Professional admin interface
- See all user activities
- View patterns and generated code
- Export production-ready apps

---

## 🔧 Troubleshooting

**Backend not starting?**
```powershell
cd backend
npm install
npm run dev
```

**Port already in use?**
```powershell
# Stop all servers first
.\stop-all.ps1
# Then start again
.\start-all.ps1
```

**Need to reset database?**
```powershell
cd backend
Remove-Item data\*.db
npm run dev  # Will recreate database
```
