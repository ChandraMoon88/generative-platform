// Achievement and Reputation Tracking System

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'speed' | 'quality' | 'discovery' | 'impact' | 'mastery' | 'social' | 'innovation';
  icon: string;
  requirement: string;
  points: number;
  unlocked: boolean;
  unlockedDate?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
  // Speed Category
  {
    id: 'speed_level1',
    title: 'Swift Scanner',
    description: 'Complete Level 1 in under 5 minutes',
    category: 'speed',
    icon: '⚡',
    requirement: 'Complete river scanning quickly',
    points: 10,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'speed_level5',
    title: 'Ecosystem Expert',
    description: 'Complete Level 5 ecosystem mapping in under 15 minutes',
    category: 'speed',
    icon: '🌊',
    requirement: 'Master ecosystem analysis efficiently',
    points: 25,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'speed_marathon',
    title: 'Marathon Restorer',
    description: 'Complete 5 levels in a single session',
    category: 'speed',
    icon: '🏃',
    requirement: 'Sustained restoration effort',
    points: 50,
    unlocked: false,
    rarity: 'epic'
  },

  // Quality Category
  {
    id: 'quality_perfect_scan',
    title: 'Perfect Scanner',
    description: 'Scan all 10 river sections without missing any pollution indicators',
    category: 'quality',
    icon: '🎯',
    requirement: 'Complete scanning with 100% accuracy',
    points: 15,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'quality_budget_master',
    title: 'Budget Master',
    description: 'Complete Level 3 planning phase with $0 waste',
    category: 'quality',
    icon: '💰',
    requirement: 'Perfect resource allocation',
    points: 30,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'quality_zero_casualties',
    title: 'Zero Casualties',
    description: 'Complete Level 5 without any species going extinct',
    category: 'quality',
    icon: '🛡️',
    requirement: 'Protect all species in ecosystem',
    points: 40,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'quality_perfect_game',
    title: 'Restoration Perfection',
    description: 'Complete all 15 levels with 100% scores',
    category: 'quality',
    icon: '👑',
    requirement: 'Achieve perfection across all levels',
    points: 100,
    unlocked: false,
    rarity: 'legendary'
  },

  // Discovery Category
  {
    id: 'discovery_first_otter',
    title: 'Otter Whisperer',
    description: 'Witness the return of river otters to cleaned sections',
    category: 'discovery',
    icon: '🦦',
    requirement: 'Restore habitat quality for keystone species',
    points: 20,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'discovery_hidden_source',
    title: 'Detective',
    description: 'Discover the hidden pollution source in Level 2',
    category: 'discovery',
    icon: '🔍',
    requirement: 'Find all pollution sources including hidden one',
    points: 25,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'discovery_secret_species',
    title: 'Biodiversity Champion',
    description: 'Document rare species that only appear in pristine water',
    category: 'discovery',
    icon: '🦋',
    requirement: 'Achieve water quality above 95%',
    points: 35,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'discovery_elder_wisdom',
    title: 'Wisdom Seeker',
    description: 'Unlock Elder Redcrow\'s traditional knowledge',
    category: 'discovery',
    icon: '📚',
    requirement: 'Reach Level 8 and choose integration path',
    points: 30,
    unlocked: false,
    rarity: 'epic'
  },

  // Impact Category
  {
    id: 'impact_community_trust',
    title: 'Trusted Leader',
    description: 'Achieve 80+ reputation with Local Residents',
    category: 'impact',
    icon: '🤝',
    requirement: 'Build strong community relationships',
    points: 25,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'impact_universal_respect',
    title: 'Universal Respect',
    description: 'Maintain 60+ reputation with ALL factions simultaneously',
    category: 'impact',
    icon: '⭐',
    requirement: 'Balance competing interests perfectly',
    points: 50,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'impact_ecosystem_thriving',
    title: 'Ecosystem Healer',
    description: 'Achieve 90+ biodiversity score in Level 5',
    category: 'impact',
    icon: '🌿',
    requirement: 'Create thriving ecosystem',
    points: 35,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'impact_cascade_positive',
    title: 'Cascade Creator',
    description: 'Trigger 5 positive cascade events in Level 5',
    category: 'impact',
    icon: '🌊',
    requirement: 'Create positive ecological ripples',
    points: 30,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'impact_global_movement',
    title: 'Movement Builder',
    description: 'Complete Level 15 with maximum impact metrics',
    category: 'impact',
    icon: '🌍',
    requirement: 'Inspire global restoration movement',
    points: 100,
    unlocked: false,
    rarity: 'legendary'
  },

  // Mastery Category
  {
    id: 'mastery_all_levels',
    title: 'Master Restorer',
    description: 'Complete all 15 levels',
    category: 'mastery',
    icon: '🎓',
    requirement: 'Complete the full restoration journey',
    points: 75,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'mastery_no_hints',
    title: 'Self-Taught Genius',
    description: 'Complete 10 levels without using any hints',
    category: 'mastery',
    icon: '🧠',
    requirement: 'Master restoration independently',
    points: 60,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'mastery_quiz_perfect',
    title: 'Ecological Scholar',
    description: 'Score 100% on all knowledge quizzes',
    category: 'mastery',
    icon: '📖',
    requirement: 'Perfect understanding of ecological principles',
    points: 45,
    unlocked: false,
    rarity: 'epic'
  },

  // Social Category
  {
    id: 'social_mentor',
    title: 'The Mentor',
    description: 'Choose the teacher path in Level 15',
    category: 'social',
    icon: '👨‍🏫',
    requirement: 'Dedicate yourself to training others',
    points: 50,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'social_diplomat',
    title: 'Master Diplomat',
    description: 'Resolve corporate conflict through collaboration',
    category: 'social',
    icon: '🕊️',
    requirement: 'Choose collaborative approach in Level 7',
    points: 30,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'social_activist',
    title: 'Truth Speaker',
    description: 'Choose full transparency in moral choices',
    category: 'social',
    icon: '📢',
    requirement: 'Prioritize truth over convenience',
    points: 35,
    unlocked: false,
    rarity: 'rare'
  },

  // Innovation Category
  {
    id: 'innovation_research',
    title: 'Researcher',
    description: 'Complete 3 research projects in Level 12',
    category: 'innovation',
    icon: '🔬',
    requirement: 'Advance restoration science',
    points: 40,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'innovation_indigenous',
    title: 'Bridge Builder',
    description: 'Integrate traditional and scientific knowledge',
    category: 'innovation',
    icon: '🌉',
    requirement: 'Choose integration path with Elder Redcrow',
    points: 45,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'innovation_patent_free',
    title: 'Open Source Hero',
    description: 'Choose to open-source all innovations',
    category: 'innovation',
    icon: '🌐',
    requirement: 'Make knowledge freely available',
    points: 40,
    unlocked: false,
    rarity: 'rare'
  }
];

