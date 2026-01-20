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
  | 'level-9-stakeholders'
  | 'level-10-compliance'
  | 'level-11-projects'
  | 'level-12-innovation'
  | 'level-13-policy'
  | 'level-14-mentor'
  | 'level-15-visionary'
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

  // LEVEL 9: Stakeholder Management
  if (progress.phase === 'level-9-stakeholders') {
    return <Level9Stakeholders progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 10: Compliance Manager
  if (progress.phase === 'level-10-compliance') {
    return <Level10Compliance progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 11: Ecosystem Engineer
  if (progress.phase === 'level-11-projects') {
    return <Level11Projects progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 12: Innovation Lab
  if (progress.phase === 'level-12-innovation') {
    return <Level12Innovation progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 13: Policy Maker
  if (progress.phase === 'level-13-policy') {
    return <Level13Policy progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 14: The Mentor
  if (progress.phase === 'level-14-mentor') {
    return <Level14Mentor progress={progress} setProgress={setProgress} />;
  }

  // LEVEL 15: The Visionary
  if (progress.phase === 'level-15-visionary') {
    return <Level15Visionary progress={progress} setProgress={setProgress} />;
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
        duration: step.estimatedDuration || 30
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
  const [connections, setConnections] = useState<Array<{from: string; to: string; type: string; impact?: string}>>([]);
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
      portrait: '👷‍♂️',
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
  const [budgetStrategy, setBudgetStrategy] = useState<'aggressive' | 'balanced' | 'conservative' | undefined>(undefined);
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
        phase: 'level-9-stakeholders' as GamePhase,
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

// LEVEL 9: Stakeholder Management Component
function Level9Stakeholders({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedTab, setSelectedTab] = useState<'map' | 'engage' | 'crisis' | 'influence'>('map');
  const [stakeholders, setStakeholders] = useState([
    { id: 'mayor', name: 'Mayor Chen', type: 'Government', influence: 85, support: 60, engaged: false },
    { id: 'epa', name: 'EPA Director', type: 'Regulatory', influence: 90, support: 75, engaged: false },
    { id: 'industry', name: 'Factory Owner', type: 'Business', influence: 70, support: 30, engaged: false },
    { id: 'farmers', name: 'Farmers Association', type: 'Community', influence: 65, support: 45, engaged: false },
    { id: 'activists', name: 'Green Coalition', type: 'Advocacy', influence: 60, support: 95, engaged: false },
    { id: 'residents', name: 'Local Residents', type: 'Community', influence: 55, support: 50, engaged: false },
  ]);
  
  const [engagementPlan, setEngagementPlan] = useState<Map<string, string>>(new Map());
  const [crisisHandled, setCrisisHandled] = useState(false);
  const [influenceMapBuilt, setInfluenceMapBuilt] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const engageStakeholder = (id: string, strategy: string) => {
    setStakeholders(prev => prev.map(s => 
      s.id === id ? { ...s, engaged: true, support: Math.min(100, s.support + 15) } : s
    ));
    const newPlan = new Map(engagementPlan);
    newPlan.set(id, strategy);
    setEngagementPlan(newPlan);
  };

  const handleCrisis = (response: string) => {
    if (response === 'transparent') {
      setStakeholders(prev => prev.map(s => ({ ...s, support: Math.min(100, s.support + 10) })));
    } else if (response === 'deflect') {
      setStakeholders(prev => prev.map(s => 
        s.type === 'Advocacy' ? { ...s, support: Math.max(0, s.support - 20) } : s
      ));
    }
    setCrisisHandled(true);
  };

  const buildInfluenceMap = () => {
    setInfluenceMapBuilt(true);
  };

  const completeLevel = () => {
    setLevelComplete(true);
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-10-compliance' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-9-stakeholders']
      });
    }, 2000);
  };

  const averageSupport = Math.round(stakeholders.reduce((sum, s) => sum + s.support, 0) / stakeholders.length);
  const allEngaged = stakeholders.every(s => s.engaged);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            🤝 Level 9: Stakeholder Management
          </h1>
          <p className="text-2xl text-rose-200">
            Build relationships and navigate complex stakeholder dynamics
          </p>
        </div>

        {/* Support Meter */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold">Average Stakeholder Support</span>
            <span className={`text-3xl font-bold ${
              averageSupport >= 70 ? 'text-green-400' :
              averageSupport >= 50 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {averageSupport}%
            </span>
          </div>
          <div className="bg-black/40 rounded-full h-4">
            <div 
              className={`h-full rounded-full transition-all ${
                averageSupport >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                averageSupport >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-red-400 to-pink-500'
              }`}
              style={{ width: `${averageSupport}%` }}
            ></div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('map')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'map'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🗺️ Stakeholder Map
          </button>
          <button
            onClick={() => setSelectedTab('engage')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'engage'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            💬 Engagement
          </button>
          <button
            onClick={() => setSelectedTab('crisis')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'crisis'
                ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            ⚠️ Crisis Response
          </button>
          <button
            onClick={() => setSelectedTab('influence')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'influence'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📊 Influence Map
          </button>
        </div>

        {/* Stakeholder Map Tab */}
        {selectedTab === 'map' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakeholders.map(stakeholder => (
              <div
                key={stakeholder.id}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white transition-all ${
                  stakeholder.engaged ? 'border-2 border-green-400' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{stakeholder.name}</h3>
                    <span className="text-sm opacity-75">{stakeholder.type}</span>
                  </div>
                  {stakeholder.engaged && (
                    <span className="text-3xl">✅</span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Influence</span>
                      <span className="font-bold">{stakeholder.influence}%</span>
                    </div>
                    <div className="bg-black/40 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-full rounded-full"
                        style={{ width: `${stakeholder.influence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Support</span>
                      <span className={`font-bold ${
                        stakeholder.support >= 70 ? 'text-green-400' :
                        stakeholder.support >= 40 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {stakeholder.support}%
                      </span>
                    </div>
                    <div className="bg-black/40 rounded-full h-2">
                      <div 
                        className={`h-full rounded-full ${
                          stakeholder.support >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          stakeholder.support >= 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 to-pink-500'
                        }`}
                        style={{ width: `${stakeholder.support}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {!stakeholder.engaged && (
                  <div className="text-xs opacity-75 bg-black/30 p-2 rounded">
                    Not yet engaged - use Engagement tab to connect
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Engagement Tab */}
        {selectedTab === 'engage' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">💬 Engagement Strategies</h3>
              <p className="text-lg mb-6 opacity-90">
                Choose the right communication strategy for each stakeholder group.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {stakeholders.map(stakeholder => (
                  <div key={stakeholder.id} className="bg-black/30 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold">{stakeholder.name}</h4>
                        <div className="text-sm opacity-75">{stakeholder.type}</div>
                      </div>
                      {stakeholder.engaged ? (
                        <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-bold">Engaged</span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-600 rounded-full text-xs font-bold">Pending</span>
                      )}
                    </div>

                    {!stakeholder.engaged && (
                      <div className="space-y-2">
                        <button
                          onClick={() => engageStakeholder(stakeholder.id, 'data-driven')}
                          className="w-full text-left bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">📊 Data-Driven Approach</div>
                          <div className="text-xs opacity-75">Present facts, figures, and scientific evidence</div>
                        </button>
                        
                        <button
                          onClick={() => engageStakeholder(stakeholder.id, 'emotional')}
                          className="w-full text-left bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">❤️ Emotional Appeal</div>
                          <div className="text-xs opacity-75">Focus on community impact and shared values</div>
                        </button>
                        
                        <button
                          onClick={() => engageStakeholder(stakeholder.id, 'economic')}
                          className="w-full text-left bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">💼 Economic Benefits</div>
                          <div className="text-xs opacity-75">Highlight cost savings and economic opportunities</div>
                        </button>
                      </div>
                    )}

                    {stakeholder.engaged && engagementPlan.has(stakeholder.id) && (
                      <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 text-sm">
                        ✅ Engaged using: <span className="font-bold capitalize">{engagementPlan.get(stakeholder.id)}</span> strategy
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {allEngaged && (
                <div className="mt-6 bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <h4 className="text-2xl font-bold">All Stakeholders Engaged!</h4>
                  <p className="opacity-90 mt-2">Your communication strategy is working.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Crisis Response Tab */}
        {selectedTab === 'crisis' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">⚠️ Crisis Communication</h3>
              
              {!crisisHandled ? (
                <>
                  <div className="bg-red-500/20 border-2 border-red-400 rounded-xl p-6 mb-6">
                    <div className="text-5xl mb-4">🚨</div>
                    <h4 className="text-2xl font-bold mb-4">Breaking News</h4>
                    <p className="text-lg mb-4">
                      A local news outlet reports that your restoration project may have disturbed 
                      a sensitive habitat area. Environmental groups are questioning your methods. 
                      How do you respond?
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleCrisis('transparent')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all text-left"
                    >
                      <div className="text-4xl mb-3">🔍</div>
                      <h4 className="text-xl font-bold mb-2">Transparent Communication</h4>
                      <p className="text-sm opacity-80">
                        Immediately share all data, invite independent review, hold public meeting
                      </p>
                      <div className="mt-3 text-xs text-green-400">✓ Builds trust with all groups</div>
                    </button>

                    <button
                      onClick={() => handleCrisis('defensive')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all text-left"
                    >
                      <div className="text-4xl mb-3">🛡️</div>
                      <h4 className="text-xl font-bold mb-2">Defensive Response</h4>
                      <p className="text-sm opacity-80">
                        Issue statement defending methodology, cite credentials and permits
                      </p>
                      <div className="mt-3 text-xs text-yellow-400">⚠ May maintain some support</div>
                    </button>

                    <button
                      onClick={() => handleCrisis('deflect')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all text-left"
                    >
                      <div className="text-4xl mb-3">↩️</div>
                      <h4 className="text-xl font-bold mb-2">Deflect & Minimize</h4>
                      <p className="text-sm opacity-80">
                        Downplay concerns, wait for story to blow over, avoid direct engagement
                      </p>
                      <div className="mt-3 text-xs text-red-400">✗ May damage stakeholder trust</div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h4 className="text-2xl font-bold mb-2">Crisis Handled</h4>
                  <p className="text-lg opacity-90">
                    Your response has been noted by stakeholders. Support levels updated.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Influence Map Tab */}
        {selectedTab === 'influence' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📊 Influence Network</h3>
              <p className="text-lg mb-6 opacity-90">
                Map stakeholder relationships and identify key influencers who can champion your project.
              </p>

              {!influenceMapBuilt ? (
                <div className="text-center">
                  <button
                    onClick={buildInfluenceMap}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                  >
                    🗺️ Build Influence Map
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-black/30 rounded-xl p-6 mb-6">
                    <h4 className="text-xl font-bold mb-4">Key Relationships</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 bg-white/10 p-3 rounded-lg">
                        <span>Mayor Chen</span>
                        <span className="opacity-50">↔️</span>
                        <span>EPA Director</span>
                        <span className="ml-auto text-sm text-green-400">Strong Alliance</span>
                      </div>
                      <div className="flex items-center gap-4 bg-white/10 p-3 rounded-lg">
                        <span>Green Coalition</span>
                        <span className="opacity-50">↔️</span>
                        <span>Local Residents</span>
                        <span className="ml-auto text-sm text-blue-400">Aligned Interests</span>
                      </div>
                      <div className="flex items-center gap-4 bg-white/10 p-3 rounded-lg">
                        <span>Factory Owner</span>
                        <span className="opacity-50">⚔️</span>
                        <span>Green Coalition</span>
                        <span className="ml-auto text-sm text-red-400">Opposition</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4">Champion Identification</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
                        <div className="text-3xl mb-2">⭐</div>
                        <div className="font-bold">EPA Director</div>
                        <div className="text-sm opacity-75 mt-1">
                          High influence + High support = Perfect champion
                        </div>
                      </div>
                      <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="font-bold">Mayor Chen</div>
                        <div className="text-sm opacity-75 mt-1">
                          Key decision-maker with strong support
                        </div>
                      </div>
                    </div>
                  </div>

                  {allEngaged && crisisHandled && averageSupport >= 60 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={completeLevel}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                      >
                        🎉 Complete Stakeholder Management
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Transition Message */}
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">🤝</div>
              <h2 className="text-5xl font-bold mb-4">Stakeholder Management Mastered!</h2>
              <p className="text-2xl opacity-80">
                Moving to final celebration...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 10: Compliance Manager Component
function Level10Compliance({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedTab, setSelectedTab] = useState<'framework' | 'permits' | 'inspections' | 'calendar'>('framework');
  const [permits, setPermits] = useState([
    { id: 'water', name: 'Water Discharge Permit', status: 'pending', progress: 0, required: true },
    { id: 'wetland', name: 'Wetland Alteration Permit', status: 'pending', progress: 0, required: true },
    { id: 'habitat', name: 'Habitat Restoration Authorization', status: 'pending', progress: 0, required: true },
    { id: 'construction', name: 'Construction Permit', status: 'pending', progress: 0, required: false },
  ]);
  
  const [regulations, setRegulations] = useState([
    { id: 'cwa', name: 'Clean Water Act', compliance: 100, critical: true },
    { id: 'esa', name: 'Endangered Species Act', compliance: 85, critical: true },
    { id: 'nepa', name: 'NEPA Review', compliance: 90, critical: true },
    { id: 'local', name: 'Local Ordinances', compliance: 95, critical: false },
  ]);

  const [inspections, setInspections] = useState([
    { id: 'initial', name: 'Initial Site Inspection', status: 'scheduled', date: 'Week 2', passed: null },
    { id: 'water', name: 'Water Quality Audit', status: 'pending', date: 'Week 4', passed: null },
    { id: 'final', name: 'Final Compliance Review', status: 'pending', date: 'Week 8', passed: null },
  ]);

  const [inspectionChallenge, setInspectionChallenge] = useState(false);
  const [challengeHandled, setChallengeHandled] = useState(false);
  const [regulatoryChange, setRegulatoryChange] = useState(false);
  const [changeHandled, setChangeHandled] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const applyForPermit = (permitId: string) => {
    setPermits(prev => prev.map(p => 
      p.id === permitId ? { ...p, status: 'in-review', progress: 50 } : p
    ));
    
    setTimeout(() => {
      setPermits(prev => prev.map(p => 
        p.id === permitId ? { ...p, status: 'approved', progress: 100 } : p
      ));
    }, 1500);
  };

  const handleInspection = (response: string) => {
    if (response === 'prepare') {
      setInspections(prev => prev.map((insp, idx) => 
        idx === 0 ? { ...insp, status: 'completed', passed: true } : insp
      ));
      setRegulations(prev => prev.map(r => ({ ...r, compliance: Math.min(100, r.compliance + 5) })));
    } else if (response === 'wing-it') {
      setInspections(prev => prev.map((insp, idx) => 
        idx === 0 ? { ...insp, status: 'completed', passed: false } : insp
      ));
      setRegulations(prev => prev.map(r => ({ ...r, compliance: Math.max(0, r.compliance - 15) })));
    }
    setChallengeHandled(true);
  };

  const handleRegulatoryChange = (response: string) => {
    if (response === 'adapt') {
      setRegulations(prev => prev.map(r => 
        r.id === 'cwa' ? { ...r, compliance: 100 } : r
      ));
    } else if (response === 'delay') {
      setRegulations(prev => prev.map(r => 
        r.id === 'cwa' ? { ...r, compliance: Math.max(0, r.compliance - 20) } : r
      ));
    }
    setChangeHandled(true);
  };

  const completeLevel = () => {
    setLevelComplete(true);
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-11-projects' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-10-compliance']
      });
    }, 2000);
  };

  const allPermitsApproved = permits.filter(p => p.required).every(p => p.status === 'approved');
  const averageCompliance = Math.round(regulations.reduce((sum, r) => sum + r.compliance, 0) / regulations.length);
  const allInspectionsPassed = inspections.every(i => i.passed !== false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            🏛️ Level 10: Compliance Manager
          </h1>
          <p className="text-2xl text-gray-300">
            Navigate regulatory requirements and maintain compliance
          </p>
        </div>

        {/* Compliance Dashboard */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Overall Compliance</div>
            <div className={`text-4xl font-bold ${
              averageCompliance >= 90 ? 'text-green-400' :
              averageCompliance >= 70 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {averageCompliance}%
            </div>
            <div className="bg-black/40 rounded-full h-3 mt-2">
              <div 
                className={`h-full rounded-full transition-all ${
                  averageCompliance >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                  averageCompliance >= 70 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
                style={{ width: `${averageCompliance}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Permits</div>
            <div className="text-4xl font-bold">
              {permits.filter(p => p.status === 'approved').length}/{permits.filter(p => p.required).length}
            </div>
            <div className="text-xs opacity-75 mt-2">Required permits approved</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Inspections</div>
            <div className="text-4xl font-bold">
              {inspections.filter(i => i.passed === true).length}/{inspections.length}
            </div>
            <div className="text-xs opacity-75 mt-2">Inspections passed</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('framework')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'framework'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📋 Regulatory Framework
          </button>
          <button
            onClick={() => setSelectedTab('permits')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'permits'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📄 Permits
          </button>
          <button
            onClick={() => setSelectedTab('inspections')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'inspections'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🔍 Inspections
          </button>
          <button
            onClick={() => setSelectedTab('calendar')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'calendar'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📅 Compliance Calendar
          </button>
        </div>

        {/* Regulatory Framework Tab */}
        {selectedTab === 'framework' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📋 Regulatory Requirements</h3>
              <p className="text-lg mb-6 opacity-90">
                Maintain compliance with federal, state, and local regulations.
              </p>

              <div className="space-y-4 mb-6">
                {regulations.map(reg => (
                  <div key={reg.id} className="bg-black/30 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold">{reg.name}</h4>
                        {reg.critical && (
                          <span className="text-xs text-red-400">⚠️ Critical Regulation</span>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        reg.compliance >= 90 ? 'bg-green-500' :
                        reg.compliance >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {reg.compliance}%
                      </span>
                    </div>
                    <div className="bg-black/40 rounded-full h-3">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          reg.compliance >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          reg.compliance >= 70 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 to-pink-500'
                        }`}
                        style={{ width: `${reg.compliance}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {!regulatoryChange && changeHandled && (
                <div className="text-center">
                  <button
                    onClick={() => setRegulatoryChange(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold hover:scale-105 transition-all"
                  >
                    ⚠️ Handle Regulatory Change
                  </button>
                </div>
              )}

              {regulatoryChange && !changeHandled && (
                <div className="bg-orange-500/20 border-2 border-orange-400 rounded-xl p-6 mt-6">
                  <div className="text-5xl mb-4">📢</div>
                  <h4 className="text-2xl font-bold mb-4">New Regulation Alert</h4>
                  <p className="text-lg mb-4">
                    The EPA has updated Clean Water Act standards, requiring stricter discharge limits. 
                    How do you respond?
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleRegulatoryChange('adapt')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">✅</div>
                      <div className="font-bold">Immediate Adaptation</div>
                      <div className="text-sm opacity-75 mt-2">
                        Update systems immediately, ensure full compliance
                      </div>
                      <div className="text-xs text-green-400 mt-2">✓ Maintains compliance</div>
                    </button>
                    <button
                      onClick={() => handleRegulatoryChange('phase')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">📅</div>
                      <div className="font-bold">Phased Implementation</div>
                      <div className="text-sm opacity-75 mt-2">
                        Request grace period, implement in stages
                      </div>
                      <div className="text-xs text-yellow-400 mt-2">⚠ Temporary variance needed</div>
                    </button>
                    <button
                      onClick={() => handleRegulatoryChange('delay')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">⏸️</div>
                      <div className="font-bold">Delay & Challenge</div>
                      <div className="text-sm opacity-75 mt-2">
                        Contest requirement, delay implementation
                      </div>
                      <div className="text-xs text-red-400 mt-2">✗ Risk non-compliance</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Permits Tab */}
        {selectedTab === 'permits' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📄 Permit Management</h3>
              <p className="text-lg mb-6 opacity-90">
                Obtain all required permits before beginning restoration work.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {permits.map(permit => (
                  <div key={permit.id} className="bg-black/30 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold">{permit.name}</h4>
                        {permit.required && (
                          <span className="text-xs text-red-400">Required</span>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        permit.status === 'approved' ? 'bg-green-500' :
                        permit.status === 'in-review' ? 'bg-yellow-500' :
                        'bg-gray-600'
                      }`}>
                        {permit.status === 'approved' ? '✓ Approved' :
                         permit.status === 'in-review' ? '⏳ In Review' :
                         'Pending'}
                      </span>
                    </div>

                    {permit.status === 'pending' && (
                      <button
                        onClick={() => applyForPermit(permit.id)}
                        className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold hover:scale-105 transition-all"
                      >
                        Apply for Permit
                      </button>
                    )}

                    {permit.status === 'in-review' && (
                      <div className="mt-3">
                        <div className="text-sm opacity-75 mb-2">Processing...</div>
                        <div className="bg-black/40 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all animate-pulse"
                            style={{ width: `${permit.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {permit.status === 'approved' && (
                      <div className="mt-3 bg-green-500/20 border border-green-400 rounded-lg p-2 text-center text-sm">
                        ✅ Permit Approved
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {allPermitsApproved && (
                <div className="mt-6 bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <h4 className="text-2xl font-bold">All Required Permits Obtained!</h4>
                  <p className="opacity-90 mt-2">You're authorized to proceed with restoration work.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inspections Tab */}
        {selectedTab === 'inspections' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🔍 Compliance Inspections</h3>
              <p className="text-lg mb-6 opacity-90">
                Pass all inspections to demonstrate regulatory compliance.
              </p>

              <div className="space-y-4 mb-6">
                {inspections.map((inspection, idx) => (
                  <div key={inspection.id} className="bg-black/30 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-bold">{inspection.name}</h4>
                        <div className="text-sm opacity-75">Scheduled: {inspection.date}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        inspection.passed === true ? 'bg-green-500' :
                        inspection.passed === false ? 'bg-red-500' :
                        inspection.status === 'scheduled' ? 'bg-blue-500' :
                        'bg-gray-600'
                      }`}>
                        {inspection.passed === true ? '✓ Passed' :
                         inspection.passed === false ? '✗ Failed' :
                         inspection.status === 'scheduled' ? 'Scheduled' :
                         'Pending'}
                      </span>
                    </div>

                    {idx === 0 && inspection.status === 'scheduled' && !challengeHandled && (
                      <button
                        onClick={() => setInspectionChallenge(true)}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold hover:scale-105 transition-all"
                      >
                        Begin Inspection
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {inspectionChallenge && !challengeHandled && (
                <div className="bg-blue-500/20 border-2 border-blue-400 rounded-xl p-6">
                  <div className="text-5xl mb-4">🔍</div>
                  <h4 className="text-2xl font-bold mb-4">Inspector Arriving Tomorrow</h4>
                  <p className="text-lg mb-4">
                    The state environmental inspector will visit your site tomorrow morning. 
                    Your team needs guidance on preparation.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleInspection('prepare')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">📋</div>
                      <div className="font-bold">Thorough Preparation</div>
                      <div className="text-sm opacity-75 mt-2">
                        Full documentation review, site cleanup, team briefing
                      </div>
                      <div className="text-xs text-green-400 mt-2">✓ Best chance of passing</div>
                    </button>
                    <button
                      onClick={() => handleInspection('standard')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">📝</div>
                      <div className="font-bold">Standard Prep</div>
                      <div className="text-sm opacity-75 mt-2">
                        Basic documentation, normal operations
                      </div>
                      <div className="text-xs text-yellow-400 mt-2">⚠ Moderate success chance</div>
                    </button>
                    <button
                      onClick={() => handleInspection('wing-it')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">🤷</div>
                      <div className="font-bold">Wing It</div>
                      <div className="text-sm opacity-75 mt-2">
                        Minimal prep, rely on current state
                      </div>
                      <div className="text-xs text-red-400 mt-2">✗ High risk of failure</div>
                    </button>
                  </div>
                </div>
              )}

              {challengeHandled && inspections[0].passed === false && (
                <div className="bg-red-500/20 border-2 border-red-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-3">⚠️</div>
                  <h4 className="text-2xl font-bold">Inspection Failed</h4>
                  <p className="opacity-90 mt-2">You'll need to address violations and schedule a re-inspection.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compliance Calendar Tab */}
        {selectedTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📅 Compliance Calendar</h3>
              <p className="text-lg mb-6 opacity-90">
                Track deadlines and upcoming compliance activities.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 rounded-xl p-4">
                  <h4 className="text-lg font-bold mb-3 text-blue-400">Upcoming Deadlines</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quarterly Water Quality Report</span>
                      <span className="text-yellow-400">Week 5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Annual Compliance Certification</span>
                      <span className="text-green-400">Week 12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Permit Renewal (Water Discharge)</span>
                      <span className="text-orange-400">Week 8</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <h4 className="text-lg font-bold mb-3 text-purple-400">Recent Activities</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span>Submitted NEPA documentation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span>Completed safety training</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-400">⏳</span>
                      <span>Awaiting EPA response</span>
                    </div>
                  </div>
                </div>
              </div>

              {allPermitsApproved && challengeHandled && changeHandled && averageCompliance >= 85 && (
                <div className="text-center">
                  <button
                    onClick={completeLevel}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                  >
                    🎉 Complete Compliance Management
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transition Message */}
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">🏛️</div>
              <h2 className="text-5xl font-bold mb-4">Compliance Mastered!</h2>
              <p className="text-2xl opacity-80">
                Moving to final celebration...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 11: Ecosystem Engineer - Multiple Projects Component
function Level11Projects({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedTab, setSelectedTab] = useState<'portfolio' | 'allocation' | 'dependencies' | 'optimization'>('portfolio');
  const [projects, setProjects] = useState([
    { id: 'river', name: 'River Restoration', zone: 'Weeping River', progress: 75, budget: 85000, team: 4, priority: 'high', status: 'active', health: 88 },
    { id: 'forest', name: 'Forest Recovery', zone: 'Silent Forest', progress: 45, budget: 62000, team: 3, priority: 'high', status: 'active', health: 65 },
    { id: 'wetland', name: 'Wetland Creation', zone: 'River Valley', progress: 20, budget: 45000, team: 2, priority: 'medium', status: 'planning', health: 40 },
    { id: 'coast', name: 'Coastal Defense', zone: 'Dying Coast', progress: 10, budget: 78000, team: 0, priority: 'medium', status: 'not-started', health: 30 },
  ]);

  const [resources, setResources] = useState({
    budget: 100000,
    team: 12,
    equipment: 8,
  });

  const [allocations, setAllocations] = useState<Map<string, { budget: number; team: number }>>(new Map([
    ['river', { budget: 30000, team: 4 }],
    ['forest', { budget: 25000, team: 3 }],
    ['wetland', { budget: 20000, team: 2 }],
    ['coast', { budget: 25000, team: 3 }],
  ]));

  const [dependencies, setDependencies] = useState([
    { from: 'river', to: 'wetland', type: 'technical', resolved: true },
    { from: 'wetland', to: 'coast', type: 'sequential', resolved: false },
    { from: 'forest', to: 'river', type: 'resource', resolved: true },
  ]);

  const [allocationChallenge, setAllocationChallenge] = useState(false);
  const [challengeHandled, setChallengeHandled] = useState(false);
  const [optimizationRun, setOptimizationRun] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const allocateResources = (projectId: string, budget: number, team: number) => {
    const newAllocations = new Map(allocations);
    newAllocations.set(projectId, { budget, team });
    setAllocations(newAllocations);

    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, budget: p.budget + budget, team: team, status: team > 0 ? 'active' : p.status }
        : p
    ));
  };

  const handleAllocationCrisis = (strategy: string) => {
    if (strategy === 'balanced') {
      setProjects(prev => prev.map(p => ({ ...p, progress: p.progress + 5 })));
    } else if (strategy === 'focus') {
      setProjects(prev => prev.map(p => 
        p.priority === 'high' ? { ...p, progress: p.progress + 15 } : { ...p, progress: p.progress - 5 }
      ));
    } else if (strategy === 'pause') {
      setProjects(prev => prev.map(p => 
        p.priority === 'medium' ? { ...p, status: 'paused' } : p
      ));
    }
    setChallengeHandled(true);
  };

  const runOptimization = () => {
    // Optimize based on dependencies and priorities
    const optimizedProjects = projects.map(p => {
      if (p.priority === 'high' && p.status === 'active') {
        return { ...p, progress: Math.min(100, p.progress + 20), health: Math.min(100, p.health + 15) };
      }
      return { ...p, progress: Math.min(100, p.progress + 10), health: Math.min(100, p.health + 5) };
    });
    setProjects(optimizedProjects);
    setOptimizationRun(true);
  };

  const completeLevel = () => {
    setLevelComplete(true);
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-12-innovation' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-11-projects']
      });
    }, 2000);
  };

  const totalBudgetAllocated = Array.from(allocations.values()).reduce((sum, a) => sum + a.budget, 0);
  const totalTeamAllocated = Array.from(allocations.values()).reduce((sum, a) => sum + a.team, 0);
  const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
  const activeProjects = projects.filter(p => p.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            🔧 Level 11: Ecosystem Engineer
          </h1>
          <p className="text-2xl text-purple-200">
            Manage multiple restoration projects simultaneously
          </p>
        </div>

        {/* Portfolio Dashboard */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Active Projects</div>
            <div className="text-4xl font-bold text-green-400">{activeProjects}/{projects.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Average Progress</div>
            <div className={`text-4xl font-bold ${
              averageProgress >= 70 ? 'text-green-400' :
              averageProgress >= 40 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {averageProgress}%
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Budget Used</div>
            <div className="text-4xl font-bold text-blue-400">
              ${(totalBudgetAllocated / 1000).toFixed(0)}K
            </div>
            <div className="text-xs opacity-75">of ${(resources.budget / 1000).toFixed(0)}K</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Team Deployed</div>
            <div className="text-4xl font-bold text-purple-400">
              {totalTeamAllocated}/{resources.team}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('portfolio')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'portfolio'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📊 Portfolio
          </button>
          <button
            onClick={() => setSelectedTab('allocation')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'allocation'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            💰 Resource Allocation
          </button>
          <button
            onClick={() => setSelectedTab('dependencies')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'dependencies'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🔗 Dependencies
          </button>
          <button
            onClick={() => setSelectedTab('optimization')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'optimization'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            ⚡ Optimization
          </button>
        </div>

        {/* Portfolio Tab */}
        {selectedTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📊 Project Portfolio</h3>
              <p className="text-lg mb-6 opacity-90">
                Monitor all active restoration projects across different ecosystems.
              </p>

              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-black/30 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-2xl font-bold">{project.name}</h4>
                        <div className="text-sm opacity-75">{project.zone}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          project.status === 'active' ? 'bg-green-500' :
                          project.status === 'planning' ? 'bg-blue-500' :
                          project.status === 'paused' ? 'bg-yellow-500' :
                          'bg-gray-600'
                        }`}>
                          {project.status === 'active' ? '✓ Active' :
                           project.status === 'planning' ? '📋 Planning' :
                           project.status === 'paused' ? '⏸ Paused' :
                           'Not Started'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          project.priority === 'high' ? 'bg-red-500' : 'bg-orange-500'
                        }`}>
                          {project.priority === 'high' ? '🔥 High' : '⚠️ Medium'}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm opacity-75 mb-1">Progress</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-black/40 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold">{project.progress}%</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm opacity-75 mb-1">Ecosystem Health</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-black/40 rounded-full h-3">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                project.health >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                project.health >= 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                'bg-gradient-to-r from-red-400 to-pink-500'
                              }`}
                              style={{ width: `${project.health}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold">{project.health}%</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm opacity-75 mb-1">Resources</div>
                        <div className="flex gap-3 text-sm">
                          <span>💰 ${(project.budget / 1000).toFixed(0)}K</span>
                          <span>👥 {project.team} team</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!allocationChallenge && !challengeHandled && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setAllocationChallenge(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold hover:scale-105 transition-all"
                  >
                    ⚠️ Handle Resource Crisis
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resource Allocation Tab */}
        {selectedTab === 'allocation' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">💰 Resource Allocation</h3>
              <p className="text-lg mb-6 opacity-90">
                Distribute budget and team members across projects strategically.
              </p>

              {allocationChallenge && !challengeHandled && (
                <div className="bg-orange-500/20 border-2 border-orange-400 rounded-xl p-6 mb-6">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h4 className="text-2xl font-bold mb-4">Budget Cut Emergency</h4>
                  <p className="text-lg mb-4">
                    Your funding has been reduced by 30%. How do you handle resource allocation?
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleAllocationCrisis('balanced')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">⚖️</div>
                      <div className="font-bold">Balanced Reduction</div>
                      <div className="text-sm opacity-75 mt-2">
                        Cut all projects equally, maintain momentum
                      </div>
                      <div className="text-xs text-green-400 mt-2">✓ All projects continue slowly</div>
                    </button>
                    <button
                      onClick={() => handleAllocationCrisis('focus')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="font-bold">Focus on Priorities</div>
                      <div className="text-sm opacity-75 mt-2">
                        Fully fund high-priority projects, reduce others
                      </div>
                      <div className="text-xs text-yellow-400 mt-2">⚠ Some projects slow down</div>
                    </button>
                    <button
                      onClick={() => handleAllocationCrisis('pause')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">⏸️</div>
                      <div className="font-bold">Pause Medium Priority</div>
                      <div className="text-sm opacity-75 mt-2">
                        Pause lower priority projects completely
                      </div>
                      <div className="text-xs text-red-400 mt-2">✗ Some projects halted</div>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {projects.map(project => {
                  const allocation = allocations.get(project.id) || { budget: 0, team: 0 };
                  return (
                    <div key={project.id} className="bg-black/30 rounded-xl p-4">
                      <h4 className="text-lg font-bold mb-3">{project.name}</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Budget Allocated</span>
                            <span className="font-bold">${(allocation.budget / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="bg-black/40 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
                              style={{ width: `${(allocation.budget / resources.budget) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Team Members</span>
                            <span className="font-bold">{allocation.team} members</span>
                          </div>
                          <div className="bg-black/40 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full rounded-full"
                              style={{ width: `${(allocation.team / resources.team) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dependencies Tab */}
        {selectedTab === 'dependencies' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🔗 Project Dependencies</h3>
              <p className="text-lg mb-6 opacity-90">
                Manage interdependencies between restoration projects.
              </p>

              <div className="space-y-4 mb-6">
                {dependencies.map((dep, idx) => {
                  const fromProject = projects.find(p => p.id === dep.from);
                  const toProject = projects.find(p => p.id === dep.to);
                  return (
                    <div key={idx} className="bg-black/30 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-bold">{fromProject?.name}</div>
                          <div className="text-sm opacity-75">{fromProject?.zone}</div>
                        </div>
                        <div className="text-3xl opacity-50">→</div>
                        <div className="flex-1">
                          <div className="font-bold">{toProject?.name}</div>
                          <div className="text-sm opacity-75">{toProject?.zone}</div>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            dep.type === 'technical' ? 'bg-blue-500' :
                            dep.type === 'sequential' ? 'bg-purple-500' :
                            'bg-orange-500'
                          }`}>
                            {dep.type}
                          </span>
                          {dep.resolved ? (
                            <div className="text-xs text-green-400 mt-1">✓ Resolved</div>
                          ) : (
                            <div className="text-xs text-yellow-400 mt-1">⏳ Pending</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-500/20 border border-blue-400 rounded-xl p-6">
                <h4 className="text-xl font-bold mb-3">Dependency Types</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-blue-400">Technical</div>
                    <div className="opacity-75">Knowledge/methods transfer between projects</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-400">Sequential</div>
                    <div className="opacity-75">One project must complete before another starts</div>
                  </div>
                  <div>
                    <div className="font-bold text-orange-400">Resource</div>
                    <div className="opacity-75">Shared resources or team members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {selectedTab === 'optimization' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">⚡ Portfolio Optimization</h3>
              <p className="text-lg mb-6 opacity-90">
                Use AI-powered optimization to maximize ecosystem impact.
              </p>

              {!optimizationRun ? (
                <div className="text-center">
                  <div className="bg-black/30 rounded-xl p-8 mb-6">
                    <div className="text-6xl mb-4">🤖</div>
                    <h4 className="text-2xl font-bold mb-4">AI Portfolio Optimizer</h4>
                    <p className="text-lg opacity-90 mb-4">
                      Analyze project dependencies, resource constraints, and ecosystem priorities 
                      to recommend optimal resource allocation.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-left mb-6">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm opacity-75">Analysis Factors</div>
                        <div className="text-xs mt-2">• Project priorities<br/>• Dependencies<br/>• Resource efficiency</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm opacity-75">Optimization Goals</div>
                        <div className="text-xs mt-2">• Maximize health<br/>• Minimize delays<br/>• Balance portfolio</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm opacity-75">Expected Results</div>
                        <div className="text-xs mt-2">• +10-20% progress<br/>• +5-15% health<br/>• Better coordination</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={runOptimization}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                  >
                    🚀 Run Optimization
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6 mb-6 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h4 className="text-2xl font-bold mb-2">Optimization Complete!</h4>
                    <p className="opacity-90">All projects have been optimized for maximum impact.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {projects.map(project => (
                      <div key={project.id} className="bg-black/30 rounded-xl p-4">
                        <h4 className="font-bold mb-2">{project.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Progress Impact:</span>
                            <span className="text-green-400 font-bold">+{Math.min(20, 100 - (project.progress - 20))}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Health Impact:</span>
                            <span className="text-green-400 font-bold">+{Math.min(15, 100 - (project.health - 15))}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {challengeHandled && averageProgress >= 50 && (
                    <div className="text-center">
                      <button
                        onClick={completeLevel}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                      >
                        🎉 Complete Multi-Project Management
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transition Message */}
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">🔧</div>
              <h2 className="text-5xl font-bold mb-4">Multi-Project Mastery!</h2>
              <p className="text-2xl opacity-80">
                Moving to final celebration...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 12: Innovation Lab Component
function Level12Innovation({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedTab, setSelectedTab] = useState<'research' | 'experiments' | 'pilots' | 'results'>('research');
  const [researchAreas, setResearchAreas] = useState([
    { id: 'biochar', name: 'Biochar Soil Enhancement', progress: 0, potential: 85, status: 'available', cost: 15000 },
    { id: 'phyto', name: 'Phytoremediation Techniques', progress: 0, potential: 90, status: 'available', cost: 20000 },
    { id: 'aqua', name: 'Aquatic Microbe Cultivation', progress: 0, potential: 75, status: 'available', cost: 12000 },
    { id: 'myco', name: 'Mycorrhizal Networks', progress: 0, potential: 95, status: 'available', cost: 25000 },
  ]);

  const [experiments, setExperiments] = useState([
    { id: 'ex1', name: 'Wetland Buffer Zones', status: 'not-started', success: null, impact: 0 },
    { id: 'ex2', name: 'Native Species Reintroduction', status: 'not-started', success: null, impact: 0 },
    { id: 'ex3', name: 'Green Infrastructure', status: 'not-started', success: null, impact: 0 },
  ]);

  const [pilots, setPilots] = useState([
    { id: 'p1', name: 'Community Science Program', status: 'planning', participants: 0, results: null },
    { id: 'p2', name: 'Riparian Restoration Pilot', status: 'planning', participants: 0, results: null },
    { id: 'p3', name: 'Urban Green Corridors', status: 'planning', participants: 0, results: null },
  ]);

  const [budget, setBudget] = useState(75000);
  const [innovations, setInnovations] = useState<string[]>([]);
  const [experimentChallenge, setExperimentChallenge] = useState(false);
  const [challengeHandled, setChallengeHandled] = useState(false);
  const [pilotLaunched, setPilotLaunched] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const fundResearch = (areaId: string) => {
    const area = researchAreas.find(a => a.id === areaId);
    if (!area || budget < area.cost) return;

    setBudget(budget - area.cost);
    setResearchAreas(prev => prev.map(a => 
      a.id === areaId ? { ...a, status: 'in-progress', progress: 50 } : a
    ));

    setTimeout(() => {
      setResearchAreas(prev => prev.map(a => 
        a.id === areaId ? { ...a, status: 'complete', progress: 100 } : a
      ));
      setInnovations(prev => [...prev, area.name]);
    }, 2000);
  };

  const runExperiment = (experimentId: string, approach: string) => {
    const successRate = approach === 'rigorous' ? 0.9 : approach === 'balanced' ? 0.7 : 0.5;
    const success = Math.random() < successRate;
    
    setExperiments(prev => prev.map(e => 
      e.id === experimentId 
        ? { ...e, status: 'complete', success, impact: success ? (approach === 'rigorous' ? 85 : 70) : 30 }
        : e
    ));
  };

  const handleExperimentCrisis = (response: string) => {
    if (response === 'iterate') {
      setExperiments(prev => prev.map(e => 
        e.success === false ? { ...e, success: true, impact: 60 } : e
      ));
    } else if (response === 'pivot') {
      setInnovations(prev => [...prev, 'Adaptive Learning Framework']);
    }
    setChallengeHandled(true);
  };

  const launchPilot = (pilotId: string) => {
    setPilots(prev => prev.map(p => 
      p.id === pilotId 
        ? { ...p, status: 'active', participants: Math.floor(Math.random() * 100) + 50, results: 'positive' }
        : p
    ));
    setPilotLaunched(true);
  };

  const completeLevel = () => {
    setLevelComplete(true);
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-13-policy' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-12-innovation']
      });
    }, 2000);
  };

  const completedResearch = researchAreas.filter(r => r.status === 'complete').length;
  const completedExperiments = experiments.filter(e => e.status === 'complete').length;
  const activePilots = pilots.filter(p => p.status === 'active').length;
  const successfulExperiments = experiments.filter(e => e.success === true).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            🔬 Level 12: Innovation Lab
          </h1>
          <p className="text-2xl text-cyan-200">
            Research new methods and pilot innovative solutions
          </p>
        </div>

        {/* Innovation Dashboard */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Research Complete</div>
            <div className="text-4xl font-bold text-blue-400">{completedResearch}/{researchAreas.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Successful Experiments</div>
            <div className="text-4xl font-bold text-green-400">{successfulExperiments}/{experiments.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Active Pilots</div>
            <div className="text-4xl font-bold text-purple-400">{activePilots}/{pilots.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Research Budget</div>
            <div className="text-4xl font-bold text-yellow-400">${(budget / 1000).toFixed(0)}K</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('research')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'research'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🔬 Research
          </button>
          <button
            onClick={() => setSelectedTab('experiments')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'experiments'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🧪 Experiments
          </button>
          <button
            onClick={() => setSelectedTab('pilots')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'pilots'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🚀 Pilot Programs
          </button>
          <button
            onClick={() => setSelectedTab('results')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'results'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📊 Results
          </button>
        </div>

        {/* Research Tab */}
        {selectedTab === 'research' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🔬 Research & Development</h3>
              <p className="text-lg mb-6 opacity-90">
                Fund cutting-edge research to discover innovative restoration techniques.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {researchAreas.map(area => (
                  <div key={area.id} className="bg-black/30 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold">{area.name}</h4>
                        <div className="text-sm opacity-75">Cost: ${(area.cost / 1000).toFixed(0)}K</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        area.status === 'complete' ? 'bg-green-500' :
                        area.status === 'in-progress' ? 'bg-yellow-500' :
                        'bg-gray-600'
                      }`}>
                        {area.status === 'complete' ? '✓ Complete' :
                         area.status === 'in-progress' ? '⏳ In Progress' :
                         'Available'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Impact Potential</span>
                        <span className="font-bold">{area.potential}%</span>
                      </div>
                      <div className="bg-black/40 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
                          style={{ width: `${area.potential}%` }}
                        ></div>
                      </div>
                    </div>

                    {area.status === 'in-progress' && (
                      <div className="mb-3">
                        <div className="text-sm opacity-75 mb-1">Research Progress</div>
                        <div className="bg-black/40 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full animate-pulse"
                            style={{ width: `${area.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {area.status === 'available' && budget >= area.cost && (
                      <button
                        onClick={() => fundResearch(area.id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold hover:scale-105 transition-all"
                      >
                        Fund Research
                      </button>
                    )}

                    {area.status === 'available' && budget < area.cost && (
                      <div className="text-center text-sm text-red-400">
                        Insufficient Budget
                      </div>
                    )}

                    {area.status === 'complete' && (
                      <div className="bg-green-500/20 border border-green-400 rounded-lg p-2 text-center text-sm">
                        ✅ Research Completed - Innovation Unlocked!
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {innovations.length > 0 && (
                <div className="mt-6 bg-blue-500/20 border border-blue-400 rounded-xl p-4">
                  <h4 className="font-bold mb-2">🎉 Innovations Unlocked:</h4>
                  <div className="flex flex-wrap gap-2">
                    {innovations.map((innovation, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500 rounded-full text-sm">
                        {innovation}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experiments Tab */}
        {selectedTab === 'experiments' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🧪 Field Experiments</h3>
              <p className="text-lg mb-6 opacity-90">
                Test new restoration approaches through controlled experiments.
              </p>

              <div className="space-y-4 mb-6">
                {experiments.map(experiment => (
                  <div key={experiment.id} className="bg-black/30 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold">{experiment.name}</h4>
                      </div>
                      {experiment.status === 'complete' && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          experiment.success ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {experiment.success ? '✓ Success' : '✗ Failed'}
                        </span>
                      )}
                    </div>

                    {experiment.status === 'not-started' && (
                      <div className="grid md:grid-cols-3 gap-3">
                        <button
                          onClick={() => runExperiment(experiment.id, 'rigorous')}
                          className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">🔬 Rigorous Protocol</div>
                          <div className="text-xs opacity-75 mt-1">90% success rate</div>
                          <div className="text-xs text-green-400 mt-1">High impact if successful</div>
                        </button>
                        <button
                          onClick={() => runExperiment(experiment.id, 'balanced')}
                          className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">⚖️ Balanced Approach</div>
                          <div className="text-xs opacity-75 mt-1">70% success rate</div>
                          <div className="text-xs text-yellow-400 mt-1">Moderate impact</div>
                        </button>
                        <button
                          onClick={() => runExperiment(experiment.id, 'quick')}
                          className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">⚡ Quick Test</div>
                          <div className="text-xs opacity-75 mt-1">50% success rate</div>
                          <div className="text-xs text-red-400 mt-1">Lower impact</div>
                        </button>
                      </div>
                    )}

                    {experiment.status === 'complete' && (
                      <div className={`border rounded-lg p-3 ${
                        experiment.success 
                          ? 'bg-green-500/20 border-green-400' 
                          : 'bg-red-500/20 border-red-400'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span>Impact Score:</span>
                          <span className="font-bold text-xl">{experiment.impact}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!experimentChallenge && completedExperiments >= 2 && !challengeHandled && (
                <div className="text-center">
                  <button
                    onClick={() => setExperimentChallenge(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold hover:scale-105 transition-all"
                  >
                    ⚠️ Handle Experiment Failure
                  </button>
                </div>
              )}

              {experimentChallenge && !challengeHandled && (
                <div className="bg-orange-500/20 border-2 border-orange-400 rounded-xl p-6">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h4 className="text-2xl font-bold mb-4">Experiment Setback</h4>
                  <p className="text-lg mb-4">
                    One of your experiments failed. How do you respond to this setback?
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleExperimentCrisis('iterate')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">🔄</div>
                      <div className="font-bold">Iterate & Improve</div>
                      <div className="text-sm opacity-75 mt-2">
                        Learn from failure, refine approach, try again
                      </div>
                      <div className="text-xs text-green-400 mt-2">✓ Convert failure to success</div>
                    </button>
                    <button
                      onClick={() => handleExperimentCrisis('pivot')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="font-bold">Pivot Strategy</div>
                      <div className="text-sm opacity-75 mt-2">
                        Use insights to develop new approach
                      </div>
                      <div className="text-xs text-blue-400 mt-2">✓ Unlock adaptive framework</div>
                    </button>
                    <button
                      onClick={() => handleExperimentCrisis('accept')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">✅</div>
                      <div className="font-bold">Accept & Document</div>
                      <div className="text-sm opacity-75 mt-2">
                        Document failure as valuable learning
                      </div>
                      <div className="text-xs text-yellow-400 mt-2">⚠ Add to knowledge base</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pilot Programs Tab */}
        {selectedTab === 'pilots' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🚀 Pilot Programs</h3>
              <p className="text-lg mb-6 opacity-90">
                Launch pilot programs to test innovations at scale with community involvement.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {pilots.map(pilot => (
                  <div key={pilot.id} className="bg-black/30 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold">{pilot.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        pilot.status === 'active' ? 'bg-green-500' :
                        pilot.status === 'planning' ? 'bg-blue-500' :
                        'bg-gray-600'
                      }`}>
                        {pilot.status === 'active' ? '✓ Active' : '📋 Planning'}
                      </span>
                    </div>

                    {pilot.status === 'planning' && completedResearch >= 2 && (
                      <button
                        onClick={() => launchPilot(pilot.id)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-bold hover:scale-105 transition-all"
                      >
                        Launch Pilot
                      </button>
                    )}

                    {pilot.status === 'planning' && completedResearch < 2 && (
                      <div className="text-center text-sm text-yellow-400">
                        Complete more research first
                      </div>
                    )}

                    {pilot.status === 'active' && (
                      <div>
                        <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 mb-3">
                          <div className="flex justify-between text-sm">
                            <span>Participants:</span>
                            <span className="font-bold">{pilot.participants}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span>Results:</span>
                            <span className="font-bold text-green-400 capitalize">{pilot.results}</span>
                          </div>
                        </div>
                        <div className="text-xs opacity-75 text-center">
                          Pilot showing promising results!
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {activePilots >= 2 && (
                <div className="mt-6 bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <h4 className="text-2xl font-bold">Multiple Pilots Running Successfully!</h4>
                  <p className="opacity-90 mt-2">Your innovations are being tested in the field.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {selectedTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📊 Innovation Impact</h3>
              <p className="text-lg mb-6 opacity-90">
                Review the outcomes of your research, experiments, and pilot programs.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/30 rounded-xl p-5">
                  <h4 className="text-xl font-bold mb-4 text-blue-400">Research Outcomes</h4>
                  <div className="space-y-3">
                    {researchAreas.filter(r => r.status === 'complete').map(area => (
                      <div key={area.id} className="flex justify-between items-center">
                        <span className="text-sm">{area.name}</span>
                        <span className="text-green-400 font-bold">+{area.potential}% potential</span>
                      </div>
                    ))}
                    {researchAreas.filter(r => r.status === 'complete').length === 0 && (
                      <div className="text-sm opacity-50">No completed research yet</div>
                    )}
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-5">
                  <h4 className="text-xl font-bold mb-4 text-green-400">Experiment Results</h4>
                  <div className="space-y-3">
                    {experiments.filter(e => e.status === 'complete').map(exp => (
                      <div key={exp.id} className="flex justify-between items-center">
                        <span className="text-sm">{exp.name}</span>
                        <span className={`font-bold ${exp.success ? 'text-green-400' : 'text-red-400'}`}>
                          {exp.success ? `+${exp.impact}% impact` : 'Learning opportunity'}
                        </span>
                      </div>
                    ))}
                    {experiments.filter(e => e.status === 'complete').length === 0 && (
                      <div className="text-sm opacity-50">No completed experiments yet</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/20 border border-purple-400 rounded-xl p-6">
                <h4 className="text-xl font-bold mb-4">🌟 Innovation Portfolio</h4>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-4xl font-bold text-blue-400">{completedResearch}</div>
                    <div className="text-sm opacity-75">Research Completed</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-400">{successfulExperiments}</div>
                    <div className="text-sm opacity-75">Successful Experiments</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-400">{activePilots}</div>
                    <div className="text-sm opacity-75">Active Pilots</div>
                  </div>
                </div>
              </div>

              {completedResearch >= 2 && successfulExperiments >= 1 && pilotLaunched && challengeHandled && (
                <div className="mt-6 text-center">
                  <button
                    onClick={completeLevel}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                  >
                    🎉 Complete Innovation Lab
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transition Message */}
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">🔬</div>
              <h2 className="text-5xl font-bold mb-4">Innovation Mastered!</h2>
              <p className="text-2xl opacity-80">
                Moving to final celebration...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 13: Policy Maker Component
function Level13Policy({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [selectedTab, setSelectedTab] = useState<'gaps' | 'advocacy' | 'legislation' | 'impact'>('gaps');
  const [policyGaps, setPolicyGaps] = useState([
    { id: 'wetland', name: 'Wetland Protection Gaps', severity: 'high', status: 'identified', support: 0 },
    { id: 'pollution', name: 'Point-Source Pollution Rules', severity: 'high', status: 'identified', support: 0 },
    { id: 'funding', name: 'Restoration Funding Mechanism', severity: 'medium', status: 'identified', support: 0 },
    { id: 'enforcement', name: 'Enforcement Authority', severity: 'medium', status: 'identified', support: 0 },
  ]);

  const [advocacyCampaigns, setAdvocacyCampaigns] = useState([
    { id: 'c1', name: 'Wetland Coalition Building', status: 'planning', reach: 0, impact: 0 },
    { id: 'c2', name: 'Public Awareness Campaign', status: 'planning', reach: 0, impact: 0 },
    { id: 'c3', name: 'Legislative Champion Recruitment', status: 'planning', reach: 0, impact: 0 },
  ]);

  const [legislation, setLegislation] = useState([
    { id: 'bill1', name: 'River Restoration Act', stage: 'drafting', votes: 0, passed: null },
    { id: 'bill2', name: 'Green Infrastructure Fund', stage: 'drafting', votes: 0, passed: null },
  ]);

  const [policyChallenge, setPolicyChallenge] = useState(false);
  const [challengeHandled, setChallengeHandled] = useState(false);
  const [billIntroduced, setBillIntroduced] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const buildSupportForGap = (gapId: string) => {
    setPolicyGaps(prev => prev.map(g => 
      g.id === gapId ? { ...g, status: 'building-support', support: 50 } : g
    ));

    setTimeout(() => {
      setPolicyGaps(prev => prev.map(g => 
        g.id === gapId ? { ...g, status: 'ready', support: 85 } : g
      ));
    }, 1500);
  };

  const launchCampaign = (campaignId: string, strategy: string) => {
    const reach = strategy === 'grassroots' ? 5000 : strategy === 'coalition' ? 3000 : 1500;
    const impact = strategy === 'grassroots' ? 80 : strategy === 'coalition' ? 90 : 60;

    setAdvocacyCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: 'active', reach, impact } : c
    ));
  };

  const handlePolicyChallenge = (response: string) => {
    if (response === 'negotiate') {
      setLegislation(prev => prev.map(l => ({ ...l, votes: l.votes + 30 })));
    } else if (response === 'educate') {
      setAdvocacyCampaigns(prev => prev.map(c => 
        c.status === 'active' ? { ...c, impact: c.impact + 15 } : c
      ));
    } else if (response === 'pressure') {
      setLegislation(prev => prev.map(l => ({ ...l, votes: l.votes + 20 })));
    }
    setChallengeHandled(true);
  };

  const introduceBill = (billId: string) => {
    setLegislation(prev => prev.map(l => 
      l.id === billId ? { ...l, stage: 'committee' } : l
    ));

    setTimeout(() => {
      setLegislation(prev => prev.map(l => 
        l.id === billId ? { ...l, stage: 'floor-vote', votes: 45 } : l
      ));
    }, 1500);

    setTimeout(() => {
      const passed = Math.random() > 0.3;
      setLegislation(prev => prev.map(l => 
        l.id === billId ? { ...l, stage: 'completed', votes: passed ? 65 : 40, passed } : l
      ));
    }, 3000);

    setBillIntroduced(true);
  };

  const completeLevel = () => {
    setLevelComplete(true);
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-14-mentor' as GamePhase,
        completedPhases: [...(progress.completedPhases || []), 'level-13-policy']
      });
    }, 2000);
  };

  const gapsAddressed = policyGaps.filter(g => g.status === 'ready').length;
  const activeCampaigns = advocacyCampaigns.filter(c => c.status === 'active').length;
  const billsPassed = legislation.filter(l => l.passed === true).length;
  const totalReach = advocacyCampaigns.reduce((sum, c) => sum + c.reach, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            🏛️ Level 13: Policy Maker
          </h1>
          <p className="text-2xl text-orange-200">
            Shape policy, build coalitions, and drive systemic change
          </p>
        </div>

        {/* Policy Dashboard */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Policy Gaps Addressed</div>
            <div className="text-4xl font-bold text-red-400">{gapsAddressed}/{policyGaps.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Active Campaigns</div>
            <div className="text-4xl font-bold text-orange-400">{activeCampaigns}/{advocacyCampaigns.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Total Reach</div>
            <div className="text-4xl font-bold text-yellow-400">{(totalReach / 1000).toFixed(1)}K</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Bills Passed</div>
            <div className="text-4xl font-bold text-green-400">{billsPassed}/{legislation.length}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('gaps')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'gaps'
                ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🔍 Policy Gaps
          </button>
          <button
            onClick={() => setSelectedTab('advocacy')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'advocacy'
                ? 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📢 Advocacy
          </button>
          <button
            onClick={() => setSelectedTab('legislation')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'legislation'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📜 Legislation
          </button>
          <button
            onClick={() => setSelectedTab('impact')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedTab === 'impact'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📊 Policy Impact
          </button>
        </div>

        {/* Policy Gaps Tab */}
        {selectedTab === 'gaps' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">🔍 Identify & Address Policy Gaps</h3>
              <p className="text-lg mb-6 opacity-90">
                Analyze existing policies to find gaps that prevent effective restoration.
              </p>

              <div className="space-y-4">
                {policyGaps.map(gap => (
                  <div key={gap.id} className="bg-black/30 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold">{gap.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          gap.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'
                        }`}>
                          {gap.severity === 'high' ? '🔥 High Priority' : '⚠️ Medium Priority'}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        gap.status === 'ready' ? 'bg-green-500' :
                        gap.status === 'building-support' ? 'bg-yellow-500' :
                        'bg-gray-600'
                      }`}>
                        {gap.status === 'ready' ? '✓ Ready' :
                         gap.status === 'building-support' ? '⏳ Building Support' :
                         'Identified'}
                      </span>
                    </div>

                    {gap.status !== 'identified' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Support Level</span>
                          <span className="font-bold">{gap.support}%</span>
                        </div>
                        <div className="bg-black/40 rounded-full h-3">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              gap.status === 'building-support' 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse'
                                : 'bg-gradient-to-r from-green-400 to-emerald-500'
                            }`}
                            style={{ width: `${gap.support}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {gap.status === 'identified' && (
                      <button
                        onClick={() => buildSupportForGap(gap.id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg font-bold hover:scale-105 transition-all"
                      >
                        Build Coalition Support
                      </button>
                    )}

                    {gap.status === 'ready' && (
                      <div className="bg-green-500/20 border border-green-400 rounded-lg p-2 text-center text-sm">
                        ✅ Ready for Legislative Action
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Advocacy Tab */}
        {selectedTab === 'advocacy' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📢 Advocacy Campaigns</h3>
              <p className="text-lg mb-6 opacity-90">
                Build public support and mobilize stakeholders for policy change.
              </p>

              <div className="space-y-4 mb-6">
                {advocacyCampaigns.map(campaign => (
                  <div key={campaign.id} className="bg-black/30 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold">{campaign.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        campaign.status === 'active' ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {campaign.status === 'active' ? '✓ Active' : '📋 Planning'}
                      </span>
                    </div>

                    {campaign.status === 'planning' && (
                      <div className="grid md:grid-cols-3 gap-3">
                        <button
                          onClick={() => launchCampaign(campaign.id, 'grassroots')}
                          className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">🌱 Grassroots</div>
                          <div className="text-xs opacity-75 mt-1">5K reach, 80% impact</div>
                          <div className="text-xs text-green-400 mt-1">Broad community support</div>
                        </button>
                        <button
                          onClick={() => launchCampaign(campaign.id, 'coalition')}
                          className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">🤝 Coalition</div>
                          <div className="text-xs opacity-75 mt-1">3K reach, 90% impact</div>
                          <div className="text-xs text-blue-400 mt-1">Strong organizational backing</div>
                        </button>
                        <button
                          onClick={() => launchCampaign(campaign.id, 'media')}
                          className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all text-sm"
                        >
                          <div className="font-bold">📺 Media</div>
                          <div className="text-xs opacity-75 mt-1">1.5K reach, 60% impact</div>
                          <div className="text-xs text-yellow-400 mt-1">High visibility</div>
                        </button>
                      </div>
                    )}

                    {campaign.status === 'active' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-500/20 border border-green-400 rounded-lg p-3">
                          <div className="text-sm opacity-75">Reach</div>
                          <div className="text-2xl font-bold">{campaign.reach.toLocaleString()}</div>
                        </div>
                        <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3">
                          <div className="text-sm opacity-75">Impact</div>
                          <div className="text-2xl font-bold">{campaign.impact}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!policyChallenge && activeCampaigns >= 2 && !challengeHandled && (
                <div className="text-center">
                  <button
                    onClick={() => setPolicyChallenge(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold hover:scale-105 transition-all"
                  >
                    ⚠️ Handle Opposition
                  </button>
                </div>
              )}

              {policyChallenge && !challengeHandled && (
                <div className="bg-orange-500/20 border-2 border-orange-400 rounded-xl p-6">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h4 className="text-2xl font-bold mb-4">Industry Opposition</h4>
                  <p className="text-lg mb-4">
                    A powerful industry group is lobbying against your policy proposal. How do you respond?
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handlePolicyChallenge('negotiate')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">🤝</div>
                      <div className="font-bold">Negotiate Compromise</div>
                      <div className="text-sm opacity-75 mt-2">
                        Find middle ground, gain moderate support
                      </div>
                      <div className="text-xs text-green-400 mt-2">✓ +30 votes</div>
                    </button>
                    <button
                      onClick={() => handlePolicyChallenge('educate')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">📚</div>
                      <div className="font-bold">Public Education</div>
                      <div className="text-sm opacity-75 mt-2">
                        Increase campaign impact with facts
                      </div>
                      <div className="text-xs text-blue-400 mt-2">✓ +15% campaign impact</div>
                    </button>
                    <button
                      onClick={() => handlePolicyChallenge('pressure')}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all text-left"
                    >
                      <div className="text-3xl mb-2">💪</div>
                      <div className="font-bold">Apply Pressure</div>
                      <div className="text-sm opacity-75 mt-2">
                        Mobilize supporters, demand action
                      </div>
                      <div className="text-xs text-yellow-400 mt-2">⚠ +20 votes, risk backlash</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legislation Tab */}
        {selectedTab === 'legislation' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📜 Legislative Process</h3>
              <p className="text-lg mb-6 opacity-90">
                Navigate the legislative process to turn policy ideas into law.
              </p>

              <div className="space-y-4">
                {legislation.map(bill => (
                  <div key={bill.id} className="bg-black/30 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-bold">{bill.name}</h4>
                        <div className="text-sm opacity-75 mt-1">Legislative Stage: 
                          <span className="font-bold capitalize ml-1">
                            {bill.stage.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      {bill.passed !== null && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          bill.passed ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {bill.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex gap-2 mb-3">
                        {['drafting', 'committee', 'floor-vote', 'completed'].map((stage, idx) => (
                          <div key={stage} className="flex-1">
                            <div className={`h-2 rounded-full ${
                              bill.stage === stage || idx < ['drafting', 'committee', 'floor-vote', 'completed'].indexOf(bill.stage)
                                ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                                : 'bg-gray-600'
                            }`}></div>
                            <div className="text-xs mt-1 capitalize">{stage.replace('-', ' ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {bill.stage === 'floor-vote' && (
                      <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3 mb-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Current Support</span>
                          <span className="font-bold">{bill.votes}/100 votes</span>
                        </div>
                        <div className="bg-black/40 rounded-full h-3">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              bill.votes >= 51 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-red-400 to-orange-500'
                            }`}
                            style={{ width: `${bill.votes}%` }}
                          ></div>
                        </div>
                        <div className="text-xs mt-2 opacity-75">Need 51 votes to pass</div>
                      </div>
                    )}

                    {bill.stage === 'drafting' && gapsAddressed >= 2 && (
                      <button
                        onClick={() => introduceBill(bill.id)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold hover:scale-105 transition-all"
                      >
                        Introduce Bill to Legislature
                      </button>
                    )}

                    {bill.stage === 'drafting' && gapsAddressed < 2 && (
                      <div className="text-center text-sm text-yellow-400">
                        Build more support before introducing bill
                      </div>
                    )}

                    {bill.passed === true && (
                      <div className="bg-green-500/20 border-2 border-green-400 rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">🎉</div>
                        <div className="font-bold">Bill Signed Into Law!</div>
                        <div className="text-sm opacity-90 mt-1">Your policy will create lasting change</div>
                      </div>
                    )}

                    {bill.passed === false && (
                      <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 text-center text-sm">
                        Bill did not receive enough support. Consider revisions.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Policy Impact Tab */}
        {selectedTab === 'impact' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">📊 Policy Impact Assessment</h3>
              <p className="text-lg mb-6 opacity-90">
                Measure the systemic impact of your policy work.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/30 rounded-xl p-5">
                  <h4 className="text-xl font-bold mb-4 text-red-400">Policy Gaps</h4>
                  <div className="space-y-3">
                    {policyGaps.map(gap => (
                      <div key={gap.id} className="flex justify-between items-center">
                        <span className="text-sm">{gap.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          gap.status === 'ready' ? 'bg-green-500' :
                          gap.status === 'building-support' ? 'bg-yellow-500' :
                          'bg-gray-600'
                        }`}>
                          {gap.status === 'ready' ? 'Ready' :
                           gap.status === 'building-support' ? 'In Progress' :
                           'Identified'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-5">
                  <h4 className="text-xl font-bold mb-4 text-orange-400">Advocacy Reach</h4>
                  <div className="space-y-3">
                    {advocacyCampaigns.map(campaign => (
                      <div key={campaign.id} className="flex justify-between items-center">
                        <span className="text-sm">{campaign.name}</span>
                        <span className="font-bold text-green-400">
                          {campaign.status === 'active' ? `${(campaign.reach / 1000).toFixed(1)}K` : 'Planned'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-400 rounded-xl p-6">
                <h4 className="text-2xl font-bold mb-4">🌟 Systemic Change Potential</h4>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-4xl font-bold text-red-400">{gapsAddressed}</div>
                    <div className="text-sm opacity-75">Gaps Addressed</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-orange-400">{(totalReach / 1000).toFixed(1)}K</div>
                    <div className="text-sm opacity-75">People Reached</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-400">{billsPassed}</div>
                    <div className="text-sm opacity-75">Laws Passed</div>
                  </div>
                </div>
              </div>

              {gapsAddressed >= 2 && activeCampaigns >= 2 && billIntroduced && challengeHandled && (
                <div className="mt-6 text-center">
                  <button
                    onClick={completeLevel}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                  >
                    🎉 Complete Policy Maker
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transition Message */}
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">🏛️</div>
              <h2 className="text-5xl font-bold mb-4">Policy Change Achieved!</h2>
              <p className="text-2xl opacity-80">
                Moving to mentorship phase...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 14: The Mentor - Teaching & Knowledge Transfer
function Level14Mentor({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'workshops' | 'trainers' | 'impact'>('curriculum');
  const [courses, setCourses] = useState(new Map([
    ['course-1', { id: 'course-1', name: 'Ecosystem Restoration Basics', modules: 0, students: 0, status: 'draft' as const, completion: 0 }],
    ['course-2', { id: 'course-2', name: 'Systems Thinking Workshop', modules: 0, students: 0, status: 'draft' as const, completion: 0 }],
    ['course-3', { id: 'course-3', name: 'Stakeholder Engagement', modules: 0, students: 0, status: 'draft' as const, completion: 0 }],
    ['course-4', { id: 'course-4', name: 'Policy & Advocacy Training', modules: 0, students: 0, status: 'draft' as const, completion: 0 }],
  ]));
  const [workshops, setWorkshops] = useState(new Map([
    ['workshop-1', { id: 'workshop-1', name: 'Field Assessment Training', participants: 0, status: 'planning' as const, satisfaction: 0 }],
    ['workshop-2', { id: 'workshop-2', name: 'Data Collection Methods', participants: 0, status: 'planning' as const, satisfaction: 0 }],
    ['workshop-3', { id: 'workshop-3', name: 'Community Facilitation', participants: 0, status: 'planning' as const, satisfaction: 0 }],
  ]));
  const [trainers, setTrainers] = useState(new Map([
    ['trainer-1', { id: 'trainer-1', name: 'Sarah Chen', expertise: 'Ecology', level: 'beginner' as const, certified: false, trainees: 0 }],
    ['trainer-2', { id: 'trainer-2', name: 'Marcus Reid', expertise: 'Community', level: 'beginner' as const, certified: false, trainees: 0 }],
    ['trainer-3', { id: 'trainer-3', name: 'Elena Vasquez', expertise: 'Policy', level: 'beginner' as const, certified: false, trainees: 0 }],
  ]));
  const [knowledgeBase, setKnowledgeBase] = useState({
    articles: 8,
    videos: 5,
    casestudies: 3,
  });
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeResolved, setChallengeResolved] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const developCourse = (courseId: string) => {
    const course = courses.get(courseId);
    if (course && course.status === 'draft') {
      const newModules = Math.floor(Math.random() * 3) + 4; // 4-6 modules
      const updated = new Map(courses);
      updated.set(courseId, { ...course, modules: newModules, status: 'ready' });
      setCourses(updated);
    }
  };

  const launchCourse = (courseId: string) => {
    const course = courses.get(courseId);
    if (course && course.status === 'ready') {
      const newStudents = Math.floor(Math.random() * 30) + 20; // 20-50 students
      const updated = new Map(courses);
      updated.set(courseId, { ...course, students: newStudents, status: 'active', completion: 0 });
      setCourses(updated);
      
      setTimeout(() => {
        const completion = Math.floor(Math.random() * 20) + 70; // 70-90%
        const updated2 = new Map(courses);
        updated2.set(courseId, { ...course, students: newStudents, status: 'active', completion });
        setCourses(updated2);
      }, 2000);
    }
  };

  const deliverWorkshop = (workshopId: string) => {
    const workshop = workshops.get(workshopId);
    if (workshop && workshop.status === 'planning') {
      const updated = new Map(workshops);
      updated.set(workshopId, { ...workshop, status: 'in-progress' });
      setWorkshops(updated);
      
      setTimeout(() => {
        const participants = Math.floor(Math.random() * 15) + 15; // 15-30
        const satisfaction = Math.floor(Math.random() * 20) + 75; // 75-95%
        const updated2 = new Map(workshops);
        updated2.set(workshopId, { ...workshop, participants, satisfaction, status: 'completed' });
        setWorkshops(updated2);
      }, 2000);
    }
  };

  const trainTrainer = (trainerId: string) => {
    const trainer = trainers.get(trainerId);
    if (trainer) {
      const nextLevel = trainer.level === 'beginner' ? 'intermediate' : 'advanced';
      const updated = new Map(trainers);
      updated.set(trainerId, { ...trainer, level: nextLevel as any });
      setTrainers(updated);
      
      if (nextLevel === 'advanced') {
        setTimeout(() => {
          const updated2 = new Map(trainers);
          updated2.set(trainerId, { ...trainer, level: 'advanced', certified: true });
          setTrainers(updated2);
        }, 1000);
      }
    }
  };

  const assignTrainees = (trainerId: string) => {
    const trainer = trainers.get(trainerId);
    if (trainer && trainer.certified) {
      const newTrainees = Math.floor(Math.random() * 5) + 5; // 5-10 trainees
      const updated = new Map(trainers);
      updated.set(trainerId, { ...trainer, trainees: trainer.trainees + newTrainees });
      setTrainers(updated);
    }
  };

  const expandKnowledge = () => {
    setKnowledgeBase({
      articles: knowledgeBase.articles + Math.floor(Math.random() * 3) + 2,
      videos: knowledgeBase.videos + Math.floor(Math.random() * 2) + 1,
      casestudies: knowledgeBase.casestudies + 1,
    });
  };

  const triggerChallenge = () => {
    setShowChallenge(true);
  };

  const handleChallengeResponse = (approach: 'adapt' | 'support' | 'structure') => {
    setChallengeResolved(true);
    setShowChallenge(false);
    
    // Positive outcomes for all approaches
    if (approach === 'adapt') {
      const updated = new Map(courses);
      courses.forEach((course, id) => {
        if (course.status === 'active') {
          updated.set(id, { ...course, completion: Math.min(100, course.completion + 15) });
        }
      });
      setCourses(updated);
    } else if (approach === 'support') {
      const updated = new Map(workshops);
      workshops.forEach((workshop, id) => {
        if (workshop.status === 'completed') {
          updated.set(id, { ...workshop, satisfaction: Math.min(100, workshop.satisfaction + 10) });
        }
      });
      setWorkshops(updated);
    } else {
      expandKnowledge();
    }
  };

  const completeLevel = () => {
    setLevelComplete(true);
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'level-15-visionary',
        completedPhases: [...progress.completedPhases, 'level-14-mentor']
      });
    }, 3000);
  };

  const activeCourses = Array.from(courses.values()).filter(c => c.status === 'active').length;
  const completedWorkshops = Array.from(workshops.values()).filter(w => w.status === 'completed').length;
  const certifiedTrainers = Array.from(trainers.values()).filter(t => t.certified).length;
  const totalStudents = Array.from(courses.values()).reduce((sum, c) => sum + c.students, 0);
  const totalTrainees = Array.from(trainers.values()).reduce((sum, t) => sum + t.trainees, 0);
  const avgSatisfaction = Array.from(workshops.values())
    .filter(w => w.satisfaction > 0)
    .reduce((sum, w, _, arr) => sum + w.satisfaction / arr.length, 0);

  const canComplete = activeCourses >= 3 && completedWorkshops >= 2 && certifiedTrainers >= 2 && challengeResolved;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2">👨‍🏫 Level 14: The Mentor</h1>
              <p className="text-xl opacity-80">Share knowledge and build capacity for lasting change</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-yellow-400">{totalStudents + totalTrainees}</div>
              <div className="text-sm opacity-75">People Trained</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-500/20 rounded-xl p-4 border-2 border-blue-400">
              <div className="text-3xl font-bold text-blue-300">{activeCourses}</div>
              <div className="text-sm opacity-75">Active Courses</div>
            </div>
            <div className="bg-green-500/20 rounded-xl p-4 border-2 border-green-400">
              <div className="text-3xl font-bold text-green-300">{completedWorkshops}</div>
              <div className="text-sm opacity-75">Workshops Delivered</div>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-4 border-2 border-purple-400">
              <div className="text-3xl font-bold text-purple-300">{certifiedTrainers}</div>
              <div className="text-sm opacity-75">Certified Trainers</div>
            </div>
            <div className="bg-yellow-500/20 rounded-xl p-4 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300">{avgSatisfaction > 0 ? Math.round(avgSatisfaction) : 0}%</div>
              <div className="text-sm opacity-75">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'curriculum'
                ? 'bg-blue-500 text-white scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            📚 Curriculum Development
          </button>
          <button
            onClick={() => setActiveTab('workshops')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'workshops'
                ? 'bg-green-500 text-white scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🎯 Workshop Delivery
          </button>
          <button
            onClick={() => setActiveTab('trainers')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'trainers'
                ? 'bg-purple-500 text-white scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🎓 Train-the-Trainer
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'impact'
                ? 'bg-yellow-500 text-white scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            📊 Impact Assessment
          </button>
        </div>

        {/* Challenge Modal */}
        {showChallenge && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-3xl p-8 max-w-2xl border-4 border-red-500 text-white">
              <h3 className="text-3xl font-bold mb-4">🚨 Teaching Challenge!</h3>
              <p className="text-xl mb-6">
                Several students are struggling with complex concepts and showing frustration. 
                Workshop satisfaction scores are dropping. How do you respond?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleChallengeResponse('adapt')}
                  className="w-full p-4 bg-blue-600/40 hover:bg-blue-600 rounded-xl border-2 border-blue-400 text-left transition-all"
                >
                  <div className="font-bold mb-1">🔄 Adapt Teaching Methods</div>
                  <div className="text-sm opacity-90">Break down complex topics, use more hands-on activities</div>
                </button>
                <button
                  onClick={() => handleChallengeResponse('support')}
                  className="w-full p-4 bg-green-600/40 hover:bg-green-600 rounded-xl border-2 border-green-400 text-left transition-all"
                >
                  <div className="font-bold mb-1">🤝 Provide Extra Support</div>
                  <div className="text-sm opacity-90">Offer one-on-one mentoring and peer learning groups</div>
                </button>
                <button
                  onClick={() => handleChallengeResponse('structure')}
                  className="w-full p-4 bg-purple-600/40 hover:bg-purple-600 rounded-xl border-2 border-purple-400 text-left transition-all"
                >
                  <div className="font-bold mb-1">📖 Enhance Learning Resources</div>
                  <div className="text-sm opacity-90">Create visual guides, videos, and practice exercises</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'curriculum' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">📚 Course Development</h2>
              <button
                onClick={expandKnowledge}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl font-bold hover:scale-105 transition-all"
              >
                📖 Expand Knowledge Base
              </button>
            </div>

            <p className="text-lg mb-6 opacity-90">
              Develop comprehensive courses to educate the next generation of conservationists.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {Array.from(courses.values()).map(course => (
                <div key={course.id} className="bg-black/30 rounded-xl p-6 border-2 border-blue-400">
                  <h3 className="text-xl font-bold mb-3">{course.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`font-bold ${
                        course.status === 'active' ? 'text-green-400' :
                        course.status === 'ready' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {course.status === 'active' ? 'Active' : course.status === 'ready' ? 'Ready' : 'Draft'}
                      </span>
                    </div>
                    {course.modules > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Modules:</span>
                        <span className="font-bold text-blue-400">{course.modules}</span>
                      </div>
                    )}
                    {course.students > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Students:</span>
                        <span className="font-bold text-green-400">{course.students}</span>
                      </div>
                    )}
                    {course.completion > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion:</span>
                          <span className="font-bold text-yellow-400">{course.completion}%</span>
                        </div>
                        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                            style={{ width: `${course.completion}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {course.status === 'draft' && (
                    <button
                      onClick={() => developCourse(course.id)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all"
                    >
                      ✏️ Develop Course
                    </button>
                  )}
                  {course.status === 'ready' && (
                    <button
                      onClick={() => launchCourse(course.id)}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all"
                    >
                      🚀 Launch Course
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-2 border-purple-400 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">📚 Knowledge Base</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{knowledgeBase.articles}</div>
                  <div className="text-sm opacity-75">Articles</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400 mb-1">{knowledgeBase.videos}</div>
                  <div className="text-sm opacity-75">Video Tutorials</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{knowledgeBase.casestudies}</div>
                  <div className="text-sm opacity-75">Case Studies</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workshops' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">🎯 Hands-On Training</h2>
              {!showChallenge && !challengeResolved && completedWorkshops >= 1 && (
                <button
                  onClick={triggerChallenge}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl font-bold hover:scale-105 transition-all animate-pulse"
                >
                  ⚠️ Teaching Challenge
                </button>
              )}
            </div>

            <p className="text-lg mb-6 opacity-90">
              Deliver practical workshops that give participants real-world skills.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {Array.from(workshops.values()).map(workshop => (
                <div key={workshop.id} className="bg-black/30 rounded-xl p-6 border-2 border-green-400">
                  <h3 className="text-xl font-bold mb-3">{workshop.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`font-bold ${
                        workshop.status === 'completed' ? 'text-green-400' :
                        workshop.status === 'in-progress' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {workshop.status === 'completed' ? 'Completed' :
                         workshop.status === 'in-progress' ? 'In Progress' :
                         'Planning'}
                      </span>
                    </div>
                    {workshop.participants > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Participants:</span>
                        <span className="font-bold text-blue-400">{workshop.participants}</span>
                      </div>
                    )}
                    {workshop.satisfaction > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Satisfaction:</span>
                          <span className={`font-bold ${
                            workshop.satisfaction >= 85 ? 'text-green-400' :
                            workshop.satisfaction >= 70 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {workshop.satisfaction}%
                          </span>
                        </div>
                        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              workshop.satisfaction >= 85 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                              workshop.satisfaction >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-red-500 to-pink-500'
                            }`}
                            style={{ width: `${workshop.satisfaction}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {workshop.status === 'planning' && (
                    <button
                      onClick={() => deliverWorkshop(workshop.id)}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all"
                    >
                      🎯 Deliver Workshop
                    </button>
                  )}
                  {workshop.status === 'in-progress' && (
                    <div className="text-center py-2 text-yellow-400 font-bold animate-pulse">
                      ⏳ In Progress...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trainers' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">🎓 Building Teaching Capacity</h2>
            <p className="text-lg mb-6 opacity-90">
              Train others to become educators, creating a cascade of knowledge transfer.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {Array.from(trainers.values()).map(trainer => (
                <div key={trainer.id} className="bg-black/30 rounded-xl p-6 border-2 border-purple-400">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">{trainer.name}</h3>
                    {trainer.certified && <div className="text-2xl">🏆</div>}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Expertise:</span>
                      <span className="font-bold text-blue-400">{trainer.expertise}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Level:</span>
                      <span className={`font-bold ${
                        trainer.level === 'advanced' ? 'text-purple-400' :
                        trainer.level === 'intermediate' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {trainer.level.charAt(0).toUpperCase() + trainer.level.slice(1)}
                      </span>
                    </div>
                    {trainer.certified && (
                      <div className="flex justify-between text-sm">
                        <span>Trainees:</span>
                        <span className="font-bold text-green-400">{trainer.trainees}</span>
                      </div>
                    )}
                  </div>
                  {!trainer.certified && (
                    <button
                      onClick={() => trainTrainer(trainer.id)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-all"
                    >
                      📚 Train Trainer
                    </button>
                  )}
                  {trainer.certified && (
                    <button
                      onClick={() => assignTrainees(trainer.id)}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all"
                    >
                      👥 Assign Trainees
                    </button>
                  )}
                </div>
              ))}
            </div>

            {certifiedTrainers >= 2 && (
              <div className="mt-6 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-400 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-3">🌟 Multiplier Effect</h3>
                <p className="text-lg mb-2">
                  Your certified trainers are now teaching others, exponentially expanding your impact!
                </p>
                <div className="text-3xl font-bold text-green-400">
                  {totalTrainees} people trained through cascade
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">📊 Educational Impact</h2>
            <p className="text-lg mb-6 opacity-90">
              Measure the reach and effectiveness of your teaching programs.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-400">Course Metrics</h3>
                <div className="space-y-3">
                  {Array.from(courses.values()).map(course => (
                    <div key={course.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{course.name}</span>
                        <span className="font-bold text-green-400">{course.students} students</span>
                      </div>
                      {course.completion > 0 && (
                        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{ width: `${course.completion}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-green-400">Workshop Success</h3>
                <div className="space-y-3">
                  {Array.from(workshops.values()).map(workshop => (
                    <div key={workshop.id} className="flex justify-between items-center">
                      <span className="text-sm">{workshop.name}</span>
                      {workshop.satisfaction > 0 ? (
                        <span className={`font-bold ${
                          workshop.satisfaction >= 85 ? 'text-green-400' :
                          workshop.satisfaction >= 70 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {workshop.satisfaction}% satisfied
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Not delivered</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-400 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">🌟 Overall Teaching Impact</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-4xl font-bold text-blue-400 mb-1">{totalStudents}</div>
                  <div className="text-sm opacity-75">Total Students</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-4xl font-bold text-green-400 mb-1">{totalTrainees}</div>
                  <div className="text-sm opacity-75">Cascade Trainees</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-4xl font-bold text-purple-400 mb-1">
                    {knowledgeBase.articles + knowledgeBase.videos + knowledgeBase.casestudies}
                  </div>
                  <div className="text-sm opacity-75">Resources Created</div>
                </div>
              </div>
              
              {canComplete && (
                <div className="text-center">
                  <p className="text-lg mb-4">
                    ✨ You've built a comprehensive education program that will continue teaching long after you're gone!
                  </p>
                  <button
                    onClick={completeLevel}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                  >
                    🎉 Complete Mentorship Level
                  </button>
                </div>
              )}
              {!canComplete && (
                <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-xl p-4">
                  <p className="text-sm">
                    <strong>To complete:</strong> Launch 3+ courses, deliver 2+ workshops, certify 2+ trainers, and handle the teaching challenge
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transition Message */}
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">👨‍🏫</div>
              <h2 className="text-5xl font-bold mb-4">Knowledge Transferred!</h2>
              <p className="text-2xl opacity-80">
                Becoming the visionary leader...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 15: The Visionary - Building a Movement & Global Impact
function Level15Visionary({ progress, setProgress }: { progress: GameProgress; setProgress: (p: GameProgress) => void }) {
  const [activeTab, setActiveTab] = useState<'movement' | 'organization' | 'global' | 'legacy'>('movement');
  const [chapters, setChapters] = useState(new Map([
    ['chapter-1', { id: 'chapter-1', name: 'Urban Watershed Alliance', location: 'Local', members: 0, status: 'forming' as const, impact: 0 }],
    ['chapter-2', { id: 'chapter-2', name: 'Regional Rivers Coalition', location: 'Regional', members: 0, status: 'forming' as const, impact: 0 }],
    ['chapter-3', { id: 'chapter-3', name: 'National Water Network', location: 'National', members: 0, status: 'forming' as const, impact: 0 }],
  ]));
  const [leaders, setLeaders] = useState(new Map([
    ['leader-1', { id: 'leader-1', name: 'Maya Patel', role: 'Regional Coordinator', trained: false, leading: 0 }],
    ['leader-2', { id: 'leader-2', name: 'James Liu', role: 'Community Organizer', trained: false, leading: 0 }],
    ['leader-3', { id: 'leader-3', name: 'Aisha Mohammed', role: 'Policy Advocate', trained: false, leading: 0 }],
    ['leader-4', { id: 'leader-4', name: 'Carlos Fernandez', role: 'Technical Lead', trained: false, leading: 0 }],
  ]));
  const [partnerships, setPartnerships] = useState(new Map([
    ['partner-1', { id: 'partner-1', name: 'Global Water Foundation', type: 'NGO', status: 'initial' as const, funding: 0 }],
    ['partner-2', { id: 'partner-2', name: 'EcoTech Solutions', type: 'Corporate', status: 'initial' as const, funding: 0 }],
    ['partner-3', { id: 'partner-3', name: 'International Rivers Network', type: 'Network', status: 'initial' as const, funding: 0 }],
  ]));
  const [vision, setVision] = useState({
    statement: '',
    goals: [] as string[],
    timeline: 0,
    funding: 0,
  });
  const [globalProjects, setGlobalProjects] = useState(0);
  const [ecosystemsRestored, setEcosystemsRestored] = useState(12); // From previous levels
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeResolved, setChallengeResolved] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const launchChapter = (chapterId: string) => {
    const chapter = chapters.get(chapterId);
    if (chapter && chapter.status === 'forming') {
      const newMembers = Math.floor(Math.random() * 100) + 50; // 50-150 members
      const updated = new Map(chapters);
      updated.set(chapterId, { ...chapter, members: newMembers, status: 'active' });
      setChapters(updated);
      
      setTimeout(() => {
        const impact = Math.floor(Math.random() * 5) + 3; // 3-8 projects
        const updated2 = new Map(chapters);
        updated2.set(chapterId, { ...chapter, members: newMembers, status: 'active', impact });
        setChapters(updated2);
        setGlobalProjects(prev => prev + impact);
        setEcosystemsRestored(prev => prev + Math.floor(Math.random() * 3) + 2);
      }, 2000);
    }
  };

  const developLeader = (leaderId: string) => {
    const leader = leaders.get(leaderId);
    if (leader && !leader.trained) {
      const updated = new Map(leaders);
      updated.set(leaderId, { ...leader, trained: true });
      setLeaders(updated);
      
      setTimeout(() => {
        const leading = Math.floor(Math.random() * 3) + 2; // 2-5 chapters
        const updated2 = new Map(leaders);
        updated2.set(leaderId, { ...leader, trained: true, leading });
        setLeaders(updated2);
      }, 1500);
    }
  };

  const buildPartnership = (partnerId: string) => {
    const partner = partnerships.get(partnerId);
    if (partner) {
      const nextStatus = partner.status === 'initial' ? 'collaborating' : 'strategic';
      const newFunding = partner.status === 'initial' ? 
        Math.floor(Math.random() * 50000) + 50000 : // $50K-100K
        Math.floor(Math.random() * 200000) + 200000; // $200K-400K
      
      const updated = new Map(partnerships);
      updated.set(partnerId, { ...partner, status: nextStatus as any, funding: partner.funding + newFunding });
      setPartnerships(updated);
      
      setVision(prev => ({ ...prev, funding: prev.funding + newFunding }));
    }
  };

  const createVisionStatement = () => {
    setVision({
      statement: 'To create a global network of thriving ecosystems where communities and nature flourish together, ensuring healthy watersheds for generations to come.',
      goals: [
        'Restore 1000 ecosystems worldwide',
        'Train 10,000 conservation leaders',
        'Influence national water policies',
        'Build self-sustaining local chapters',
        'Create accessible education resources'
      ],
      timeline: 10, // 10-year vision
      funding: vision.funding,
    });
  };

  const expandGlobally = () => {
    const newChapters = Math.floor(Math.random() * 5) + 3; // 3-8 new chapters
    const newProjects = Math.floor(Math.random() * 10) + 10; // 10-20 projects
    setGlobalProjects(prev => prev + newProjects);
    setEcosystemsRestored(prev => prev + Math.floor(Math.random() * 8) + 5);
    
    // Add new international chapters
    const internationalLocations = ['Europe', 'Asia', 'Africa', 'South America', 'Australia'];
    const updated = new Map(chapters);
    for (let i = 0; i < Math.min(newChapters, 5); i++) {
      const location = internationalLocations[i];
      const id = `chapter-international-${i + 1}`;
      if (!updated.has(id)) {
        updated.set(id, {
          id,
          name: `${location} Water Alliance`,
          location,
          members: Math.floor(Math.random() * 80) + 40,
          status: 'active' as const,
          impact: Math.floor(Math.random() * 4) + 2,
        });
      }
    }
    setChapters(updated);
  };

  const triggerChallenge = () => {
    setShowChallenge(true);
  };

  const handleChallengeResponse = (approach: 'values' | 'structure' | 'sustainable') => {
    setChallengeResolved(true);
    setShowChallenge(false);
    
    // All approaches are positive
    if (approach === 'values') {
      createVisionStatement();
    } else if (approach === 'structure') {
      const updated = new Map(leaders);
      leaders.forEach((leader, id) => {
        if (leader.trained) {
          updated.set(id, { ...leader, leading: leader.leading + 2 });
        }
      });
      setLeaders(updated);
    } else {
      expandGlobally();
    }
  };

  const completeLevel = () => {
    setLevelComplete(true);
    setTimeout(() => {
      setProgress({
        ...progress,
        phase: 'completion',
        completedPhases: [...progress.completedPhases, 'level-15-visionary']
      });
    }, 3000);
  };

  const activeChapters = Array.from(chapters.values()).filter(c => c.status === 'active').length;
  const totalMembers = Array.from(chapters.values()).reduce((sum, c) => sum + c.members, 0);
  const trainedLeaders = Array.from(leaders.values()).filter(l => l.trained).length;
  const strategicPartners = Array.from(partnerships.values()).filter(p => p.status === 'strategic').length;
  const totalFunding = Array.from(partnerships.values()).reduce((sum, p) => sum + p.funding, 0);

  const canComplete = activeChapters >= 4 && trainedLeaders >= 3 && vision.statement !== '' && challengeResolved && strategicPartners >= 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2">🌍 Level 15: The Visionary</h1>
              <p className="text-xl opacity-80">Build a global movement for lasting environmental change</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-yellow-400">{ecosystemsRestored}</div>
              <div className="text-sm opacity-75">Ecosystems Restored</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-500/20 rounded-xl p-4 border-2 border-blue-400">
              <div className="text-3xl font-bold text-blue-300">{activeChapters}</div>
              <div className="text-sm opacity-75">Active Chapters</div>
            </div>
            <div className="bg-green-500/20 rounded-xl p-4 border-2 border-green-400">
              <div className="text-3xl font-bold text-green-300">{totalMembers}</div>
              <div className="text-sm opacity-75">Network Members</div>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-4 border-2 border-purple-400">
              <div className="text-3xl font-bold text-purple-300">{globalProjects}</div>
              <div className="text-sm opacity-75">Global Projects</div>
            </div>
            <div className="bg-yellow-500/20 rounded-xl p-4 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300">${(totalFunding / 1000).toFixed(0)}K</div>
              <div className="text-sm opacity-75">Network Funding</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('movement')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'movement'
                ? 'bg-blue-500 text-white scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🌊 Movement Building
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'organization'
                ? 'bg-green-500 text-white scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            👥 Leadership Network
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'global'
                ? 'bg-purple-500 text-white scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🌐 Global Scaling
          </button>
          <button
            onClick={() => setActiveTab('legacy')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'legacy'
                ? 'bg-yellow-500 text-white scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🏆 Vision & Legacy
          </button>
        </div>

        {/* Challenge Modal */}
        {showChallenge && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-3xl p-8 max-w-2xl border-4 border-red-500 text-white">
              <h3 className="text-3xl font-bold mb-4">🚨 Scaling Challenge!</h3>
              <p className="text-xl mb-6">
                As your movement grows rapidly, some chapters are drifting from the original mission. 
                Resources are stretched thin, and there's confusion about priorities. How do you maintain cohesion?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleChallengeResponse('values')}
                  className="w-full p-4 bg-blue-600/40 hover:bg-blue-600 rounded-xl border-2 border-blue-400 text-left transition-all"
                >
                  <div className="font-bold mb-1">🎯 Reinforce Core Values</div>
                  <div className="text-sm opacity-90">Create clear vision statement and shared principles</div>
                </button>
                <button
                  onClick={() => handleChallengeResponse('structure')}
                  className="w-full p-4 bg-green-600/40 hover:bg-green-600 rounded-xl border-2 border-green-400 text-left transition-all"
                >
                  <div className="font-bold mb-1">🏗️ Build Stronger Structure</div>
                  <div className="text-sm opacity-90">Develop regional coordinators and support systems</div>
                </button>
                <button
                  onClick={() => handleChallengeResponse('sustainable')}
                  className="w-full p-4 bg-purple-600/40 hover:bg-purple-600 rounded-xl border-2 border-purple-400 text-left transition-all"
                >
                  <div className="font-bold mb-1">💰 Ensure Financial Sustainability</div>
                  <div className="text-sm opacity-90">Diversify funding and build local fundraising capacity</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'movement' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">🌊 Building the Movement</h2>
              {!showChallenge && !challengeResolved && activeChapters >= 3 && (
                <button
                  onClick={triggerChallenge}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl font-bold hover:scale-105 transition-all animate-pulse"
                >
                  ⚠️ Scaling Challenge
                </button>
              )}
            </div>

            <p className="text-lg mb-6 opacity-90">
              Create local chapters that empower communities to take ownership of their ecosystems.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {Array.from(chapters.values()).map(chapter => (
                <div key={chapter.id} className="bg-black/30 rounded-xl p-6 border-2 border-blue-400">
                  <h3 className="text-xl font-bold mb-3">{chapter.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Location:</span>
                      <span className="font-bold text-blue-400">{chapter.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`font-bold ${
                        chapter.status === 'active' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {chapter.status === 'active' ? 'Active' : 'Forming'}
                      </span>
                    </div>
                    {chapter.members > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Members:</span>
                        <span className="font-bold text-green-400">{chapter.members}</span>
                      </div>
                    )}
                    {chapter.impact > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Projects Led:</span>
                        <span className="font-bold text-purple-400">{chapter.impact}</span>
                      </div>
                    )}
                  </div>
                  {chapter.status === 'forming' && (
                    <button
                      onClick={() => launchChapter(chapter.id)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all"
                    >
                      🚀 Launch Chapter
                    </button>
                  )}
                </div>
              ))}
            </div>

            {activeChapters >= 3 && (
              <div className="mt-6 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-400 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-3">🌟 Movement Growing!</h3>
                <p className="text-lg">
                  Your network has {totalMembers} members across {activeChapters} chapters, 
                  working on {globalProjects} restoration projects simultaneously!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">👥 Developing Leaders</h2>
            <p className="text-lg mb-6 opacity-90">
              Cultivate a network of empowered leaders who can sustain the movement.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {Array.from(leaders.values()).map(leader => (
                <div key={leader.id} className="bg-black/30 rounded-xl p-6 border-2 border-green-400">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">{leader.name}</h3>
                    {leader.trained && <div className="text-2xl">⭐</div>}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Role:</span>
                      <span className="font-bold text-blue-400">{leader.role}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`font-bold ${
                        leader.trained ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {leader.trained ? 'Leadership Trained' : 'In Development'}
                      </span>
                    </div>
                    {leader.leading > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Leading:</span>
                        <span className="font-bold text-purple-400">{leader.leading} chapters</span>
                      </div>
                    )}
                  </div>
                  {!leader.trained && (
                    <button
                      onClick={() => developLeader(leader.id)}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all"
                    >
                      🎓 Develop Leader
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-400 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">🌐 Leadership Network</h3>
              <p className="text-lg mb-4">
                Your {trainedLeaders} trained leaders are coordinating {Array.from(leaders.values()).reduce((sum, l) => sum + l.leading, 0)} chapters, 
                creating a self-sustaining organizational structure.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'global' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">🌐 International Expansion</h2>
              <button
                onClick={expandGlobally}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold hover:scale-105 transition-all"
              >
                🚀 Expand Globally
              </button>
            </div>

            <p className="text-lg mb-6 opacity-90">
              Scale your impact by forming strategic partnerships and expanding worldwide.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {Array.from(partnerships.values()).map(partner => (
                <div key={partner.id} className="bg-black/30 rounded-xl p-6 border-2 border-purple-400">
                  <h3 className="text-lg font-bold mb-3">{partner.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Type:</span>
                      <span className="font-bold text-blue-400">{partner.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`font-bold ${
                        partner.status === 'strategic' ? 'text-purple-400' :
                        partner.status === 'collaborating' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {partner.status === 'strategic' ? 'Strategic' :
                         partner.status === 'collaborating' ? 'Collaborating' :
                         'Initial Contact'}
                      </span>
                    </div>
                    {partner.funding > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Funding:</span>
                        <span className="font-bold text-green-400">${(partner.funding / 1000).toFixed(0)}K</span>
                      </div>
                    )}
                  </div>
                  {partner.status !== 'strategic' && (
                    <button
                      onClick={() => buildPartnership(partner.id)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-all"
                    >
                      🤝 Build Partnership
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-2 border-blue-400 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">🌍 Global Reach</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-4xl font-bold text-blue-400 mb-1">{activeChapters}</div>
                  <div className="text-sm opacity-75">Countries/Regions</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-4xl font-bold text-green-400 mb-1">{globalProjects}</div>
                  <div className="text-sm opacity-75">Active Projects</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-4xl font-bold text-purple-400 mb-1">${(totalFunding / 1000).toFixed(0)}K</div>
                  <div className="text-sm opacity-75">Total Funding</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'legacy' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">🏆 Vision & Legacy</h2>
            <p className="text-lg mb-6 opacity-90">
              Define the long-term vision and create a lasting legacy for generations.
            </p>

            {vision.statement === '' ? (
              <div className="bg-black/30 rounded-xl p-8 border-2 border-yellow-400 mb-6">
                <h3 className="text-2xl font-bold mb-4">Create Your Vision Statement</h3>
                <p className="text-lg mb-6 opacity-90">
                  A clear, inspiring vision will guide your movement for decades to come.
                </p>
                <button
                  onClick={createVisionStatement}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                >
                  ✨ Craft Vision Statement
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-2 border-yellow-400 rounded-xl p-8 mb-6">
                <h3 className="text-3xl font-bold mb-4">🌟 Our Vision</h3>
                <p className="text-xl mb-6 italic leading-relaxed">"{vision.statement}"</p>
                <h4 className="text-2xl font-bold mb-3">Strategic Goals:</h4>
                <ul className="space-y-2 mb-6">
                  {vision.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-center text-lg">
                      <span className="text-green-400 mr-3">✓</span>
                      {goal}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-lg opacity-75">{vision.timeline}-Year Strategic Plan</span>
                  <span className="text-2xl font-bold text-green-400">${(vision.funding / 1000).toFixed(0)}K committed</span>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-400 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">🌍 Your Global Impact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-5xl font-bold text-green-400 mb-2">{ecosystemsRestored}</div>
                  <div className="text-lg">Ecosystems Restored</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-5xl font-bold text-blue-400 mb-2">{totalMembers}</div>
                  <div className="text-lg">Lives Changed</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-5xl font-bold text-purple-400 mb-2">{activeChapters}</div>
                  <div className="text-lg">Communities Empowered</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-5xl font-bold text-yellow-400 mb-2">{trainedLeaders}</div>
                  <div className="text-lg">Leaders Developed</div>
                </div>
              </div>
            </div>

            {canComplete && (
              <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-400 rounded-xl p-8 text-center">
                <h3 className="text-3xl font-bold mb-4">✨ Movement Complete!</h3>
                <p className="text-xl mb-6 leading-relaxed">
                  You've built a self-sustaining global movement that will continue your work for generations. 
                  Your vision of thriving ecosystems is becoming reality across the world.
                </p>
                <button
                  onClick={completeLevel}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                >
                  🎉 Complete Your Journey
                </button>
              </div>
            )}
            {!canComplete && (
              <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-xl p-4">
                <p className="text-sm">
                  <strong>To complete:</strong> Launch 4+ chapters, develop 3+ leaders, create vision statement, 
                  build 1+ strategic partnership, and resolve the scaling challenge
                </p>
              </div>
            )}
          </div>
        )}

        {/* Transition Message */}
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="text-8xl mb-6 animate-bounce">🌍</div>
              <h2 className="text-5xl font-bold mb-4">Global Movement Created!</h2>
              <p className="text-2xl opacity-80">
                Revealing the full journey...
              </p>
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
          <h2 className="text-4xl font-bold mb-6">🏆 Complete 15-Level Journey</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🌊</div>
              <div className="text-2xl font-bold mb-1">Level 1</div>
              <div className="text-xs opacity-75">Discovery</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-2xl font-bold mb-1">Level 2</div>
              <div className="text-xs opacity-75">Investigation</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-2xl font-bold mb-1">Level 3</div>
              <div className="text-xs opacity-75">Planning</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🛠️</div>
              <div className="text-2xl font-bold mb-1">Level 4</div>
              <div className="text-xs opacity-75">Execution</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🔗</div>
              <div className="text-2xl font-bold mb-1">Level 5</div>
              <div className="text-xs opacity-75">Systems</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-2xl font-bold mb-1">Level 6</div>
              <div className="text-xs opacity-75">Team</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-2xl font-bold mb-1">Level 7</div>
              <div className="text-xs opacity-75">Budget</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-2xl font-bold mb-1">Level 8</div>
              <div className="text-xs opacity-75">Analytics</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🤝</div>
              <div className="text-2xl font-bold mb-1">Level 9</div>
              <div className="text-xs opacity-75">Stakeholders</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🏛️</div>
              <div className="text-2xl font-bold mb-1">Level 10</div>
              <div className="text-xs opacity-75">Compliance</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🔧</div>
              <div className="text-2xl font-bold mb-1">Level 11</div>
              <div className="text-xs opacity-75">Projects</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🔬</div>
              <div className="text-2xl font-bold mb-1">Level 12</div>
              <div className="text-xs opacity-75">Innovation</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">📜</div>
              <div className="text-2xl font-bold mb-1">Level 13</div>
              <div className="text-xs opacity-75">Policy</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">👨‍🏫</div>
              <div className="text-2xl font-bold mb-1">Level 14</div>
              <div className="text-xs opacity-75">Mentor</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl mb-2">🌍</div>
              <div className="text-2xl font-bold mb-1">Level 15</div>
              <div className="text-xs opacity-75">Visionary</div>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-white">
          <h2 className="text-4xl font-bold mb-6">🌟 Your Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border-2 border-blue-400">
              <div className="text-5xl font-bold text-blue-300 mb-2">92%</div>
              <div className="text-xl">River Health Restored</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border-2 border-green-400">
              <div className="text-5xl font-bold text-green-300 mb-2">15+</div>
              <div className="text-xl">Ecosystems Healed</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border-2 border-purple-400">
              <div className="text-5xl font-bold text-purple-300 mb-2">500+</div>
              <div className="text-xl">People Trained</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border-2 border-yellow-400">
              <div className="text-5xl font-bold text-yellow-300 mb-2">8</div>
              <div className="text-xl">Global Chapters</div>
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
              <div>✅ Stakeholder Relationship Manager</div>
              <div>✅ Crisis Communication System</div>
              <div>✅ Regulatory Compliance Framework</div>
              <div>✅ Permit Management System</div>
              <div>✅ Inspection Tracking</div>
              <div>✅ Multi-Project Portfolio Manager</div>
              <div>✅ Resource Allocation Engine</div>
              <div>✅ Dependency Management</div>
              <div>✅ Innovation Lab & R&D Tracker</div>
              <div>✅ Experiment Management System</div>
              <div>✅ Pilot Program Launcher</div>
              <div>✅ Policy Gap Analysis Tool</div>
              <div>✅ Advocacy Campaign Manager</div>
              <div>✅ Legislative Tracking System</div>
              <div>✅ Curriculum Development Platform</div>
              <div>✅ Workshop Management System</div>
              <div>✅ Train-the-Trainer Program</div>
              <div>✅ Knowledge Base Builder</div>
              <div>✅ Movement Building Network</div>
              <div>✅ Leadership Development Platform</div>
              <div>✅ Global Chapter Management</div>
              <div>✅ Partnership & Funding Tracker</div>
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
