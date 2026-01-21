'use client';

import { useState } from 'react';
import { Droplets, TreePine, Building2, Wheat, Waves, Mountain } from 'lucide-react';

interface LandingZone {
  id: string;
  name: string;
  description: string;
  challenge: string;
  icon: any;
  color: string;
  domain: string;
}

const LANDING_ZONES: LandingZone[] = [
  {
    id: 'river',
    name: 'The Weeping River Valley',
    description: 'Polluted waterways struggle to sustain life',
    challenge: 'Restore water quality and aquatic ecosystems',
    icon: Droplets,
    color: 'from-blue-600 via-cyan-500 to-blue-400',
    domain: 'Water Quality Management'
  },
  {
    id: 'forest',
    name: 'The Silent Forest',
    description: 'Deforestation has left habitats destroyed',
    challenge: 'Rebuild biodiversity and forest health',
    icon: TreePine,
    color: 'from-green-600 via-emerald-500 to-green-400',
    domain: 'Biodiversity & Habitat Management'
  },
  {
    id: 'city',
    name: 'The Choking City',
    description: 'Urban pollution threatens residents',
    challenge: 'Clean air, manage waste, restore urban nature',
    icon: Building2,
    color: 'from-gray-600 via-slate-500 to-gray-400',
    domain: 'Urban Environmental Management'
  },
  {
    id: 'fields',
    name: 'The Barren Fields',
    description: 'Soil degradation has destroyed farmland',
    challenge: 'Restore soil health and agricultural viability',
    icon: Wheat,
    color: 'from-amber-600 via-yellow-500 to-amber-400',
    domain: 'Soil & Agriculture Management'
  },
  {
    id: 'coast',
    name: 'The Dying Coast',
    description: 'Ocean pollution and coral bleaching spread',
    challenge: 'Heal marine ecosystems and coastal zones',
    icon: Waves,
    color: 'from-teal-600 via-cyan-500 to-teal-400',
    domain: 'Marine & Coastal Management'
  },
  {
    id: 'mountains',
    name: 'The Wounded Mountains',
    description: 'Mining has scarred the landscape',
    challenge: 'Restore land and prevent erosion',
    icon: Mountain,
    color: 'from-stone-600 via-gray-500 to-stone-400',
    domain: 'Land Restoration & Remediation'
  }
];

interface Props {
  onZoneSelected: (zoneId: string) => void;
}

export default function OpeningSequence({ onZoneSelected }: Props) {
  const [phase, setPhase] = useState<'space' | 'descent' | 'selection'>('space');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  if (phase === 'space') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 2 + 2 + 's'
              }}
            />
          ))}
        </div>

        {/* Planet EcoSphere */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mx-auto mb-12">
              {/* Planet with glow effect */}
              <div className="w-96 h-96 rounded-full bg-gradient-to-br from-blue-500 via-green-400 to-blue-600 animate-spin-slow relative shadow-2xl shadow-blue-500/50">
                {/* Cloud patterns */}
                <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
                {/* Continents */}
                <div className="absolute top-1/4 left-1/4 w-20 h-16 bg-green-600/60 rounded-full blur-sm"></div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-20 bg-green-500/50 rounded-full blur-sm"></div>
                <div className="absolute top-1/2 right-1/3 w-16 h-12 bg-amber-600/40 rounded-full blur-sm"></div>
              </div>
              
              {/* Orbital ring */}
              <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full scale-110 animate-pulse"></div>
            </div>

            <div className="space-y-6 animate-fade-in">
              <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4">
                EcoSphere Chronicles
              </h1>
              
              <div className="max-w-2xl mx-auto space-y-4 text-gray-300">
                <p className="text-2xl italic text-cyan-300">
                  "Welcome, Restoration Architect..."
                </p>
                
                <p className="text-xl leading-relaxed">
                  Before you lies EcoSphere, a world once thriving with life, now facing environmental challenges. 
                  Each ecosystem struggles in its own way, each crying out for help.
                </p>
                
                <p className="text-xl leading-relaxed text-blue-300">
                  You are not here to conquer or build from nothing. 
                  You are here to heal, to restore, to bring balance back to a world that once knew harmony.
                </p>
                
                <p className="text-lg text-gray-400 mt-8">
                  But first... let me understand who you are and what calls to your heart.
                </p>
              </div>

              <button
                onClick={() => setPhase('descent')}
                className="mt-12 px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50"
              >
                Begin Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'descent') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-cyan-600 relative overflow-hidden">
        {/* Clouds passing by */}
        <div className="absolute inset-0 animate-float">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full blur-xl"
              style={{
                width: Math.random() * 200 + 100 + 'px',
                height: Math.random() * 60 + 40 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's'
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-white space-y-8 animate-fade-in">
            <div className="text-6xl font-bold animate-pulse">
              Descending to EcoSphere...
            </div>
            
            <div className="text-2xl text-cyan-300">
              Through the clouds, through the atmosphere
            </div>
            
            <div className="text-xl text-gray-300 max-w-2xl mx-auto">
              Six regions spread below, each with unique challenges. 
              Where you land will shape your journey...
            </div>

            <div className="mt-12">
              <div className="w-32 h-32 mx-auto border-4 border-cyan-400 rounded-full animate-spin-slow"></div>
            </div>

            <button
              onClick={() => setPhase('selection')}
              className="mt-8 px-10 py-3 bg-cyan-600/50 text-white text-lg font-bold rounded-lg hover:bg-cyan-500/70 transition-all"
            >
              Choose Your Landing Zone
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4">
            Choose Your Path
          </h1>
          <p className="text-2xl text-cyan-300 mb-4 italic">
            "What calls to you first? What do you feel needs attention?"
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Each region faces different environmental challenges. Your choice will define your starting point, 
            but remember—no choice is wrong. Whatever draws your attention is exactly where you're meant to begin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {LANDING_ZONES.map((zone) => {
            const Icon = zone.icon;
            const isSelected = selectedZone === zone.id;
            
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`relative p-8 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? 'scale-105 shadow-2xl ring-4 ring-cyan-400'
                    : 'hover:scale-102 shadow-lg'
                } bg-gradient-to-br ${zone.color}`}
              >
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${isSelected ? 'bg-white/30' : 'bg-black/20'}`}>
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {zone.name}
                  </h3>
                  
                  <p className="text-white/90 mb-4 text-lg">
                    {zone.description}
                  </p>
                  
                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-white/80 mb-2 font-semibold">Challenge:</p>
                    <p className="text-white">{zone.challenge}</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-xs text-white/70 mb-1">Application Domain:</p>
                    <p className="text-sm font-bold text-white">{zone.domain}</p>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedZone && (
          <div className="text-center animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto mb-6">
              <p className="text-xl text-cyan-300 italic mb-4">
                "You've chosen {LANDING_ZONES.find(z => z.id === selectedZone)?.name}. 
                A wise choice. This ecosystem needs you."
              </p>
              <p className="text-gray-300">
                Your journey begins here, but remember—every ecosystem is connected. 
                Success in one area opens doors to heal others.
              </p>
            </div>
            
            <button
              onClick={() => {
                // Save choice and start game
                localStorage.setItem('ecosphere_landing_zone', selectedZone);
                onZoneSelected(selectedZone);
              }}
              className="px-16 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-2xl shadow-cyan-500/50 animate-pulse"
            >
              Begin Restoration
            </button>
          </div>
        )}

        {!selectedZone && (
          <div className="text-center">
            <p className="text-gray-400 text-lg">
              Select a landing zone to begin your journey
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
