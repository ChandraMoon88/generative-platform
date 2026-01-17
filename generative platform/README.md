# Generative Platform

An intelligent application generation platform that learns from user interactions to automatically build applications.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER EXPERIENCE LAYER                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │        Restaurant Management Simulation (Frontend)          ││
│  │   - Menu Management    - Order Processing                   ││
│  │   - Inventory Control  - Staff Scheduling                   ││
│  │   - Customer Service   - Financial Reports                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Events & Interactions
┌─────────────────────────────────────────────────────────────────┐
│                     INTELLIGENCE LAYER                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ Event Collection │→ │Pattern Recognition│→ │ Model Builder  │ │
│  │   & Storage      │  │  (Rules + ML)     │  │  (Synthesizer) │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Application Model
┌─────────────────────────────────────────────────────────────────┐
│                     GENERATION LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ Template Engine  │→ │ Code Assembler   │→ │ Output Apps    │ │
│  │   & Components   │  │  & Integration   │  │  (Full Stack)  │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
generative-platform/
├── frontend/                    # User Experience Layer
│   ├── src/
│   │   ├── components/         # UI Components
│   │   ├── hooks/              # React Hooks (including instrumentation)
│   │   ├── services/           # API & Event Services
│   │   ├── store/              # State Management
│   │   ├── types/              # TypeScript Types
│   │   └── utils/              # Utilities
│   └── package.json
│
├── backend/                     # Intelligence Layer
│   ├── src/
│   │   ├── api/                # REST API Endpoints
│   │   ├── services/
│   │   │   ├── event-collector/    # Event Collection
│   │   │   ├── pattern-recognition/ # Pattern Matching
│   │   │   └── model-builder/      # App Model Synthesis
│   │   ├── db/                 # Database Models & Migrations
│   │   └── utils/              # Utilities
│   └── package.json
│
├── generator/                   # Generation Layer
│   ├── templates/              # Code Generation Templates
│   │   ├── frontend/           # UI Templates
│   │   ├── backend/            # API Templates
│   │   └── database/           # Schema Templates
│   ├── src/
│   │   ├── engine/             # Template Engine
│   │   ├── assembler/          # Code Assembler
│   │   └── output/             # Output Manager
│   └── package.json
│
├── dashboard/                   # Admin Control Interface
│   ├── src/
│   │   ├── components/         # Dashboard UI
│   │   ├── pages/              # Dashboard Pages
│   │   └── services/           # Dashboard Services
│   └── package.json
│
├── shared/                      # Shared Types & Utilities
│   ├── types/                  # Common TypeScript Types
│   ├── schemas/                # JSON Schemas
│   └── utils/                  # Shared Utilities
│
├── docs/                        # Documentation
│   ├── architecture.md
│   ├── patterns.md
│   └── api.md
│
├── auto-commit.ps1             # Auto-commit script
├── start-auto-commit.bat       # Easy launcher for auto-commit
└── README.md
```

## Quick Start

### 1. Start Auto-Commit (Optional)
Double-click `start-auto-commit.bat` to enable automatic commits on file changes.

### 2. Install Dependencies
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install

# Generator
cd generator && npm install

# Dashboard
cd dashboard && npm install
```

### 3. Start Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Dashboard
cd dashboard && npm run dev
```

## Core Concepts

### Pattern Recognition
The platform recognizes these universal patterns from user interactions:
- **CRUD Operations**: Create, Read, Update, Delete entities
- **Workflows**: Multi-step processes with state transitions
- **Data Relationships**: Entity associations and hierarchies
- **Validation Rules**: Business logic and constraints
- **UI Patterns**: Navigation, forms, lists, dashboards

### Application Model
Synthesized from patterns into a complete specification:
- Data Model (entities, properties, relationships)
- UI Model (screens, navigation, layouts)
- Workflow Model (processes, states, transitions)
- Validation Model (rules, constraints)
- Access Control Model (roles, permissions)

### Code Generation
Transforms models into production-ready applications:
- React/Next.js Frontend
- Node.js/Express Backend
- PostgreSQL Database
- Docker Deployment
- Automated Testing

## License
MIT
