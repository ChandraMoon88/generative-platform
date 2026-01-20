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
  skills: Map<string, 'novice' | 'intermediate' | 'advanced' | 'expert' | 'master'>;
  costPerMonth: number;
  availability: 'full-time' | 'part-time';
  personalityTraits: string[];
  experience: number;
  morale: number;
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
