'use client';

import { useState, useEffect } from 'react';
import { Droplet, TreePine, Factory, Sprout, Waves, Mountain, Check, Lock, Sparkles, Users, DollarSign, BarChart3, MessageSquare, FileCheck, FolderKanban, Lightbulb, Scale, GraduationCap, Globe } from 'lucide-react';
import Level1Game from './Level1Game';
import Level2Game from './Level2Game';
import Level3Game from './Level3Game';
import Level5Game from './Level5Game';
import RemainingLevelsGame from './RemainingLevelsGame';
import OpeningSequence from './OpeningSequence';
import GaiaGuide, { GaiaMessages } from './GaiaGuide';
import { loadGameState, GameState } from '@/lib/gameState';

// Level Icons Mapping
const levelIcons = [
  Droplet, Factory, TreePine, Waves, Sprout, Users, DollarSign, BarChart3,
  MessageSquare, FileCheck, FolderKanban, Lightbulb, Scale, GraduationCap, Globe
];

interface Level {
  id: number;
  title: string;
  phase: string;
  description: string;
  objective: string;
  challenge: string;
}

const levels: Level[] = [
  {
    id: 1,
    title: "First Contact - The Arrival",
    phase: "The Awakening",
    description: "Welcome to EcoSphere, Restoration Architect. A once-thriving river valley now struggles with pollution and degradation. You've been chosen to help this world heal.",
    objective: "Use your Environmental Scanner to explore the Weeping River. Examine water quality, identify pollution levels, and document the river's condition across all sections.",
    challenge: "Scan all 10 river sections, name your river, and understand its complete ecosystem structure. You're discovering a struggling waterway that was once crystal clear and full of life."
  },
  {
    id: 2,
    title: "The Source of Sorrow - Investigation",
    phase: "The Awakening",
    description: "The river's pollution has sources. Using your Pollution Tracker, trace contamination back to its origins.",
    objective: "Follow glowing particle trails upstream to discover all pollution sources: industrial discharge, agricultural runoff, urban waste, illegal dumping, and natural contamination.",
    challenge: "Document 5 pollution sources with complete information. Create dossiers for each source, collect evidence, and prioritize them using the Impact-Feasibility Matrix."
  },
  {
    id: 3,
    title: "The Grand Plan - Strategy & Design",
    phase: "The Awakening",
    description: "With pollution sources identified, it's time to design your restoration strategy. Enter the Planning Workshop to create your comprehensive healing plan.",
    objective: "Arrange restoration action cards on your timeline. Connect dependencies, allocate your budget and team resources, and define success metrics for each step.",
    challenge: "Design a complete restoration workflow with at least 5 steps. Choose between Swift Strike (focus on top source) or Comprehensive Approach (address all sources gradually)."
  },
  {
    id: 4,
    title: "Making It Real - Execution & Monitoring",
    phase: "The Awakening",
    description: "Your plan is ready. Now watch it come to life! Monitor restoration activities in real-time and adapt to unexpected challenges.",
    objective: "Launch your restoration project and track progress through the Living Dashboard. Respond to dynamic events like storms, resource shortages, and unexpected pollution spikes.",
    challenge: "Complete your first restoration action while handling at least one unexpected challenge. Maintain resources within limits and show measurable environmental improvement."
  },
  {
    id: 5,
    title: "The Ripple Effect - Understanding Connections",
    phase: "The Awakening",
    description: "Your river restoration is creating ripples throughout the ecosystem! Discover how healing one system affects the entire web of life.",
    objective: "Map connected ecosystems: wetlands, groundwater, downstream lake, riverbank soil, vegetation, wildlife, community wells, and agricultural fields.",
    challenge: "Document 5+ connected systems, analyze cascading impacts, and choose your strategic approach: River-Only Focus, Integrated Restoration, or Strategic Prioritization."
  },
  {
    id: 6,
    title: "The Team Builder - Collaboration Begins",
    phase: "Mastery",
    description: "Restoration is not a solo journey. Open the Recruitment Center and build your dream team of specialists, each with unique skills and personalities.",
    objective: "Hire water quality experts, biologists, equipment operators, and community liaisons. Assign specialists to tasks based on skills, manage team dynamics, and handle scheduling conflicts.",
    challenge: "Build a team of 3+ specialists. Complete the Emergency Storm Scenario: secure equipment, collect samples, and warn communities - all within 48 hours."
  },
  {
    id: 7,
    title: "The Budget Master - Financial Management",
    phase: "Mastery",
    description: "Your funding agency requests a detailed financial report. It's time to master the art of budget management and financial planning.",
    objective: "Categorize all expenses, track spending by project and category, create budget forecasts, analyze variance, and identify cost optimizations.",
    challenge: "Generate a comprehensive financial report, apply for a grant if budget is tight, and find at least one cost optimization that saves 10% or more."
  },
  {
    id: 8,
    title: "The Data Scientist - Advanced Analytics",
    phase: "Mastery",
    description: "Transform your raw monitoring data into powerful insights! Build visualizations, discover patterns, create predictive models, and detect anomalies.",
    objective: "Use the Analytics Lab to create time-series charts, correlation heat maps, and trend visualizations. Build a predictive model for water quality forecasting.",
    challenge: "Create 3+ visualizations, discover 2 hidden patterns in your data, build a predictive model, correct a data anomaly, and design a live stakeholder dashboard."
  },
  {
    id: 9,
    title: "The Communicator - Stakeholder Management",
    phase: "Mastery",
    description: "Environmental restoration affects many groups: communities, businesses, government agencies. Master stakeholder communication and engagement.",
    objective: "Map all stakeholder groups on a Power-Interest Matrix. Create tailored communication plans, conduct community meetings, and manage crisis communications.",
    challenge: "Identify 5+ stakeholder groups, create communication plans for each, hold a successful community meeting, and manage a crisis scenario (fish kill) within 24 hours."
  },
  {
    id: 10,
    title: "The Compliance Manager - Regulations & Permissions",
    phase: "Mastery",
    description: "Navigate the complex world of environmental regulations, permits, inspections, and reporting requirements across multiple jurisdictions.",
    objective: "Identify applicable regulations (federal, state, local). Apply for required permits like NPDES. Prepare for EPA inspection and submit monitoring reports.",
    challenge: "Pass your first inspection, submit all required reports, respond to a regulation change, and resolve conflicts between federal and local requirements."
  },
  {
    id: 11,
    title: "The Ecosystem Engineer - Multiple Projects",
    phase: "Expansion",
    description: "Your success with the river has opened new opportunities. Now manage multiple restoration projects simultaneously across the entire region.",
    objective: "Launch river, lake, wetlands, and forest restoration projects. Manage portfolio dashboard, allocate shared resources, and identify synergies between projects.",
    challenge: "Run 3+ simultaneous projects, discover 2 project synergies, create reusable project templates, and plan resource allocation 6 months ahead."
  },
  {
    id: 12,
    title: "The Innovation Lab - Research & Development",
    phase: "Expansion",
    description: "Become an innovation leader! Propose research questions, design experiments, pilot new technologies, and decide whether to patent or open-source your discoveries.",
    objective: "Propose a research hypothesis, design controlled experiments with test groups, analyze results, and pilot successful innovations at multiple sites.",
    challenge: "Complete 2 research projects, deploy 1 innovation, document 1 valuable failure, make an IP strategy decision, and track adoption impact."
  },
  {
    id: 13,
    title: "The Policy Maker - Influence & Advocacy",
    phase: "Expansion",
    description: "Transform your on-the-ground experience into systemic change! Draft policy proposals, build coalitions, run advocacy campaigns, and influence legislation.",
    objective: "Identify policy gaps from your restoration work. Draft a Watershed Protection Act. Build a coalition of supporters and navigate the legislative process.",
    challenge: "Pass your policy proposal through committee and floor votes. Build a coalition of 3+ organizations, negotiate amendments, and track policy impact."
  },
  {
    id: 14,
    title: "The Mentor - Teaching & Scaling Knowledge",
    phase: "Expansion",
    description: "Your expertise must multiply! Accept mentees, design learning curricula, delegate projects, create training programs, and establish a train-the-trainer model.",
    objective: "Mentor 2 individuals with personalized learning plans. Create comprehensive methodology documentation. Design and deliver a 3-day training workshop.",
    challenge: "Mentor 2+ people to competency, train 5+ master trainers who each teach others, publish open educational resources, and track multiplied impact."
  },
  {
    id: 15,
    title: "The Visionary - Building the Movement",
    phase: "Expansion",
    description: "Your ultimate challenge: build a self-sustaining global movement. Design organizational structure, secure funding, expand geographically, and plan your succession.",
    objective: "Create a bold vision for community-based restoration everywhere. Build a $1M+ sustainable budget. Expand to 3+ regions. Partner with universities and government.",
    challenge: "Establish organizational governance, achieve financial sustainability, expand globally, plan leadership succession, and watch the movement thrive without you. Impact: 3,450 practitioners, 1,247 restored watersheds, 47 countries."
  }
];

