# Generative Platform

A platform that learns from user interactions and generates new applications based on observed patterns.

## Architecture

The platform consists of **3 separate servers**:

### 1. **Client Server** (Port 3000)
**Purpose:** Demo application for end users to interact with  
**Location:** `./frontend/`  
**Example:** Restaurant management dashboard  

This is where users perform their tasks (create orders, manage staff, etc). All interactions are instrumented and sent to the backend.

```bash
cd frontend
npm run dev
```

Access: http://localhost:3000

---

### 2. **Backend API** (Port 3001)
**Purpose:** Event collection, pattern recognition, model synthesis, code generation  
**Location:** `./backend/`  

Handles:
- Event collection from client
- Pattern recognition
- Application model synthesis
- Code generation

```bash
cd backend
npm run dev
```

API Endpoints:
- `POST /api/events` - Collect events
- `GET /api/sessions` - View sessions
- `POST /api/patterns/analyze/:sessionId` - Analyze patterns
- `POST /api/models/synthesize` - Create app models
- `POST /api/generator/generate` - Generate code

---

### 3. **Admin Server** (Port 3002)
**Purpose:** Admin dashboard for developers/platform operators  
**Location:** `./admin/`  

Features:
- View collected events
- Analyze recognized patterns
- Browse session recordings
- View synthesized models
- Generate and download code
- Pattern configuration

```bash
cd admin
npm run dev
```

Access: http://localhost:3002

---

## How It Works

```
┌─────────────────────┐
│   Client Server     │  Port 3000 - Users interact with demo app
│  (Demo Restaurant)  │  (creates orders, manages staff, etc.)
└──────────┬──────────┘
           │ Events (clicks, forms, navigation)
           ↓
┌─────────────────────┐
│   Backend API       │  Port 3001 - Processes events
│  (Event Collection) │  - Stores events in SQLite
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
