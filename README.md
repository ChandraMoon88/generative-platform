# 🎨 Component Library Platform

**Build applications faster with 150+ production-ready React components**

A comprehensive component library for building modern web applications. Browse, preview, and use universal components designed for any type of application.

---

## ✨ Features

- 🧩 **150+ Components** - Buttons, forms, charts, animations, 3D, games, and more
- 🔍 **Smart Search** - Find exactly what you need instantly
- 👁️ **Live Previews** - See components in action before using
- 📱 **Project Management** - Organize your applications
- 🎯 **30+ Categories** - From basic UI to advanced game development
- 📝 **Code Examples** - Copy-paste ready implementations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd generative-platform
```

**2. Install and start backend**
```bash
cd backend
npm install
npm run dev
```
Backend runs on **http://localhost:3001**

**3. Install and start frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:3000**

**4. Open browser**
```
http://localhost:3000
│  (Pattern Engine)   │  - Recognizes patterns
│  (Code Generator)   │  - Synthesizes models
└──────────┬──────────┘  - Generates code
           │
           │ View data, trigger analysis
           ↓
┌─────────────────────┐
│   Admin Server      │  Port 3002 - You monitor and control
│  (Admin Dashboard)  │  - View events/patterns
└─────────────────────┘  - Generate new apps
```

## Getting Started

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Client (Demo App):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Start Admin Dashboard:**
   ```bash
   cd admin
   npm install
   npm run dev
   ```

4. **Use the platform:**
   - Open http://localhost:3000 - Interact with the demo restaurant app
   - Open http://localhost:3002 - View events and patterns in admin dashboard
   - Events are automatically collected as users interact
   - Use admin dashboard to analyze patterns and generate code

## Example Workflow

1. **User interacts with client app** (Port 3000)
   - Creates new orders
   - Manages staff
   - Updates tables
   
2. **Events are collected** → Backend (Port 3001)
   - Every click, form submission, navigation tracked
   - Stored in SQLite database

3. **Admin analyzes patterns** (Port 3002)
   - Navigate to "Patterns" page
   - Click "Analyze Session"
   - View recognized patterns (CRUD operations, workflows)

4. **Generate new application**
   - Navigate to "Generate" page
   - Select patterns to include
   - Click "Generate Code"
   - Download generated React components

## Technologies

- **Frontend/Admin:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Express.js, SQLite (sql.js), TypeScript
- **Instrumentation:** Custom hooks for event capture
- **Pattern Recognition:** Rule-based matching engine
- **Code Generation:** Template-based TypeScript/React generator
