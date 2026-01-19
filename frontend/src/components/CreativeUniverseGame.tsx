'use client';

import React, { useState, useEffect } from 'react';

interface GameProgress {
  currentLevel: number;
  currentStage: number;
  environment: string | null;
  completedChallenges: string[];
  unlockedComponents: any[];
  score: number;
  playtime: number; // in seconds
  achievements: string[];
}

const environments = [
  { 
    id: 'sunset', 
    name: 'Sunset Paradise', 
    emoji: '🌅', 
    description: 'Warm, vibrant, and energetic atmosphere',
    color: 'from-orange-400 via-red-500 to-pink-500',
    theme: { primary: '#FF6B6B', secondary: '#FFA500', bg: '#FFF5E6', text: '#2C1810' }
  },
  { 
    id: 'ocean', 
    name: 'Ocean Depths', 
    emoji: '🌊', 
    description: 'Cool, calm, and flowing serenity',
    color: 'from-blue-400 via-cyan-500 to-teal-500',
    theme: { primary: '#4A90E2', secondary: '#00CED1', bg: '#E6F7FF', text: '#003D5C' }
  },
  { 
    id: 'forest', 
    name: 'Mystic Forest', 
    emoji: '🌲', 
    description: 'Natural, grounded, and peaceful haven',
    color: 'from-green-400 via-emerald-500 to-lime-500',
    theme: { primary: '#228B22', secondary: '#90EE90', bg: '#F0FFF0', text: '#1B4D1B' }
  },
  { 
    id: 'cosmic', 
    name: 'Cosmic Galaxy', 
    emoji: '🌌', 
    description: 'Mysterious, infinite, and inspiring universe',
    color: 'from-purple-500 via-indigo-600 to-blue-700',
    theme: { primary: '#6A0DAD', secondary: '#9D4EDD', bg: '#1A0B2E', text: '#E0D8F0' }
  },
  { 
    id: 'desert', 
    name: 'Golden Desert', 
    emoji: '🏜️', 
    description: 'Vast, warm, and timeless expanse',
    color: 'from-yellow-400 via-amber-500 to-orange-600',
    theme: { primary: '#F59E0B', secondary: '#FBBF24', bg: '#FFFBEB', text: '#78350F' }
  },
  { 
    id: 'arctic', 
    name: 'Arctic Aurora', 
    emoji: '❄️', 
    description: 'Crisp, pure, and magical wonderland',
    color: 'from-cyan-300 via-blue-400 to-indigo-500',
    theme: { primary: '#67E8F9', secondary: '#60A5FA', bg: '#F0F9FF', text: '#075985' }
  }
];

