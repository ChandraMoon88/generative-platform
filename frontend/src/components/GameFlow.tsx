'use client';

import React, { useState } from 'react';
import EnvironmentDemo from './EnvironmentDemo';

interface GameState {
  phase: 'welcome' | 'demo' | 'domain-selection' | 'gameplay' | 'reveal';
  selectedDomain: string | null;
  completedTasks: string[];
  unlockedComponents: any[];
  score: number;
}

const domains = [
  { 
    id: 'sunset', 
    name: 'Sunset Paradise', 
    emoji: '🌅', 
    description: 'Warm, vibrant, and energetic vibes',
    color: 'from-orange-400 via-red-500 to-pink-500'
  },
  { 
    id: 'ocean', 
    name: 'Ocean Breeze', 
    emoji: '🌊', 
    description: 'Cool, calm, and refreshing atmosphere',
    color: 'from-blue-400 via-cyan-500 to-teal-500'
  },
  { 
    id: 'forest', 
    name: 'Forest Haven', 
    emoji: '🌲', 
    description: 'Natural, grounded, and peaceful energy',
    color: 'from-green-400 via-emerald-500 to-lime-500'
  },
  { 
    id: 'cosmic', 
    name: 'Cosmic Dreams', 
    emoji: '🌌', 
    description: 'Mysterious, deep, and inspiring space',
    color: 'from-purple-500 via-indigo-600 to-blue-700'
  },
  { 
    id: 'sunrise', 
    name: 'Sunrise Glow', 
    emoji: '🌄', 
    description: 'Fresh, hopeful, and bright beginnings',
    color: 'from-yellow-300 via-orange-400 to-pink-400'
  },
  { 
    id: 'midnight', 
    name: 'Midnight Magic', 
    emoji: '✨', 
    description: 'Elegant, sophisticated, and luxurious feel',
    color: 'from-gray-800 via-purple-900 to-black'
  }
];

