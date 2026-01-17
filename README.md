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

---

## 🎯 What You Can Build

### Dashboards & Analytics
Use components like DataTable, LineChart, BarChart, MetricCard, and more to create powerful analytics dashboards.

### E-Commerce Platforms
Build online stores with CardGrid, Button, Badge, CreditCardInput, ImageGallery, and CheckoutFlow.

### Social Applications
Create social platforms using Timeline, LiveFeed, ChatInterface, FileUpload, and CommentThread.

### Games & Interactive Apps
Develop games with GameCanvas, Sprite, PhysicsBody, GameController, and CollisionDetector.

### 3D Experiences
Build immersive 3D apps using Scene3D, Model3D, Camera3D, Light3D, and Particle3D.

---

## 🧩 Component Categories

- **Buttons & Actions** (4) - Interactive UI controls
- **Navigation** (5) - Menus, tabs, breadcrumbs
- **Modals & Overlays** (6) - Dialogs, drawers, tooltips
- **Data Display** (5) - Tables, lists, cards, timelines
- **Forms & Inputs** (5) - Text fields, file uploads, pickers
- **Feedback** (7) - Toasts, alerts, loaders, badges
- **Charts** (10) - Line, bar, pie, heatmap, gauges
- **Animation** (7) - Transitions, springs, parallax
- **3D & WebGL** (7) - 3D scenes, models, cameras
- **Game Development** (8) - Canvas, sprites, physics
- **Advanced Layout** (9) - Grids, containers, effects
- **Business Components** (30+) - Auth, payments, workflow
- **And many more!**

---

## 📱 Using the Platform

### 1. Create Your Account
Navigate to `/register` and create your account to get started.

### 2. Browse Components
Visit `/components` to explore the entire library. Use search and filters to find what you need.

### 3. Create Projects
Go to `/projects` to create and manage your applications.

### 4. Build Your App
Select components, customize them, and build your application piece by piece.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, SQLite
- **Components**: Universal React component library
- **Authentication**: Secure JWT-based auth

---

## 📂 Project Structure

```
├── frontend/           # User application
│   ├── src/
│   │   ├── app/       # Pages and routes
│   │   └── components/# Component library
│   └── package.json
│
├── backend/           # API server
│   ├── src/
│   │   ├── api/      # API endpoints
│   │   └── db/       # Database
│   └── package.json
│
└── README.md
```

---

## 🎨 Example Usage

```tsx
import { Button, DataTable, LineChart } from '@/components/universal';

// Use components instantly
<Button variant="primary" onClick={handleClick}>
  Get Started
</Button>

<DataTable 
  data={users} 
  columns={columns}
  onSort={handleSort}
/>

<LineChart 
  data={salesData}
  height={300}
/>
```

---

## 🔒 Privacy & Security

- Secure authentication system
- Private projects - your work stays yours
- Password protection
- Data isolation between users

---

## 🎯 Component Highlights

### Most Popular
- **DataTable** - Advanced tables with sorting and filtering
- **Button** - Universal button with all variants
- **LineChart** - Beautiful time-series visualizations
- **Modal** - Flexible dialog system
- **UniversalForm** - Dynamic form builder

### Most Versatile  
- **CardGrid** - Responsive card layouts
- **Navbar** - Customizable navigation
- **FileUpload** - Drag-and-drop file handling
- **Timeline** - Event chronology display

### Game Changers
- **GameCanvas** - 2D game development
- **Scene3D** - 3D rendering with WebGL
- **SpringAnimation** - Physics-based animations
- **RichTextEditor** - WYSIWYG editing

---

## 📚 Documentation

Each component includes:
- Clear description
- Available props
- Real-world use cases
- Live preview
- Code examples

---

## 🤝 Contributing

Contributions are welcome! Focus areas:
- New components
- Documentation improvements
- Bug fixes
- UI/UX enhancements

---

## 🆘 Support

**Getting Started:**
- Ensure Node.js 18+ is installed
- Check both servers are running (ports 3000 & 3001)
- Clear browser cache if issues persist

**Component Questions:**
- Browse the library for examples
- Check component documentation
- Review code examples

---

## 📝 License

For personal and educational use.

---

## 🌟 Get Started Now

```bash
# Install and run
npm install && npm run dev

# Create account
http://localhost:3000/register

# Start building
http://localhost:3000/projects
```

---

**Made for developers who want to build faster ⚡**

Star this repo if you find it useful! ⭐
