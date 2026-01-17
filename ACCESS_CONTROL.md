# 🔐 Access Control & Project Management System

## Overview

Complete role-based access control system where:
- **Clients** can access all components and manage their own projects
- **Admin** can access all components and see ALL user projects with full activity monitoring
- Each user's projects are isolated, but admin has full visibility

## 🎯 Key Features

### 1. **Component Library Access**
- ✅ **ALL users (clients + admin)** can browse and use all 150+ components
- ✅ Component library available at `/components` route
- ✅ 30+ categories of universal components
- ✅ Search, filter, and live preview capabilities

### 2. **Project Ownership & Isolation**
- ✅ Each project belongs to ONE user (owner)
- ✅ Users can only see and edit their own projects
- ✅ Projects are automatically associated with creator's user ID
- ✅ Complete project isolation per user

### 3. **Admin Superpowers** 👑
- ✅ Admin can see **ALL projects** from **ALL users**
- ✅ Admin dashboard shows:
  - Total projects across all users
  - Total users
  - Projects by status
  - Recent activity feed
  - User information for each project
- ✅ Admin can view, edit, and monitor any project
- ✅ Full activity tracking and monitoring

### 4. **User Roles**

#### **Client Role** (default)
```typescript
{
  role: 'client',
  permissions: {
    components: 'READ ALL',      // Can browse all components
    projects: 'CRUD OWN',         // Create, Read, Update, Delete own projects only
    otherProjects: 'NO ACCESS'    // Cannot see other users' projects
  }
}
```

#### **Admin Role**
```typescript
{
  role: 'admin',
  permissions: {
    components: 'READ ALL',       // Can browse all components
    projects: 'CRUD ALL',          // Can CRUD ALL projects from ALL users
    monitoring: 'FULL ACCESS',     // Can monitor all user activity
    stats: 'FULL ACCESS'           // Can view system-wide statistics
  }
}
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'client' CHECK(role IN ('admin', 'client')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,              -- Owner of the project
  name TEXT NOT NULL,
  description TEXT,
  model_id TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'building', 'completed', 'deployed')),
  config TEXT,                        -- JSON: project configuration
  generated_files TEXT,               -- JSON: generated code files
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔌 API Endpoints

### Authentication
```typescript
POST /api/auth/register
// Register new user (defaults to 'client' role)
Body: { name, email, password, role?: 'admin' | 'client' }
Response: { userId, token, user: { id, name, email, role } }

POST /api/auth/login
// Login user
Body: { email, password }
Response: { userId, token, user: { id, name, email, role } }
```

### Projects (Protected - Requires Authentication)
```typescript
GET /api/projects
// Get projects (filtered by role)
// - Clients: Returns only their own projects
// - Admin: Returns ALL projects from ALL users
Headers: { Authorization: 'Bearer <token>' }
Response: { 
  projects: Project[], 
  isAdmin: boolean, 
  totalProjects: number 
}

GET /api/projects/:id
// Get specific project
// - Clients: Can only access their own projects (403 if not owner)
// - Admin: Can access ANY project
Headers: { Authorization: 'Bearer <token>' }
Response: { project: Project }

POST /api/projects
// Create new project (auto-assigned to authenticated user)
Headers: { Authorization: 'Bearer <token>' }
Body: { name, description?, modelId?, config? }
Response: { projectId, project: Project }

PUT /api/projects/:id
// Update project
// - Clients: Can only update their own projects
// - Admin: Can update ANY project
Headers: { Authorization: 'Bearer <token>' }
Body: { name?, description?, status?, config?, generatedFiles? }
Response: { success: true }

DELETE /api/projects/:id
// Delete project
// - Clients: Can only delete their own projects
// - Admin: Can delete ANY project
Headers: { Authorization: 'Bearer <token>' }
Response: { success: true }

GET /api/projects/user/:userId
// Admin-only: Get all projects for specific user
Headers: { Authorization: 'Bearer <token>' }
Response: { projects: Project[], userId, totalProjects }

GET /api/projects/stats/overview
// Admin-only: Get system-wide statistics
Headers: { Authorization: 'Bearer <token>' }
Response: { 
  stats: {
    totalProjects,
    totalUsers,
    projectsByStatus,
    recentProjects
  }
}
```

## 🎨 Frontend Routes

### Client Routes
```typescript
/                          // Home - redirects to /projects
/login                     // Login page
/register                  // Registration page
/projects                  // User's projects list
/projects/:id              // Project detail & builder
/components                // Browse component library
```

### Admin Routes
```typescript
/admin/projects            // All projects from all users
/admin/patterns            // Pattern analysis
/admin/models              // Model management
/admin/generate            // Code generation
```

## 🔐 Access Control Flow

### Client Workflow
```
1. User registers (role: 'client')
   ↓
2. Login → Redirect to /projects
   ↓
3. View only their own projects
   ↓
4. Create new project → Auto-assigned to user_id
   ↓
5. Browse components at /components
   ↓
6. Build application in project detail page
   ↓