const gameTasks = {
  sunset: [
    { id: 1, question: "How should visitors feel when they arrive?", options: ["Energized & Excited", "Welcomed & Comfortable", "Curious & Engaged", "Inspired & Motivated"], component: 'hero' },
    { id: 2, question: "What mood should your colors create?", options: ["Bold & Powerful", "Warm & Cozy", "Playful & Fun", "Elegant & Refined"], component: 'theme' },
    { id: 3, question: "How do you want to tell your story?", options: ["Big Visual Impact", "Personal Journey", "Simple & Direct", "Creative & Unique"], component: 'content' },
    { id: 4, question: "What action should stand out most?", options: ["Let's Start!", "Learn More", "Join Now", "Get in Touch"], component: 'cta' },
    { id: 5, question: "How should sections flow together?", options: ["Smooth Transitions", "Clear Divisions", "Surprising Elements", "Consistent Rhythm"], component: 'layout' }
  ],
  ocean: [
    { id: 1, question: "What feeling greets your visitors?", options: ["Peaceful & Calm", "Fresh & Clean", "Open & Free", "Trustworthy & Safe"], component: 'hero' },
    { id: 2, question: "What vibe do your colors give?", options: ["Cool & Refreshing", "Minimal & Modern", "Light & Airy", "Professional & Clear"], component: 'theme' },
    { id: 3, question: "How should content breathe?", options: ["Spacious & Open", "Organized & Clean", "Flowing & Natural", "Balanced & Centered"], component: 'content' },
    { id: 4, question: "What invites interaction?", options: ["Gentle Invitation", "Clear Direction", "Subtle Prompts", "Confident Call"], component: 'cta' },
    { id: 5, question: "How do elements connect?", options: ["Seamless Flow", "Wave-like Motion", "Layered Depth", "Harmonious Balance"], component: 'layout' }
  ],
  forest: [
    { id: 1, question: "What atmosphere welcomes people?", options: ["Grounded & Stable", "Natural & Organic", "Comfortable & Safe", "Growth & Progress"], component: 'hero' },
    { id: 2, question: "What essence do colors convey?", options: ["Earthy & Real", "Fresh & Living", "Calm & Balanced", "Rich & Abundant"], component: 'theme' },
    { id: 3, question: "How should information grow?", options: ["Naturally Unfolding", "Rooted & Strong", "Branching Paths", "Layered Discovery"], component: 'content' },
    { id: 4, question: "What encourages exploration?", options: ["Discover More", "Grow With Us", "Start Journey", "Plant Seeds"], component: 'cta' },
    { id: 5, question: "How do spaces relate?", options: ["Organic Clusters", "Rooted Structure", "Natural Hierarchy", "Ecosystem Balance"], component: 'layout' }
  ],
  cosmic: [
    { id: 1, question: "What first impression sparkles?", options: ["Mysterious & Intriguing", "Vast & Limitless", "Futuristic & Bold", "Magical & Enchanting"], component: 'hero' },
    { id: 2, question: "What energy do colors radiate?", options: ["Deep & Rich", "Glowing & Vibrant", "Dark & Dramatic", "Shimmering & Bright"], component: 'theme' },
    { id: 3, question: "How should content reveal itself?", options: ["Gradual Discovery", "Unexpected Moments", "Layered Depths", "Infinite Scroll"], component: 'content' },
    { id: 4, question: "What launches engagement?", options: ["Launch Mission", "Explore Galaxy", "Beam Me Up", "Join Universe"], component: 'cta' },
    { id: 5, question: "How do sections orbit?", options: ["Floating Islands", "Stellar Navigation", "Cosmic Grid", "Gravity Wells"], component: 'layout' }
  ],
  sunrise: [
    { id: 1, question: "What awakens your visitors?", options: ["Bright & Cheerful", "Fresh & New", "Optimistic & Hopeful", "Vibrant & Alive"], component: 'hero' },
    { id: 2, question: "What light do colors bring?", options: ["Golden Glow", "Soft Pastels", "Radiant Energy", "Dawn Warmth"], component: 'theme' },
    { id: 3, question: "How should stories unfold?", options: ["Progressive Reveal", "Ascending Journey", "Brightening Path", "Rising Action"], component: 'content' },
    { id: 4, question: "What ignites action?", options: ["Rise & Shine", "New Beginning", "Seize the Day", "Light the Way"], component: 'cta' },
    { id: 5, question: "How do elements illuminate?", options: ["Gradual Brightening", "Horizon Layers", "Expanding Light", "Radial Balance"], component: 'layout' }
  ],
  midnight: [
    { id: 1, question: "What elegance welcomes guests?", options: ["Sophisticated & Luxe", "Mysterious & Alluring", "Refined & Classy", "Powerful & Bold"], component: 'hero' },
    { id: 2, question: "What richness do colors exude?", options: ["Deep & Luxurious", "Metallic Accents", "Velvet Tones", "Jewel Elegance"], component: 'theme' },
    { id: 3, question: "How should content unveil?", options: ["Dramatic Reveals", "Elegant Transitions", "Curtain Opens", "Spotlight Moments"], component: 'content' },
    { id: 4, question: "What compels exclusivity?", options: ["Enter Experience", "Unlock Access", "Join Elite", "Claim Premium"], component: 'cta' },
    { id: 5, question: "How do spaces command?", options: ["Symmetrical Power", "Centered Focus", "Luxury Layers", "Premium Grid"], component: 'layout' }
  ]
};

