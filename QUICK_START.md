# 🚀 Quick Start Guide

## Setup (5 minutes)

### 1. Start Backend Server
```bash
cd "c:\Users\chand\Downloads\generative platform\backend"
npm run dev
```
✅ Backend running on **http://localhost:3001**

### 2. Start Client App
```bash
cd "c:\Users\chand\Downloads\generative platform\frontend"
npm run dev
```
✅ Client app running on **http://localhost:3000**

### 3. Start Admin Panel
```bash
cd "c:\Users\chand\Downloads\generative platform\admin"
npm run dev
```
✅ Admin panel running on **http://localhost:3002**

## Create Test Accounts

### Option 1: Using Web Interface

**Create Client Account:**
1. Go to http://localhost:3000/register
2. Fill in: Name, Email, Password
3. Click "Register"
4. ✅ Automatically logged in and redirected to /projects

**Create Admin Account (via API):**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@test.com\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

### Option 2: Using PowerShell

**Create Client:**
```powershell
$body = @{
    name = "John Doe"
    email = "john@test.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

**Create Admin:**
```powershell
$body = @{
    name = "Admin User"
    email = "admin@test.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

## Test the System

### As Client (John)

1. **Login:**
   - Go to http://localhost:3000/login
   - Email: john@test.com
   - Password: password123

2. **Browse Components:**
   - Click "Browse Components" button
   - See all 150+ components
   - Search, filter, preview

3. **Create Project:**
   - Click "+ New Project"
   - Name: "My E-Commerce Store"
   - Click "Create Project"

4. **View Your Projects:**
   - See your project in the list
   - Click "Open" to view details
   - Status: Draft

5. **Build Application:**
   - In project detail page
   - Browse and select components
   - Add to your project

### As Admin

1. **Login:**
   - Go to http://localhost:3000/login
   - Email: admin@test.com
   - Password: admin123

2. **View All Projects:**
   - Automatically see ALL projects
   - Admin badge shows at top
   - See John's project with his email

3. **Admin Dashboard:**
   - Go to http://localhost:3002/projects
   - See statistics:
     - Total Projects
     - Total Users
     - Active Projects
   - View table of ALL projects with owners

4. **Monitor Activity:**
   - Search by project name
   - Filter by status
   - View recent activity
   - Click any project to inspect

## Verify Access Control

### Test 1: Client Isolation

1. Create second client account (Jane)
2. Login as Jane, create project "Jane's Blog"
3. Logout, login as John
4. John should NOT see Jane's project
5. John only sees "My E-Commerce Store"

### Test 2: Admin Visibility

1. Login as admin
2. Go to /projects or /admin/projects
3. Should see BOTH projects:
   - John's E-Commerce Store (Owner: John)
   - Jane's Blog (Owner: Jane)

### Test 3: Component Access

1. Login as ANY user (client or admin)
2. Go to /components
3. All users see all 150+ components
4. Can search, filter, and preview

## API Testing

### Get Projects (Client)
```bash
# Login as client
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Copy token from response

# Get projects (only John's)
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer <token>"
```

### Get Projects (Admin)
```bash
# Login as admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Copy token from response

# Get ALL projects
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer <token>"

# Returns ALL projects with user info
```

## System Overview

### Ports
- **3001** - Backend API
- **3000** - Client Application
- **3002** - Admin Dashboard

### Key URLs

**Client:**
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- Projects: http://localhost:3000/projects
- Components: http://localhost:3000/components

**Admin:**
- Projects: http://localhost:3002/projects
- Patterns: http://localhost:3002/patterns
- Models: http://localhost:3002/models
- Generate: http://localhost:3002/generate

**API:**
- Health: http://localhost:3001/health
- Auth: http://localhost:3001/api/auth/*
- Projects: http://localhost:3001/api/projects/*

## What You Can Do

### As Client:
✅ Browse all 150+ components  
✅ Create unlimited projects  
✅ Build applications  
✅ Manage own projects  
❌ Cannot see other users' projects  

### As Admin:
✅ Browse all 150+ components  
✅ Create own projects  
✅ See ALL user projects  
✅ View user information  
✅ Monitor all activity  
✅ System statistics  

## Project Lifecycle

```
1. Draft         → User planning and selecting components
2. Building      → Actively adding components
3. Completed     → Application structure done
4. Deployed      → Generated and deployed
```

## Next Steps

1. ✅ Create test accounts (client + admin)
2. ✅ Test client isolation (create projects, verify privacy)
3. ✅ Test admin access (view all projects)
4. ✅ Browse component library
5. ✅ Create and manage projects
6. ✅ Verify access control works

## Support

- **Documentation:** See ACCESS_CONTROL.md
- **Implementation:** See IMPLEMENTATION_SUMMARY.md
- **Full Guide:** See INFINITE_BUILDER_COMPLETE.md

## Status

🟢 **FULLY OPERATIONAL**

- Backend: Running
- Database: Initialized with roles + projects
- Frontend: Client app ready
- Admin: Dashboard ready
- Access Control: Active
- Components: All 150+ available

**Everything is ready to use!** 🎉
