'use client';

export type SpeciesType = 'producer' | 'primary_consumer' | 'secondary_consumer' | 'tertiary_consumer' | 'decomposer';
export type TrophicLevel = 1 | 2 | 3 | 4 | 5;
export type HabitatType = 'river' | 'riverbank' | 'wetland' | 'forest' | 'meadow';

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  type: SpeciesType;
  trophicLevel: TrophicLevel;
  population: number;
  maxPopulation: number;
  habitat: HabitatType[];
  diet: string[];  // IDs of species this one eats
  predators: string[];  // IDs of species that eat this one
  health: number;  // 0-100
  isKeystone: boolean;
  isEndangered: boolean;
  description: string;
  icon: string;
  waterQualityRequirement: number;  // 0-100, minimum water quality needed
  reproductionRate: number;  // 0-1, how quickly population recovers
}

export interface EcosystemConnection {
  from: string;  // Species ID
  to: string;    // Species ID
  type: 'predation' | 'competition' | 'mutualism' | 'parasitism';
  strength: number;  // 0-1, how strong the relationship is
}

export interface EcosystemState {
  waterQuality: number;
  oxygenLevel: number;
  temperature: number;
  biodiversityScore: number;
  stabilityIndex: number;
  species: Species[];
  connections: EcosystemConnection[];
  cascadeEvents: CascadeEvent[];
}

export interface CascadeEvent {
  id: string;
  trigger: string;
  description: string;
  affectedSpecies: string[];
  impact: 'positive' | 'negative' | 'mixed';
  timestamp: number;
}

