# 🎨 Universal Application Builder

> **Build amazing applications with 150+ production-ready components**

A comprehensive platform providing a vast library of universal, reusable components to accelerate your application development. Browse, preview, and use components for any type of application you want to build.

## ✨ What's Included

- 🧩 **150+ Components** across 30+ categories
- 🔍 **Smart Search & Filter** - Find exactly what you need
- 👁️ **Live Previews** - See components in action
- 📱 **Project Management** - Organize your applications
- 📝 **Code Examples** - Ready-to-use code snippets
- 🎯 **Use Cases** - Real-world application examples

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation & Setup

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd generative-platform
```

2. **Install and start backend**
```bash
cd backend
npm install
npm run dev
```
✅ Backend running on **http://localhost:3001**

3. **Install and start frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running on **http://localhost:3000**

4. **Open your browser**
```
http://localhost:3000
```

---

## 📱 Using the Platform

### 1. Create an Account
- Go to http://localhost:3000/register
- Enter your name, email, and password
- Click "Register" to create your account

### 2. Browse Components
- Navigate to `/components` or click "Browse Components"
- Explore 150+ components organized by category
- Use the search bar to find specific components
- Filter by tags (button, animation, 3d, game, etc.)
- Click any component to see:
  - Live preview
  - Code examples
  - Available props
  - Use cases

### 3. Create Projects
- Go to `/projects`
- Click "New Project"
- Enter project name and description
- Start building your application!

### 4. Build Your App
- Open any project
- Browse the component library
- Select components you need
- Configure and customize them
- Track your progress (Draft → Building → Completed → Deployed)

---

## 🧩 Component Categories

### 🎨 Core UI Components
**Buttons & Actions (4)**
- Button, ButtonGroup, IconButton, FloatingActionButton

**Navigation (5)**
- Navbar, Sidebar, Breadcrumbs, Tabs, Pagination

**Modals & Overlays (6)**
- Modal, Drawer, Popover, Tooltip, ConfirmDialog, BottomSheet

**Data Display (5)**
- DataTable, List, CardGrid, DetailView, Timeline

**Forms & Inputs (5)**
- UniversalForm, RichTextEditor, FileUpload, ColorPicker, DropZone

**Feedback (7)**
- Toast, Alert, Badge, Spinner, ProgressBar, Skeleton, EmptyState

### 📊 Data Visualization
**Charts & Analytics (10)**
- LineChart, BarChart, PieChart, MetricCard, Heatmap
- GaugeChart, FunnelChart, NetworkGraph, PivotTable, Treemap

### 🎬 Advanced Components
**Animation (7)**
- Transition, SpringAnimation, ParallaxScroll, RevealOnScroll
- GestureHandler, Morphing, Keyframe

**3D & WebGL (7)**
- Scene3D, Model3D, Camera3D, Light3D, Geometry3D, Particle3D, Skybox3D

**Game Development (8)**
- GameCanvas, Sprite, PhysicsBody, GameController
- Tilemap, CollisionDetector, ParticleEmitter, ScoreTracker

**Advanced Layout (9)**
- MasonryGrid, ResponsiveGrid, StickyContainer, ParticleBackground
- BlurEffect, GradientBackground, ShaderEffect, InfiniteScroll, FlexLayout

### 💼 Business Components
**Authentication (2)**
- LoginForm, TwoFactorAuth

**Payment (2)**
- CreditCardInput, CheckoutFlow

**Workflow & Organization (12)**
- Workflow, KanbanBoard, GanttChart, DayCalendar, WeekCalendar
- MonthCalendar, TreeView, Org Chart, FileTree, TagManager

**Advanced Tables & Code (6)**
- VirtualTable, EditableTable, PivotTableAdvanced
- CodeEditor, DiffViewer, JSONViewer

### 🔧 Specialized Components
**Search & Mobile (6)**
- SearchBar, GlobalSearch, FacetedSearch, SearchSuggestion
- BottomNavigation, SwipeableViews

**Collaboration & Communication (9)**
- CommentThread, ChatInterface, VideoCall, LiveFeed
- PresenceIndicator, PhoneInput, EmailComposer, SMSComposer, NotificationBell

**Configuration & Settings (4)**
- SettingsPanel, ThemeCustomizer, FeatureToggle, APIConfigurator

**Media (5)**
- ImageGallery, VideoPlayer, AudioPlayer, MediaCarousel, VirtualTour

**Industry-Specific (5)**
- AppointmentScheduler, InventoryTracker, StockTicker, PropertyListing, CourseCatalog

**Builder Tools (3)**
- ComponentBuilder, TemplateGallery, DynamicFormBuilder

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, SQLite
- **Authentication**: JWT-based auth
- **Database**: SQLite with sql.js
- **Components**: Custom universal component library

---

## 📂 Project Structure

```
generative-platform/
├── backend/              # Backend API server
│   ├── src/
│   │   ├── api/         # API routes (auth, projects)
│   │   ├── db/          # Database initialization
│   │   └── utils/       # Helper utilities
│   └── package.json
│
├── frontend/            # User application
│   ├── src/
│   │   ├── app/        # Next.js pages & routes
│   │   ├── components/ # Universal component library
│   │   └── services/   # API services
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🎯 Key Features

### 🔍 Smart Component Discovery
- **Search by name** - Find components by title
- **Search by description** - Find by what they do
- **Filter by category** - Browse by type
- **Filter by tags** - Multi-tag filtering
- **Live preview** - See before you use

