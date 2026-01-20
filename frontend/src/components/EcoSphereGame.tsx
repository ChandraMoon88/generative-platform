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
  
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