// Base species database for river ecosystem
export const RIVER_SPECIES: Species[] = [
  // Producers (Trophic Level 1)
  {
    id: 'algae',
    name: 'Green Algae',
    scientificName: 'Chlorophyta sp.',
    type: 'producer',
    trophicLevel: 1,
    population: 1000,
    maxPopulation: 2000,
    habitat: ['river', 'wetland'],
    diet: [],
    predators: ['mayfly', 'snail'],
    health: 65,
    isKeystone: false,
    isEndangered: false,
    description: 'Primary producer, forms the base of the food web. Requires clean water and sunlight.',
    icon: '🌿',
    waterQualityRequirement: 40,
    reproductionRate: 0.8
  },
  {
    id: 'diatoms',
    name: 'Diatoms',
    scientificName: 'Bacillariophyta',
    type: 'producer',
    trophicLevel: 1,
    population: 1500,
    maxPopulation: 3000,
    habitat: ['river'],
    diet: [],
    predators: ['mayfly', 'caddisfly'],
    health: 70,
    isKeystone: false,
    isEndangered: false,
    description: 'Microscopic algae with silica shells. Excellent indicator of water quality.',
    icon: '🔬',
    waterQualityRequirement: 60,
    reproductionRate: 0.9
  },
  {
    id: 'waterweed',
    name: 'Water Weed',
    scientificName: 'Elodea canadensis',
    type: 'producer',
    trophicLevel: 1,
    population: 500,
    maxPopulation: 1000,
    habitat: ['river', 'wetland'],
    diet: [],
    predators: ['snail', 'crayfish'],
    health: 55,
    isKeystone: false,
    isEndangered: false,
    description: 'Submerged aquatic plant that oxygenates water and provides shelter.',
    icon: '🌱',
    waterQualityRequirement: 50,
    reproductionRate: 0.6
  },
  
  // Primary Consumers (Trophic Level 2)
  {
    id: 'mayfly',
    name: 'Mayfly Larvae',
    scientificName: 'Ephemeroptera',
    type: 'primary_consumer',
    trophicLevel: 2,
    population: 800,
    maxPopulation: 1500,
    habitat: ['river'],
    diet: ['algae', 'diatoms'],
    predators: ['trout', 'sculpin'],
    health: 60,
    isKeystone: false,
    isEndangered: false,
    description: 'Sensitive to pollution. Their presence indicates good water quality.',
    icon: '🦟',
    waterQualityRequirement: 70,
    reproductionRate: 0.7
  },
  {
    id: 'caddisfly',
    name: 'Caddisfly Larvae',
    scientificName: 'Trichoptera',
    type: 'primary_consumer',
    trophicLevel: 2,
    population: 600,
    maxPopulation: 1200,
    habitat: ['river'],
    diet: ['algae', 'diatoms', 'waterweed'],
    predators: ['trout', 'sculpin', 'salamander'],
    health: 65,
    isKeystone: false,
    isEndangered: false,
    description: 'Build protective cases from pebbles and plant material.',
    icon: '🐛',
    waterQualityRequirement: 65,
    reproductionRate: 0.65
  },
  {
    id: 'snail',
    name: 'River Snail',
    scientificName: 'Viviparus sp.',
    type: 'primary_consumer',
    trophicLevel: 2,
    population: 400,
    maxPopulation: 800,
    habitat: ['river', 'riverbank'],
    diet: ['algae', 'waterweed'],
    predators: ['crayfish', 'turtle'],
    health: 50,
    isKeystone: false,
    isEndangered: false,
    description: 'Grazes on algae and plant material. Tolerates moderate pollution.',
    icon: '🐌',
    waterQualityRequirement: 45,
    reproductionRate: 0.5
  },
  {
    id: 'crayfish',
    name: 'Crayfish',
    scientificName: 'Cambarus sp.',
    type: 'primary_consumer',
    trophicLevel: 2,
    population: 200,
    maxPopulation: 500,
    habitat: ['river', 'riverbank'],
    diet: ['algae', 'waterweed', 'snail'],
    predators: ['otter', 'heron', 'bass'],
    health: 55,
    isKeystone: false,
    isEndangered: false,
    description: 'Omnivorous scavenger. Important for nutrient cycling.',
    icon: '🦞',
    waterQualityRequirement: 50,
    reproductionRate: 0.4
  },
  
  // Secondary Consumers (Trophic Level 3)
  {
    id: 'sculpin',
    name: 'Sculpin',
    scientificName: 'Cottus sp.',
    type: 'secondary_consumer',
    trophicLevel: 3,
    population: 150,
    maxPopulation: 300,
    habitat: ['river'],
    diet: ['mayfly', 'caddisfly'],
    predators: ['trout', 'otter'],
    health: 60,
    isKeystone: false,
    isEndangered: false,
    description: 'Bottom-dwelling fish that feeds on insect larvae.',
    icon: '🐟',
    waterQualityRequirement: 65,
    reproductionRate: 0.5
  },
  {
    id: 'trout',
    name: 'Rainbow Trout',
    scientificName: 'Oncorhynchus mykiss',
    type: 'secondary_consumer',
    trophicLevel: 3,
    population: 100,
    maxPopulation: 250,
    habitat: ['river'],
    diet: ['mayfly', 'caddisfly', 'sculpin'],
    predators: ['otter', 'heron', 'eagle'],
    health: 55,
    isKeystone: true,
    isEndangered: false,
    description: 'Indicator species requiring cold, oxygenated water. Keystone predator.',
    icon: '🐠',
    waterQualityRequirement: 75,
    reproductionRate: 0.45
  },
  {
    id: 'salamander',
    name: 'Stream Salamander',
    scientificName: 'Desmognathus sp.',
    type: 'secondary_consumer',
    trophicLevel: 3,
    population: 80,
    maxPopulation: 200,
    habitat: ['river', 'riverbank'],
    diet: ['caddisfly', 'mayfly', 'snail'],
    predators: ['heron', 'raccoon'],
    health: 50,
    isKeystone: false,
    isEndangered: true,
    description: 'Amphibian requiring pristine water. Endangered in many regions.',
    icon: '🦎',
    waterQualityRequirement: 80,
    reproductionRate: 0.3
  },
  {
    id: 'bass',
    name: 'Smallmouth Bass',
    scientificName: 'Micropterus dolomieu',
    type: 'secondary_consumer',
    trophicLevel: 3,
    population: 60,
    maxPopulation: 150,
    habitat: ['river'],
    diet: ['crayfish', 'sculpin', 'trout'],
    predators: ['otter', 'eagle'],
    health: 45,
    isKeystone: false,
    isEndangered: false,
    description: 'Predatory fish that controls smaller fish populations.',
    icon: '🐡',
    waterQualityRequirement: 55,
    reproductionRate: 0.4
  },
  
  // Tertiary Consumers (Trophic Level 4)
  {
    id: 'otter',
    name: 'River Otter',
    scientificName: 'Lontra canadensis',
    type: 'tertiary_consumer',
    trophicLevel: 4,
    population: 12,
    maxPopulation: 30,
    habitat: ['river', 'riverbank'],
    diet: ['trout', 'crayfish', 'sculpin', 'bass'],
    predators: [],
    health: 70,
    isKeystone: true,
    isEndangered: true,
    description: 'Top predator. Keystone species. Presence indicates healthy ecosystem.',
    icon: '🦦',
    waterQualityRequirement: 80,
    reproductionRate: 0.2
  },
  {
    id: 'heron',
    name: 'Great Blue Heron',
    scientificName: 'Ardea herodias',
    type: 'tertiary_consumer',
    trophicLevel: 4,
    population: 8,
    maxPopulation: 20,
    habitat: ['river', 'riverbank', 'wetland'],
    diet: ['trout', 'salamander', 'crayfish'],
    predators: [],
    health: 65,
    isKeystone: false,
    isEndangered: false,
    description: 'Wading bird that hunts fish and amphibians.',
    icon: '🦅',
    waterQualityRequirement: 70,
    reproductionRate: 0.25
  },
  {
    id: 'eagle',
    name: 'Bald Eagle',
    scientificName: 'Haliaeetus leucocephalus',
    type: 'tertiary_consumer',
    trophicLevel: 4,
    population: 4,
    maxPopulation: 10,
    habitat: ['river', 'forest'],
    diet: ['trout', 'bass'],
    predators: [],
    health: 60,
    isKeystone: false,
    isEndangered: false,
    description: 'Apex predator. Symbol of environmental recovery.',
    icon: '🦅',
    waterQualityRequirement: 75,
    reproductionRate: 0.15
  },
  {
    id: 'turtle',
    name: 'Painted Turtle',
    scientificName: 'Chrysemys picta',
    type: 'secondary_consumer',
    trophicLevel: 3,
    population: 50,
    maxPopulation: 120,
    habitat: ['river', 'riverbank', 'wetland'],
    diet: ['snail', 'algae', 'waterweed'],
    predators: ['raccoon'],
    health: 55,
    isKeystone: false,
    isEndangered: false,
    description: 'Omnivorous reptile. Long-lived species.',
    icon: '🐢',
    waterQualityRequirement: 60,
    reproductionRate: 0.3
  },
  {
    id: 'raccoon',
    name: 'Raccoon',
    scientificName: 'Procyon lotor',
    type: 'tertiary_consumer',
    trophicLevel: 4,
    population: 15,
    maxPopulation: 40,
    habitat: ['riverbank', 'forest'],
    diet: ['crayfish', 'turtle', 'salamander'],
    predators: [],
    health: 60,
    isKeystone: false,
    isEndangered: false,
    description: 'Opportunistic omnivore. Adaptable to various conditions.',
    icon: '🦝',
    waterQualityRequirement: 30,
    reproductionRate: 0.5
  },
  
  // Decomposers
  {
    id: 'bacteria',
    name: 'Decomposer Bacteria',
    scientificName: 'Various species',
    type: 'decomposer',
    trophicLevel: 1,
    population: 5000,
    maxPopulation: 10000,
    habitat: ['river', 'riverbank', 'wetland'],
    diet: [],
    predators: [],
    health: 75,
    isKeystone: true,
    isEndangered: false,
    description: 'Break down organic matter, recycling nutrients. Essential for ecosystem function.',
    icon: '🦠',
    waterQualityRequirement: 20,
    reproductionRate: 0.95
  }
];

