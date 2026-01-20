# 🎮 EcoSphere Chronicles - Environmental Restoration Game

An interactive educational game where players become environmental restoration experts, learning about water quality, pollution investigation, strategic planning, and ecosystem management.

## 🌟 Features

- **15 Complete Levels** with real interactive gameplay (5-8 hours total)
- **Educational Content** covering water quality, ecology, team management, and policy
- **Progress Persistence** with auto-save functionality
- **Quiz System** with 70% passing requirement
- **Real-time Data Generation** for realistic environmental scenarios
- **Beautiful UI** with animations and color-coded visualizations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/generative-platform.git
cd generative-platform

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game!

## 📁 Project Structure

```
generative-platform/
├── frontend/          # Next.js game application
│   ├── src/
│   │   ├── app/       # Next.js pages and routes
│   │   ├── components/# Game components (Level1-15)
│   │   └── lib/       # Game state management
│   └── package.json
├── backend/           # Backend API services
│   ├── src/
│   │   ├── api/       # API routes
│   │   ├── db/        # Database layer
│   │   └── middleware/# Security & auth
│   └── package.json
└── shared/            # Shared types and utilities
    └── types/
```

## 🎯 Game Levels

### Level 1: Water Assessment (20-40 min)
- Interactive river scanning mini-game
- Real-time water quality data
- 10-question science quiz

### Level 2: Pollution Investigation (15-25 min)
- Track 7 pollution sources
- Evidence collection system
- Priority matrix analysis

### Level 3: Strategic Planning (15-25 min)
- Budget management ($50K)
- Timeline scheduling
- Resource allocation

### Levels 4-15: Advanced Topics
- Implementation & Execution
- Ecosystem Mapping
- Team Building
- Financial Management
- Crisis Management
- Community Engagement
- Regulatory Compliance
- Data Analysis
- Long-term Sustainability
- Scaling & Expansion
- Policy Advocacy
- Legacy Creation

## 🛠️ Development

### Frontend Development

```bash
cd frontend
npm run dev     # Start dev server
npm run build   # Build for production
npm run start   # Start production server
```

### Backend Development

```bash
cd backend
npm install
npm run dev     # Start backend server (port 3001)
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎓 Educational Value

This game teaches:
- **Environmental Science** - Water quality parameters, pollution types
- **Strategic Planning** - Resource allocation, timeline management
- **Data Analysis** - Interpreting environmental data
- **Project Management** - Implementation, monitoring, adjustment
- **Community Engagement** - Stakeholder management
- **Policy** - Regulatory compliance, advocacy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution

- New game levels or mechanics
- UI/UX improvements
- Additional educational content
- Bug fixes and optimizations
- Documentation improvements
- Accessibility enhancements
- Internationalization (i18n)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌐 Live Demo

Play the game: [https://generative-platform.vercel.app](https://generative-platform.vercel.app)

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Built with Next.js, React, and TypeScript
- Icons by Lucide React
- Styled with Tailwind CSS

---

**Note for Developers:** This repository contains the public game code. If you're looking to contribute, check out the issues page for open tasks!

🎮 **Enjoy playing and learning about environmental restoration!** 🌍