export default function EcoSphereGame() {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set([0]));
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showOpeningSequence, setShowOpeningSequence] = useState<boolean>(true);
  const [selectedLandingZone, setSelectedLandingZone] = useState<string | null>(null);
  const [gaiaMessage, setGaiaMessage] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Load game state on mount
  useEffect(() => {
    const saved = loadGameState();
    const savedZone = localStorage.getItem('ecosphere_landing_zone');
    
    if (saved) {
      setGameState(saved);
      setCurrentLevel(saved.currentLevel);
      setCompletedLevels(new Set(saved.completedLevels));
      if (saved.currentLevel > 0) {
        setGameStarted(true);
        setShowOpeningSequence(false);
      }
    }
    
    if (savedZone) {
      setSelectedLandingZone(savedZone);
      setShowOpeningSequence(false);
    }
  }, []);

  const maxUnlockedLevel = gameState ? gameState.maxUnlockedLevel : 1;
  const currentLevelData = levels[currentLevel - 1];
  const Icon = levelIcons[currentLevel - 1];

  const completeLevel = () => {
    setCompletedLevels(prev => new Set([...prev, currentLevel]));
    
    // Show Gaia message on level completion
    setGaiaMessage(GaiaMessages.levelComplete.text);
    setTimeout(() => setGaiaMessage(null), 5000);
    
    if (currentLevel < 15) {
      setTimeout(() => {
        setCurrentLevel(currentLevel + 1);
      }, 2000);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGaiaMessage(GaiaMessages.welcome.text);
    setTimeout(() => setGaiaMessage(null), 5000);
  };
  
  const handleZoneSelected = (zoneId: string) => {
    setSelectedLandingZone(zoneId);
    setShowOpeningSequence(false);
    setGameStarted(true);
    
    // Show Gaia message for the selected zone
    const zoneMessages: Record<string, string> = {
      river: "The Weeping River Valley awaits your healing touch. Let us begin where water once flowed pure.",
      forest: "The Silent Forest remembers its songs. Together, we shall bring life back to these ancient woods.",
      city: "The Choking City needs our wisdom. Urban healing is delicate work, but vital for all who live here.",
      fields: "The Barren Fields hold memory of abundance. Let us restore what generations once cherished.",
      coast: "The Dying Coast calls out. Where land meets sea, our work is crucial for countless lives.",
      mountains: "The Wounded Mountains stand strong despite their scars. Let us help them heal and thrive once more."
    };
    
    setGaiaMessage(zoneMessages[zoneId] || GaiaMessages.welcome.text);
    setTimeout(() => setGaiaMessage(null), 6000);
  };

  const selectLevel = (levelId: number) => {
    if (levelId <= maxUnlockedLevel) {
      setCurrentLevel(levelId);
      setShowLevelSelect(false);
      setGaiaMessage(GaiaMessages.challenge.text);
      setTimeout(() => setGaiaMessage(null), 5000);
    }
  };
  
  // Show opening sequence first
  if (showOpeningSequence) {
    return <OpeningSequence onZoneSelected={handleZoneSelected} />;
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-blue-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="text-center space-y-8">
            <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <Globe className="w-24 h-24 text-emerald-300" />
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-4">EcoSphere</h1>
            <p className="text-2xl text-emerald-200 mb-6">The Ultimate Environmental Restoration Game</p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-left space-y-6 max-w-2xl mx-auto">
              <p className="text-lg text-white/90">
                Welcome, <span className="text-emerald-300 font-semibold">Restoration Architect</span>. 
                You&apos;ve been chosen to heal EcoSphere - a beautiful planet facing environmental challenges.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-300 mt-1 flex-shrink-0" />
                  <p className="text-white/80">Restore polluted rivers, degraded forests, and struggling ecosystems</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-300 mt-1 flex-shrink-0" />
                  <p className="text-white/80">Build teams, manage budgets, and navigate complex regulations</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-300 mt-1 flex-shrink-0" />
                  <p className="text-white/80">Scale from local projects to global movements</p>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <p className="text-sm text-white/60 italic">
                  Progress through 15 levels across 3 phases: The Awakening, Mastery, and Expansion. 
                  Your journey begins at a polluted river valley...
                </p>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showLevelSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-white">Select Level</h2>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  // Unlock all levels
                  const currentState = loadGameState();
                  if (currentState) {
                    currentState.maxUnlockedLevel = 15;
                    localStorage.setItem('ecosphere_game_state', JSON.stringify(currentState));
                    window.location.reload();
                  }
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-bold"
              >
                🔓 Unlock All Levels
              </button>
              <button
                onClick={() => setShowLevelSelect(false)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Back to Game
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => {
              const LevelIcon = levelIcons[level.id - 1];
              const isUnlocked = level.id <= maxUnlockedLevel;
              const isCompleted = completedLevels.has(level.id);
              const isCurrent = level.id === currentLevel;
              
              return (
                <button
                  key={level.id}
                  onClick={() => selectLevel(level.id)}
                  disabled={!isUnlocked}
                  className={`p-6 rounded-xl text-left transition-all transform hover:scale-105 ${
                    !isUnlocked
                      ? 'bg-white/5 opacity-50 cursor-not-allowed'
                      : isCurrent
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl'
                      : isCompleted
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${!isUnlocked ? 'bg-white/10' : 'bg-white/20'}`}>
                      {isUnlocked ? <LevelIcon className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white/50" />}
                    </div>
                    {isCompleted && (
                      <div className="p-2 bg-green-500 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-white/60 mb-1">{level.phase}</div>
                  <div className="text-lg font-bold text-white mb-2">
                    Level {level.id}: {level.title}
                  </div>
                  {isUnlocked && (
                    <div className="text-sm text-white/80 line-clamp-2">{level.description}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // If on Level 1, render the actual interactive game
  if (gameStarted && currentLevel === 1) {
    return (
      <>
        <Level1Game />
        {gaiaMessage && (
          <GaiaGuide 
            message={{ text: gaiaMessage, emotion: 'thoughtful' }}
            autoClose={true}
            autoCloseDelay={5000}
          />
        )}
      </>
    );
  }
  
  if (gameStarted && currentLevel === 2) {
    return (
      <>
        <Level2Game />
        {gaiaMessage && (
          <GaiaGuide 
            message={{ text: gaiaMessage, emotion: 'thoughtful' }}
            autoClose={true}
            autoCloseDelay={5000}
          />
        )}
      </>
    );
  }
  
  if (gameStarted && currentLevel === 3) {
    return (
      <>
        <Level3Game />
        {gaiaMessage && (
          <GaiaGuide 
            message={{ text: gaiaMessage, emotion: 'thoughtful' }}
            autoClose={true}
            autoCloseDelay={5000}
          />
        )}
      </>
    );
  }
  
  if (gameStarted && currentLevel === 4) {
    return (
      <>
        <RemainingLevelsGame levelNumber={4} />
        {gaiaMessage && (
          <GaiaGuide 
            message={{ text: gaiaMessage, emotion: 'thoughtful' }}
            autoClose={true}
            autoCloseDelay={5000}
          />
        )}
      </>
    );
  }
  
  if (gameStarted && currentLevel === 5) {
    return (
      <>
        <Level5Game />
        {gaiaMessage && (
          <GaiaGuide 
            message={{ text: gaiaMessage, emotion: 'thoughtful' }}
            autoClose={true}
            autoCloseDelay={5000}
          />
        )}
      </>
    );
  }
  
  if (gameStarted && currentLevel >= 6 && currentLevel <= 15) {
    return (
      <>
        <RemainingLevelsGame levelNumber={currentLevel} />
        {gaiaMessage && (
          <GaiaGuide 
            message={{ text: gaiaMessage, emotion: 'thoughtful' }}
            autoClose={true}
            autoCloseDelay={5000}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-emerald-300 text-sm mb-1">{currentLevelData.phase}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Level {currentLevel}: {currentLevelData.title}
            </h1>
          </div>
          <button
            onClick={() => setShowLevelSelect(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
          >
            Level Select
          </button>
        </div>
        
        <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-500"
            style={{ width: `${(completedLevels.size / 15) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-white/60 text-sm">
          Progress: {completedLevels.size} of 15 levels completed
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                <Icon className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">{currentLevelData.title}</h2>
                <p className="text-white/80 leading-relaxed">{currentLevelData.description}</p>
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-xl p-6 mb-6">
              <h3 className="text-emerald-300 font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Objective
              </h3>
              <p className="text-white/90 leading-relaxed">{currentLevelData.objective}</p>
            </div>

            <div className="bg-orange-500/10 rounded-xl p-6">
              <h3 className="text-orange-300 font-bold mb-3">Challenge</h3>
              <p className="text-white/90 leading-relaxed">{currentLevelData.challenge}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Interactive Gameplay Area</h3>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-8 text-center">
              <div className="inline-block p-6 bg-white/10 rounded-full mb-4">
                <Icon className="w-16 h-16 text-white/60" />
              </div>
              <p className="text-white/70 mb-6">
                Gameplay mechanics for &ldquo;{currentLevelData.title}&rdquo; would appear here in the full implementation.
              </p>

              <button
                onClick={completeLevel}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
              >
                Complete Level {currentLevel}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Your Progress</h3>
            <div className="space-y-3">
              {[...Array(Math.min(5, 16 - Math.floor((currentLevel - 1) / 5) * 5))].map((_, idx) => {
                const levelNum = Math.floor((currentLevel - 1) / 5) * 5 + idx + 1;
                if (levelNum > 15) return null;
                
                const isCompleted = completedLevels.has(levelNum);
                const isCurrent = levelNum === currentLevel;
                const isUnlocked = levelNum <= maxUnlockedLevel;
                const LevelIcon = levelIcons[levelNum - 1];
                
                return (
                  <div
                    key={levelNum}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isCurrent ? 'bg-emerald-500/20 border-2 border-emerald-500' : isCompleted ? 'bg-green-500/10' : isUnlocked ? 'bg-white/5' : 'bg-white/5 opacity-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500' : 'bg-white/10'}`}>
                      {isCompleted ? <Check className="w-4 h-4 text-white" /> : isUnlocked ? <LevelIcon className="w-4 h-4 text-white" /> : <Lock className="w-4 h-4 text-white/50" />}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${isCurrent ? 'text-emerald-300' : 'text-white/80'}`}>
                        Level {levelNum}
                      </div>
                      <div className="text-xs text-white/60 truncate">{levels[levelNum - 1].title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-white font-bold mb-3">Current Phase</h3>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
              {currentLevelData.phase}
            </div>
            <p className="text-white/70 text-sm">
              {currentLevel <= 5 && "Foundation building: Learn the basics of environmental restoration through hands-on experience."}
              {currentLevel > 5 && currentLevel <= 10 && "Master complex systems: Team management, finances, analytics, communications, and compliance."}
              {currentLevel > 10 && "Scale your impact: Multi-project management, innovation, policy influence, teaching, and movement building."}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Achievements</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Levels Completed</span>
                <span className="text-emerald-300 font-bold">{completedLevels.size}/15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Current Phase</span>
                <span className="text-blue-300 font-bold">
                  {currentLevel <= 5 ? "1/3" : currentLevel <= 10 ? "2/3" : "3/3"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Restoration Points</span>
                <span className="text-yellow-300 font-bold">{completedLevels.size * 250}</span>
              </div>
            </div>
          </div>

          {completedLevels.size === 15 && (
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-6 border-2 border-yellow-500/50">
              <div className="text-center">
                <div className="inline-block p-4 bg-yellow-500/20 rounded-full mb-4">
                  <Sparkles className="w-12 h-12 text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Journey Complete!</h3>
                <p className="text-white/80 text-sm">
                  You&apos;ve mastered all 15 levels and become a true Restoration Architect. Your movement is changing the world!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Gaia Guide overlay */}
      {gaiaMessage && (
        <GaiaGuide 
          message={{ text: gaiaMessage, emotion: 'thoughtful' }}
          autoClose={true}
          autoCloseDelay={5000}
        />
      )}
    </div>
  );
}
