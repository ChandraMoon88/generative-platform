'use client';

/**
 * EcoSphere: The Ultimate Environmental Restoration Game
 * A game where players restore ecosystems while unknowingly generating
 * custom environmental management applications through their gameplay patterns.
 */

import React, { useState, useEffect } from 'react';

// Game Phase Types
type GamePhase = 
  | 'welcome'
  | 'landing-zone-selection'
  | 'level-1-discovery'
  | 'level-2-investigation'
  | 'level-3-planning'
  | 'level-4-execution'
  | 'level-5-systems'
  | 'level-6-team'
  | 'level-7-budget'
  | 'level-8-analytics'
  | 'completion';

// Landing Zone (Starting Domain)
interface LandingZone {
  id: string;
  name: string;
  emoji: string;
  description: string;
  challenges: string[];
  color: string;
  primaryEntity: string;
}

// Water Source Entity (Example from Level 1)
interface WaterSource {
  id: string;
  name: string;
  sections: WaterSection[];
  overallHealth: 'critical' | 'polluted' | 'at-risk' | 'healthy';
}

interface WaterSection {
  id: string;
  sectionNumber: number;
  temperature: number;
  pH: number;
  dissolvedOxygen: number;
  turbidity: number;
  pollutantLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  coordinates: { lat: number; lng: number };
}

// Pollution Source Entity (Level 2)
interface PollutionSource {
  id: string;
  name: string;
  sourceType: 'industrial' | 'agricultural' | 'urban' | 'illegal' | 'natural';
  severity: number; // 1-10
  frequency: 'constant' | 'daily' | 'weekly' | 'seasonal' | 'one-time';
  pollutants: string[];
  responsibility: string;
  accessibility: 'easy' | 'moderate' | 'difficult' | 'requires-authority';
  evidence: Evidence[];
  priority: number;
}

interface Evidence {
  type: 'photograph' | 'measurement' | 'sample' | 'interview';
  data: any;
  timestamp: number;
}

// Restoration Plan (Level 3)
interface RestorationPlan {
  id: string;
  name: string;
  steps: WorkflowStep[];
  approach: 'sequential' | 'parallel';
  totalBudget: number;
  totalDuration: number;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  actionType: string;
  estimatedDuration: number;
  estimatedCost: number;
  assignedResources: Resource[];
  prerequisites: string[];
  successCriteria: SuccessCriteria[];
  riskFactors: string[];
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
}

interface Resource {
  id: string;
  type: 'budget' | 'team' | 'equipment';
  name: string;
  amount: number;
  allocated: number;
}

interface SuccessCriteria {
  measurement: string;
  target: string | number;
  verificationMethod: string;
  successThreshold: string;
}

// Team Member (Level 6)
interface TeamMember {
  id: string;
  name: string;
  role: string;
  portrait: string;
  specialty: string;
  skills: string[];
  costPerMonth: number;
  experience: number;
  compatibility: string[];
  personality: string;
  portfolio?: string;
}

// Game Progress
interface GameProgress {
  phase: GamePhase;
  level: number;
  selectedZone: string | null;
  discoveredEntities: Map<string, any>;
  restorationPoints: number;
  unlockedAbilities: string[];
  playTime: number;
  generatedAppModel: ApplicationModel;
  restorationPlan?: RestorationPlan;
  completedPhases?: string[];
  systemsStrategy?: 'river-only' | 'integrated' | 'prioritized';
  teamMembers?: TeamMember[];
  budgetStrategy?: 'aggressive' | 'balanced' | 'conservative';
}

// Application Model (What gets generated)
interface ApplicationModel {
  entities: any[];
  relationships: any[];
  workflows: any[];
  businessLogic: any[];
  uiPatterns: string[];
  architecture: 'single-domain' | 'multi-domain';
  prioritization: 'speed' | 'comprehensive' | 'stakeholder-focused';
}

// Landing Zones
const landingZones: LandingZone[] = [
  {
    id: 'river-valley',
    name: 'The Weeping River Valley',
    emoji: '🌊',
    description: 'Polluted waterways, dying aquatic life',
    challenges: ['Water pollution', 'Aquatic ecosystem collapse', 'Industrial discharge'],
    color: 'from-blue-400 via-cyan-500 to-teal-500',
    primaryEntity: 'WaterSource'
  },
  {
    id: 'silent-forest',
    name: 'The Silent Forest',
    emoji: '🌲',
    description: 'Deforestation, habitat loss, declining biodiversity',
    challenges: ['Deforestation', 'Habitat fragmentation', 'Species decline'],
    color: 'from-green-400 via-emerald-500 to-teal-600',
    primaryEntity: 'ForestHabitat'
  },
  {
    id: 'choking-city',
    name: 'The Choking City',
    emoji: '🏙️',
    description: 'Air pollution, waste overflow, urban decay',
    challenges: ['Air quality', 'Waste management', 'Urban heat islands'],
    color: 'from-gray-400 via-slate-500 to-zinc-600',
    primaryEntity: 'UrbanEnvironment'
  },
  {
    id: 'barren-fields',
    name: 'The Barren Fields',
    emoji: '🌾',
    description: 'Soil degradation, failed crops, desertification',
    challenges: ['Soil erosion', 'Nutrient depletion', 'Desertification'],
    color: 'from-yellow-400 via-amber-500 to-orange-600',
    primaryEntity: 'AgriculturalLand'
  },
  {
    id: 'dying-coast',
    name: 'The Dying Coast',
    emoji: '🏖️',
    description: 'Ocean pollution, coral bleaching, marine life struggling',
    challenges: ['Ocean pollution', 'Coral bleaching', 'Overfishing'],
    color: 'from-cyan-400 via-blue-500 to-indigo-600',
    primaryEntity: 'MarineEcosystem'
  },
  {
    id: 'wounded-mountains',
    name: 'The Wounded Mountains',
    emoji: '⛰️',
    description: 'Mining damage, erosion, disrupted ecosystems',
    challenges: ['Mining impacts', 'Erosion', 'Habitat destruction'],
    color: 'from-stone-400 via-gray-600 to-slate-700',
    primaryEntity: 'MountainEcosystem'
  }
];