// MASSIVE game structure - 3+ hours of gameplay
const gameStructure = {
  level1: {
    name: "Discovery Phase",
    stages: [
      {
        id: "welcome",
        name: "Philosophy of Space",
        challenges: [
          { id: "intro1", type: "choice", question: "In environmental psychology, how does spatial cognition influence user behavior in digital landscapes?", options: ["Affordance Theory - spaces suggest actions", "Gestalt Principles - wholeness perception", "Biophilic Design - nature connection", "Phenomenology - lived experience"], points: 50 },
          { id: "intro2", type: "choice", question: "If color temperature could represent temporal dynamics, how would you map time to chromatic experience?", options: ["Warm→Cool: Past→Future", "Saturation: Moment Intensity", "Hue Rotation: Cyclical Rhythm", "Value Gradient: Consciousness Depth"], points: 75 },
          { id: "intro3", type: "text", question: "🎮 Fun Challenge: Describe your ideal digital environment as if it were a living organism. What does it breathe? How does it grow?", placeholder: "My environment breathes through...", points: 100 }
        ]
      },
      {
        id: "environment-intro",
        name: "Spatial Semantics",
        challenges: [
          { id: "env1", type: "choice", question: "In the context of semiotics, how do environmental signifiers create meaning hierarchies?", options: ["Icons: Visual Metaphors", "Indexes: Causal Relationships", "Symbols: Cultural Constructs", "Syntactic Patterns: Structural Rhythm"], points: 100 },
          { id: "env2", type: "slider", question: "🎮 Fun Activity: Adjust the 'emotional resonance frequency' of your space (0=meditative, 100=exhilarating)", min: 0, max: 100, points: 75 },
          { id: "env3", type: "choice", question: "How does negative space function as an active compositional element in environmental narrative?", options: ["Silence as Emphasis", "Void as Potential", "Breath as Rhythm", "Absence as Presence"], points: 100 },
          { id: "env4", type: "text", question: "🌟 Creative Exercise: If your environment were a musical composition, what would be its signature chord progression?", placeholder: "My spatial symphony moves from...", points: 150 }
        ]
      }
    ]
  },
  level2: {
    name: "Environment Selection",
    stages: [
      {
        id: "explore-environments",
        name: "Phenomenological Immersion",
        challenges: [
          { id: "exp1", type: "choice", question: "Which elemental archetype embodies your design epistemology? Consider thermodynamics, fluid dynamics, and crystalline structures.", options: ["Pyroclastic Flow (Sun/Fire): Transformation through energy", "Hydrodynamic Current (Water): Adaptive flow and emergence", "Fractal Branching (Forest): Recursive complexity", "Quantum Vacuum (Cosmic): Infinite possibility space", "Aeolian Erosion (Desert): Time's sculptural force", "Phase Transition (Arctic): Boundary states"], points: 150 },
          { id: "exp2", type: "choice", question: "🎨 Synesthesia Challenge: If you could taste your chosen environment, what flavor profile would it have?", options: ["Umami - Deep, Complex, Layered", "Sweet - Harmonious, Balanced", "Bitter - Sophisticated, Refined", "Sour - Dynamic, Energetic", "Salty - Grounded, Elemental"], points: 100 },
          { id: "exp3", type: "text", question: "Describe how circadian rhythms and chronobiology influence your environmental color perception across different cognitive states.", placeholder: "My environment shifts with consciousness because...", points: 200 },
          { id: "exp4", type: "choice", question: "🎭 Role-Play: You're an environmental architect in 2150. How do your spaces adapt to users' neural states?", options: ["Brainwave-Responsive Chromatics", "Emotional Field Mapping", "Memory Palace Architecture", "Dream State Navigation"], points: 150 }
        ]
      }
    ]
  },
  level3: {
    name: "Foundation Building",
    stages: [
      {
        id: "color-theory",
        name: "Chromatic Quantum Mechanics",
        challenges: [
          { id: "col1", type: "choice", question: "In color theory, how does the opponent process theory inform emotional valence in interface design?", options: ["Red-Green Axis: Arousal-Relaxation", "Blue-Yellow Axis: Thermal Perception", "Light-Dark Axis: Cognitive Load", "Saturation Depth: Attention Gradient"], points: 150 },
          { id: "col2", type: "choice", question: "🎮 Mini-Game: You're mixing pigments in a neural laboratory. Which combination creates 'digital nostalgia'?", options: ["Sunset Orange + Pixel Blue", "Analog Violet + Glitch Green", "Retro Cyan + Static Amber", "Memory Magenta + Dream Teal"], points: 100 },
          { id: "col3", type: "text", question: "Apply Goethe's color theory to describe how your palette manifests psychological archetypes.", placeholder: "My colors embody archetypal forces through...", points: 200 },
          { id: "col4", type: "choice", question: "How does metamerism (color matching under different illuminants) influence cross-device environmental consistency?", options: ["Spectral Power Distribution", "Observer Variability Modeling", "Chromatic Adaptation Transform", "Perceptual Uniformity Mapping"], points: 150 },
          { id: "col5", type: "choice", question: "🌈 Fun Challenge: If your color palette were a chemical reaction, what would be its activation energy?", options: ["Spontaneous (Low Energy)", "Catalyzed (Medium Energy)", "Explosive (High Energy)", "Quantum Tunneling (Probabilistic)"], points: 100 },
          { id: "col6", type: "text", question: "Describe the 'temporal chromatics' of your environment: how colors evolve across user journey stages.", placeholder: "Colors transform temporally as users...", points: 200 }
        ]
      },
      {
        id: "layout-basics",
        name: "Topological Interface Theory",
        challenges: [
          { id: "lay1", type: "choice", question: "Apply network topology principles: how does your spatial graph minimize cognitive traversal distance?", options: ["Star Topology: Central Authority", "Mesh Topology: Distributed Access", "Tree Topology: Hierarchical Navigation", "Hypergraph: Non-linear Pathways"], points: 150 },
          { id: "lay2", type: "choice", question: "🎯 Interactive Puzzle: Arrange these elements using the golden ratio and Fibonacci spirals. What emerges?", options: ["Natural Eye Flow", "Dynamic Tension", "Harmonic Resonance", "Fractal Recursion"], points: 150 },
          { id: "lay3", type: "text", question: "Using gestalt principles, explain how proximity, similarity, and continuity create emergent meaning.", placeholder: "Spatial relationships generate meaning through...", points: 200 },
          { id: "lay4", type: "slider", question: "🎨 Calibration: Set the 'entropy level' of your layout (0=perfect order, 100=creative chaos)", min: 0, max: 100, points: 100 },
          { id: "lay5", type: "choice", question: "How does F-pattern vs. Z-pattern scanning influence information architecture in your environment?", options: ["F-Pattern: Content-Heavy", "Z-Pattern: Minimal Focused", "Layer Cake: Horizontal Scanning", "Spotted Pattern: Non-Linear"], points: 150 }
        ]
      }
    ]
  },
  level4: {
    name: "Element Creation",
    stages: [
      {
        id: "hero-section",
        name: "Threshold Experience Design",
        challenges: [
          { id: "hero1", type: "choice", question: "Apply liminal space theory: your hero section is a psychological threshold. What transitional state does it embody?", options: ["Anticipation: Pre-Experience Tension", "Immersion: Immediate Absorption", "Disorientation: Cognitive Restructuring", "Recognition: Familiar Reimagining"], points: 150 },
          { id: "hero2", type: "text", question: "🎭 Story Time: Write a hero section that uses narrative transportation theory to create immediate engagement.", placeholder: "You enter a space where...", points: 250 },
          { id: "hero3", type: "choice", question: "Using scale psychology, how should your hero's typographic hierarchy manipulate perceived environmental depth?", options: ["Forced Perspective: Dramatic Depth", "Isometric Equality: Democratic Space", "Atmospheric Fade: Infinite Horizon", "Scalar Ambiguity: Perceptual Play"], points: 150 },
          { id: "hero4", type: "choice", question: "🎬 Animation Challenge: Design an entrance sequence based on physics simulations. What law of motion?", options: ["Spring Dynamics: Elastic Energy", "Gravity Wells: Orbital Attraction", "Particle Systems: Emergent Complexity", "Wave Propagation: Ripple Effects"], points: 150 },
          { id: "hero5", type: "text", question: "Describe your hero section's 'attentional magnetism' using neuroscience principles (foveal vs peripheral processing).", placeholder: "Visual attention is captured through...", points: 200 }
        ]
      },
      {
        id: "content-areas",
        name: "Information Ecology",
        challenges: [
          { id: "cont1", type: "choice", question: "Apply narrative theory: how does your content architecture implement Freytag's dramatic structure in spatial form?", options: ["Exposition: Layered Revelation", "Rising Action: Progressive Disclosure", "Climax: Focal Intensity", "Denouement: Resolution Space"], points: 200 },
          { id: "cont2", type: "choice", question: "🎲 Randomness Game: Use Perlin noise to generate content distribution. What pattern emerges?", options: ["Organic Clusters", "Smooth Gradients", "Turbulent Flow", "Harmonic Waves"], points: 150 },
          { id: "cont3", type: "text", question: "Describe your content ecosystem using ecological succession principles: pioneer species, climax community, disturbance regimes.", placeholder: "Content evolves like an ecosystem through...", points: 250 },
          { id: "cont4", type: "choice", question: "How does information scent (term from information foraging theory) guide navigation?", options: ["Semantic Proximity Cues", "Visual Weight Hierarchy", "Haptic Feedback Trails", "Temporal Breadcrumbs"], points: 150 },
          { id: "cont5", type: "choice", question: "🧩 Puzzle Mode: Arrange content using tessellation patterns. Which creates optimal cognitive chunks?", options: ["Hexagonal Packing", "Voronoi Diagrams", "Penrose Tiling", "Modular Grid"], points: 150 }
        ]
      },
      {
        id: "inBehavioral Choreography",
        challenges: [
          { id: "int1", type: "choice", question: "Using haptic psychology, what tactile metaphor should interactive elements embody?", options: ["Viscosity: Fluid Resistance", "Elasticity: Spring Memory", "Plasticity: Permanent Deformation", "Crystalline: Brittle Precision"], points: 150 },
          { id: "int2", type: "choice", question: "🎮 Physics Playground: Design hover states using real physics. What force interaction?", options: ["Magnetic Attraction", "Gravitational Lens", "Electrostatic Charge", "Quantum Superposition"], points: 150 },
          { id: "int3", type: "text", question: "Describe your interaction model using operant conditioning: what behavior-reward loop does it establish?", placeholder: "Users are reinforced through...", points: 200 },
          { id: "int4", type: "choice", question: "How does your affordance design balance Donald Norman's signifiers vs. perceptual affordances?", options: ["Explicit Signifiers: Clarity First", "Discovered Affordances: Exploration", "Cultural Conventions: Learned Patterns", "Emergent Properties: Systemic Discovery"], points: 150 },
          { id: "int5", type: "choice", question: "🎪 Fun Exercise: Your buttons are performers. What's their stage personality?", options: ["Method Actor: Deep Immersion", "Improviser: Responsive Play", "Mime: Silent Expression", "Magician: Surprising Transformation
          { id: "int4", type: "choice", question: "How obvious should actions be?", options: ["Very Clear", "Subtle Hints", "Hidden Until Hover", "Always Visible"], points: 100 }
        ]
      }
    ]
  },
  level5: {
    name: "Advanced Design",
    stages: [
      {Typographic Phenomenology",
        challenges: [
          { id: "typ1", type: "choice", question: "Apply type classification history: which typographic paradigm aligns with your environmental philosophy?", options: ["Humanist: Renaissance Proportion", "Transitional: Enlightenment Rationality", "Modern: Industrial Geometry", "Postmodern: Deconstructed Meaning"], points: 200 },
          { id: "typ2", type: "slider", question: "🎼 Musical Tuning: Set your typographic scale using harmonic ratios (perfect fourth = 1.333, perfect fifth = 1.5)", min: 1, max: 2, points: 150 },
          { id: "typ3", type: "text", question: "Describe your typography's 'voice' using phonetics: what acoustic properties does it possess?", placeholder: "My type speaks with...", points: 200 },
          { id: "typ4", type: "choice", question: "How does vertical rhythm establish temporal pacing in reading flow? Apply music theory.", options: ["Adagio: Slow, Spacious", "Andante: Walking Pace", "Allegro: Brisk, Energetic", "Syncopated: Unexpected Rhythm"], points: 150 },
          { id: "typ5", type: "choice", question: "🎨 Calligraphy Challenge: If you handwrote your interface, what script style?", options: ["Gothic: Dense Texture", "Italic: Flowing Grace", "Uncial: Rounded Warmth", "Blackletter: Dramatic Contrast"], points: 100 },
          { id: "typ6", type: "text", question: "Using semiotics, explain how your typography creates meaning through connotation vs. denotation.", placeholder: "Type connotes cultural meaning by...", points: 2points: 100 },
          { id: "typ4", type: "slider", question: "Line spacing comfort level?", min: 0, max: 100, points: 100 },
          { id: "typ5", type: "choice", question: "Text weight for emphasis?", options: ["Bold & Strong", "Medium Balance", "Light & Airy", "Variable Mix"], points: 100 }
        ]
      },
      {
        id: "spacing-rhythm",
        name: "Mastering Rhythm & Spacing",
        challenges: [
          { id: "spa1", type: "choice", question: "How should elements breathe?", options: ["Lots of Space", "Comfortable", "Compact", "Tight & Packed"], points: 150 },
          { id: "spa2", type: "choice", question: "Create visual rhythm with:", options: ["Regular Patterns", "Varied Sizes", "Alternating Styles", "Random Flow"], points: 150 },
          { id: "spa3", type: "slider", question: "Padding around content?", min: 0, max: 100, points: 100 },
          { id: "spa4", type: "choice", question: "Margins between sections?", options: ["Large Gaps", "Medium Space", "Small Breaks", "Minimal Separation"], points: 100 }
        ]
      },
      {
        id: "visual-hierarchy",
        name: "Building Visual Hierarchy",
        challenges: [
          { id: "vis1", type: "ranking", question: "Rank importance of elements:", items: ["Headline", "Image", "Description", "Action Button"], points: 200 },
          { id: "vis2", type: "choice", question: "Guide attention through:", options: ["Size Contrast", "Color Emphasis", "Position Flow", "Animation"], points: 150 },
          { id: "vis3", type: "choice", question: "Secondary information should:", options: ["Fade to Background", "Complement Primary", "Create Balance", "Add Details"], points: 150 }
        ]
      }
    ]
  },
  level6: {
    name: "Personality & Character",
    stages: [
      {
        id: "style-identity",
        name: "Defining Your Style",
        challenges: [
          { id: "sty1", type: "choice", question: "Your design personality:", options: ["Minimalist & Pure", "Rich & Detailed", "Playful & Creative", "Professional & Polished"], points: 200 },
          { id: "sty2", type: "choice", question: "How much decoration?", options: ["None - Pure Function", "Subtle Touches", "Moderate Flair", "Abundant Details"], points: 150 },
          { id: "sty3", type: "text", question: "Three words that describe your style:", placeholder: "e.g., elegant, modern, warm", points: 200 },
          { id: "sty4", type: "choice", question: "Icons or text for navigation?", options: ["Icons Only", "Text Only", "Combined", "Context Dependent"], points: 100 }
        ]
      },
      {
        id: "emotional-design",
        name: "Emotional Connections",
        challenges: [
          { id: "emo1", type: "choice", question: "First emotion to evoke:", options: ["Trust", "Excitement", "Comfort", "Wonder"], points: 150 },
          { id: "emo2", type: "choice", question: "Overall feeling should be:", options: ["Professional", "Friendly", "Inspiring", "Unique"], points: 150 },
          { id: "emo3", type: "text", question: "How should visitors feel leaving?", placeholder: "Describe the feeling...", points: 200 },
          { id: "emo4", type: "choice", question: "Personal touch through:", options: ["Custom Graphics", "Warm Language", "Unique Interactions", "Story Elements"], points: 150 }
        ]
      },
      {
        id: "brand-voice",
        name: "Developing Voice",
        challenges: [
          { id: "voi1", type: "choice", question: "Communication tone:", options: ["Formal & Professional", "Casual & Friendly", "Inspiring & Motivational", "Playful & Fun"], points: 150 },
          { id: "voi2", type: "text", question: "Your signature phrase:", placeholder: "A memorable tagline...", points: 200 },
          { id: "voi3", type: "choice", question: "Naming style for sections:", options: ["Descriptive & Clear", "Creative & Unique", "Questions & Prompts", "Simple & Direct"], points: 100 }
        ]
      }
    ]
  },
  level7: {
    name: "Refinement & Polish",
    stages: [
      {
        id: "details-matters",
        name: "Perfecting Details",
        challenges: [
          { id: "det1", type: "choice", question: "Corner style preference:", options: ["Sharp Edges", "Slightly Rounded", "Very Rounded", "Circular"], points: 100 },
          { id: "det2", type: "choice", question: "Shadow depth:", options: ["No Shadows", "Subtle Lift", "Medium Depth", "Strong Contrast"], points: 100 },
          { id: "det3", type: "choice", question: "Border treatment:", options: ["No Borders", "Thin Lines", "Medium Weight", "Bold Frames"], points: 100 },
          { id: "det4", type: "slider", question: "Transition speed?", min: 0, max: 100, points: 100 },
          { id: "det5", type: "choice", question: "Loading state style:", options: ["Spinner", "Progress Bar", "Skeleton", "Fade"], points: 100 }
        ]
      },
      {
        id: "consistency",
        name: "Achieving Consistency",
        challenges: [
          { id: "con1", type: "choice", question: "Spacing system:", options: ["Strict Grid", "Flexible Flow", "Golden Ratio", "Custom Mix"], points: 150 },
          { id: "con2", type: "choice", question: "Color variations:", options: ["Strict Palette", "Tints & Shades", "Dynamic Themes", "Contextual"], points: 150 },
          { id: "con3", type: "choice", question: "Element sizing:", options: ["Fixed Sizes", "Relative Scale", "Responsive Fluid", "Adaptive"], points: 150 }
        ]
      },
      {
        id: "accessibility",
        name: "Inclusive Design",
        challenges: [
          { id: "acc1", type: "choice", question: "Text readability priority:", options: ["Maximum Contrast", "Comfortable Reading", "Stylistic Balance", "User Adjustable"], points: 150 },
          { id: "acc2", type: "choice", question: "Focus indicators:", options: ["Prominent & Clear", "Subtle & Elegant", "Animated", "Custom Styled"], points: 100 },
          { id: "acc3", type: "choice", question: "Alternative text approach:", options: ["Descriptive & Detailed", "Concise & Clear", "Context Aware", "Progressive"], points: 100 }
        ]
      }
    ]
  },
  level8: {
    name: "Master Creation",
    stages: [
      {
        id: "final-touches",
        name: "Adding Magic",
        challenges: [
          { id: "fin1", type: "choice", question: "Signature element:", options: ["Unique Animation", "Custom Graphic", "Special Effect", "Hidden Easter Egg"], points: 200 },
          { id: "fin2", type: "text", question: "What makes this uniquely yours?", placeholder: "Your creative signature...", points: 250 },
          { id: "fin3", type: "choice", question: "How to surprise visitors:", options: ["Unexpected Interaction", "Hidden Content", "Playful Details", "Dynamic Changes"], points: 200 },
          { id: "fin4", type: "text", question: "Final message to visitors:", placeholder: "Your parting words...", points: 250 }
        ]
      },
      {
        id: "completion",
        name: "Bringing It Together",
        challenges: [
          { id: "comp1", type: "review", question: "Review your color choices", points: 300 },
          { id: "comp2", type: "review", question: "Check your layout flow", points: 300 },
          { id: "comp3", type: "review", question: "Verify your interactions", points: 300 },
          { id: "comp4", type: "text", question: "Name your creation:", placeholder: "Give it a memorable name", points: 300 },
          { id: "comp5", type: "text", question: "Describe what you built:", placeholder: "Tell the story of your world", points: 300 }
        ]
      }
    ]
  }
};

export default function CreativeUniverseGame({ onGameComplete }: { onGameComplete: (components: any[]) => void }) {
  const [progress, setProgress] = useState<GameProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gameProgress');
      if (saved) return JSON.parse(saved);
    }
    return {
      currentLevel: 1,
      currentStage: 0,
      environment: null,
      completedChallenges: [],
      unlockedComponents: [],
      score: 0,
      playtime: 0,
      achievements: []
    };
  });

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);

  // Save progress
  useEffect(() => {
    localStorage.setItem('gameProgress', JSON.stringify(progress));
  }, [progress]);

  // Playtime tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => ({ ...prev, playtime: prev.playtime + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const getCurrentStageData = () => {
    const levelKey = `level${progress.currentLevel}` as keyof typeof gameStructure;
    const level = gameStructure[levelKey];
    if (!level) return null;
    return level.stages[progress.currentStage];
  };

  const handleAnswer = (answer: any) => {
    const stage = getCurrentStageData();
    if (!stage) return;

    const challenge = stage.challenges[currentChallenge];
    const newScore = progress.score + challenge.points;
    const challengeId = `L${progress.currentLevel}S${progress.currentStage}C${currentChallenge}`;

    // Create component from answer
    const component = createComponentFromAnswer(challenge, answer);

    setProgress(prev => ({
      ...prev,
      score: newScore,
      completedChallenges: [...prev.completedChallenges, challengeId],
      unlockedComponents: [...prev.unlockedComponents, component]
    }));

    // Move to next challenge
    if (currentChallenge < stage.challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setUserAnswer(null);
    } else {
      // Move to next stage or level
      advanceProgress();
    }
  };

  const advanceProgress = () => {
    const levelKey = `level${progress.currentLevel}` as keyof typeof gameStructure;
    const level = gameStructure[levelKey];

    if (progress.currentStage < level.stages.length - 1) {
      setProgress(prev => ({
        ...prev,
        currentStage: prev.currentStage + 1
      }));
      setCurrentChallenge(0);
    } else if (progress.currentLevel < 8) {
      setProgress(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        currentStage: 0
      }));
      setCurrentChallenge(0);
    } else {
      // Game complete!
      onGameComplete(progress.unlockedComponents);
    }
  };

  const createComponentFromAnswer = (challenge: any, answer: any) => {
    const env = environments.find(e => e.id === progress.environment) || environments[0];
    const id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      type: 'Card',
      category: 'Layout & Containers',
      props: {
        title: challenge.question,
        content: typeof answer === 'string' ? answer : JSON.stringify(answer),
        backgroundColor: env.theme.bg,
        color: env.theme.text,
        padding: '32px',
        borderRadius: '16px',
        borderWidth: '2px',
        borderColor: env.theme.primary
      }
    };
  };

  // Select environment
  if (!progress.environment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="text-center text-white mb-12">
            <h1 className="text-7xl font-bold mb-4">Choose Your Universe</h1>
            <p className="text-2xl opacity-90">Select the environment that speaks to your soul</p>
            <div className="mt-6 text-xl">
              <div>⏱️ Estimated Journey: 3-4 hours</div>
              <div className="text-sm opacity-75 mt-2">Take your time - this is your creative adventure</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {environments.map((env) => (
              <button
                key={env.id}
                onClick={() => setProgress({...progress, environment: env.id})}
                className="group relative overflow-hidden rounded-3xl p-8 text-left transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${env.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10 text-white">
                  <div className="text-7xl mb-4">{env.emoji}</div>
                  <h3 className="text-3xl font-bold mb-2">{env.name}</h3>
                  <p className="text-lg opacity-90">{env.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stage = getCurrentStageData();
  if (!stage) return <div>Loading...</div>;

  const challenge = stage.challenges[currentChallenge];
  const levelKey = `level${progress.currentLevel}` as keyof typeof gameStructure;
  const level = gameStructure[levelKey];
  const totalChallenges = level.stages.reduce((sum, s) => sum + s.challenges.length, 0);
  const completedInLevel = progress.completedChallenges.filter(c => c.startsWith(`L${progress.currentLevel}`)).length;
  const levelProgress = (completedInLevel / totalChallenges) * 100;

  const env = environments.find(e => e.id === progress.environment)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">{progress.score}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">L{progress.currentLevel}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{formatTime(progress.playtime)}</div>
              <div className="text-sm text-gray-600">Playtime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{progress.unlockedComponents.length}</div>
              <div className="text-sm text-gray-600">Created</div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{level.name}</h2>
              <p className="text-gray-600">{stage.name}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-purple-600">
                {currentChallenge + 1} / {stage.challenges.length}
              </div>
              <div className="text-sm text-gray-500">Challenge</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Challenge Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{env.emoji}</div>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
              +{challenge.points} Points
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-4">{challenge.question}</h3>
          </div>

          {/* Answer UI based on challenge type */}
          {challenge.type === 'choice' && 'options' in challenge && challenge.options && (
            <div className="grid md:grid-cols-2 gap-4">
              {challenge.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-left hover:shadow-xl transform transition-all hover:scale-105 border-2 border-transparent hover:border-purple-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {['🎨', '✨', '🌟', '💫'][index % 4]}
                    </div>
                    <div className="text-xl font-bold text-gray-800">{option}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {challenge.type === 'text' && 'placeholder' in challenge && challenge.placeholder && (
            <div>
              <textarea
                value={userAnswer || ''}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={challenge.placeholder}
                className="w-full px-6 py-4 border-2 border-purple-200 rounded-2xl text-lg focus:border-purple-600 focus:ring-4 focus:ring-purple-200 transition-all"
                rows={4}
              />
              <button
                onClick={() => handleAnswer(userAnswer)}
                disabled={!userAnswer || userAnswer.length < 3}
                className="mt-4 w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-xl font-bold hover:scale-105 transform transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          )}

          {challenge.type === 'slider' && 'min' in challenge && (
            <div>
              <input
                type="range"
                min={'min' in challenge ? challenge.min : 0}
                max={'max' in challenge ? challenge.max : 100}
                value={userAnswer || 50}
                onChange={(e) => setUserAnswer(parseInt(e.target.value))}
                className="w-full h-4 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center mt-4 text-4xl font-bold text-purple-600">
                {userAnswer || 50}
              </div>
              <button
                onClick={() => handleAnswer(userAnswer || 50)}
                className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-xl font-bold hover:scale-105 transform transition-all shadow-lg"
              >
                Lock In →
              </button>
            </div>
          )}

          {(challenge.type === 'ranking' || challenge.type === 'match' || challenge.type === 'palette' || challenge.type === 'review') && (
            <div className="text-center">
              <button
                onClick={() => handleAnswer('completed')}
                className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-2xl font-bold hover:scale-105 transform transition-all shadow-lg"
              >
                Complete Challenge →
              </button>
              <p className="mt-4 text-gray-600">Click to continue - all answers are valid!</p>
            </div>
          )}
        </div>

        {/* Hint Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            {showHint ? '🔓 Hide Hint' : '💡 Need a Hint?'}
          </button>
          {showHint && (
            <div className="mt-3 p-4 bg-purple-50 rounded-lg text-gray-700">
              There's no wrong answer! Choose what feels right to you. This is your creative journey.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