export default function GameFlow({ onAppCreated }: { onAppCreated: (components: any[]) => void }) {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'welcome',
    selectedDomain: null,
    completedTasks: [],
    unlockedComponents: [],
    score: 0
  });

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const handleDomainSelect = (domainId: string) => {
    setGameState({
      ...gameState,
      phase: 'gameplay',
      selectedDomain: domainId
    });
  };

  const handleTaskComplete = (option: string) => {
    const domain = gameState.selectedDomain!;
    const tasks = gameTasks[domain as keyof typeof gameTasks] || gameTasks.restaurant;
    const currentTask = tasks[currentTaskIndex];
    
    // Create component based on task and selection
    const newComponent = createComponentFromChoice(currentTask.component, option);
    
    const updatedState = {
      ...gameState,
      completedTasks: [...gameState.completedTasks, currentTask.id.toString()],
      unlockedComponents: [...gameState.unlockedComponents, newComponent],
      score: gameState.score + 100
    };

    setGameState(updatedState);

    // Move to next task or reveal
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      setGameState({ ...updatedState, phase: 'reveal' });
      onAppCreated(updatedState.unlockedComponents);
    }
  };

  const createComponentFromChoice = (componentType: string, choice: string) => {
    // Generate unique component based on user's choice
    const id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const componentMap: any = {
      hero: {
        type: 'Card',
        category: 'Layout & Containers',
        props: {
          title: choice,
          content: 'Your creative vision comes to life here!',
          backgroundColor: choice.includes('Cozy') ? '#FFF5E1' : choice.includes('Elegant') ? '#F8F9FA' : '#FFE5E5',
          padding: '48px',
          borderRadius: '16px',
          fontSize: '24px',
          textAlign: 'center'
        }
      },
      menu: {
        type: 'Card',
        category: 'Layout & Containers',
        props: {
          title: `Featured: ${choice}`,
          content: 'Delicious options crafted with care',
          backgroundColor: '#FFFAF0',
          padding: '32px',
          borderRadius: '12px'
        }
      },
      about: {
        type: 'Card',
        category: 'Layout & Containers',
        props: {
          title: 'Our Story',
          content: `Discover through ${choice}`,
          backgroundColor: '#F0F8FF',
          padding: '32px'
        }
      },
      booking: {
        type: 'Button',
        category: 'Buttons & Actions',
        props: {
          text: choice,
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          padding: '16px 32px',
          fontSize: '18px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }
      },
      testimonials: {
        type: 'Alert',
        category: 'Feedback & Status',
        props: {
          message: `⭐⭐⭐⭐⭐ "${choice}" - Amazing experience!`,
          backgroundColor: '#FEF3C7',
          padding: '24px',
          borderRadius: '12px'
        }
      },
      products: {
        type: 'Card',
        category: 'Layout & Containers',
        props: {
          title: 'Shop Collection',
          content: `Displayed as ${choice}`,
          backgroundColor: '#F3F4F6',
          padding: '32px'
        }
      },
      details: {
        type: 'Card',
        category: 'Layout & Containers',
        props: {
          title: 'Product Details',
          content: `Enhanced with ${choice}`,
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderWidth: '2px',
          borderColor: '#E5E7EB'
        }
      },
      cart: {
        type: 'Button',
        category: 'Buttons & Actions',
        props: {
          text: `${choice} Checkout`,
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          padding: '16px 32px',
          borderRadius: '8px'
        }
      },
      trust: {
        type: 'Alert',
        category: 'Feedback & Status',
        props: {
          message: `✓ Trusted Choice: ${choice}`,
          backgroundColor: '#D1FAE5',
          padding: '20px'
        }
      },
      portfolio: {
        type: 'Card',
        category: 'Layout & Containers',
        props: {
          title: 'Projects',
          content: `Shown in ${choice}`,
          backgroundColor: '#F9FAFB',
          padding: '40px'
        }
      },
      contact: {
        type: 'Button',
        category: 'Buttons & Actions',
        props: {
          text: `Connect via ${choice}`,
          backgroundColor: '#8B5CF6',
          color: '#FFFFFF',
          padding: '16px 32px'
        }
      },
      proof: {
        type: 'Card',
        category: 'Layout & Containers',
        props: {
          title: 'Credentials',
          content: `Featuring ${choice}`,
          backgroundColor: '#EEF2FF',
          padding: '24px'
        }
      }
    };

    return {
      id,
      ...(componentMap[componentType] || componentMap.hero)
    };
  };

  // Welcome Phase
  if (gameState.phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-4">
        <div className="max-w-4xl text-center text-white space-y-8">
          <div className="text-8xl mb-6 animate-bounce">🎮</div>
          <h1 className="text-7xl font-bold mb-4">Creative Quest</h1>
          <p className="text-3xl mb-8">Play, Create, Build Your Dream!</p>
          <p className="text-xl mb-12 opacity-90">
            Every choice you make creates something amazing. Let's see what you'll create!
          </p>
          <button
            onClick={() => setGameState({ ...gameState, phase: 'demo' })}
            className="bg-white text-purple-600 px-12 py-6 rounded-full text-2xl font-bold hover:scale-110 transform transition-all shadow-2xl"
          >
            See What's Possible ✨
          </button>
        </div>
      </div>
    );
  }

  // Demo Phase
  if (gameState.phase === 'demo') {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setGameState({ ...gameState, phase: 'domain-selection' })}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:scale-110 transform transition-all shadow-2xl animate-pulse"
          >
            Start Creating! 🚀
          </button>
        </div>
        <RestaurantDemo />
      </div>
    );
  }

  // Domain Selection
  if (gameState.phase === 'domain-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Choose Your Adventure
            </h1>
            <p className="text-2xl text-gray-600">What world will you create today?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => handleDomainSelect(domain.id)}
                className="group relative overflow-hidden rounded-3xl p-8 text-left transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10 text-white">
                  <div className="text-7xl mb-4">{domain.emoji}</div>
                  <h3 className="text-3xl font-bold mb-2">{domain.name}</h3>
                  <p className="text-lg opacity-90">{domain.description}</p>
                </div>
                <div className="absolute bottom-4 right-4 text-white text-4xl opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                  →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Gameplay Phase
  if (gameState.phase === 'gameplay') {
    const domain = gameState.selectedDomain!;
    const tasks = gameTasks[domain as keyof typeof gameTasks] || gameTasks.restaurant;
    const currentTask = tasks[currentTaskIndex];
    const progress = ((currentTaskIndex + 1) / tasks.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Quest Progress</span>
              <span className="text-sm font-medium text-purple-600">
                {currentTaskIndex + 1} of {tasks.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Score */}
          <div className="text-right mb-6">
            <span className="text-3xl font-bold text-purple-600">⭐ {gameState.score}</span>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💭</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentTask.question}</h2>
              <p className="text-gray-600 text-lg">Choose what feels right to you!</p>
            </div>

            {/* Options */}
            <div className="grid md:grid-cols-2 gap-4">
              {currentTask.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleTaskComplete(option)}
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-left hover:shadow-xl transform transition-all hover:scale-105 border-2 border-transparent hover:border-purple-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {['🎨', '✨', '🌟', '💫'][index]}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">{option}</div>
                      <div className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to choose
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reveal Phase
  if (gameState.phase === 'reveal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-4xl text-center text-white space-y-8">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-7xl font-bold mb-4">You Did It!</h1>
          <p className="text-4xl mb-8">Final Score: ⭐ {gameState.score}</p>
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 mb-8">
            <p className="text-2xl mb-4">
              While you were playing and making creative choices...
            </p>
            <p className="text-5xl font-bold mb-4">
              You Built Something Amazing! 🚀
            </p>
            <p className="text-xl opacity-90">
              Every decision you made created a unique piece. Let's see your creation!
            </p>
          </div>
          <button
            onClick={() => {
              // App already created via onAppCreated callback
              window.location.href = '/projects';
            }}
            className="bg-white text-purple-600 px-12 py-6 rounded-full text-2xl font-bold hover:scale-110 transform transition-all shadow-2xl"
          >
            See My Creation ✨
          </button>
        </div>
      </div>
    );
  }

  return null;
}
