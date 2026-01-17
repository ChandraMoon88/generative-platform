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
- 🔐 **Secure** - Enterprise-grade security with encrypted passwords
- ☁️ **Cloud Ready** - Deploy to Vercel, Netlify, or any platform

---

## 🚀 Quick Start

### Local Development

**1. Clone & Install**
```bash
git clone <repository-url>
cd generative-platform

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

**2. Start Servers**
```bash
# Terminal 1: Backend (port 3001)
cd backend && npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend && npm run dev
```

**3. Create Account**
Open `http://localhost:3000/register` and create your account

---

## 🌐 Deploy to Vercel (Free)

Deploy your own instance in 3 simple steps:

### Step 1: Fork Repository
Click the **"Fork"** button at the top of this page to create your own copy

### Step 2: Deploy to Vercel

1. **Sign up** at [vercel.com](https://vercel.com) (100% free forever)
2. Click **"New Project"**
3. **Import** your forked repository from GitHub
4. **Configure** (optional):
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: Leave default
   - Environment Variables: Add later if needed
5. Click **"Deploy"** 

⚡ Your app will be live in ~30 seconds at: `https://your-app.vercel.app`

### Step 3: Access Your App

Visit your deployment URL and:
- ✅ Create your admin account at `/register`
- ✅ Browse 150+ components at `/components`
- ✅ Start building projects

### 🎯 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/generative-platform)

---

### 📝 Environment Variables (Optional)

For production use, you can add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# JWT Secret (for secure authentication)
JWT_SECRET=your-random-secret-string-here

# Database (Vercel provides SQLite by default)
DATABASE_URL=file:./data/production.db

# Frontend URL (auto-set by Vercel)
FRONTEND_URL=https://your-app.vercel.app
```

**Note**: The app works out-of-the-box without setting any environment variables!

---

## 🎯 What You Can Build

### 📊 Dashboards & Analytics
Create powerful dashboards with **DataTable**, **LineChart**, **BarChart**, **MetricCard**, **PieChart**

### 🛒 E-Commerce Stores
Build online shops with **CardGrid**, **ProductCard**, **CreditCardInput**, **ImageGallery**, **CheckoutFlow**

### 💬 Social Platforms
Develop social apps with **Timeline**, **LiveFeed**, **ChatInterface**, **FileUpload**, **CommentThread**

### 🎮 Games & Interactive Apps
Make games using **GameCanvas**, **Sprite**, **PhysicsBody**, **GameController**, **CollisionDetector**

### 🎨 3D Experiences
Create 3D apps with **Scene3D**, **Model3D**, **Camera3D**, **Light3D**, **Particle3D**

---

## 🧩 Component Library (150+)

| Category | Components | Examples |
|----------|-----------|----------|
| **Buttons & Actions** | 4 | Button, IconButton, FloatingButton |
| **Navigation** | 5 | Navbar, Tabs, Breadcrumbs, Sidebar |
| **Modals & Overlays** | 6 | Modal, Drawer, Tooltip, Popover |
| **Data Display** | 5 | DataTable, Card, Timeline, Badge |
| **Forms & Inputs** | 5 | Input, Select, FileUpload, DatePicker |
| **Feedback** | 7 | Toast, Alert, Loader, Progress |
| **Charts** | 10 | Line, Bar, Pie, Scatter, Heatmap |
| **Animation** | 7 | FadeIn, SlideIn, Spring, Parallax |
| **3D & WebGL** | 7 | Scene3D, Model3D, Camera, Lighting |
| **Game Dev** | 8 | Canvas, Sprite, Physics, Collision |
| **Business** | 30+ | Auth, Payment, Workflow, Analytics |

---

## 📱 How to Use

### 1️⃣ Create Your Account
Go to `/register` and create your free account

### 2️⃣ Browse Components
Visit `/components` to explore all 150+ components with live previews

### 3️⃣ Create a Project
Click "New Project" at `/projects` to start building

### 4️⃣ Build Your App
Drag components, customize props, see live preview, export code

---

## 💻 Code Example

```tsx
import { 
  Button, 
  DataTable, 
  LineChart,
  Modal 
} from '@/components/universal';

function MyApp() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Button 
        variant="primary" 
        onClick={() => setShowModal(true)}
      >
        Open Dashboard
      </Button>

      <DataTable 
        data={salesData} 
        columns={columns}
        sortable
        filterable
      />

      <LineChart 
        data={chartData}
        height={400}
        showLegend
      />

      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <h2>Analytics Dashboard</h2>
      </Modal>
    </div>
  );
}
```

---

## 🔒 Security Features

Your applications are protected with enterprise-grade security:

- ✅ **Encrypted Passwords** - PBKDF2 with 10,000 iterations + unique salt
- ✅ **SQL Injection Protection** - Parameterized queries & input validation
- ✅ **XSS Protection** - Automatic input sanitization & HTML encoding
- ✅ **CSRF Protection** - Origin validation on all state-changing requests
- ✅ **Rate Limiting** - 100 requests per 15 minutes per user
- ✅ **Security Headers** - Protection against clickjacking & MIME sniffing
- ✅ **Private Projects** - Your projects are private and isolated

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, SQLite
- **Components**: 150+ Universal React components
- **Auth**: JWT tokens with secure hashing
- **Security**: Rate limiting, input validation, CSRF protection

---

## 📂 Project Structure

```
generative-platform/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # Pages (register, login, projects, components)
│   │   └── components/   # 150+ Universal components
│   └── package.json
│
├── backend/              # Express API server
│   ├── src/
│   │   ├── api/         # REST endpoints (auth, projects)
│   │   ├── db/          # SQLite database
│   │   └── middleware/  # Security middleware
│   └── package.json
│
└── README.md
```

---

## 🎯 Popular Components

### 🌟 Most Used
- **DataTable** - Sortable, filterable tables with pagination
- **Button** - All variants (primary, secondary, outline, ghost)
- **LineChart** - Time-series data visualization
- **Modal** - Flexible dialogs and popups
- **Form** - Dynamic forms with validation

### 💎 Hidden Gems
- **GameCanvas** - Full 2D game engine
- **Scene3D** - WebGL 3D rendering
- **SpringAnimation** - Physics-based animations
- **RichTextEditor** - WYSIWYG editor

---

## 🆘 Troubleshooting

### Can't access http://localhost:3000?
- Check backend is running on port 3001
- Check frontend is running on port 3000
- Try `npm install` again if dependencies failed

### Login not working?
- Clear browser cookies and try again
- Check backend console for errors
- Ensure both servers are running

### Components not loading?
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser console for errors
- Verify you're logged in

### Port already in use?
```bash
# Windows: Kill process on port
netstat -ano | findstr :3000
taskkill /PID <process-id> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