// Ecosystem connections (predator-prey and other relationships)
export const ECOSYSTEM_CONNECTIONS: EcosystemConnection[] = [
  // Predation relationships (already defined in diet/predators above, but explicitly listed for visualization)
  { from: 'mayfly', to: 'algae', type: 'predation', strength: 0.8 },
  { from: 'mayfly', to: 'diatoms', type: 'predation', strength: 0.9 },
  { from: 'caddisfly', to: 'algae', type: 'predation', strength: 0.7 },
  { from: 'caddisfly', to: 'diatoms', type: 'predation', strength: 0.8 },
  { from: 'snail', to: 'algae', type: 'predation', strength: 0.9 },
  { from: 'snail', to: 'waterweed', type: 'predation', strength: 0.6 },
  { from: 'crayfish', to: 'snail', type: 'predation', strength: 0.5 },
  { from: 'crayfish', to: 'waterweed', type: 'predation', strength: 0.4 },
  { from: 'sculpin', to: 'mayfly', type: 'predation', strength: 0.8 },
  { from: 'sculpin', to: 'caddisfly', type: 'predation', strength: 0.7 },
  { from: 'trout', to: 'mayfly', type: 'predation', strength: 0.7 },
  { from: 'trout', to: 'caddisfly', type: 'predation', strength: 0.6 },
  { from: 'trout', to: 'sculpin', type: 'predation', strength: 0.5 },
  { from: 'bass', to: 'crayfish', type: 'predation', strength: 0.7 },
  { from: 'bass', to: 'sculpin', type: 'predation', strength: 0.6 },
  { from: 'otter', to: 'trout', type: 'predation', strength: 0.9 },
  { from: 'otter', to: 'bass', type: 'predation', strength: 0.7 },
  { from: 'otter', to: 'crayfish', type: 'predation', strength: 0.5 },
  { from: 'heron', to: 'trout', type: 'predation', strength: 0.8 },
  { from: 'heron', to: 'salamander', type: 'predation', strength: 0.6 },
  { from: 'eagle', to: 'trout', type: 'predation', strength: 0.9 },
  { from: 'eagle', to: 'bass', type: 'predation', strength: 0.7 },
  
  // Competition relationships
  { from: 'trout', to: 'bass', type: 'competition', strength: 0.6 },
  { from: 'mayfly', to: 'caddisfly', type: 'competition', strength: 0.4 },
  { from: 'otter', to: 'heron', type: 'competition', strength: 0.5 },
  
  // Mutualism relationships
  { from: 'waterweed', to: 'mayfly', type: 'mutualism', strength: 0.5 },  // Plants provide shelter
  { from: 'bacteria', to: 'algae', type: 'mutualism', strength: 0.7 }  // Nutrient cycling
];