export default function EcoSphereGame({ onGameComplete }: { onGameComplete: (appModel: ApplicationModel) => void }) {
  const [progress, setProgress] = useState<GameProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecosphere-progress');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      phase: 'welcome',
      level: 1,
      selectedZone: null,
      discoveredEntities: new Map(),
      restorationPoints: 0,
      unlockedAbilities: [],
      playTime: 0,
      generatedAppModel: {
        entities: [],
        relationships: [],
        workflows: [],
        businessLogic: [],
        uiPatterns: [],
        architecture: 'single-domain',
        prioritization: 'speed'
      }
    };
  });

  // Persist progress
  useEffect(() => {
    localStorage.setItem('ecosphere-progress', JSON.stringify(progress));
  }, [progress]);

  // Play time tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => ({ ...prev, playTime: prev.playTime + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins}m ${secs}s`;
  };

  // PHASE: Welcome Screen
  if (progress.phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated stars/particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 2 + 2 + 's'
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl w-full text-center relative z-10">
          {/* Planet EcoSphere */}
          <div className="mb-12 relative">
            <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-blue-400 via-green-400 to-emerald-500 animate-spin-slow shadow-2xl relative">
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-300 via-green-300 to-emerald-400 opacity-70"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-200 via-green-200 to-emerald-300 opacity-50"></div>
            </div>
          </div>

          <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
            Welcome to EcoSphere
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
            <p className="text-2xl mb-4 italic">
              "A beautiful world awaits your care..."
            </p>
            <p className="text-lg opacity-90">
              You are a <span className="font-bold text-green-300">Restoration Architect</span>, 
              chosen to help EcoSphere heal and flourish again.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8 text-white">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-xl font-bold mb-2">Explore & Discover</h3>
              <p className="text-sm opacity-80">Understand ecosystems through beautiful, interactive exploration</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-3">🛠️</div>
              <h3 className="text-xl font-bold mb-2">Plan & Execute</h3>
              <p className="text-sm opacity-80">Design restoration strategies and watch them come to life</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-xl font-bold mb-2">Heal & Thrive</h3>
              <p className="text-sm opacity-80">See ecosystems recover and flourish under your guidance</p>
            </div>
          </div>

          <button
            onClick={() => setProgress({ ...progress, phase: 'landing-zone-selection' })}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-16 py-6 rounded-full text-2xl font-bold hover:scale-110 transform transition-all shadow-2xl hover:shadow-green-500/50"
          >
            Begin Your Journey 🚀
          </button>
        </div>
      </div>
    );
  }

  // PHASE: Landing Zone Selection
  if (progress.phase === 'landing-zone-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Gaia Introduction */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center text-6xl shadow-2xl animate-float">
              🌟
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">
              Gaia Welcomes You
            </h2>
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
              <p className="text-2xl mb-4 italic">
                "Welcome, Restoration Architect. EcoSphere needs you."
              </p>
              <p className="text-xl opacity-90">
                But first... let me understand who you are and what calls to your heart.
              </p>
              <p className="text-lg opacity-80 mt-4">
                Choose the landing zone that speaks to you. There is no wrong choice.
              </p>
            </div>
          </div>

          {/* Landing Zones */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingZones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => {
                  // Record selection and move to Level 1
                  const updatedProgress = {
                    ...progress,
                    phase: 'level-1-discovery' as GamePhase,
                    selectedZone: zone.id,
                    generatedAppModel: {
                      ...progress.generatedAppModel,
                      entities: [{ type: zone.primaryEntity, properties: [] }]
                    }
                  };
                  setProgress(updatedProgress);
                }}
                className="group relative overflow-hidden rounded-3xl transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${zone.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="relative z-10 p-8 text-white text-left">
                  <div className="text-6xl mb-4">{zone.emoji}</div>
                  <h3 className="text-3xl font-bold mb-3">{zone.name}</h3>
                  <p className="text-lg mb-4 opacity-90">{zone.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-semibold opacity-75">Challenges:</div>
                    {zone.challenges.map((challenge, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span>⚠️</span>
                        <span>{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold">
                    Choose This Path →
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 text-center text-white">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-8 py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="text-lg">{formatTime(progress.playTime)}</span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-lg">{progress.restorationPoints} Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LEVEL 1: Discovery Mode
  if (progress.phase === 'level-1-discovery') {
    return <Level1Discovery progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 2: Investigation
  if (progress.phase === 'level-2-investigation') {
    return <Level2Investigation progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 3: Planning
  if (progress.phase === 'level-3-planning') {
    return <Level3Planning progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 4: Execution & Monitoring
  if (progress.phase === 'level-4-execution') {
    return <Level4Execution progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 5: Systems Thinking
  if (progress.phase === 'level-5-systems') {
    return <Level5Systems progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 6: Team Building
  if (progress.phase === 'level-6-team') {
    return <Level6Team progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 7: Budget Management
  if (progress.phase === 'level-7-budget') {
    return <Level7Budget progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 8: Data Analytics
  if (progress.phase === 'level-8-analytics') {
    return <Level8Analytics progress={progress} setProgress={setProgress} />;
  }

  // COMPLETION
  if (progress.phase === 'completion') {
    return <CompletionScreen progress={progress} setProgress={setProgress} />;
  }

  // More levels...
  return <div>Game in progress...</div>;
}

// LEVEL 1: Discovery Component
function Level1Discovery({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [scanningLocation, setScanningLocation] = useState<number | null>(null);
  const [riverName, setRiverName] = useState('');
  const [scannedSections, setScannedSections] = useState<Set<number>>(new Set());
  const [riverSections, setRiverSections] = useState<WaterSection[]>([]);

  const zone = landingZones.find(z => z.id === progress.selectedZone);

  const handleScan = (sectionNumber: number) => {
    setScanningLocation(sectionNumber);
    
    setTimeout(() => {
      // Generate realistic water quality data
      const section: WaterSection = {
        id: `section-${sectionNumber}`,
        sectionNumber,
        temperature: 65 + Math.random() * 10,
        pH: 3.8 + (sectionNumber * 0.15) + Math.random() * 0.3,
        dissolvedOxygen: 3 + (sectionNumber * 0.3) + Math.random() * 0.5,
        turbidity: 90 - (sectionNumber * 2) + Math.random() * 5,
        pollutantLevel: sectionNumber < 4 ? 'critical' : sectionNumber < 7 ? 'high' : 'medium',
        coordinates: { lat: 40.7128 + sectionNumber * 0.01, lng: -74.0060 + sectionNumber * 0.01 }
      };

      setRiverSections(prev => [...prev, section]);
      setScannedSections(prev => new Set([...prev, sectionNumber]));
      setScanningLocation(null);

      // Record entity property discovery
      const updatedModel = { ...progress.generatedAppModel };
      updatedModel.uiPatterns.push('geographic-visualization', 'data-collection-forms', 'real-time-scanning');
      setProgress({ ...progress, generatedAppModel: updatedModel });
    }, 2000);
  };

  const completeLevel1 = () => {
    // Award points and advance
    const updatedProgress = {
      ...progress,
      phase: 'level-2-investigation' as GamePhase,
      level: 2,
      restorationPoints: progress.restorationPoints + 100,
      unlockedAbilities: [...progress.unlockedAbilities, 'water-scanner', 'data-collection']
    };
    setProgress(updatedProgress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <div className="text-6xl mb-4">{zone?.emoji}</div>
          <h1 className="text-5xl font-bold mb-4">Level 1: First Contact</h1>
          <p className="text-2xl opacity-90">The Arrival at {zone?.name}</p>
        </div>

        {/* Gaia Guidance */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🌟</div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Gaia speaks:</h3>
              <p className="text-lg opacity-90 mb-4">
                "You've chosen the river. Good. Water is life, and this river once sang with vitality. 
                Now tell me... when you look at this river, what do you SEE?"
              </p>
              <p className="text-md opacity-75">
                Use your Environmental Scanner to examine the river. Walk along it. Scan different locations. 
                Understand its full condition.
              </p>
            </div>
          </div>
        </div>

        {/* Environmental Scanner Tool */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🔬</div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Environmental Scanner</h2>
              <p className="text-gray-600">Point and click to scan any river section</p>
            </div>
          </div>

          {/* River Visualization */}
          <div className="relative h-64 bg-gradient-to-r from-blue-100 via-cyan-50 to-blue-100 rounded-2xl p-6 mb-6">
            <div className="absolute top-4 left-4 text-sm text-gray-600 font-semibold">
              UPSTREAM ← River Flow → DOWNSTREAM
            </div>
            
            {/* River Sections */}
            <div className="flex justify-between items-center h-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((section) => (
                <button
                  key={section}
                  onClick={() => !scannedSections.has(section) && handleScan(section)}
                  disabled={scanningLocation === section}
                  className={`
                    relative w-12 h-32 rounded-lg transition-all transform hover:scale-110
                    ${scannedSections.has(section) 
                      ? 'bg-green-400 cursor-default' 
                      : 'bg-blue-400 hover:bg-blue-500 cursor-pointer'
                    }
                    ${scanningLocation === section ? 'animate-pulse ring-4 ring-yellow-400' : ''}
                  `}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                    {section}
                  </div>
                  {scannedSections.has(section) && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scanning Feedback */}
          {scanningLocation && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl animate-spin">🔄</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Scanning Section {scanningLocation}...</h3>
                  <p className="text-gray-600">Analyzing water quality parameters</p>
                </div>
              </div>
            </div>
          )}

          {/* Scanned Results */}
          {riverSections.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Scan Results</h3>
              {riverSections.map((section) => (
                <div key={section.id} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-gray-800">Section {section.sectionNumber}</h4>
                    <span className={`
                      px-4 py-1 rounded-full text-sm font-bold
                      ${section.pollutantLevel === 'critical' ? 'bg-red-500 text-white' : ''}
                      ${section.pollutantLevel === 'high' ? 'bg-orange-500 text-white' : ''}
                      ${section.pollutantLevel === 'medium' ? 'bg-yellow-500 text-white' : ''}
                    `}>
                      {section.pollutantLevel.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Temperature</div>
                      <div className="text-lg font-bold text-gray-800">{section.temperature.toFixed(1)}°F</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">pH Level</div>
                      <div className="text-lg font-bold text-gray-800">{section.pH.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">(Healthy: 6.5-8.5)</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Dissolved Oxygen</div>
                      <div className="text-lg font-bold text-gray-800">{section.dissolvedOxygen.toFixed(1)} mg/L</div>
                      <div className="text-xs text-gray-500">(Fish need 6+)</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Turbidity</div>
                      <div className="text-lg font-bold text-gray-800">{section.turbidity.toFixed(0)} NTU</div>
                      <div className="text-xs text-gray-500">(Clear: &lt;10)</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* River Naming */}
        {scannedSections.size >= 5 && !riverName && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">🌟</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Gaia asks:</h3>
                <p className="text-lg text-gray-700 mb-4">
                  "You've learned so much about this river. What shall we call it? Every river has a name, a personality."
                </p>
                <input
                  type="text"
                  value={riverName}
                  onChange={(e) => setRiverName(e.target.value)}
                  placeholder="Enter river name..."
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Completion */}
        {scannedSections.size === 10 && riverName && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl shadow-2xl p-8 text-white text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold mb-4">Achievement Unlocked!</h2>
            <p className="text-2xl mb-6">River Scholar - Understood a complete water system</p>
            <p className="text-xl opacity-90 mb-8">
              You've named and fully mapped <span className="font-bold">{riverName}</span>!
            </p>
            <button
              onClick={completeLevel1}
              className="bg-white text-green-600 px-12 py-4 rounded-full text-xl font-bold hover:scale-110 transform transition-all shadow-lg"
            >
              Continue to Level 2: Investigation →
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-4">
            <div className="flex justify-between items-center mb-2 text-white">
              <span className="font-bold">River Sections Scanned</span>
              <span className="font-bold">{scannedSections.size} / 10</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-green-400 h-full transition-all duration-500"
                style={{ width: `${(scannedSections.size / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// LEVEL 2: Investigation Component
function Level2Investigation({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [pollutionSources, setPollutionSources] = useState<PollutionSource[]>([]);
  const [currentSource, setCurrentSource] = useState<PollutionSource | null>(null);
  const [priorityMatrix, setPriorityMatrix] = useState<Map<string, {x: number, y: number}>>(new Map());

  const zone = landingZones.find(z => z.id === progress.selectedZone);

  // Sample pollution sources
  const availableSources: PollutionSource[] = [
    {
      id: 'factory-1',
      name: 'ChemCorp Factory Discharge',
      sourceType: 'industrial',
      severity: 9,
      frequency: 'constant',
      pollutants: ['heavy metals', 'chemical compounds'],
      responsibility: 'ChemCorp Industries',
      accessibility: 'requires-authority',
      evidence: [],
      priority: 0
    },
    {
      id: 'farm-1',
      name: 'Agricultural Runoff',
      sourceType: 'agricultural',
      severity: 6,
      frequency: 'seasonal',
      pollutants: ['pesticides', 'fertilizers'],
      responsibility: 'Local Farms',
      accessibility: 'moderate',
      evidence: [],
      priority: 0
    },
    {
      id: 'urban-1',
      name: 'Storm Drain Overflow',
      sourceType: 'urban',
      severity: 5,
      frequency: 'weekly',
      pollutants: ['urban waste', 'oil residue'],
      responsibility: 'City Municipality',
      accessibility: 'moderate',
      evidence: [],
      priority: 0
    },
    {
      id: 'illegal-1',
      name: 'Hidden Waste Dump',
      sourceType: 'illegal',
      severity: 7,
      frequency: 'one-time',
      pollutants: ['mixed waste', 'unknown chemicals'],
      responsibility: 'Unknown',
      accessibility: 'easy',
      evidence: [],
      priority: 0
    },
    {
      id: 'natural-1',
      name: 'Abandoned Mine Leaching',
      sourceType: 'natural',
      severity: 4,
      frequency: 'constant',
      pollutants: ['metal leaching'],
      responsibility: 'Historical',
      accessibility: 'difficult',
      evidence: [],
      priority: 0
    }
  ];

  const completeLevel2 = () => {
    // Record prioritization algorithm
    const updatedModel = { ...progress.generatedAppModel };
    updatedModel.businessLogic.push({
      type: 'prioritization-algorithm',
      criteria: ['impact', 'feasibility', 'severity', 'accessibility'],
      method: 'priority-matrix'
    });
    updatedModel.entities.push({ type: 'PollutionSource', properties: Object.keys(availableSources[0]) });

    const updatedProgress = {
      ...progress,
      phase: 'level-3-planning' as GamePhase,
      level: 3,
      restorationPoints: progress.restorationPoints + 250,
      unlockedAbilities: [...progress.unlockedAbilities, 'pollution-tracker', 'prioritization'],
      generatedAppModel: updatedModel
    };
    setProgress(updatedProgress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-pink-700 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-white mb-12">
          <div className="text-6xl mb-4">{zone?.emoji}</div>
          <h1 className="text-5xl font-bold mb-4">Level 2: The Source of Sorrow</h1>
          <p className="text-2xl opacity-90">Investigation</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🌟</div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Gaia speaks:</h3>
              <p className="text-lg opacity-90">
                "You've understood the river's pain. Now discover why it suffers. Every problem has a source."
              </p>
            </div>
          </div>
        </div>

        {/* Pollution Sources Discovery */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span>🔍</span>
            <span>Pollution Tracker</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSources.map((source) => (
              <button
                key={source.id}
                onClick={() => setCurrentSource(source)}
                className="text-left bg-gray-50 rounded-2xl p-6 hover:shadow-lg transform transition-all hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{source.name}</h3>
                  <span className="text-2xl">
                    {source.sourceType === 'industrial' && '🏭'}
                    {source.sourceType === 'agricultural' && '🌾'}
                    {source.sourceType === 'urban' && '🏙️'}
                    {source.sourceType === 'illegal' && '⚠️'}
                    {source.sourceType === 'natural' && '⛰️'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Severity: {source.severity}/10</div>
                  <div>Type: {source.sourceType}</div>
                  <div>Frequency: {source.frequency}</div>
                </div>

                <div className="mt-4 text-blue-600 font-semibold text-sm">
                  Click to investigate →
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Source Details Modal */}
        {currentSource && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{currentSource.name}</h2>
                <button
                  onClick={() => setCurrentSource(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Source Type</div>
                  <div className="text-lg font-bold text-gray-800 capitalize">{currentSource.sourceType}</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Severity</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-full rounded-full transition-all"
                        style={{ width: `${currentSource.severity * 10}%` }}
                      ></div>
                    </div>
                    <div className="text-lg font-bold text-gray-800">{currentSource.severity}/10</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Pollutants Detected</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentSource.pollutants.map((pollutant, idx) => (
                      <span key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {pollutant}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Responsibility</div>
                  <div className="text-lg font-bold text-gray-800">{currentSource.responsibility}</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Accessibility</div>
                  <div className="text-lg font-bold text-gray-800 capitalize">{currentSource.accessibility.replace('-', ' ')}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setPollutionSources(prev => [...prev, currentSource]);
                  setCurrentSource(null);
                }}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold hover:scale-105 transform transition-all"
              >
                Document This Source
              </button>
            </div>
          </div>
        )}

        {/* Prioritization Matrix */}
        {pollutionSources.length >= 3 && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Priority Matrix</h2>
            <p className="text-gray-600 mb-6">
              Gaia asks: "You've found {pollutionSources.length} sources. Which should we address first? 
              Drag sources onto the matrix based on Impact (harm caused) and Feasibility (ease of fixing)."
            </p>

            {/* Matrix Grid */}
            <div className="relative w-full h-96 bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 rounded-2xl border-2 border-gray-300">
              <div className="absolute bottom-0 left-0 text-sm font-bold text-gray-700 -rotate-90 origin-bottom-left ml-6">
                Feasibility (How Easy to Fix) →
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-sm font-bold text-gray-700">
                ← Impact (Harm Caused) →
              </div>

              {/* Quadrant Labels */}
              <div className="absolute top-4 left-4 text-xs font-semibold text-gray-600 bg-white/70 px-2 py-1 rounded">
                High Impact, Low Feasibility
              </div>
              <div className="absolute top-4 right-4 text-xs font-semibold text-gray-600 bg-white/70 px-2 py-1 rounded">
                High Impact, High Feasibility ⭐
              </div>
              <div className="absolute bottom-4 left-4 text-xs font-semibold text-gray-600 bg-white/70 px-2 py-1 rounded">
                Low Impact, Low Feasibility
              </div>
              <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-600 bg-white/70 px-2 py-1 rounded">
                Low Impact, High Feasibility
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={completeLevel2}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-4 rounded-full text-xl font-bold hover:scale-110 transform transition-all shadow-lg"
              >
                Complete Prioritization & Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 3: Planning Component
function Level3Planning({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [planSteps, setPlanSteps] = useState<WorkflowStep[]>([]);
  const [approach, setApproach] = useState<'sequential' | 'parallel' | null>(null);

  const completeLevel3 = () => {
    const updatedModel = { ...progress.generatedAppModel };
    updatedModel.workflows.push({
      type: 'restoration-workflow',
      steps: planSteps,
      approach: approach,
      dependencies: true
    });
    updatedModel.architecture = approach === 'sequential' ? 'single-domain' : 'multi-domain';

    const updatedProgress = {
      ...progress,
      phase: 'level-4-execution' as GamePhase,
      level: 4,
      restorationPoints: progress.restorationPoints + 500,
      generatedAppModel: updatedModel
    };
    setProgress(updatedProgress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-700 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Level 3: The Grand Plan</h1>
          <p className="text-2xl opacity-90">Strategy & Design</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Planning Workshop</h2>
          <p className="text-gray-600 mb-6">
            Design your restoration strategy. How will you heal this ecosystem?
          </p>

          {/* Strategic Choice */}
          {!approach && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setApproach('sequential')}
                className="text-left bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-lg transform transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Path A: The Swift Strike</h3>
                <p className="text-gray-700 mb-4">
                  Address only the top pollution source aggressively. Faster results, but leaves other sources active.
                </p>
                <div className="text-sm text-gray-600">
                  ✓ Focused approach<br />
                  ✓ Faster visible progress<br />
                  ⚠️ Other sources remain
                </div>
              </button>

              <button
                onClick={() => setApproach('parallel')}
                className="text-left bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-lg transform transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Path B: Comprehensive Approach</h3>
                <p className="text-gray-700 mb-4">
                  Address all sources gradually. Slower visible progress, but deeper healing.
                </p>
                <div className="text-sm text-gray-600">
                  ✓ Holistic solution<br />
                  ✓ All sources addressed<br />
                  ⚠️ Takes longer
                </div>
              </button>
            </div>
          )}

          {approach && (
            <div className="text-center">
              <div className="bg-green-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  You chose: {approach === 'sequential' ? 'The Swift Strike' : 'Comprehensive Approach'}
                </h3>
                <p className="text-gray-700">
                  This choice will shape your entire restoration strategy.
                </p>
              </div>

              <button
                onClick={completeLevel3}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-4 rounded-full text-xl font-bold hover:scale-110 transform transition-all shadow-lg"
              >
                Finalize Plan & Begin Execution →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// LEVEL 4: Execution & Monitoring Component
function Level4Execution({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationDay, setSimulationDay] = useState(0);
  const [metrics, setMetrics] = useState({
    riverHealth: 42,
    pH: 6.2,
    dissolvedOxygen: 4.5,
    budgetSpent: 0,
    daysElapsed: 0,
    teamUtilization: 0,
  });
  const [activeActions, setActiveActions] = useState<Array<{
    id: string;
    name: string;
    progress: number;
    startDay: number;
    duration: number;
  }>>([]);
  const [events, setEvents] = useState<Array<{
    id: string;
    day: number;
    type: 'info' | 'warning' | 'success' | 'challenge';
    title: string;
    message: string;
  }>>([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeData, setChallengeData] = useState<{
    title: string;
    description: string;
    options: Array<{ id: string; text: string; impact: string }>;
  } | null>(null);

  const restorationPlan = progress.restorationPlan || { approach: 'sequential', steps: [] };

  useEffect(() => {
    // Initialize actions based on restoration plan
    if (activeActions.length === 0 && restorationPlan.steps.length > 0) {
      const initialActions = restorationPlan.steps.slice(0, restorationPlan.approach === 'parallel' ? 3 : 1).map((step, idx) => ({
        id: `action-${idx}`,
        name: step.name,
        progress: 0,
        startDay: 0,
        duration: step.duration
      }));
      setActiveActions(initialActions);
      
      // Add welcome event
      setEvents([{
        id: 'event-0',
        day: 0,
        type: 'info',
        title: 'Simulation Ready',
        message: `Restoration plan loaded with ${restorationPlan.steps.length} steps. Click "Run Simulation" to begin.`
      }]);
    }
  }, []);

  // Simulation loop
  useEffect(() => {
    if (!simulationRunning) return;

    const interval = setInterval(() => {
      setSimulationDay(day => {
        const newDay = day + 1;
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          riverHealth: Math.min(100, prev.riverHealth + (newDay < 20 ? 0.5 : 1.5)),
          pH: Math.min(7.5, prev.pH + 0.02),
          dissolvedOxygen: Math.min(8, prev.dissolvedOxygen + 0.05),
          budgetSpent: prev.budgetSpent + 500,
          daysElapsed: newDay,
          teamUtilization: activeActions.length > 0 ? 85 : 20,
        }));

        // Update active actions
        setActiveActions(prev => prev.map(action => {
          const newProgress = Math.min(100, action.progress + (100 / action.duration));
          return { ...action, progress: newProgress };
        }).filter(action => action.progress < 100));

        // Add scheduled events
        if (newDay === 5) {
          setEvents(prev => [...prev, {
            id: `event-${newDay}`,
            day: newDay,
            type: 'info',
            title: 'Data Collection',
            message: 'Field team reports: Water clarity improved by 15%. Fish sightings increasing!'
          }]);
        }

        if (newDay === 15) {
          // Trigger challenge
          setChallengeData({
            title: 'Unexpected Storm Warning',
            description: 'A severe storm is approaching in 48 hours. Heavy rainfall could wash away recent restoration work or help flush out pollutants.',
            options: [
              { id: 'reinforce', text: 'Reinforce Critical Areas', impact: 'Cost: $5,000 | Protects work | Delays timeline by 2 days' },
              { id: 'monitor', text: 'Monitor and Adapt', impact: 'Cost: $1,000 | Risk some damage | Maintain timeline' },
              { id: 'leverage', text: 'Leverage Natural Flushing', impact: 'Cost: $500 | Risk/reward gamble | Could accelerate recovery' }
            ]
          });
          setShowChallenge(true);
          setSimulationRunning(false);
        }

        if (newDay === 20) {
          setEvents(prev => [...prev, {
            id: `event-${newDay}`,
            day: newDay,
            type: 'warning',
            title: 'Resource Alert',
            message: 'Budget at 60% capacity. Consider cost optimization for remaining work.'
          }]);
        }

        if (newDay === 30) {
          setEvents(prev => [...prev, {
            id: `event-${newDay}`,
            day: newDay,
            type: 'success',
            title: 'Milestone Achieved!',
            message: '🎉 River health exceeds 60%! Local wildlife returning. Community celebrating!'
          }]);
        }

        if (newDay >= 45) {
          // Simulation complete
          setSimulationRunning(false);
          setEvents(prev => [...prev, {
            id: `event-${newDay}`,
            day: newDay,
            type: 'success',
            title: 'Mission Complete!',
            message: '🌟 Restoration successful! The ecosystem is thriving. Moving to Systems Thinking...'
          }]);
          
          setTimeout(() => {
            setProgress({
              ...progress,
              phase: 'level-5-systems' as GamePhase,
              completedPhases: [...(progress.completedPhases || []), 'level-4-execution']
            });
          }, 3000);
        }

        return newDay;
      });
    }, 200); // Fast simulation: 5 days per second

    return () => clearInterval(interval);
  }, [simulationRunning, activeActions]);

  const handleChallengeResponse = (optionId: string) => {
    setEvents(prev => [...prev, {
      id: `event-challenge-response`,
      day: simulationDay,
      type: 'info',
      title: 'Decision Made',
      message: `You chose to ${optionId}. Adapting restoration strategy...`
    }]);
    
    if (optionId === 'reinforce') {
      setMetrics(prev => ({ ...prev, budgetSpent: prev.budgetSpent + 5000 }));
    } else if (optionId === 'leverage') {
      setMetrics(prev => ({ ...prev, riverHealth: prev.riverHealth + 5 }));
    }
    
    setShowChallenge(false);
    setChallengeData(null);
    setSimulationRunning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-green-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            🛠️ Level 4: Execution & Monitoring
          </h1>
          <p className="text-2xl text-blue-200">
            Watch your restoration plan come to life in real-time
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Simulation Day: {simulationDay} / 45</h3>
              <p className="text-lg opacity-80">
                {simulationRunning ? '⏱️ Simulation running...' : '⏸️ Simulation paused'}
              </p>
            </div>
            <button
              onClick={() => setSimulationRunning(!simulationRunning)}
              className={`px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 ${
                simulationRunning 
                  ? 'bg-yellow-500 hover:bg-yellow-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {simulationRunning ? '⏸️ Pause' : '▶️ Run Simulation'}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-black/30 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(simulationDay / 45) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Dashboard: 3 columns */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Active Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">🎯 Active Actions</h3>
            {activeActions.length === 0 ? (
              <p className="text-center opacity-60 py-8">
                {simulationDay >= 45 ? '✅ All actions complete!' : 'No active actions'}
              </p>
            ) : (
              <div className="space-y-4">
                {activeActions.map(action => (
                  <div key={action.id} className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{action.name}</span>
                      <span className="text-sm opacity-75">{Math.round(action.progress)}%</span>
                    </div>
                    <div className="bg-black/30 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full transition-all"
                        style={{ width: `${action.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs opacity-60 mt-1">
                      Started: Day {action.startDay} | Duration: {action.duration} days
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Center: Living River Visualization */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">🌊 Living River</h3>
            <div className="relative h-64 bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl overflow-hidden">
              {/* Animated water flow */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-water-flow"></div>
              </div>
              
              {/* Health indicator */}
              <div className="absolute top-4 left-4 right-4 text-center">
                <div className="text-6xl mb-2">
                  {metrics.riverHealth < 50 ? '😔' : metrics.riverHealth < 75 ? '😊' : '🤩'}
                </div>
                <div className="text-2xl font-bold">
                  Health: {Math.round(metrics.riverHealth)}%
                </div>
              </div>

              {/* Fish animation */}
              {metrics.riverHealth > 60 && (
                <div className="absolute bottom-8 animate-swim">
                  <span className="text-4xl">🐟</span>
                </div>
              )}
              
              {/* Plants */}
              {metrics.riverHealth > 50 && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                  <span className="text-3xl">🌱</span>
                  <span className="text-3xl">🌿</span>
                  <span className="text-3xl">🌾</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Metrics Dashboard */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">📊 Metrics</h3>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-sm opacity-75">pH Level</div>
                <div className="text-3xl font-bold">{metrics.pH.toFixed(1)}</div>
                <div className="text-xs opacity-60">Target: 7.0-7.5</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-sm opacity-75">Dissolved Oxygen</div>
                <div className="text-3xl font-bold">{metrics.dissolvedOxygen.toFixed(1)} mg/L</div>
                <div className="text-xs opacity-60">Target: &gt;6 mg/L</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-sm opacity-75">Budget Spent</div>
                <div className="text-3xl font-bold">${(metrics.budgetSpent / 1000).toFixed(1)}K</div>
                <div className="text-xs opacity-60">of $50K allocated</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-sm opacity-75">Team Utilization</div>
                <div className="text-3xl font-bold">{metrics.teamUtilization}%</div>
                <div className="text-xs opacity-60">Optimal: 70-90%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Stream */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
          <h3 className="text-2xl font-bold mb-4">📡 Event Stream</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {events.slice().reverse().map(event => (
              <div 
                key={event.id} 
                className={`p-4 rounded-xl border-l-4 ${
                  event.type === 'success' ? 'bg-green-500/20 border-green-400' :
                  event.type === 'warning' ? 'bg-yellow-500/20 border-yellow-400' :
                  event.type === 'challenge' ? 'bg-red-500/20 border-red-400' :
                  'bg-blue-500/20 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold">{event.title}</span>
                  <span className="text-sm opacity-60">Day {event.day}</span>
                </div>
                <p className="text-sm opacity-90">{event.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Modal */}
        {showChallenge && challengeData && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-3xl p-8 max-w-2xl w-full text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-4">⚠️ {challengeData.title}</h2>
              <p className="text-xl mb-6 opacity-90">{challengeData.description}</p>
              
              <div className="space-y-4">
                <p className="text-lg font-semibold">Choose your response:</p>
                {challengeData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChallengeResponse(option.id)}
                    className="w-full text-left bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all transform hover:scale-105"
                  >
                    <div className="font-bold text-lg mb-2">{option.text}</div>
                    <div className="text-sm opacity-75">{option.impact}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 5: Systems Thinking Component
function Level5Systems({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [revealedSystems, setRevealedSystems] = useState<Set<string>>(new Set(['river']));
  const [connections, setConnections] = useState<Array<{from: string; to: string; type: string}>>([]);
  const [strategy, setStrategy] = useState<'river-only' | 'integrated' | 'prioritized' | null>(null);
  const [showStrategyChoice, setShowStrategyChoice] = useState(false);

  // Ecosystem nodes
  const ecosystems = [
    { id: 'river', name: 'Restored River', emoji: '🌊', x: 50, y: 50, tier: 'primary', health: 85 },
    { id: 'wetlands', name: 'Adjacent Wetlands', emoji: '🦆', x: 20, y: 30, tier: 'direct', health: 45 },
    { id: 'lake', name: 'Downstream Lake', emoji: '🏞️', x: 80, y: 30, tier: 'direct', health: 38 },
    { id: 'groundwater', name: 'Groundwater Aquifer', emoji: '💧', x: 50, y: 85, tier: 'direct', health: 52 },
    { id: 'forest', name: 'Riparian Forest', emoji: '🌲', x: 15, y: 65, tier: 'direct', health: 41 },
    { id: 'farmland', name: 'Agricultural Land', emoji: '🌾', x: 85, y: 70, tier: 'direct', health: 35 },
    { id: 'ocean', name: 'Ocean Delta', emoji: '🌊', x: 95, y: 15, tier: 'secondary', health: 30 },
    { id: 'wildlife', name: 'Wildlife Corridor', emoji: '🦌', x: 10, y: 95, tier: 'secondary', health: 28 },
    { id: 'urban', name: 'Urban Water Supply', emoji: '🏙️', x: 70, y: 90, tier: 'secondary', health: 48 },
    { id: 'fishery', name: 'Commercial Fishery', emoji: '🎣', x: 90, y: 50, tier: 'secondary', health: 25 },
  ];

  // Connection relationships
  const allConnections = [
    { from: 'river', to: 'wetlands', type: 'Water Flow', impact: 'High' },
    { from: 'river', to: 'lake', type: 'Drainage', impact: 'High' },
    { from: 'river', to: 'groundwater', type: 'Infiltration', impact: 'Medium' },
    { from: 'river', to: 'forest', type: 'Hydration', impact: 'Medium' },
    { from: 'river', to: 'farmland', type: 'Irrigation', impact: 'Medium' },
    { from: 'lake', to: 'ocean', type: 'Outflow', impact: 'Medium' },
    { from: 'wetlands', to: 'wildlife', type: 'Habitat', impact: 'High' },
    { from: 'groundwater', to: 'urban', type: 'Water Supply', impact: 'High' },
    { from: 'lake', to: 'fishery', type: 'Ecosystem', impact: 'High' },
  ];

  useEffect(() => {
    // Auto-reveal direct connections after 2 seconds
    const timer = setTimeout(() => {
      const directSystems = ecosystems.filter(e => e.tier === 'direct').map(e => e.id);
      setRevealedSystems(new Set(['river', ...directSystems]));
      
      // Show primary connections
      const primaryConnections = allConnections.filter(c => 
        directSystems.includes(c.to) && c.from === 'river'
      );
      setConnections(primaryConnections);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDiscoverSecondary = () => {
    const secondarySystems = ecosystems.filter(e => e.tier === 'secondary').map(e => e.id);
    setRevealedSystems(new Set([...Array.from(revealedSystems), ...secondarySystems]));
    setConnections(allConnections);
    
    setTimeout(() => {
      setShowStrategyChoice(true);
    }, 1500);
  };

  const handleStrategyChoice = (choice: 'river-only' | 'integrated' | 'prioritized') => {
    setStrategy(choice);
    
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-6-team' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-5-systems'],
        systemsStrategy: choice
      });
    }, 2000);
  };

  const getImpactColor = (health: number) => {
    if (health >= 70) return 'text-green-400';
    if (health >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            🔗 Level 5: Systems Thinking
          </h1>
          <p className="text-2xl text-purple-200">
            Understanding the ripple effects across connected ecosystems
          </p>
        </div>

        {/* Gaia's Insight */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-6xl">🌟</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Gaia's Wisdom</h3>
              <p className="text-lg opacity-90">
                "Your river restoration has succeeded, but look deeper... Every system touches another. 
                The river you healed is connected to wetlands, forests, groundwater, and beyond. 
                Your actions ripple through the entire ecosystem web."
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Systems Map */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">🗺️ Ecosystem Web</h3>
            
            <div className="relative h-[600px] bg-gradient-to-br from-blue-950 to-purple-950 rounded-xl overflow-hidden border-2 border-white/20">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {connections.map((conn, idx) => {
                  const fromNode = ecosystems.find(e => e.id === conn.from);
                  const toNode = ecosystems.find(e => e.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <line
                      key={idx}
                      x1={`${fromNode.x}%`}
                      y1={`${fromNode.y}%`}
                      x2={`${toNode.x}%`}
                      y2={`${toNode.y}%`}
                      stroke={conn.impact === 'High' ? '#22c55e' : '#eab308'}
                      strokeWidth="2"
                      strokeDasharray={conn.impact === 'Medium' ? '5,5' : '0'}
                      opacity="0.6"
                    />
                  );
                })}
              </svg>

              {/* Ecosystem nodes */}
              {ecosystems.map(system => {
                const isRevealed = revealedSystems.has(system.id);
                if (!isRevealed) return null;

                return (
                  <button
                    key={system.id}
                    onClick={() => setSelectedSystem(system.id)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                      selectedSystem === system.id ? 'scale-125 z-20' : 'z-10'
                    }`}
                    style={{ left: `${system.x}%`, top: `${system.y}%` }}
                  >
                    <div className={`relative ${
                      system.tier === 'primary' ? 'w-24 h-24' : 
                      system.tier === 'direct' ? 'w-20 h-20' : 'w-16 h-16'
                    } bg-gradient-to-br ${
                      system.tier === 'primary' ? 'from-green-400 to-emerald-600' :
                      system.tier === 'direct' ? 'from-blue-400 to-cyan-600' :
                      'from-purple-400 to-pink-600'
                    } rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 border-white/30 animate-pulse-slow`}>
                      {system.emoji}
                      
                      {/* Health indicator */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap">
                        <span className={getImpactColor(system.health)}>
                          {system.health}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Discovery prompt */}
              {revealedSystems.size <= 6 && !showStrategyChoice && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
                  <button
                    onClick={handleDiscoverSecondary}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-all shadow-2xl animate-bounce"
                  >
                    🔍 Discover Secondary Connections
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: System Details & Impact Analysis */}
          <div className="space-y-6">
            {/* Selected System Details */}
            {selectedSystem && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">System Details</h3>
                {(() => {
                  const system = ecosystems.find(e => e.id === selectedSystem);
                  if (!system) return null;

                  return (
                    <div>
                      <div className="text-5xl mb-3 text-center">{system.emoji}</div>
                      <h4 className="text-2xl font-bold text-center mb-3">{system.name}</h4>
                      
                      <div className="space-y-3">
                        <div className="bg-black/30 rounded-lg p-3">
                          <div className="text-sm opacity-75">Current Health</div>
                          <div className={`text-3xl font-bold ${getImpactColor(system.health)}`}>
                            {system.health}%
                          </div>
                        </div>
                        
                        <div className="bg-black/30 rounded-lg p-3">
                          <div className="text-sm opacity-75">Tier</div>
                          <div className="text-lg font-semibold capitalize">{system.tier}</div>
                        </div>

                        <div className="bg-black/30 rounded-lg p-3">
                          <div className="text-sm opacity-75 mb-2">Connected To</div>
                          <div className="space-y-1">
                            {connections
                              .filter(c => c.from === system.id || c.to === system.id)
                              .map((c, idx) => (
                                <div key={idx} className="text-sm">
                                  → {ecosystems.find(e => e.id === (c.from === system.id ? c.to : c.from))?.name}
                                  <span className={`ml-2 ${c.impact === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    ({c.impact})
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Impact Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">📊 Impact Analysis</h3>
              <div className="space-y-3">
                <div className="bg-green-500/20 border-l-4 border-green-400 p-3 rounded">
                  <div className="font-bold text-green-300">River Restoration Success</div>
                  <div className="text-sm opacity-90">85% health achieved ✅</div>
                </div>
                
                <div className="bg-yellow-500/20 border-l-4 border-yellow-400 p-3 rounded">
                  <div className="font-bold text-yellow-300">Direct Systems Affected</div>
                  <div className="text-sm opacity-90">5 ecosystems showing improvement</div>
                </div>
                
                <div className="bg-red-500/20 border-l-4 border-red-400 p-3 rounded">
                  <div className="font-bold text-red-300">Secondary Systems at Risk</div>
                  <div className="text-sm opacity-90">4 ecosystems need attention</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Choice Modal */}
        {showStrategyChoice && !strategy && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 max-w-4xl w-full text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-4 text-center">🎯 Strategic Decision</h2>
              <p className="text-xl mb-6 text-center opacity-90">
                You now see the full ecosystem web. How will you expand your restoration efforts?
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleStrategyChoice('river-only')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                >
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-xl font-bold mb-2">River-Only Focus</h3>
                  <p className="text-sm opacity-80">
                    Perfect the river restoration. Let natural connections spread benefits gradually.
                  </p>
                  <div className="mt-3 text-xs">
                    <span className="text-green-400">✓ Deep expertise</span><br/>
                    <span className="text-yellow-400">⚠ Slower ecosystem recovery</span>
                  </div>
                </button>

                <button
                  onClick={() => handleStrategyChoice('integrated')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                >
                  <div className="text-4xl mb-3">🌐</div>
                  <h3 className="text-xl font-bold mb-2">Integrated Approach</h3>
                  <p className="text-sm opacity-80">
                    Address all connected systems simultaneously for maximum ecosystem synergy.
                  </p>
                  <div className="mt-3 text-xs">
                    <span className="text-green-400">✓ Holistic recovery</span><br/>
                    <span className="text-yellow-400">⚠ Complex coordination</span>
                  </div>
                </button>

                <button
                  onClick={() => handleStrategyChoice('prioritized')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                >
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-xl font-bold mb-2">Prioritized Impact</h3>
                  <p className="text-sm opacity-80">
                    Target high-impact systems first. Balance reach with resource efficiency.
                  </p>
                  <div className="mt-3 text-xs">
                    <span className="text-green-400">✓ Optimal ROI</span><br/>
                    <span className="text-yellow-400">⚠ Some systems wait longer</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transition Message */}
        {strategy && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">✨</div>
              <h2 className="text-5xl font-bold mb-4">Systems Thinking Unlocked!</h2>
              <p className="text-2xl opacity-80">
                Moving to Team Building...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 6: Team Building Component
function Level6Team({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedTab, setSelectedTab] = useState<'recruit' | 'assign' | 'review'>('recruit');
  const [hiredTeam, setHiredTeam] = useState<TeamMember[]>([]);
  const [budget, setBudget] = useState(50000);
  const [assignments, setAssignments] = useState<Map<string, string>>(new Map()); // taskId -> memberId
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeResolved, setChallengeResolved] = useState(false);

  // Available specialists
  const availableSpecialists: TeamMember[] = [
    {
      id: 'sarah-chen',
      name: 'Dr. Sarah Chen',
      role: 'Water Quality Scientist',
      portrait: '👩‍🔬',
      specialty: 'Chemical Analysis',
      experience: 8,
      costPerMonth: 8000,
      skills: ['Water Testing', 'Lab Analysis', 'Quality Control'],
      compatibility: ['emily-park', 'james-wilson'],
      personality: 'Detail-oriented, methodical, great at documentation'
    },
    {
      id: 'marcus-thompson',
      name: 'Marcus Thompson',
      role: 'Restoration Engineer',
      portfolio: '👷‍♂️',
      specialty: 'Infrastructure Design',
      experience: 12,
      costPerMonth: 9500,
      skills: ['Engineering', 'Project Management', 'Heavy Equipment'],
      compatibility: ['raj-patel', 'lisa-brown'],
      personality: 'Practical, experienced, strong leadership'
    },
    {
      id: 'emily-park',
      name: 'Emily Park',
      role: 'Ecologist',
      portrait: '🌿',
      specialty: 'Biodiversity',
      experience: 6,
      costPerMonth: 7000,
      skills: ['Species Identification', 'Habitat Assessment', 'Field Research'],
      compatibility: ['sarah-chen', 'david-nguyen'],
      personality: 'Passionate, curious, excellent field researcher'
    },
    {
      id: 'raj-patel',
      name: 'Raj Patel',
      role: 'GIS Specialist',
      portrait: '🗺️',
      specialty: 'Spatial Analysis',
      experience: 5,
      costPerMonth: 6500,
      skills: ['Mapping', 'Data Visualization', 'Remote Sensing'],
      compatibility: ['marcus-thompson', 'emily-park'],
      personality: 'Tech-savvy, analytical, great visualizations'
    },
    {
      id: 'lisa-brown',
      name: 'Lisa Brown',
      role: 'Community Liaison',
      portrait: '💬',
      specialty: 'Stakeholder Engagement',
      experience: 10,
      costPerMonth: 7500,
      skills: ['Communication', 'Negotiation', 'Public Speaking'],
      compatibility: ['marcus-thompson', 'david-nguyen'],
      personality: 'Charismatic, diplomatic, builds trust easily'
    },
    {
      id: 'james-wilson',
      name: 'James Wilson',
      role: 'Data Analyst',
      portrait: '📊',
      specialty: 'Statistical Analysis',
      experience: 4,
      costPerMonth: 6000,
      skills: ['Statistics', 'Modeling', 'Report Writing'],
      compatibility: ['sarah-chen', 'raj-patel'],
      personality: 'Quantitative thinker, clear communicator'
    },
    {
      id: 'david-nguyen',
      name: 'David Nguyen',
      role: 'Policy Advisor',
      portrait: '⚖️',
      specialty: 'Environmental Law',
      experience: 15,
      costPerMonth: 10000,
      skills: ['Regulatory Compliance', 'Policy Analysis', 'Legal Research'],
      compatibility: ['lisa-brown', 'emily-park'],
      personality: 'Strategic, well-connected, understands regulations'
    },
    {
      id: 'maria-santos',
      name: 'Maria Santos',
      role: 'Field Technician',
      portrait: '🔧',
      specialty: 'Equipment Operation',
      experience: 3,
      costPerMonth: 5000,
      skills: ['Equipment Maintenance', 'Sample Collection', 'Safety Protocols'],
      compatibility: ['emily-park', 'marcus-thompson'],
      personality: 'Reliable, hardworking, learns quickly'
    },
  ];

  // Tasks that need assignment
  const tasks = [
    { id: 'task-1', name: 'Water Quality Monitoring', requiredSkills: ['Water Testing', 'Lab Analysis'], duration: '2 weeks' },
    { id: 'task-2', name: 'Restoration Construction', requiredSkills: ['Engineering', 'Project Management'], duration: '6 weeks' },
    { id: 'task-3', name: 'Biodiversity Survey', requiredSkills: ['Species Identification', 'Field Research'], duration: '3 weeks' },
    { id: 'task-4', name: 'Impact Mapping', requiredSkills: ['Mapping', 'Data Visualization'], duration: '2 weeks' },
    { id: 'task-5', name: 'Community Meetings', requiredSkills: ['Communication', 'Public Speaking'], duration: '4 weeks' },
  ];

  const handleHire = (specialist: TeamMember) => {
    if (budget >= specialist.costPerMonth * 3) { // Minimum 3-month commitment
      setHiredTeam([...hiredTeam, specialist]);
      setBudget(budget - (specialist.costPerMonth * 3));
    }
  };

  const handleAssign = (taskId: string, memberId: string) => {
    const newAssignments = new Map(assignments);
    newAssignments.set(taskId, memberId);
    setAssignments(newAssignments);
  };

  const calculateTeamSynergy = () => {
    let synergy = 0;
    hiredTeam.forEach(member => {
      const compatibleCount = member.compatibility.filter(compId => 
        hiredTeam.some(m => m.id === compId)
      ).length;
      synergy += compatibleCount * 10;
    });
    return Math.min(100, synergy);
  };

  const getTaskMatch = (task: any, memberId: string) => {
    const member = hiredTeam.find(m => m.id === memberId);
    if (!member) return 0;
    
    const matchedSkills = task.requiredSkills.filter((skill: string) => 
      member.skills.includes(skill)
    ).length;
    return Math.round((matchedSkills / task.requiredSkills.length) * 100);
  };

  const allTasksAssigned = tasks.every(task => assignments.has(task.id));

  useEffect(() => {
    if (allTasksAssigned && hiredTeam.length >= 3 && !showChallenge) {
      setTimeout(() => setShowChallenge(true), 1000);
    }
  }, [allTasksAssigned, hiredTeam.length]);

  const handleChallengeDecision = (decision: 'hire-temp' | 'reassign' | 'delay') => {
    setChallengeResolved(true);
    
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-7-budget' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-6-team'],
        teamMembers: hiredTeam
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            👥 Level 6: Team Building
          </h1>
          <p className="text-2xl text-orange-200">
            Assemble and manage your restoration dream team
          </p>
        </div>

        {/* Budget Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 text-white flex justify-between items-center">
          <div>
            <div className="text-sm opacity-75">Available Budget</div>
            <div className="text-3xl font-bold">${budget.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm opacity-75">Team Size</div>
            <div className="text-3xl font-bold">{hiredTeam.length}/8</div>
          </div>
          <div>
            <div className="text-sm opacity-75">Team Synergy</div>
            <div className="text-3xl font-bold text-green-400">{calculateTeamSynergy()}%</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('recruit')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'recruit'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🎯 Recruit Team
          </button>
          <button
            onClick={() => setSelectedTab('assign')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'assign'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📋 Assign Tasks
          </button>
          <button
            onClick={() => setSelectedTab('review')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'review'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            ⭐ Team Review
          </button>
        </div>

        {/* Recruitment Tab */}
        {selectedTab === 'recruit' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSpecialists.map(specialist => {
              const isHired = hiredTeam.some(m => m.id === specialist.id);
              const canAfford = budget >= specialist.costPerMonth * 3;

              return (
                <div
                  key={specialist.id}
                  className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white transition-all ${
                    isHired ? 'opacity-50 border-2 border-green-400' : 'hover:scale-105'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{specialist.portrait}</div>
                    <h3 className="text-2xl font-bold">{specialist.name}</h3>
                    <div className="text-sm opacity-75">{specialist.role}</div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="bg-black/30 rounded-lg p-3">
                      <div className="text-xs opacity-75">Specialty</div>
                      <div className="font-semibold">{specialist.specialty}</div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3">
                      <div className="text-xs opacity-75">Experience</div>
                      <div className="font-semibold">{specialist.experience} years</div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3">
                      <div className="text-xs opacity-75">Skills</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {specialist.skills.map(skill => (
                          <span key={skill} className="text-xs bg-blue-500/30 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3">
                      <div className="text-xs opacity-75">Cost</div>
                      <div className="font-semibold">${specialist.costPerMonth.toLocaleString()}/month</div>
                      <div className="text-xs opacity-60">(3-month min: ${(specialist.costPerMonth * 3).toLocaleString()})</div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3">
                      <div className="text-xs opacity-75 mb-1">Personality</div>
                      <div className="text-xs italic">{specialist.personality}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleHire(specialist)}
                    disabled={isHired || !canAfford}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      isHired
                        ? 'bg-green-600 cursor-not-allowed'
                        : canAfford
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isHired ? '✅ Hired' : canAfford ? '🤝 Hire' : '❌ Insufficient Budget'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Assignment Tab */}
        {selectedTab === 'assign' && (
          <div className="space-y-6">
            {hiredTeam.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center text-white">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold mb-2">No Team Members Yet</h3>
                <p className="text-lg opacity-75">Go to the Recruit tab to hire your team first!</p>
              </div>
            ) : (
              <>
                {tasks.map(task => {
                  const assignedMemberId = assignments.get(task.id);
                  const assignedMember = hiredTeam.find(m => m.id === assignedMemberId);
                  const matchScore = assignedMemberId ? getTaskMatch(task, assignedMemberId) : 0;

                  return (
                    <div key={task.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{task.name}</h3>
                          <div className="flex gap-2 mb-2">
                            {task.requiredSkills.map(skill => (
                              <span key={skill} className="text-xs bg-purple-500/30 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm opacity-75">Duration: {task.duration}</div>
                        </div>
                        
                        {assignedMember && (
                          <div className={`px-4 py-2 rounded-lg font-bold ${
                            matchScore >= 80 ? 'bg-green-500/30 text-green-300' :
                            matchScore >= 50 ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-red-500/30 text-red-300'
                          }`}>
                            Match: {matchScore}%
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {hiredTeam.map(member => {
                          const isAssigned = assignments.get(task.id) === member.id;
                          const match = getTaskMatch(task, member.id);

                          return (
                            <button
                              key={member.id}
                              onClick={() => handleAssign(task.id, member.id)}
                              className={`p-4 rounded-xl transition-all ${
                                isAssigned
                                  ? 'bg-gradient-to-br from-blue-500 to-cyan-600 scale-105'
                                  : 'bg-white/10 hover:bg-white/20'
                              }`}
                            >
                              <div className="text-4xl mb-2">{member.portrait}</div>
                              <div className="font-semibold text-sm">{member.name.split(' ')[0]}</div>
                              <div className="text-xs opacity-75 mb-2">{member.role}</div>
                              <div className={`text-xs font-bold ${
                                match >= 80 ? 'text-green-300' :
                                match >= 50 ? 'text-yellow-300' :
                                'text-red-300'
                              }`}>
                                {match}% Match
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {allTasksAssigned && (
                  <div className="bg-green-500/20 border-2 border-green-400 rounded-2xl p-6 text-center text-white">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold">All Tasks Assigned!</h3>
                    <p className="text-lg opacity-90 mt-2">Your team is ready for action.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Review Tab */}
        {selectedTab === 'review' && (
          <div className="space-y-6">
            {hiredTeam.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center text-white">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold mb-2">No Team to Review</h3>
                <p className="text-lg opacity-75">Hire team members first!</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Team Composition</h3>
                    <div className="space-y-2">
                      {hiredTeam.map(member => (
                        <div key={member.id} className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
                          <span className="text-3xl">{member.portrait}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{member.name}</div>
                            <div className="text-xs opacity-75">{member.specialty}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Skills Coverage</h3>
                    <div className="space-y-3">
                      {Array.from(new Set(hiredTeam.flatMap(m => m.skills))).map(skill => (
                        <div key={skill} className="bg-black/30 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{skill}</span>
                            <span className="text-xs opacity-75">
                              {hiredTeam.filter(m => m.skills.includes(skill)).length}x
                            </span>
                          </div>
                          <div className="bg-black/40 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full rounded-full"
                              style={{ width: `${(hiredTeam.filter(m => m.skills.includes(skill)).length / hiredTeam.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Team Metrics</h3>
                    <div className="space-y-4">
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-sm opacity-75">Average Experience</div>
                        <div className="text-3xl font-bold">
                          {Math.round(hiredTeam.reduce((sum, m) => sum + m.experience, 0) / hiredTeam.length)} years
                        </div>
                      </div>
                      
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-sm opacity-75">Monthly Cost</div>
                        <div className="text-3xl font-bold">
                          ${hiredTeam.reduce((sum, m) => sum + m.costPerMonth, 0).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-sm opacity-75">Team Synergy</div>
                        <div className={`text-3xl font-bold ${
                          calculateTeamSynergy() >= 70 ? 'text-green-400' :
                          calculateTeamSynergy() >= 40 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {calculateTeamSynergy()}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Delegation Challenge */}
        {showChallenge && !challengeResolved && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-3xl p-8 max-w-3xl w-full text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-4">⚡ Delegation Challenge</h2>
              <p className="text-xl mb-6">
                Emergency! A severe pollution incident just occurred upstream. Your team is already fully assigned. 
                You need someone to handle this crisis immediately. What do you do?
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleChallengeDecision('hire-temp')}
                  className="w-full text-left bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all"
                >
                  <div className="font-bold text-lg mb-2">💰 Hire Emergency Contractor</div>
                  <div className="text-sm opacity-80">Cost: $15,000 | Quick response | No long-term commitment</div>
                </button>

                <button
                  onClick={() => handleChallengeDecision('reassign')}
                  className="w-full text-left bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all"
                >
                  <div className="font-bold text-lg mb-2">🔄 Reassign Team Member</div>
                  <div className="text-sm opacity-80">Free | Delays other work | Builds team versatility</div>
                </button>

                <button
                  onClick={() => handleChallengeDecision('delay')}
                  className="w-full text-left bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all"
                >
                  <div className="font-bold text-lg mb-2">⏰ Wait for Team Availability</div>
                  <div className="text-sm opacity-80">Free | Risk escalation | Tests planning skills</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transition Message */}
        {challengeResolved && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">👥</div>
              <h2 className="text-5xl font-bold mb-4">Team Building Complete!</h2>
              <p className="text-2xl opacity-80">
                Moving to Budget Management...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 7: Budget Management Component
function Level7Budget({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'planning' | 'tracking' | 'optimization'>('overview');
  const [budgetStrategy, setBudgetStrategy] = useState<'aggressive' | 'balanced' | 'conservative' | null>(null);
  const [allocations, setAllocations] = useState({
    personnel: 35,
    equipment: 20,
    materials: 15,
    permits: 10,
    monitoring: 10,
    contingency: 10
  });
  const [expenses, setExpenses] = useState<Array<{
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
    status: 'pending' | 'approved' | 'paid';
  }>>([
    { id: 'e1', category: 'personnel', description: 'Team salaries (Month 1)', amount: 45000, date: 'Day 1', status: 'paid' },
    { id: 'e2', category: 'equipment', description: 'Water testing equipment', amount: 12000, date: 'Day 3', status: 'paid' },
    { id: 'e3', category: 'materials', description: 'Restoration materials', amount: 8500, date: 'Day 5', status: 'approved' },
    { id: 'e4', category: 'permits', description: 'Environmental permits', amount: 5000, date: 'Day 7', status: 'pending' },
  ]);
  
  const [grantApplications, setGrantApplications] = useState<Array<{
    id: string;
    name: string;
    amount: number;
    probability: number;
    status: 'draft' | 'submitted' | 'approved' | 'denied';
  }>>([
    { id: 'g1', name: 'Federal EPA Grant', amount: 150000, probability: 60, status: 'draft' },
    { id: 'g2', name: 'State Water Quality Fund', amount: 75000, probability: 75, status: 'draft' },
    { id: 'g3', name: 'Private Foundation Grant', amount: 50000, probability: 45, status: 'draft' },
  ]);

  const [showOptimization, setShowOptimization] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  const totalBudget = 250000;
  const totalSpent = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalCommitted = expenses.filter(e => e.status !== 'pending').reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = totalBudget - totalCommitted;

  const getCategoryColor = (category: string) => {
    const colors: any = {
      personnel: 'bg-blue-500',
      equipment: 'bg-purple-500',
      materials: 'bg-green-500',
      permits: 'bg-yellow-500',
      monitoring: 'bg-orange-500',
      contingency: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleStrategyChoice = (strategy: 'aggressive' | 'balanced' | 'conservative') => {
    setBudgetStrategy(strategy);
    
    // Adjust allocations based on strategy
    if (strategy === 'aggressive') {
      setAllocations({ personnel: 40, equipment: 25, materials: 20, permits: 5, monitoring: 5, contingency: 5 });
    } else if (strategy === 'balanced') {
      setAllocations({ personnel: 35, equipment: 20, materials: 15, permits: 10, monitoring: 10, contingency: 10 });
    } else {
      setAllocations({ personnel: 30, equipment: 15, materials: 10, permits: 15, monitoring: 15, contingency: 15 });
    }
  };

  const submitGrant = (grantId: string) => {
    setGrantApplications(prev => prev.map(g => 
      g.id === grantId ? { ...g, status: 'submitted' as const } : g
    ));
  };

  const completeOptimization = () => {
    setOptimizationComplete(true);
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-8-analytics' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-7-budget'],
        budgetStrategy
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            💰 Level 7: Budget Management
          </h1>
          <p className="text-2xl text-green-200">
            Master financial planning and resource allocation
          </p>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white">
            <div className="text-sm opacity-75">Total Budget</div>
            <div className="text-3xl font-bold text-blue-300">${(totalBudget / 1000).toFixed(0)}K</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white">
            <div className="text-sm opacity-75">Spent</div>
            <div className="text-3xl font-bold text-red-300">${(totalSpent / 1000).toFixed(0)}K</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white">
            <div className="text-sm opacity-75">Committed</div>
            <div className="text-3xl font-bold text-yellow-300">${(totalCommitted / 1000).toFixed(0)}K</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white">
            <div className="text-sm opacity-75">Remaining</div>
            <div className={`text-3xl font-bold ${remainingBudget > 100000 ? 'text-green-300' : remainingBudget > 50000 ? 'text-yellow-300' : 'text-red-300'}`}>
              ${(remainingBudget / 1000).toFixed(0)}K
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'overview'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setSelectedTab('planning')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'planning'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📋 Planning
          </button>
          <button
            onClick={() => setSelectedTab('tracking')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'tracking'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            💳 Tracking
          </button>
          <button
            onClick={() => setSelectedTab('optimization')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'optimization'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            ⚡ Optimization
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Budget Allocation Pie Chart (Visual) */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">💼 Budget Allocation</h3>
              <div className="space-y-3">
                {Object.entries(allocations).map(([category, percentage]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize">{category}</span>
                      <span className="font-bold">{percentage}% (${((totalBudget * percentage) / 100 / 1000).toFixed(0)}K)</span>
                    </div>
                    <div className="bg-black/40 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`${getCategoryColor(category)} h-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Flow Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📈 Cash Flow</h3>
              <div className="space-y-4">
                <div className="bg-green-500/20 border-l-4 border-green-400 p-4 rounded">
                  <div className="text-sm opacity-75">Income Sources</div>
                  <div className="text-2xl font-bold">$250K</div>
                  <div className="text-xs mt-1">Initial Grant Funding</div>
                </div>
                
                <div className="bg-red-500/20 border-l-4 border-red-400 p-4 rounded">
                  <div className="text-sm opacity-75">Expenses to Date</div>
                  <div className="text-2xl font-bold">${(totalSpent / 1000).toFixed(0)}K</div>
                  <div className="text-xs mt-1">{expenses.filter(e => e.status === 'paid').length} transactions</div>
                </div>
                
                <div className="bg-blue-500/20 border-l-4 border-blue-400 p-4 rounded">
                  <div className="text-sm opacity-75">Burn Rate</div>
                  <div className="text-2xl font-bold">$15K/week</div>
                  <div className="text-xs mt-1">Estimated runway: {Math.floor(remainingBudget / 15000)} weeks</div>
                </div>

                <div className="bg-purple-500/20 border-l-4 border-purple-400 p-4 rounded">
                  <div className="text-sm opacity-75">Pending Grants</div>
                  <div className="text-2xl font-bold">$275K</div>
                  <div className="text-xs mt-1">{grantApplications.length} applications</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Planning Tab */}
        {selectedTab === 'planning' && (
          <div className="space-y-6">
            {!budgetStrategy ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-6 text-center">Choose Your Budget Strategy</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <button
                    onClick={() => handleStrategyChoice('aggressive')}
                    className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                  >
                    <div className="text-5xl mb-4">🚀</div>
                    <h4 className="text-2xl font-bold mb-3">Aggressive</h4>
                    <p className="text-sm opacity-80 mb-4">
                      Maximize impact quickly. Front-load spending on personnel and equipment.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="text-green-400">✓ Fast results</div>
                      <div className="text-green-400">✓ Maximum team</div>
                      <div className="text-red-400">✗ Low contingency</div>
                      <div className="text-red-400">✗ Higher risk</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStrategyChoice('balanced')}
                    className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                  >
                    <div className="text-5xl mb-4">⚖️</div>
                    <h4 className="text-2xl font-bold mb-3">Balanced</h4>
                    <p className="text-sm opacity-80 mb-4">
                      Moderate pace with good coverage. Balance speed, safety, and flexibility.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="text-green-400">✓ Steady progress</div>
                      <div className="text-green-400">✓ Reasonable buffer</div>
                      <div className="text-yellow-400">~ Medium risk</div>
                      <div className="text-yellow-400">~ Standard timeline</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStrategyChoice('conservative')}
                    className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                  >
                    <div className="text-5xl mb-4">🛡️</div>
                    <h4 className="text-2xl font-bold mb-3">Conservative</h4>
                    <p className="text-sm opacity-80 mb-4">
                      Prioritize safety and compliance. Large contingency fund for surprises.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="text-green-400">✓ High safety</div>
                      <div className="text-green-400">✓ Large buffer</div>
                      <div className="text-yellow-400">~ Slower pace</div>
                      <div className="text-yellow-400">~ Smaller team</div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Budget Plan: {budgetStrategy.charAt(0).toUpperCase() + budgetStrategy.slice(1)}</h3>
                  <button
                    onClick={() => setBudgetStrategy(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
                  >
                    Change Strategy
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-bold mb-3">Allocation Breakdown</h4>
                    <div className="space-y-2">
                      {Object.entries(allocations).map(([category, percentage]) => (
                        <div key={category} className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
                          <span className="capitalize font-semibold">{category}</span>
                          <span className="text-lg">{percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-3">Grant Applications</h4>
                    <div className="space-y-3">
                      {grantApplications.map(grant => (
                        <div key={grant.id} className="bg-black/30 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-bold">{grant.name}</div>
                              <div className="text-sm opacity-75">${(grant.amount / 1000).toFixed(0)}K</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              grant.status === 'draft' ? 'bg-gray-500' :
                              grant.status === 'submitted' ? 'bg-blue-500' :
                              grant.status === 'approved' ? 'bg-green-500' :
                              'bg-red-500'
                            }`}>
                              {grant.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 bg-black/40 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-yellow-400 to-green-500 h-full rounded-full"
                                style={{ width: `${grant.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{grant.probability}%</span>
                          </div>
                          {grant.status === 'draft' && (
                            <button
                              onClick={() => submitGrant(grant.id)}
                              className="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-sm font-bold"
                            >
                              Submit Application
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tracking Tab */}
        {selectedTab === 'tracking' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">💳 Expense Tracking</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(expense => (
                    <tr key={expense.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">{expense.date}</td>
                      <td className="py-3 px-4">{expense.description}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        ${expense.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          expense.status === 'paid' ? 'bg-green-500' :
                          expense.status === 'approved' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}>
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-white/40 font-bold">
                    <td colSpan={3} className="py-3 px-4 text-right">Total Spent:</td>
                    <td className="py-3 px-4 text-right text-xl">${totalSpent.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {selectedTab === 'optimization' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">⚡ Cost Optimization Challenge</h3>
              <p className="text-lg mb-6 opacity-90">
                Your budget is on track, but you've identified opportunities to reduce costs by 15% 
                without compromising quality. Where should you optimize?
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowOptimization(true)}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                >
                  <div className="text-4xl mb-3">🤝</div>
                  <h4 className="text-xl font-bold mb-2">Negotiate with Vendors</h4>
                  <p className="text-sm opacity-80">Leverage bulk purchasing and long-term contracts</p>
                  <div className="mt-3 text-xs text-green-400">Save: $22K</div>
                </button>

                <button
                  onClick={() => setShowOptimization(true)}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                >
                  <div className="text-4xl mb-3">♻️</div>
                  <h4 className="text-xl font-bold mb-2">Use Recycled Materials</h4>
                  <p className="text-sm opacity-80">Source sustainable alternatives at lower cost</p>
                  <div className="mt-3 text-xs text-green-400">Save: $18K</div>
                </button>

                <button
                  onClick={() => setShowOptimization(true)}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all transform hover:scale-105 text-left"
                >
                  <div className="text-4xl mb-3">🎓</div>
                  <h4 className="text-xl font-bold mb-2">Volunteer Programs</h4>
                  <p className="text-sm opacity-80">Engage community volunteers for non-technical work</p>
                  <div className="mt-3 text-xs text-green-400">Save: $25K</div>
                </button>
              </div>
            </div>

            {showOptimization && (
              <div className="bg-green-500/20 border-2 border-green-400 rounded-2xl p-6 text-center text-white">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-2">Optimization Applied!</h3>
                <p className="text-lg opacity-90 mb-4">
                  You've reduced costs while maintaining quality. Budget efficiency increased!
                </p>
                <button
                  onClick={completeOptimization}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                >
                  Complete Budget Management
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transition Message */}
        {optimizationComplete && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">💰</div>
              <h2 className="text-5xl font-bold mb-4">Budget Mastery Achieved!</h2>
              <p className="text-2xl opacity-80">
                Moving to Data Analytics...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 8: Data Analytics Component
function Level8Analytics({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'patterns' | 'predictions' | 'reports'>('dashboard');
  const [discoveredPattern, setDiscoveredPattern] = useState<string | null>(null);
  const [predictionAccuracy, setPredictionAccuracy] = useState(0);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Sample data for visualizations
  const waterQualityTrend = [
    { week: 'Week 1', ph: 6.2, oxygen: 4.5, health: 42 },
    { week: 'Week 2', ph: 6.4, oxygen: 5.1, health: 48 },
    { week: 'Week 3', ph: 6.6, oxygen: 5.6, health: 55 },
    { week: 'Week 4', ph: 6.8, oxygen: 6.2, health: 63 },
    { week: 'Week 5', ph: 7.0, oxygen: 6.8, health: 72 },
    { week: 'Week 6', ph: 7.2, oxygen: 7.3, health: 80 },
    { week: 'Week 7', ph: 7.4, oxygen: 7.8, health: 88 },
  ];

  const pollutionSources = [
    { name: 'Industrial', impact: 35, trend: 'decreasing' },
    { name: 'Agricultural', impact: 28, trend: 'stable' },
    { name: 'Urban', impact: 22, trend: 'decreasing' },
    { name: 'Illegal Dumping', impact: 10, trend: 'eliminated' },
    { name: 'Natural', impact: 5, trend: 'stable' },
  ];

  const speciesRecovery = [
    { species: 'Trout', baseline: 12, current: 47, target: 60 },
    { species: 'Mayfly', baseline: 23, current: 68, target: 80 },
    { species: 'Otter', baseline: 3, current: 8, target: 15 },
    { species: 'Heron', baseline: 5, current: 14, target: 20 },
  ];

  const costEfficiency = [
    { category: 'Personnel', budgeted: 87500, spent: 83200, efficiency: 95 },
    { category: 'Equipment', budgeted: 50000, spent: 45800, efficiency: 92 },
    { category: 'Materials', budgeted: 37500, spent: 38900, efficiency: 96 },
    { category: 'Permits', budgeted: 25000, spent: 22000, efficiency: 88 },
  ];

  const handlePatternDiscovery = (pattern: string) => {
    setDiscoveredPattern(pattern);
    setTimeout(() => setDiscoveredPattern(null), 3000);
  };

  const runPredictiveModel = () => {
    let accuracy = 0;
    const interval = setInterval(() => {
      accuracy += 5;
      setPredictionAccuracy(accuracy);
      if (accuracy >= 85) {
        clearInterval(interval);
      }
    }, 100);
  };

  const generateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      setReportGenerated(true);
    }, 2000);
  };

  const completeLevel = () => {
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'completion' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-8-analytics']
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            📊 Level 8: Data Analytics
          </h1>
          <p className="text-2xl text-purple-200">
            Transform data into insights and actionable intelligence
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('dashboard')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'dashboard'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📈 Dashboard
          </button>
          <button
            onClick={() => setSelectedTab('patterns')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'patterns'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🔍 Pattern Discovery
          </button>
          <button
            onClick={() => setSelectedTab('predictions')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'predictions'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🔮 Predictions
          </button>
          <button
            onClick={() => setSelectedTab('reports')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'reports'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📄 Reports
          </button>
        </div>

        {/* Dashboard Tab */}
        {selectedTab === 'dashboard' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Water Quality Trend */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">💧 Water Quality Trend</h3>
              <div className="space-y-3">
                {waterQualityTrend.map((week, idx) => (
                  <div key={week.week} className="bg-black/30 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{week.week}</span>
                      <span className={`font-bold ${
                        week.health >= 70 ? 'text-green-400' :
                        week.health >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {week.health}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>pH: {week.ph}</div>
                      <div>O₂: {week.oxygen} mg/L</div>
                    </div>
                    <div className="mt-2 bg-black/40 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-green-500 h-full rounded-full transition-all"
                        style={{ width: `${week.health}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pollution Source Analysis */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🏭 Pollution Sources</h3>
              <div className="space-y-4">
                {pollutionSources.map(source => (
                  <div key={source.name} className="bg-black/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">{source.name}</div>
                        <div className="text-sm opacity-75">Impact: {source.impact}%</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        source.trend === 'eliminated' ? 'bg-green-500' :
                        source.trend === 'decreasing' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}>
                        {source.trend}
                      </span>
                    </div>
                    <div className="bg-black/40 rounded-full h-3">
                      <div 
                        className={`h-full rounded-full ${
                          source.trend === 'eliminated' ? 'bg-green-500' :
                          source.trend === 'decreasing' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${source.impact}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Species Recovery */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🦋 Species Recovery</h3>
              <div className="space-y-4">
                {speciesRecovery.map(species => {
                  const progress = Math.round((species.current / species.target) * 100);
                  return (
                    <div key={species.species} className="bg-black/30 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold">{species.species}</span>
                        <span className="text-sm">
                          {species.current}/{species.target} ({progress}%)
                        </span>
                      </div>
                      <div className="bg-black/40 rounded-full h-3 mb-1">
                        <div 
                          className={`h-full rounded-full ${
                            progress >= 80 ? 'bg-green-500' :
                            progress >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs opacity-75">
                        <span>Baseline: {species.baseline}</span>
                        <span>Current: {species.current}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cost Efficiency */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">💰 Cost Efficiency</h3>
              <div className="space-y-4">
                {costEfficiency.map(item => (
                  <div key={item.category} className="bg-black/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold">{item.category}</div>
                      <div className={`font-bold ${
                        item.efficiency >= 90 ? 'text-green-400' :
                        item.efficiency >= 80 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {item.efficiency}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>Budget: ${(item.budgeted / 1000).toFixed(0)}K</div>
                      <div>Spent: ${(item.spent / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="bg-black/40 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
                        style={{ width: `${item.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pattern Discovery Tab */}
        {selectedTab === 'patterns' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🔍 Discover Hidden Patterns</h3>
              <p className="text-lg mb-6 opacity-90">
                Analyze the data to uncover correlations and insights that can improve restoration outcomes.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => handlePatternDiscovery('rainfall')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all text-left"
                >
                  <div className="text-4xl mb-3">🌧️</div>
                  <h4 className="text-xl font-bold mb-2">Rainfall Correlation</h4>
                  <p className="text-sm opacity-80">
                    Discover how rainfall patterns affect water quality recovery rates
                  </p>
                </button>

                <button
                  onClick={() => handlePatternDiscovery('seasonal')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all text-left"
                >
                  <div className="text-4xl mb-3">🍂</div>
                  <h4 className="text-xl font-bold mb-2">Seasonal Trends</h4>
                  <p className="text-sm opacity-80">
                    Identify seasonal patterns in species activity and pollution levels
                  </p>
                </button>

                <button
                  onClick={() => handlePatternDiscovery('upstream')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all text-left"
                >
                  <div className="text-4xl mb-3">⬆️</div>
                  <h4 className="text-xl font-bold mb-2">Upstream Impact</h4>
                  <p className="text-sm opacity-80">
                    Analyze how upstream changes cascade through the ecosystem
                  </p>
                </button>

                <button
                  onClick={() => handlePatternDiscovery('intervention')}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all text-left"
                >
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="text-xl font-bold mb-2">Intervention Effectiveness</h4>
                  <p className="text-sm opacity-80">
                    Compare effectiveness of different restoration techniques
                  </p>
                </button>
              </div>

              {discoveredPattern && (
                <div className="mt-6 bg-green-500/20 border-2 border-green-400 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">💡</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Pattern Discovered!</h4>
                      <p className="opacity-90">
                        {discoveredPattern === 'rainfall' && 'Heavy rainfall events correlate with 15% faster oxygen recovery. Schedule intensive restoration before rainy season!'}
                        {discoveredPattern === 'seasonal' && 'Species return rates peak in spring (March-May). Plan major habitat work for late winter completion.'}
                        {discoveredPattern === 'upstream' && 'Upstream improvements show 3-5 week lag before downstream benefits appear. Build this delay into projections.'}
                        {discoveredPattern === 'intervention' && 'Natural filtration methods (wetland restoration) show 40% better long-term results than mechanical filtration.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Predictions Tab */}
        {selectedTab === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🔮 Predictive Modeling</h3>
              <p className="text-lg mb-6 opacity-90">
                Use machine learning to forecast future outcomes and optimize strategy.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">6-Month Projection</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>River Health</span>
                        <span className="font-bold text-green-400">95%</span>
                      </div>
                      <div className="text-xs opacity-75">High confidence (+/- 3%)</div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Species Diversity</span>
                        <span className="font-bold text-green-400">+47%</span>
                      </div>
                      <div className="text-xs opacity-75">Medium confidence (+/- 12%)</div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Remaining Budget</span>
                        <span className="font-bold text-yellow-400">$28K</span>
                      </div>
                      <div className="text-xs opacity-75">High confidence (+/- $5K)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Weather disruption: 12% risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Budget overrun: 23% risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Permit delays: 8% risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Invasive species: 35% risk</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={runPredictiveModel}
                  disabled={predictionAccuracy > 0}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    predictionAccuracy > 0
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105'
                  }`}
                >
                  {predictionAccuracy > 0 ? '⚙️ Model Running...' : '▶️ Run Predictive Model'}
                </button>
              </div>

              {predictionAccuracy > 0 && (
                <div className="mt-6 bg-purple-500/20 border-2 border-purple-400 rounded-xl p-6">
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">Model Accuracy</span>
                      <span className="font-bold">{predictionAccuracy}%</span>
                    </div>
                    <div className="bg-black/40 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${predictionAccuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  {predictionAccuracy >= 85 && (
                    <div className="text-center text-green-400 font-bold">
                      ✅ Model Training Complete! High accuracy achieved.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {selectedTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📄 Executive Reports</h3>
              <p className="text-lg mb-6 opacity-90">
                Generate comprehensive reports for stakeholders and decision-makers.
              </p>

              {!reportGenerated ? (
                <>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/30 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">📊</div>
                      <div className="font-bold">Progress Report</div>
                      <div className="text-sm opacity-75">7 weeks of data</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">💰</div>
                      <div className="font-bold">Financial Summary</div>
                      <div className="text-sm opacity-75">Budget analysis</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="font-bold">Impact Assessment</div>
                      <div className="text-sm opacity-75">Ecological outcomes</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={generateReport}
                      disabled={generatingReport}
                      className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                        generatingReport
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105'
                      }`}
                    >
                      {generatingReport ? '⚙️ Generating Report...' : '📄 Generate Comprehensive Report'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4">📊</div>
                    <h3 className="text-3xl font-bold mb-2">Report Generated Successfully!</h3>
                    <p className="text-lg opacity-90">Comprehensive analysis complete</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">88%</div>
                      <div className="text-sm">Overall Success</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">$179K</div>
                      <div className="text-sm">Budget Utilized</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400">+156%</div>
                      <div className="text-sm">Biodiversity Gain</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={completeLevel}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                    >
                      🎉 Complete EcoSphere Journey
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Completion Screen
function CompletionScreen({ progress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 py-12 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Celebration */}
        <div className="mb-12">
          <div className="text-9xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-7xl font-bold text-white mb-6 animate-pulse">
            Congratulations!
          </h1>
          <p className="text-3xl text-green-200 mb-4">
            You've completed the EcoSphere Journey
          </p>
        </div>

        {/* Achievement Summary */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
          <h2 className="text-4xl font-bold mb-6">🏆 Your Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-5xl mb-3">🌊</div>
              <div className="text-3xl font-bold mb-2">Level 1</div>
              <div className="text-sm opacity-75">Discovery</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-5xl mb-3">🔍</div>
              <div className="text-3xl font-bold mb-2">Level 2</div>
              <div className="text-sm opacity-75">Investigation</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-5xl mb-3">📋</div>
              <div className="text-3xl font-bold mb-2">Level 3</div>
              <div className="text-sm opacity-75">Planning</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-5xl mb-3">🛠️</div>
              <div className="text-3xl font-bold mb-2">Level 4</div>
              <div className="text-sm opacity-75">Execution</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-5xl mb-3">🔗</div>
              <div className="text-3xl font-bold mb-2">Level 5</div>
              <div className="text-sm opacity-75">Systems</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-5xl mb-3">👥</div>
              <div className="text-3xl font-bold mb-2">Level 6</div>
              <div className="text-sm opacity-75">Team</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-5xl mb-3">💰</div>
              <div className="text-3xl font-bold mb-2">Level 7</div>
              <div className="text-sm opacity-75">Budget</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-5xl mb-3">📊</div>
              <div className="text-3xl font-bold mb-2">Level 8</div>
              <div className="text-sm opacity-75">Analytics</div>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
          <h2 className="text-4xl font-bold mb-6">🌟 Your Impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border-2 border-blue-400">
              <div className="text-5xl font-bold text-blue-300 mb-2">88%</div>
              <div className="text-xl">River Health Restored</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border-2 border-green-400">
              <div className="text-5xl font-bold text-green-300 mb-2">+156%</div>
              <div className="text-xl">Biodiversity Increase</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border-2 border-purple-400">
              <div className="text-5xl font-bold text-purple-300 mb-2">$179K</div>
              <div className="text-xl">Budget Managed</div>
            </div>
          </div>
        </div>

        {/* The Reveal */}
        <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-md rounded-3xl p-8 border-2 border-yellow-400 text-white">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-4xl font-bold mb-4">The Truth Revealed</h2>
          <p className="text-xl mb-6 leading-relaxed">
            Throughout your journey, you weren't just playing a game... You were <span className="text-yellow-300 font-bold">designing a real application</span>.
          </p>
          <p className="text-lg mb-6 opacity-90">
            Every decision you made, every workflow you created, every entity you discovered - 
            all of it generated a complete, production-ready environmental management system 
            tailored to your needs.
          </p>
          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <div className="text-sm opacity-75 mb-2">Your Generated Application Includes:</div>
            <div className="grid md:grid-cols-2 gap-3 text-left">
              <div>✅ Water Quality Management System</div>
              <div>✅ Pollution Source Tracking</div>
              <div>✅ Restoration Workflow Engine</div>
              <div>✅ Team & Resource Management</div>
              <div>✅ Financial Planning Tools</div>
              <div>✅ Analytics Dashboard</div>
              <div>✅ Systems Integration Framework</div>
              <div>✅ Real-time Monitoring</div>
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-300">
            This is the future of software creation: Learning through doing.
          </p>
        </div>

        {/* Gaia's Final Message */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
          <div className="text-7xl mb-4">🌍</div>
          <h2 className="text-3xl font-bold mb-4">Gaia's Farewell</h2>
          <p className="text-xl italic opacity-90 mb-4">
            "You came to EcoSphere as a learner. You leave as a Restoration Architect.
            The river you saved is real in its essence, and the skills you've gained 
            will ripple through every system you touch."
          </p>
          <p className="text-lg opacity-75">
            Thank you for playing EcoSphere. 🌱
          </p>
        </div>
      </div>
    </div>
  );
}

// Add CSS for animations
const styles = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes water-flow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes swim {
    0% { transform: translateX(-50px); }
    100% { transform: translateX(calc(100vw - 50px)); }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-water-flow {
    animation: water-flow 3s linear infinite;
  }
  
  .animate-swim {
    animation: swim 8s linear infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
