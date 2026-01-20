'use client';

import React, { useState } from 'react';
import RestaurantDemo from './RestaurantDemo';
import EcoSphereGame from './EcoSphereGame';

interface GameState {
  phase: 'welcome' | 'demo' | 'ecosphere-game' | 'domain-selection' | 'gameplay' | 'reveal';
  selectedDomain: string | null;
  completedTasks: string[];
  unlockedComponents: any[];
  score: number;
  useEcoSphere: boolean;
}

const domains = [
  { 
    id: 'restaurant', 
    name: 'Food Haven', 
    emoji: '🍽️', 
    description: 'Create your dream dining experience',
    color: 'from-orange-400 to-red-500'
  },
  { 
    id: 'store', 
    name: 'Shop World', 
    emoji: '🛍️', 
    description: 'Design the ultimate shopping destination',
    color: 'from-blue-400 to-purple-500'
  },
  { 
    id: 'portfolio', 
    name: 'Creative Studio', 
    emoji: '🎨', 
    description: 'Showcase your artistic vision',
    color: 'from-pink-400 to-purple-500'
  },
  { 
    id: 'fitness', 
    name: 'Fit Life', 
    emoji: '💪', 
    description: 'Build a wellness community',
    color: 'from-green-400 to-teal-500'
  },
  { 
    id: 'education', 
    name: 'Learn Hub', 
    emoji: '📚', 
    description: 'Create an inspiring learning space',
    color: 'from-yellow-400 to-orange-500'
  },
  { 
    id: 'travel', 
    name: 'Wanderlust', 
    emoji: '✈️', 
    description: 'Design adventures around the world',
    color: 'from-cyan-400 to-blue-500'
  }
];

const gameTasks = {
  restaurant: [
    { id: 1, question: "What feeling should guests have when they arrive?", options: ["Cozy & Warm", "Elegant & Sophisticated", "Fun & Energetic", "Peaceful & Calm"], component: 'hero' },
    { id: 2, question: "What's the star of your menu?", options: ["Italian Pasta", "Gourmet Burgers", "Sushi Rolls", "Mexican Tacos"], component: 'menu' },
    { id: 3, question: "How should guests discover your story?", options: ["Video Journey", "Photo Gallery", "Written Tale", "Timeline"], component: 'about' },
    { id: 4, question: "What makes booking easy?", options: ["Quick Form", "Calendar View", "Chat Booking", "Phone Button"], component: 'booking' },
    { id: 5, question: "How do you showcase reviews?", options: ["Star Ratings", "Story Cards", "Video Reviews", "Social Feed"], component: 'testimonials' }
  ],
  store: [
    { id: 1, question: "What catches shoppers' attention first?", options: ["Big Banner Sale", "Product Carousel", "Video Hero", "Search Bar"], component: 'hero' },
    { id: 2, question: "How should products be displayed?", options: ["Grid Gallery", "Card List", "Masonry Wall", "Slider"], component: 'products' },
    { id: 3, question: "What helps customers decide?", options: ["Star Reviews", "Image Zoom", "Size Guide", "Compare Tool"], component: 'details' },
    { id: 4, question: "How should checkout feel?", options: ["Quick 1-Click", "Step-by-Step", "Side Cart", "Full Page"], component: 'cart' },
    { id: 5, question: "What builds trust?", options: ["Customer Photos", "Brand Story", "Guarantees", "Awards"], component: 'trust' }
  ],
  portfolio: [
    { id: 1, question: "How do you introduce yourself?", options: ["Bold Statement", "Animated Name", "Video Intro", "Creative Bio"], component: 'hero' },
    { id: 2, question: "How should projects be showcased?", options: ["Full Screen Gallery", "Grid Tiles", "Masonry Layout", "Slider"], component: 'portfolio' },
    { id: 3, question: "What tells your story best?", options: ["Timeline", "Skills Chart", "About Page", "Process"], component: 'about' },
    { id: 4, question: "How can people reach you?", options: ["Contact Form", "Email Button", "Social Links", "Chat"], component: 'contact' },
    { id: 5, question: "What shows your expertise?", options: ["Client Logos", "Testimonials", "Certifications", "Case Studies"], component: 'proof' }
  ]
};

export default function GameFlow({ onAppCreated }: { onAppCreated: (components: any[]) => void }) {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'welcome',
    selectedDomain: null,
    completedTasks: [],
    unlockedComponents: [],
    score: 0,
    useEcoSphere: true // Enable EcoSphere by default
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
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl text-center text-white space-y-8 relative z-10">
          <div className="text-8xl mb-6">🌍</div>
          <h1 className="text-7xl font-bold mb-4">EcoSphere</h1>
          <p className="text-3xl mb-8">Restore a Planet, Build Your Application</p>
          <p className="text-xl mb-12 opacity-90">
            Help heal EcoSphere's ecosystems while unknowingly designing your perfect environmental management app!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setGameState({ ...gameState, phase: 'ecosphere-game', useEcoSphere: true })}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-6 rounded-full text-2xl font-bold hover:scale-110 transform transition-all shadow-2xl"
            >
              Start Journey 🚀
            </button>
            <button
              onClick={() => setGameState({ ...gameState, phase: 'demo', useEcoSphere: false })}
              className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full text-xl font-semibold hover:scale-105 transform transition-all border-2 border-white/30"
            >
              See Demo ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EcoSphere Game Phase
  if (gameState.phase === 'ecosphere-game' && gameState.useEcoSphere) {
    return <EcoSphereGame />;
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