### 📦 Project Management
- **Create unlimited projects**
- **Private workspace** - Your projects are yours alone
- **Status tracking** - Draft → Building → Completed → Deployed
- **Project details** - Name, description, components used
- **Edit anytime** - Update projects as you build

### 🎨 Component Features
Every component includes:
- **Description** - Clear explanation
- **Props** - Configuration options
- **Use Cases** - Where to use it
- **Code Examples** - Copy-paste ready
- **Live Demo** - Interactive preview

---

## 🎮 Usage Examples

### Building a Dashboard
```tsx
// Select these components:
- DataTable      // For data display
- LineChart      // For analytics
- MetricCard     // For KPIs
- Navbar         // For navigation
- Sidebar        // For menu
```

### Building E-Commerce
```tsx
// Select these components:
- CardGrid       // For products
- Button         // For actions
- Badge          // For labels
- CreditCardInput // For checkout
- ImageGallery   // For product images
```

### Building a Social App
```tsx
// Select these components:
- Timeline       // For posts
- LiveFeed       // For updates
- ChatInterface  // For messaging
- FileUpload     // For media
- CommentThread  // For discussions
```

### Building Analytics
```tsx
// Select these components:
- LineChart, BarChart, PieChart  // Charts
- Heatmap, GaugeChart            // Visualizations
- MetricCard                     // KPIs
- PivotTable                     // Data analysis
```

### Building Games
```tsx
// Select these components:
- GameCanvas          // Main canvas
- Sprite              // Game objects
- PhysicsBody         // Physics
- GameController      // Controls
- CollisionDetector   // Interactions
- ScoreTracker        // Scoring
```

---

## 🔒 Privacy & Security

- ✅ **Secure Authentication** - Password-protected accounts
- ✅ **Private Projects** - Only you can see your projects
- ✅ **Data Isolation** - Your data is separate from others
- ✅ **JWT Tokens** - Secure session management
- ✅ **Password Hashing** - Encrypted credentials

---

## 📚 Documentation

### For Each Component:
1. **Name & Category** - What it is and where it fits
2. **Description** - Clear explanation of functionality
3. **Tags** - Keywords for discovery
4. **Props** - Available configuration options
5. **Use Cases** - Real-world applications
6. **Code Example** - Ready-to-use code
7. **Live Preview** - Interactive demonstration

### Component Props Example:
```tsx
<Button 
  variant="primary"      // Style variant
  size="medium"          // Size option
  icon={<Icon />}        // Optional icon
  loading={false}        // Loading state
  onClick={handleClick}  // Click handler
>
  Click Me
</Button>
```

---

## 🛠️ Development

### Adding New Components
1. Create component in `frontend/src/components/universal/`
2. Add to appropriate category
3. Export from category index
4. Add to `ComponentSelector.tsx` catalog
5. Add code example to `ComponentShowcase.tsx`

### Project Workflow
```
Draft → Building → Completed → Deployed

Draft:      Planning, selecting components
Building:   Actively adding components
Completed:  App structure finalized  
Deployed:   Application is live
```

---

## 🆘 Troubleshooting

### Can't Login?
- Ensure backend is running (port 3001)
- Check credentials
- Try registering a new account

### Components Not Loading?
- Refresh the page
- Clear browser cache
- Check browser console for errors
- Verify backend connection

### Project Not Saving?
- Check backend server is running
- Verify you're logged in
- Check network tab in dev tools

### Backend Won't Start?
- Check port 3001 is available
- Run `npm install` in backend folder
- Check for error messages

### Frontend Won't Start?
- Check port 3000 is available
- Run `npm install` in frontend folder
- Delete `.next` folder and restart

---

## 🎯 Common Use Cases

### Dashboards & Admin Panels
Components: DataTable, LineChart, MetricCard, Navbar, Sidebar

### E-Commerce Platforms
Components: CardGrid, Button, Badge, CreditCardInput, ImageGallery

### Social Applications
Components: Timeline, LiveFeed, ChatInterface, FileUpload, CommentThread

### Analytics Tools
Components: Charts (Line/Bar/Pie), Heatmap, GaugeChart, PivotTable

### Content Management
Components: RichTextEditor, FileUpload, TreeView, TagManager

### Booking Systems
Components: MonthCalendar, AppointmentScheduler, TimeSlotPicker

### Communication Apps
Components: ChatInterface, VideoCall, EmailComposer, NotificationBell

### Educational Platforms
Components: CourseCatalog, VideoPlayer, ProgressBar, QuizBuilder

---

## 📝 License

This project is for personal and educational use.

---

## 🌟 Getting Started Checklist

- [ ] Clone repository
- [ ] Install Node.js 18+
- [ ] Install backend dependencies
- [ ] Install frontend dependencies
- [ ] Start backend server (port 3001)
- [ ] Start frontend server (port 3000)
- [ ] Open browser to http://localhost:3000
- [ ] Register an account
- [ ] Browse component library
- [ ] Create your first project
- [ ] Start building!

---

## 🚀 Ready to Build?

1. **Start the servers**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

2. **Create your account**
```
http://localhost:3000/register
```

3. **Browse components**
```
http://localhost:3000/components
```

4. **Start building**
```
http://localhost:3000/projects
```

---

**Happy Building! 🎨✨**

Need help? Check the component library for examples and inspiration!