export interface PlayerProgress {
  level: number;
  completedLevels: Set<number>;
  achievements: Map<string, Achievement>;
  totalPoints: number;
  playTime: number; // in minutes
  startDate: Date;
  lastPlayed: Date;
  stats: {
    levelsCompleted: number;
    perfectScores: number;
    speciesDocumented: number;
    ecosystemsRestored: number;
    communityMembersEngaged: number;
    researchProjectsCompleted: number;
    policiesInfluenced: number;
    peopleTrained: number;
  };
}

export function initializePlayerProgress(): PlayerProgress {
  return {
    level: 1,
    completedLevels: new Set(),
    achievements: new Map(ACHIEVEMENTS.map(a => [a.id, { ...a, unlocked: false }])),
    totalPoints: 0,
    playTime: 0,
    startDate: new Date(),
    lastPlayed: new Date(),
    stats: {
      levelsCompleted: 0,
      perfectScores: 0,
      speciesDocumented: 0,
      ecosystemsRestored: 0,
      communityMembersEngaged: 0,
      researchProjectsCompleted: 0,
      policiesInfluenced: 0,
      peopleTrained: 0
    }
  };
}

export function unlockAchievement(progress: PlayerProgress, achievementId: string): PlayerProgress {
  const achievement = progress.achievements.get(achievementId);
  if (!achievement || achievement.unlocked) return progress;

  const updatedAchievement = {
    ...achievement,
    unlocked: true,
    unlockedDate: new Date()
  };

  const newAchievements = new Map(progress.achievements);
  newAchievements.set(achievementId, updatedAchievement);

  return {
    ...progress,
    achievements: newAchievements,
    totalPoints: progress.totalPoints + achievement.points
  };
}