7. Project stays isolated to their account
```

### Admin Workflow
```
1. Admin registers (role: 'admin')
   ↓
2. Login → Redirect to /projects (admin view)
   ↓
3. See ALL projects from ALL users
   ↓
4. View user information for each project
   ↓
5. Monitor activity across all users
   ↓
6. Access admin dashboard at /admin/projects
   ↓
7. View system-wide statistics
   ↓
8. Can open and inspect any user's project
```

## 🚀 Usage Examples

### Create a Client Account
```bash
# Register as client (default)
POST http://localhost:3001/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Automatically gets role: 'client'
```

### Create an Admin Account
```bash
# Register as admin
POST http://localhost:3001/api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Client Creates Project
```bash
POST http://localhost:3001/api/projects
Headers: { Authorization: 'Bearer <client-token>' }
{
  "name": "My E-Commerce App",
  "description": "Building an online store"
}

# Project auto-assigned to client's user_id
# Only this client can see and edit this project
```

### Admin Views All Projects
```bash
GET http://localhost:3001/api/projects
Headers: { Authorization: 'Bearer <admin-token>' }

# Returns ALL projects with owner information:
{
  "projects": [
    {
      "id": "proj-1",
      "user_id": "user-123",
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "name": "My E-Commerce App",
      "status": "building"
    },
    {
      "id": "proj-2",
      "user_id": "user-456",
      "user_name": "Jane Smith",
      "user_email": "jane@example.com",
      "name": "Social Media Dashboard",
      "status": "completed"
    }
  ],
  "isAdmin": true,
  "totalProjects": 2
}
```

## 📝 Project Lifecycle

### 1. Draft
- Initial state when project is created
- User is browsing components and planning

### 2. Building
- User is actively adding components and building
- Components being selected and configured

### 3. Completed
- Application structure is complete
- Ready for code generation

### 4. Deployed
- Code has been generated and deployed
- Application is live

## 🎯 Key Benefits

### For Clients
✅ Complete access to all 150+ components  
✅ Private workspace for their projects  
✅ No visibility into other users' work  
✅ Full control over their own projects  
✅ Secure and isolated environment  

### For Admin
✅ Complete access to all 150+ components  
✅ Full visibility into ALL user projects  
✅ Monitor system-wide activity  
✅ Track user engagement and usage  
✅ Debug and support any user's project  
✅ System-wide statistics and analytics  

## 🔒 Security Features

1. **JWT-based Authentication**
   - Token-based auth for all protected routes
   - User ID embedded in token

2. **Role-based Authorization**
   - Middleware checks user role before granting access
   - Automatic permission enforcement

3. **Project Ownership Validation**
   - Every project query checks ownership
   - 403 Forbidden if user tries to access others' projects

4. **Admin Privilege Verification**
   - Admin-only routes verify role === 'admin'
   - Regular users get 403 on admin endpoints

## 📦 Data Isolation

### Client Data View
```
User John (client) sees:
├── My Projects (3)
│   ├── E-Commerce App
│   ├── Blog Platform
│   └── Portfolio Site
└── Component Library (150+ components)
```

### Admin Data View
```
Admin sees:
├── All Projects (50+)
│   ├── User: John
│   │   ├── E-Commerce App
│   │   ├── Blog Platform
│   │   └── Portfolio Site
│   ├── User: Jane
│   │   ├── Social Dashboard
│   │   └── Analytics Tool
│   └── User: Bob
│       └── Mobile App
└── Component Library (150+ components)
└── System Stats
    ├── Total Users: 25
    ├── Total Projects: 50
    └── Active Projects: 12
```

## 🎮 Getting Started

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### 2. Start Client App
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. Start Admin Panel
```bash
cd admin
npm install
npm run dev
# Runs on http://localhost:3002
```

### 4. Create Accounts

**Client Account:**
- Go to http://localhost:3000/register
- Sign up (defaults to client role)
- Start creating projects

**Admin Account:**
- Use API to create admin account:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### 5. Test Access Control

**As Client:**
1. Login at http://localhost:3000/login
2. View your projects at /projects
3. Create a new project
4. Browse components at /components
5. Try to view another user's project → Should get 403 Forbidden

**As Admin:**
1. Login at http://localhost:3000/login (or http://localhost:3002)
2. View ALL projects from ALL users
3. See user information for each project
4. Open any user's project
5. View system statistics

## 🌟 Summary

This system provides:
- ✅ **Universal Component Access** - Everyone can use all components
- ✅ **Project Isolation** - Users only see their own work
- ✅ **Admin Oversight** - Admin sees everything for monitoring and support
- ✅ **Secure Authentication** - Token-based auth with role verification
- ✅ **Automatic Ownership** - Projects auto-assigned to creators
- ✅ **Full Activity Tracking** - Admin can monitor all user activity

**Perfect for:**
- Multi-tenant application builders
- SaaS platforms with admin monitoring
- Educational platforms with teacher oversight
- Enterprise tools with admin dashboards