// Simulate ecosystem changes based on water quality and species interactions
export function simulateEcosystem(
  currentState: EcosystemState,
  waterQualityChange: number,
  daysElapsed: number
): EcosystemState {
  const newSpecies = [...currentState.species];
  const cascadeEvents: CascadeEvent[] = [];
  
  // Update water quality
  const newWaterQuality = Math.max(0, Math.min(100, currentState.waterQuality + waterQualityChange));
  
  // Update each species based on water quality
  newSpecies.forEach(species => {
    const qualityGap = newWaterQuality - species.waterQualityRequirement;
    
    // Species health affected by water quality
    if (qualityGap < -20) {
      species.health = Math.max(0, species.health - 15);
      species.population = Math.floor(species.population * 0.7);
    } else if (qualityGap < 0) {
      species.health = Math.max(0, species.health - 5);
      species.population = Math.floor(species.population * 0.9);
    } else if (qualityGap > 20) {
      species.health = Math.min(100, species.health + 10);
      species.population = Math.min(species.maxPopulation, Math.floor(species.population * (1 + species.reproductionRate * 0.1)));
    } else {
      species.health = Math.min(100, species.health + 5);
      species.population = Math.min(species.maxPopulation, Math.floor(species.population * (1 + species.reproductionRate * 0.05)));
    }
    
    // Population can't exceed max
    species.population = Math.min(species.maxPopulation, species.population);
    
    // Species extinction check
    if (species.population <= 0) {
      cascadeEvents.push({
        id: `extinction_${species.id}_${Date.now()}`,
        trigger: `${species.name} extinct`,
        description: `${species.name} population has gone extinct due to poor conditions. This will affect ${species.predators.length} predator species.`,
        affectedSpecies: species.predators,
        impact: 'negative',
        timestamp: Date.now()
      });
    }
  });
  
  // Calculate predator-prey dynamics
  newSpecies.forEach(predator => {
    if (predator.diet.length > 0) {
      const preyAvailable = predator.diet.reduce((sum, preyId) => {
        const prey = newSpecies.find(s => s.id === preyId);
        return sum + (prey?.population || 0);
      }, 0);
      
      // Predator suffers if prey is scarce
      if (preyAvailable < 100) {
        predator.health = Math.max(0, predator.health - 10);
        predator.population = Math.floor(predator.population * 0.8);
      }
    }
  });
  
  // Keystone species cascade effects
  const keystoneSpecies = newSpecies.filter(s => s.isKeystone);
  keystoneSpecies.forEach(keystone => {
    if (keystone.health < 30) {
      cascadeEvents.push({
        id: `keystone_crisis_${keystone.id}_${Date.now()}`,
        trigger: `${keystone.name} in crisis`,
        description: `Keystone species ${keystone.name} is in critical condition. Entire ecosystem stability is at risk.`,
        affectedSpecies: newSpecies.map(s => s.id),
        impact: 'negative',
        timestamp: Date.now()
      });
    } else if (keystone.health > 70 && keystone.population > keystone.maxPopulation * 0.6) {
      cascadeEvents.push({
        id: `keystone_thriving_${keystone.id}_${Date.now()}`,
        trigger: `${keystone.name} thriving`,
        description: `Keystone species ${keystone.name} is thriving! Positive cascading effects throughout ecosystem.`,
        affectedSpecies: keystone.diet.concat(keystone.predators),
        impact: 'positive',
        timestamp: Date.now()
      });
    }
  });
  
  // Calculate biodiversity score (species richness + evenness)
  const aliveSpecies = newSpecies.filter(s => s.population > 0).length;
  const biodiversityScore = Math.round((aliveSpecies / RIVER_SPECIES.length) * 100);
  
  // Calculate stability index (based on trophic level balance)
  const trophicBalance = [1, 2, 3, 4].map(level => {
    const speciesAtLevel = newSpecies.filter(s => s.trophicLevel === level && s.population > 0);
    return speciesAtLevel.length;
  });
  const stabilityIndex = Math.round(Math.min(...trophicBalance) / Math.max(...trophicBalance) * 100);
  
  return {
    ...currentState,
    waterQuality: newWaterQuality,
    biodiversityScore,
    stabilityIndex,
    species: newSpecies,
    cascadeEvents: [...currentState.cascadeEvents, ...cascadeEvents]
  };
}

export function initializeEcosystem(waterQuality: number): EcosystemState {
  return {
    waterQuality,
    oxygenLevel: waterQuality * 0.08,  // mg/L
    temperature: 15,  // Celsius
    biodiversityScore: 85,
    stabilityIndex: 75,
    species: RIVER_SPECIES.map(s => ({ ...s })),
    connections: ECOSYSTEM_CONNECTIONS,
    cascadeEvents: []
  };
}

export function getSpeciesByTrophicLevel(ecosystem: EcosystemState, level: TrophicLevel): Species[] {
  return ecosystem.species.filter(s => s.trophicLevel === level && s.population > 0);
}

export function getEndangeredSpecies(ecosystem: EcosystemState): Species[] {
  return ecosystem.species.filter(s => s.isEndangered && s.population > 0);
}

export function getKeystoneSpecies(ecosystem: EcosystemState): Species[] {
  return ecosystem.species.filter(s => s.isKeystone && s.population > 0);
}