export function checkAchievements(progress: PlayerProgress, context: {
  levelCompleted?: number;
  completionTime?: number;
  score?: number;
  budget?: number;
  speciesExtinct?: number;
  choiceMade?: string;
  reputations?: Map<string, number>;
  biodiversityScore?: number;
  cascadeEvents?: number;
}): PlayerProgress {
  let updatedProgress = { ...progress };

  // Speed achievements
  if (context.levelCompleted === 1 && context.completionTime && context.completionTime < 5) {
    updatedProgress = unlockAchievement(updatedProgress, 'speed_level1');
  }
  if (context.levelCompleted === 5 && context.completionTime && context.completionTime < 15) {
    updatedProgress = unlockAchievement(updatedProgress, 'speed_level5');
  }

  // Quality achievements
  if (context.levelCompleted && context.score === 100) {
    updatedProgress = unlockAchievement(updatedProgress, 'quality_perfect_scan');
  }
  if (context.levelCompleted === 3 && context.budget === 0) {
    updatedProgress = unlockAchievement(updatedProgress, 'quality_budget_master');
  }
  if (context.levelCompleted === 5 && context.speciesExtinct === 0) {
    updatedProgress = unlockAchievement(updatedProgress, 'quality_zero_casualties');
  }

  // Discovery achievements
  if (context.biodiversityScore && context.biodiversityScore > 95) {
    updatedProgress = unlockAchievement(updatedProgress, 'discovery_secret_species');
  }
  if (context.choiceMade === 'integrate_knowledge' || context.choiceMade === 'full_partnership') {
    updatedProgress = unlockAchievement(updatedProgress, 'discovery_elder_wisdom');
  }

  // Impact achievements
  if (context.reputations) {
    const localRep = context.reputations.get('Local Residents') || 0;
    if (localRep >= 80) {
      updatedProgress = unlockAchievement(updatedProgress, 'impact_community_trust');
    }

    const allAbove60 = Array.from(context.reputations.values()).every(rep => rep >= 60);
    if (allAbove60) {
      updatedProgress = unlockAchievement(updatedProgress, 'impact_universal_respect');
    }
  }
  if (context.biodiversityScore && context.biodiversityScore >= 90) {
    updatedProgress = unlockAchievement(updatedProgress, 'impact_ecosystem_thriving');
  }
  if (context.cascadeEvents && context.cascadeEvents >= 5) {
    updatedProgress = unlockAchievement(updatedProgress, 'impact_cascade_positive');
  }

  // Mastery achievements
  if (progress.completedLevels.size === 15) {
    updatedProgress = unlockAchievement(updatedProgress, 'mastery_all_levels');
  }

  // Social achievements
  if (context.choiceMade === 'teacher') {
    updatedProgress = unlockAchievement(updatedProgress, 'social_mentor');
  }
  if (context.choiceMade === 'collaborate') {
    updatedProgress = unlockAchievement(updatedProgress, 'social_diplomat');
  }
  if (context.choiceMade === 'transparency') {
    updatedProgress = unlockAchievement(updatedProgress, 'social_activist');
  }

  // Innovation achievements
  if (context.choiceMade === 'integrate_knowledge' || context.choiceMade === 'full_partnership') {
    updatedProgress = unlockAchievement(updatedProgress, 'innovation_indigenous');
  }

  return updatedProgress;
}

export function getAchievementsByCategory(achievements: Map<string, Achievement>): Map<string, Achievement[]> {
  const categories = new Map<string, Achievement[]>();
  
  achievements.forEach(achievement => {
    const category = achievement.category;
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(achievement);
  });

  return categories;
}

export function getCompletionPercentage(achievements: Map<string, Achievement>): number {
  const total = achievements.size;
  const unlocked = Array.from(achievements.values()).filter(a => a.unlocked).length;
  return Math.round((unlocked / total) * 100);
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'text-gray-400 bg-gray-500/20';
    case 'rare': return 'text-blue-400 bg-blue-500/20';
    case 'epic': return 'text-purple-400 bg-purple-500/20';
    case 'legendary': return 'text-yellow-400 bg-yellow-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'speed': return '⚡';
    case 'quality': return '⭐';
    case 'discovery': return '🔍';
    case 'impact': return '🌍';
    case 'mastery': return '🎓';
    case 'social': return '🤝';
    case 'innovation': return '💡';
    default: return '✨';
  }
}
