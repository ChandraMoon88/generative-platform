// Game state management types
export interface RiverSegmentData {
  segmentId: number;
  name: string;
  pH: number;
  temperature: number;
  dissolvedOxygen: number;
  pollutionLevel: 'critical' | 'high' | 'moderate' | 'low';
  turbidity: number;
  scanned: boolean;
  timestamp?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LevelProgress {
  levelNumber: number;
  started: boolean;
  dataCollected: RiverSegmentData[];
  quizScore: number | null;
  quizAttempts: number;
  timeSpent: number;
  completed: boolean;
  completedAt?: number;
}

export interface GameState {
  playerName: string;
  currentLevel: number;
  maxUnlockedLevel: number;
  completedLevels: number[];
  levelProgress: {
    [key: number]: LevelProgress;
  };
  totalScore: number;
  achievementsUnlocked: string[];
  lastSaved: number;
}

export const INITIAL_GAME_STATE: GameState = {
  playerName: '',
  currentLevel: 1,
  maxUnlockedLevel: 1,
  completedLevels: [],
  levelProgress: {},
  totalScore: 0,
  achievementsUnlocked: [],
  lastSaved: Date.now()
};

// Local storage helpers
export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem('ecosphere_game_state', JSON.stringify(state));
    localStorage.setItem('ecosphere_last_save', Date.now().toString());
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem('ecosphere_game_state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return null;
};

export const resetGameState = (): void => {
  localStorage.removeItem('ecosphere_game_state');
  localStorage.removeItem('ecosphere_last_save');
};

// Generate realistic river data
export const generateRiverSegmentData = (segmentId: number): RiverSegmentData => {
  // Closer to factory (lower IDs) = worse pollution
  const pollutionFactor = Math.max(0, 1 - (segmentId / 12));
  
  // pH: Lower = more acidic (polluted). Healthy is 6.5-8.5
  const basePH = 4.0 + (segmentId * 0.3) + (Math.random() * 0.5);
  const pH = Math.min(8.5, Math.max(3.5, basePH));
  
  // Temperature: Should be around 65-72°F (normal variation)
  const temperature = 65 + Math.random() * 7;
  
  // Dissolved Oxygen: Lower = worse. Healthy is 6+ mg/L
  const baseOxygen = 2 + (segmentId * 0.35) + (Math.random() * 1);
  const dissolvedOxygen = Math.min(9, Math.max(1.5, baseOxygen));
  
  // Turbidity: Higher = more pollution. Clear water < 10 NTU
  const baseTurbidity = 120 - (segmentId * 8) + (Math.random() * 20);
  const turbidity = Math.max(5, baseTurbidity);
  
  // Determine pollution level
  let pollutionLevel: 'critical' | 'high' | 'moderate' | 'low';
  if (pH < 5 || dissolvedOxygen < 3 || turbidity > 80) {
    pollutionLevel = 'critical';
  } else if (pH < 6 || dissolvedOxygen < 5 || turbidity > 50) {
    pollutionLevel = 'high';
  } else if (pH < 6.5 || dissolvedOxygen < 6 || turbidity > 20) {
    pollutionLevel = 'moderate';
  } else {
    pollutionLevel = 'low';
  }
  
  return {
    segmentId,
    name: `Segment ${segmentId}`,
    pH: Math.round(pH * 10) / 10,
    temperature: Math.round(temperature * 10) / 10,
    dissolvedOxygen: Math.round(dissolvedOxygen * 10) / 10,
    pollutionLevel,
    turbidity: Math.round(turbidity),
    scanned: false
  };
};

// Quiz questions for Level 1
export const LEVEL_1_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the healthy pH range for river water?",
    options: ["3.0 - 5.0", "6.5 - 8.5", "9.0 - 11.0", "12.0 - 14.0"],
    correctAnswer: 1,
    explanation: "Healthy river water has a pH between 6.5 and 8.5. Values outside this range can harm aquatic life."
  },
  {
    id: 2,
    question: "What does low dissolved oxygen (below 5 mg/L) indicate?",
    options: [
      "Water is perfectly healthy",
      "Fish and aquatic life are thriving",
      "Aquatic organisms are struggling to survive",
      "Water temperature is too cold"
    ],
    correctAnswer: 2,
    explanation: "Dissolved oxygen below 5-6 mg/L means aquatic life struggles to get enough oxygen to survive."
  },
  {
    id: 3,
    question: "Based on your data, which river segments show critical pollution?",
    options: [
      "Segments near the source (1-3)",
      "Segments in the middle (5-7)",
      "Segments downstream (8-10)",
      "All segments equally"
    ],
    correctAnswer: 0,
    explanation: "Segments closest to pollution sources (near the factory upstream) typically show the worst conditions."
  },
  {
    id: 4,
    question: "What does high turbidity (cloudiness) in water suggest?",
    options: [
      "Water is clean and clear",
      "Presence of suspended particles and pollutants",
      "High oxygen content",
      "Perfect ecosystem health"
    ],
    correctAnswer: 1,
    explanation: "High turbidity means suspended particles, sediment, or pollutants make the water cloudy."
  },
  {
    id: 5,
    question: "Why is it important to scan multiple river segments?",
    options: [
      "It's not important, one segment is enough",
      "To understand pollution distribution and identify worst areas",
      "Just to waste time",
      "Only to make the game longer"
    ],
    correctAnswer: 1,
    explanation: "Scanning multiple segments reveals how pollution spreads and helps prioritize restoration efforts."
  },
  {
    id: 6,
    question: "If pH is 4.2, what does this indicate?",
    options: [
      "Water is too alkaline",
      "Water is highly acidic and polluted",
      "Water is neutral and safe",
      "pH doesn't matter for water quality"
    ],
    correctAnswer: 1,
    explanation: "pH 4.2 is highly acidic (normal is 6.5-8.5), indicating serious pollution that harms aquatic life."
  },
  {
    id: 7,
    question: "What's the first step in environmental restoration?",
    options: [
      "Immediately start cleaning",
      "Understanding the full scope of the problem through assessment",
      "Blame someone for the pollution",
      "Ignore the data and hope it improves"
    ],
    correctAnswer: 1,
    explanation: "Comprehensive assessment and data collection come first - you can't fix what you don't understand."
  },
  {
    id: 8,
    question: "Clear water with low turbidity (<10 NTU) indicates:",
    options: [
      "High pollution levels",
      "Dangerous toxic chemicals",
      "Healthy, clean water conditions",
      "Acidic environment"
    ],
    correctAnswer: 2,
    explanation: "Low turbidity means clear water with few suspended particles - a sign of good water quality."
  },
  {
    id: 9,
    question: "Why might downstream segments show better conditions than upstream?",
    options: [
      "Pollution magically disappears",
      "Natural dilution and distance from pollution sources",
      "Fish clean the water themselves",
      "Downstream is always polluted"
    ],
    correctAnswer: 1,
    explanation: "As water flows downstream, it can be diluted by clean tributaries and distance from pollution sources."
  },
  {
    id: 10,
    question: "What's your primary goal as a Restoration Architect in Level 1?",
    options: [
      "Win points as fast as possible",
      "Thoroughly understand the river's condition to plan effective restoration",
      "Scan randomly without thinking",
      "Complete as quickly as possible"
    ],
    correctAnswer: 1,
    explanation: "Your goal is deep understanding. Rushed assessment leads to ineffective restoration plans."
  }
];

export const calculateQuizScore = (answers: number[]): { score: number; passed: boolean } => {
  const correct = answers.filter((answer, index) => answer === LEVEL_1_QUIZ[index].correctAnswer).length;
  const score = Math.round((correct / LEVEL_1_QUIZ.length) * 100);
  const passed = score >= 70; // Need 70% to pass
  
  return { score, passed };
};