---

## 🤝 Contributing

We welcome contributions! Areas to help:

- 🧩 New components
- 📚 Documentation improvements
- 🐛 Bug fixes
- ♿ Accessibility enhancements
- 🎨 UI/UX improvements

**To contribute:**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-component`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is available for personal and commercial use.

---

## 💡 Pro Tips

1. **Explore First** - Spend 10 minutes browsing `/components` to see what's available
2. **Use Search** - Type what you need (e.g., "chart", "button", "3D")
3. **Check Examples** - Every component has code examples
4. **Start Simple** - Build a small project first to learn the workflow
5. **Customize Everything** - All components accept props for customization

---

## 🌟 Quick Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

---

## 📞 Support

**Need help?**
- Check troubleshooting section above
- Browse component documentation at `/components`
- Review code examples in each component

**Found a bug?**
- Create an issue with reproduction steps
- Include browser and Node.js version
- Share error messages

---

## 🎉 Get Started in 60 Seconds

```bash
# Clone
git clone <repository-url>
cd generative-platform

# Install & Run
cd backend && npm install && npm run dev &
cd ../frontend && npm install && npm run dev

# Open browser
http://localhost:3000/register
```

---

## 🚀 Deploy Your App (Free Hosting)

Prefer not to run locally? Deploy for free:

- **Vercel** - Best for Next.js (this app) - [vercel.com](https://vercel.com)
- **Netlify** - Great for all apps - [netlify.com](https://netlify.com)
- **Railway** - Full-stack apps - [railway.app](https://railway.app)
- **Render** - Free tier available - [render.com](https://render.com)

All offer free plans with custom domains!

---

**Built for developers who want to ship faster ⚡**

⭐ **Star this repo if you find it useful!**

🚀 **Ready to build something amazing? [Get started now](#-quick-start)**
