# 🚀 Quick Start - Deploying EcoSphere

## For Developers: Getting Started

### 1️⃣ Clone & Install
```bash
git clone https://github.com/yourusername/ecosphere-game.git
cd ecosphere-game

# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
npm install
```

### 2️⃣ Run Locally
```bash
# Terminal 1: Start backend
cd backend
npm run dev
# Running on http://localhost:3001

# Terminal 2: Start frontend
cd frontend
npm run dev
# Visit http://localhost:3000
```

### 3️⃣ Play the Game!
- Open `http://localhost:3000`
- Create an account
- Start your journey from Level 1: The Seed
- Complete objectives to unlock the next level

---

## 🌐 Deploy to Production

### Deploy Frontend (Vercel)
```bash
cd frontend
npx vercel --prod
```

### Deploy Backend (Railway)
```bash
cd backend
railway login
railway init
railway up
```

### Set Environment Variables
In Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

---

## 🎮 Gameplay

### Your Journey
- **15 Levels**: From personal action to global movement
- **30+ Tools**: Unlock applications as you progress
- **Real Learning**: Environmental science + leadership skills
- **Sequential Play**: Complete each level to unlock the next

### Levels Overview
1. 🌱 The Seed - Plant your first tree
2. 🌿 The Gardener - Create an ecosystem
3. 🚜 The Farmer - Sustainable agriculture
4. 🌲 The Forester - Restore forests
5. 🌊 The River Guardian - Clean watersheds
6. 👥 The Community Organizer - Build coalitions
7. 🏙️ The Urban Planner - Green infrastructure
8. 📜 The Policy Advocate - Influence policy
9. 📚 The Educator - Teach communities
10. 💡 The Entrepreneur - Green business
11. 🗺️ The Regional Coordinator - Scale regionally
12. 📱 The Influencer - Digital campaigns
13. 🔬 The Innovator - New technologies
14. 🎓 The Mentor - Train leaders
15. 🌟 The Visionary - Global movement

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Deployment**: Vercel (frontend) + Railway (backend)

---

## 📖 Documentation

- `README.md` - This file
- `frontend/README.md` - Frontend setup
- `backend/README.md` - Backend API docs

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🌍 Join the Movement

Ready to transform from a seed to a global environmental movement?

**[Play Now](https://ecosphere-game.vercel.app)** | **[Report Issue](https://github.com/yourusername/ecosphere-game/issues)** | **[Contribute](https://github.com/yourusername/ecosphere-game/pulls)**

---

**Built with 💚 for the planet**
