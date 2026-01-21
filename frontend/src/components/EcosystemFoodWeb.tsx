'use client';

import { useState } from 'react';
import { Species, EcosystemState, getSpeciesByTrophicLevel } from '@/lib/ecosystemData';
import { Info, AlertTriangle, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  ecosystem: EcosystemState;
  onSpeciesClick: (species: Species) => void;
  selectedSpecies: Species | null;
}

export default function EcosystemFoodWeb({ ecosystem, onSpeciesClick, selectedSpecies }: Props) {
  const [hoveredSpecies, setHoveredSpecies] = useState<string | null>(null);

  const getTrophicColor = (level: number) => {
    switch (level) {
      case 1: return 'from-green-500 to-emerald-600';
      case 2: return 'from-blue-500 to-cyan-600';
      case 3: return 'from-purple-500 to-pink-600';
      case 4: return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 70) return 'text-green-400';
    if (health >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPopulationPercentage = (species: Species) => {
    return Math.round((species.population / species.maxPopulation) * 100);
  };

  // Get species by trophic level for display
  const trophicLevels = [
    { level: 4, title: 'Tertiary Consumers (Top Predators)', species: getSpeciesByTrophicLevel(ecosystem, 4) },
    { level: 3, title: 'Secondary Consumers (Predators)', species: getSpeciesByTrophicLevel(ecosystem, 3) },
    { level: 2, title: 'Primary Consumers (Herbivores)', species: getSpeciesByTrophicLevel(ecosystem, 2) },
    { level: 1, title: 'Producers (Plants & Algae)', species: getSpeciesByTrophicLevel(ecosystem, 1) }
  ];

  // Get connections for highlighted species
  const getConnectedSpecies = (speciesId: string) => {
    const species = ecosystem.species.find(s => s.id === speciesId);
    if (!species) return { prey: [], predators: [] };
    return {
      prey: species.diet,
      predators: species.predators
    };
  };

  const highlightedSpecies = hoveredSpecies || selectedSpecies?.id;
  const connections = highlightedSpecies ? getConnectedSpecies(highlightedSpecies) : { prey: [], predators: [] };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 rounded-2xl p-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">🕸️</span>
          Food Web Visualization
        </h3>
        <p className="text-gray-400 text-sm">
          Click on any species to see detailed information and their role in the ecosystem
        </p>
      </div>

      {/* Ecosystem Health Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6 bg-white/5 rounded-xl p-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">Water Quality</div>
          <div className={`text-2xl font-bold ${ecosystem.waterQuality > 70 ? 'text-green-400' : ecosystem.waterQuality > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {Math.round(ecosystem.waterQuality)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Biodiversity</div>
          <div className={`text-2xl font-bold ${ecosystem.biodiversityScore > 70 ? 'text-green-400' : ecosystem.biodiversityScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {ecosystem.biodiversityScore}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Stability</div>
          <div className={`text-2xl font-bold ${ecosystem.stabilityIndex > 70 ? 'text-green-400' : ecosystem.stabilityIndex > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {ecosystem.stabilityIndex}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Species</div>
          <div className="text-2xl font-bold text-cyan-400">
            {ecosystem.species.filter(s => s.population > 0).length}/{ecosystem.species.length}
          </div>
        </div>
      </div>

      {/* Trophic Levels */}
      <div className="space-y-6">
        {trophicLevels.map(({ level, title, species }) => (
          <div key={level} className="bg-white/5 rounded-xl p-4">
            <h4 className={`text-lg font-bold mb-3 bg-gradient-to-r ${getTrophicColor(level)} bg-clip-text text-transparent`}>
              {title}
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {species.map(sp => {
                const isHighlighted = highlightedSpecies === sp.id;
                const isConnected = connections.prey.includes(sp.id) || connections.predators.includes(sp.id);
                const isPrey = connections.prey.includes(sp.id);
                const isPredator = connections.predators.includes(sp.id);
                
                return (
                  <button
                    key={sp.id}
                    onClick={() => onSpeciesClick(sp)}
                    onMouseEnter={() => setHoveredSpecies(sp.id)}
                    onMouseLeave={() => setHoveredSpecies(null)}
                    className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
                      isHighlighted
                        ? `bg-gradient-to-br ${getTrophicColor(level)} shadow-2xl scale-105`
                        : isConnected
                        ? isPrey
                          ? 'bg-green-500/20 ring-2 ring-green-400'
                          : 'bg-red-500/20 ring-2 ring-red-400'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl">{sp.icon}</span>
                      <div className="flex flex-col items-end gap-1">
                        {sp.isKeystone && (
                          <Star className="w-4 h-4 text-yellow-400" title="Keystone Species" />
                        )}
                        {sp.isEndangered && (
                          <AlertTriangle className="w-4 h-4 text-red-400" title="Endangered" />
                        )}
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <div className="font-bold text-white text-sm mb-1 line-clamp-1">
                        {sp.name}
                      </div>
                      <div className="text-xs text-gray-400 italic mb-2 line-clamp-1">
                        {sp.scientificName}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Health</span>
                          <span className={`font-bold ${getHealthColor(sp.health)}`}>
                            {sp.health}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Population</span>
                          <span className="font-bold text-white">
                            {sp.population.toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Population bar */}
                        <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              getPopulationPercentage(sp) > 70 ? 'bg-green-500' :
                              getPopulationPercentage(sp) > 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${getPopulationPercentage(sp)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {species.length === 0 && (
              <div className="text-center py-6 text-gray-500 italic">
                No species at this trophic level
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white/5 rounded-xl p-4">
        <h5 className="text-sm font-bold text-white mb-3">Legend & Connections</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300">Keystone Species</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-gray-300">Endangered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/20 ring-2 ring-green-400 rounded"></div>
            <span className="text-gray-300">Prey (Food Source)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/20 ring-2 ring-red-400 rounded"></div>
            <span className="text-gray-300">Predator (Threat)</span>
          </div>
        </div>
        {highlightedSpecies && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-gray-400 text-xs">
              <strong>Hover or click</strong> on species to see their connections in the food web
            </p>
          </div>
        )}
      </div>

      {/* Cascade Events Alert */}
      {ecosystem.cascadeEvents.length > 0 && (
        <div className="mt-6 space-y-2">
          <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Recent Cascade Events
          </h5>
          {ecosystem.cascadeEvents.slice(-3).map((event, idx) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg text-sm ${
                event.impact === 'positive'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                  : event.impact === 'negative'
                  ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                  : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300'
              }`}
            >
              <div className="flex items-start gap-2">
                {event.impact === 'positive' ? (
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold">{event.trigger}</div>
                  <div className="text-xs opacity-90 mt-1">{event.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
