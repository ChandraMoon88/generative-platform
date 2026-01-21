// Narrative System - Story reveals, moral choices, and character encounters

export interface StoryReveal {
  id: string;
  title: string;
  type: 'backstory' | 'discovery' | 'warning' | 'revelation' | 'celebration';
  content: string;
  unlockLevel: number;
  emotion: 'neutral' | 'happy' | 'concerned' | 'proud' | 'thoughtful';
  choices?: MoralChoice[];
  characterSpeaker?: 'gaia' | 'scientist' | 'elder' | 'activist' | 'child';
}

export interface MoralChoice {
  id: string;
  text: string;
  description: string;
  consequences: {
    immediate: string;
    longTerm: string;
    reputationImpact: { [faction: string]: number };
    environmentalImpact: number; // -100 to +100
  };
}

export interface CharacterEncounter {
  id: string;
  character: Character;
  level: number;
  dialogue: string[];
  quest?: Quest;
  unlocked: boolean;
}

export interface Character {
  name: string;
  role: string;
  avatar: string; // emoji
  backstory: string;
  motivation: string;
  faction: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  reward: string;
  completed: boolean;
}

// The Backstory of EcoSphere
export const PLANET_HISTORY: StoryReveal[] = [
  {
    id: 'arrival',
    title: 'The Arrival',
    type: 'backstory',
    content: "As your ship descends through the clouds, you see it clearly: a world that was once vibrant, now struggling. EcoSphere wasn't always like this. Centuries ago, it was a paradise—rivers ran clear, forests teemed with life, and communities lived in harmony with nature. But rapid industrialization, unchecked growth, and the belief that resources were infinite changed everything. Now, you've been called here as a Restoration Architect, one of the few who understands that healing is still possible.",
    unlockLevel: 1,
    emotion: 'thoughtful',
    characterSpeaker: 'gaia'
  },
  {
    id: 'gaia_origin',
    title: "Gaia's Purpose",
    type: 'revelation',
    content: "You've been wondering about me, haven't you? I'm Gaia—not just an AI guide, but the consciousness of this planet's environmental monitoring network. I was created by the First Restoration Team, scientists who saw the collapse coming and built me to remember, to teach, to guide future healers. I've watched thousands of restoration attempts. Some succeeded brilliantly. Others... didn't. But you're different. You ask the right questions. You see the connections. Together, we might actually succeed where others have failed.",
    unlockLevel: 2,
    emotion: 'thoughtful',
    characterSpeaker: 'gaia'
  },
  {
    id: 'the_collapse',
    title: 'The Great Collapse',
    type: 'backstory',
    content: "150 years ago, the Weeping River lived up to its name for the first time. The Grand Chemical Works upstream released decades of stored toxins in a single catastrophic failure. Within days, every fish died. Within weeks, the riverside communities fell ill. Within months, the ecosystem collapsed completely. But it didn't have to be this way. Documents I've recovered show that engineers warned leadership about the dangers. Whistleblowers tried to speak up. Community activists organized protests. They were all ignored in favor of short-term profits. The question is: what will you do differently?",
    unlockLevel: 3,
    emotion: 'concerned',
    characterSpeaker: 'gaia',
    choices: [
      {
        id: 'transparency',
        text: 'Full Transparency',
        description: 'Document everything and share it publicly to prevent future disasters',
        consequences: {
          immediate: 'Communities trust you, but some corporations become hostile',
          longTerm: 'Your methodology becomes the gold standard for restoration projects',
          reputationImpact: {
            'Local Residents': 25,
            'Scientific Community': 20,
            'Corporate Sector': -30,
            'Environmental Groups': 30
          },
          environmentalImpact: 50
        }
      },
      {
        id: 'diplomatic',
        text: 'Diplomatic Balance',
        description: 'Share lessons learned while building bridges with all stakeholders',
        consequences: {
          immediate: 'Everyone appreciates your balanced approach',
          longTerm: 'You become a trusted mediator, but change is slower',
          reputationImpact: {
            'Local Residents': 15,
            'Scientific Community': 15,
            'Corporate Sector': 10,
            'Environmental Groups': 15
          },
          environmentalImpact: 30
        }
      },
      {
        id: 'pragmatic',
        text: 'Pragmatic Focus',
        description: 'Focus on results now, worry about accountability later',
        consequences: {
          immediate: 'Quick progress, but some feel you\'re avoiding hard truths',
          longTerm: 'River is restored, but systemic issues remain',
          reputationImpact: {
            'Local Residents': 10,
            'Scientific Community': 5,
            'Corporate Sector': 20,
            'Environmental Groups': -15
          },
          environmentalImpact: 40
        }
      }
    ]
  },
  {
    id: 'previous_architects',
    title: 'The Previous Restoration Architects',
    type: 'backstory',
    content: "You're not the first to attempt this restoration. Before you, three architects tried. Dr. Elena Martinez focused on speed—she made impressive progress in 18 months but cut corners on community engagement. When funding ran out, locals didn't continue her work. Professor James Chen took the opposite approach: three years of planning, endless stakeholder meetings, perfect consensus-building. But he ran out of time before breaking ground. And Maya Patel? She tried the techno-fix approach—deployed cutting-edge nanobots and biofilters. They worked beautifully for six months, then broke down with no one trained to maintain them. Each taught me something. Speed without roots fails. Planning without action fails. Technology without people fails. What will your approach be?",
    unlockLevel: 5,
    emotion: 'thoughtful',
    characterSpeaker: 'gaia'
  },
  {
    id: 'the_otter_return',
    title: 'The Otter Returns',
    type: 'celebration',
    content: "Do you see them? Look closely at the cleaned section of river. There—three river otters, playing in water that's been lifeless for 80 years! I've been monitoring this planet for decades, and I'd almost given up hope of seeing this. Otters are indicator species—they only live in clean, healthy rivers with abundant fish. Their return means everything is working. The water is clean enough. The fish populations are recovering. The ecosystem is healing. But here's what makes this moment even more special: I've analyzed their genetic markers. These otters are descendants of the original population that lived here before The Collapse. Somehow, against all odds, a small group survived in a remote tributary. Your work has created a corridor for them to return home. They've been waiting 80 years for this moment. We just gave it to them.",
    unlockLevel: 5,
    emotion: 'proud',
    characterSpeaker: 'gaia'
  },
  {
    id: 'corporate_pressure',
    title: 'The Pressure Mounts',
    type: 'warning',
    content: "I need to warn you about something. TechFlow Industries has been watching your progress—and they're not happy. Your restoration work is revealing decades of their illegal dumping. Their lawyers are preparing to fight. Their PR team is spreading doubt about your methods. Their lobbyists are pushing for new regulations that would shut down restoration projects like yours. They have billions in resources, political connections, and a ruthless willingness to protect their profits at any cost. You have science, community support, and the truth on your side. The question is: will that be enough? The next few decisions you make will determine whether this restoration succeeds or becomes another cautionary tale of good intentions crushed by corporate power.",
    unlockLevel: 7,
    emotion: 'concerned',
    characterSpeaker: 'gaia',
    choices: [
      {
        id: 'legal_battle',
        text: 'Fight Them in Court',
        description: 'Launch a legal challenge with full documentation of their violations',
        consequences: {
          immediate: 'Expensive legal battle begins, project slows down',
          longTerm: 'If you win, sets legal precedent for future restorations',
          reputationImpact: {
            'Local Residents': 20,
            'Scientific Community': 15,
            'Corporate Sector': -50,
            'Environmental Groups': 40,
            'Government': 10
          },
          environmentalImpact: 60
        }
      },
      {
        id: 'public_campaign',
        text: 'Win Public Opinion',
        description: 'Launch a media campaign showing the real impact of their pollution',
        consequences: {
          immediate: 'Public outrage forces them to negotiate',
          longTerm: 'They agree to cleanup but avoid formal admission of guilt',
          reputationImpact: {
            'Local Residents': 30,
            'Scientific Community': 10,
            'Corporate Sector': -30,
            'Environmental Groups': 25,
            'Government': 5
          },
          environmentalImpact: 45
        }
      },
      {
        id: 'collaborate',
        text: 'Seek Collaboration',
        description: 'Offer them a chance to be part of the solution instead of the problem',
        consequences: {
          immediate: 'Surprising partnership forms, but activists feel betrayed',
          longTerm: 'Corporate-funded restoration, but with strings attached',
          reputationImpact: {
            'Local Residents': 5,
            'Scientific Community': -5,
            'Corporate Sector': 40,
            'Environmental Groups': -30,
            'Government': 20
          },
          environmentalImpact: 35
        }
      }
    ]
  },
  {
    id: 'indigenous_wisdom',
    title: 'The Elder\'s Teaching',
    type: 'revelation',
    content: "An elderly woman approaches you at the river's edge. She introduces herself as Elder Sarah Redcrow, last living member of the Kawani people who lived here for 10,000 years before colonization. 'You're doing good work,' she says, 'but you're missing something important. My people didn't manage this river—we partnered with it. We didn't restore ecosystems—we listened to them. Your science tells you what, but our traditional knowledge tells you why.' She shows you ancient watermarks on stone—flood patterns that modern engineering ignored, leading to the catastrophic failure you're now fixing. She describes the river as it was: not a resource to exploit, but a relative to respect. 'In our language,' she says, 'the river's name translates to "The One Who Teaches Patience." Modern society forgot that lesson. Will you remember it?'",
    unlockLevel: 8,
    emotion: 'thoughtful',
    characterSpeaker: 'elder',
    choices: [
      {
        id: 'integrate_knowledge',
        text: 'Integrate Traditional Wisdom',
        description: 'Formally incorporate indigenous knowledge into your restoration methodology',
        consequences: {
          immediate: 'Your approach becomes more holistic and culturally grounded',
          longTerm: 'You pioneer a new model of restoration that bridges science and tradition',
          reputationImpact: {
            'Local Residents': 35,
            'Scientific Community': 10,
            'Indigenous Communities': 50,
            'Environmental Groups': 30,
            'Future Generations': 40
          },
          environmentalImpact: 70
        }
      },
      {
        id: 'respectful_separation',
        text: 'Acknowledge but Separate',
        description: 'Honor the wisdom while keeping scientific methods primary',
        consequences: {
          immediate: 'You maintain scientific credibility with some institutions',
          longTerm: 'You miss opportunities for deeper, more sustainable restoration',
          reputationImpact: {
            'Local Residents': 10,
            'Scientific Community': 20,
            'Indigenous Communities': 5,
            'Environmental Groups': 10,
            'Future Generations': 15
          },
          environmentalImpact: 50
        }
      },
      {
        id: 'full_partnership',
        text: 'Full Co-Leadership',
        description: 'Invite Elder Redcrow to co-lead the restoration project',
        consequences: {
          immediate: 'Some stakeholders resist, but the work becomes transformative',
          longTerm: 'Project becomes a global model for decolonized environmental science',
          reputationImpact: {
            'Local Residents': 40,
            'Scientific Community': 5,
            'Indigenous Communities': 70,
            'Environmental Groups': 40,
            'Future Generations': 60
          },
          environmentalImpact: 85
        }
      }
    ]
  },
  {
    id: 'future_vision',
    title: 'A Message From The Future',
    type: 'revelation',
    content: "I have something to show you—something I've never revealed to anyone. When the First Restoration Team created me, they didn't just give me memory of the past. They gave me the ability to model probable futures. I've been running simulations of what happens based on the choices you make. In one timeline, your restoration work here sparks a global movement. Within 50 years, 10,000 rivers are restored. Communities worldwide embrace regenerative practices. The climate stabilizes. Biodiversity rebounds. In another timeline, you succeed here, but the lessons don't spread. Your restored river becomes an isolated jewel surrounded by continued degradation. And in the darkest timeline... your work is undone by the next political shift, the next economic crisis, the next generation that forgets why this matters. The future isn't fixed. Every choice you make increases the probability of one timeline over another. The question isn't just 'Can you restore this river?' It's 'Can you restore it in a way that ensures it stays restored?'",
    unlockLevel: 12,
    emotion: 'thoughtful',
    characterSpeaker: 'gaia'
  },
  {
    id: 'the_final_choice',
    title: 'The Ultimate Decision',
    type: 'revelation',
    content: "You've done it. The river is restored. The ecosystem is thriving. Communities are engaged. Policies have changed. You've achieved everything you set out to do. But now you face a choice that will define your legacy. You've been offered three paths: 1) Stay here as permanent guardian of this watershed, ensuring it remains healthy forever. 2) Move to the next degraded river, repeating this success somewhere else. 3) Step back entirely, trusting what you've built to sustain itself while you train others to do this work globally. Each choice has profound implications. The first ensures this specific place thrives but limits your broader impact. The second multiplies your direct restoration work but risks burnout. The third creates exponential change through others but requires trusting that your systems will work without you. What kind of legacy do you want to leave?",
    unlockLevel: 14,
    emotion: 'thoughtful',
    characterSpeaker: 'gaia',
    choices: [
      {
        id: 'guardian',
        text: 'Become the Guardian',
        description: 'Dedicate your life to protecting this one watershed',
        consequences: {
          immediate: 'This river becomes the healthiest in the region',
          longTerm: 'One perfect restoration, but limited global impact',
          reputationImpact: {
            'Local Residents': 60,
            'Scientific Community': 20,
            'Environmental Groups': 30,
            'Future Generations': 40
          },
          environmentalImpact: 95
        }
      },
      {
        id: 'wanderer',
        text: 'Become the Wanderer',
        description: 'Move to the next river, then the next, restoring as many as possible',
        consequences: {
          immediate: 'You personally restore 5 more watersheds in your lifetime',
          longTerm: 'Significant impact, but you become exhausted and the model doesn\'t scale',
          reputationImpact: {
            'Local Residents': 30,
            'Scientific Community': 40,
            'Environmental Groups': 45,
            'Future Generations': 50
          },
          environmentalImpact: 75
        }
      },
      {
        id: 'teacher',
        text: 'Become the Teacher',
        description: 'Train others to replicate your success globally',
        consequences: {
          immediate: 'You step back from direct work to focus on teaching and systems',
          longTerm: 'Your students restore 1,247 watersheds in 47 countries',
          reputationImpact: {
            'Local Residents': 20,
            'Scientific Community': 50,
            'Environmental Groups': 40,
            'Future Generations': 90
          },
          environmentalImpact: 100
        }
      }
    ]
  }
];

// Characters that players can encounter
export const CHARACTERS: Character[] = [
  {
    name: 'Dr. Maria Santos',
    role: 'Lead Ecologist',
    avatar: '👩‍🔬',
    backstory: 'Former corporate scientist who became a whistleblower after discovering her company was hiding pollution data. Now dedicates her life to independent environmental research.',
    motivation: 'Redemption through truth and restoration',
    faction: 'Scientific Community'
  },
  {
    name: 'Elder Sarah Redcrow',
    role: 'Indigenous Knowledge Keeper',
    avatar: '👵',
    backstory: 'Last fluent speaker of the Kawani language. Holds 10,000 years of traditional ecological knowledge about this watershed. Watching cautiously to see if modern science will finally listen.',
    motivation: 'Preserve ancestral wisdom and heal the land',
    faction: 'Indigenous Communities'
  },
  {
    name: 'Marcus Webb',
    role: 'Community Organizer',
    avatar: '👨‍🦱',
    backstory: 'Grew up drinking contaminated water from this river. His sister died from pollution-related illness. Now fights to ensure no other family suffers the same fate.',
    motivation: 'Justice for environmental victims',
    faction: 'Local Residents'
  },
  {
    name: 'Yuki Tanaka',
    role: 'Youth Climate Activist',
    avatar: '👧',
    backstory: 'Sixteen-year-old who organized the largest environmental protest in the region\'s history. Demands that adults take responsibility for the world they\'re leaving behind.',
    motivation: 'Secure a livable future',
    faction: 'Future Generations'
  },
  {
    name: 'Robert Chen',
    role: 'Former Factory Manager',
    avatar: '👨‍💼',
    backstory: 'Managed the plant that polluted the river for 20 years. Saw the impact up close and had a crisis of conscience. Now trying to make amends by supporting restoration efforts.',
    motivation: 'Atonement and transformation',
    faction: 'Corporate Sector'
  },
  {
    name: 'Gaia',
    role: 'Planetary AI Guide',
    avatar: '✨',
    backstory: 'Created by the First Restoration Team to be the memory and conscience of the planet. Has witnessed countless attempts at healing and holds the wisdom of what works and what doesn\'t.',
    motivation: 'Guide humanity toward ecological wisdom',
    faction: 'Environmental Systems'
  }
];

// Player decisions and their tracking
export interface NarrativeState {
  unlockedStories: Set<string>;
  choicesMade: Map<string, string>; // story id -> choice id
  characterRelationships: Map<string, number>; // character name -> relationship score (-100 to 100)
  reputationScores: Map<string, number>; // faction -> score (0 to 100)
  moralAlignment: {
    transparency: number; // vs secrecy
    collaboration: number; // vs confrontation
    tradition: number; // vs innovation
    local: number; // vs global
    speed: number; // vs thoroughness
  };
}

export function initializeNarrativeState(): NarrativeState {
  return {
    unlockedStories: new Set(),
    choicesMade: new Map(),
    characterRelationships: new Map(CHARACTERS.map(c => [c.name, 0])),
    reputationScores: new Map([
      ['Local Residents', 50],
      ['Scientific Community', 50],
      ['Corporate Sector', 50],
      ['Environmental Groups', 50],
      ['Indigenous Communities', 50],
      ['Government', 50],
      ['Future Generations', 50]
    ]),
    moralAlignment: {
      transparency: 0,
      collaboration: 0,
      tradition: 0,
      local: 0,
      speed: 0
    }
  };
}

export function applyChoice(state: NarrativeState, storyId: string, choiceId: string): NarrativeState {
  const story = PLANET_HISTORY.find(s => s.id === storyId);
  if (!story || !story.choices) return state;
  
  const choice = story.choices.find(c => c.id === choiceId);
  if (!choice) return state;
  
  const newState = { ...state };
  newState.choicesMade.set(storyId, choiceId);
  
  // Update reputation scores
  Object.entries(choice.consequences.reputationImpact).forEach(([faction, impact]) => {
    const current = newState.reputationScores.get(faction) || 50;
    newState.reputationScores.set(faction, Math.max(0, Math.min(100, current + impact)));
  });
  
  // Update moral alignment based on choice type
  if (choiceId.includes('transparency') || choiceId.includes('legal')) {
    newState.moralAlignment.transparency += 10;
  }
  if (choiceId.includes('collaborate') || choiceId.includes('diplomatic')) {
    newState.moralAlignment.collaboration += 10;
  }
  if (choiceId.includes('integrate') || choiceId.includes('traditional')) {
    newState.moralAlignment.tradition += 10;
  }
  
  return newState;
}

export function getAvailableStories(currentLevel: number, state: NarrativeState): StoryReveal[] {
  return PLANET_HISTORY.filter(story => 
    story.unlockLevel <= currentLevel && !state.unlockedStories.has(story.id)
  );
}

export function getCharacterDialogue(character: Character, reputationScore: number): string[] {
  if (reputationScore >= 75) {
    return [
      `${character.avatar} ${character.name}: "You're doing incredible work here. I'm proud to support you."`,
      `${character.avatar} ${character.name}: "${character.motivation} - and you're making it happen."`
    ];
  } else if (reputationScore >= 50) {
    return [
      `${character.avatar} ${character.name}: "I appreciate what you're trying to do. Keep it up."`,
      `${character.avatar} ${character.name}: "I have some concerns, but I see your potential."`
    ];
  } else if (reputationScore >= 25) {
    return [
      `${character.avatar} ${character.name}: "I'm not sure about your methods..."`,
      `${character.avatar} ${character.name}: "You'll need to earn my trust."`
    ];
  } else {
    return [
      `${character.avatar} ${character.name}: "Your approach is problematic. We need to talk."`,
      `${character.avatar} ${character.name}: "I'm disappointed in the choices you've made."`
    ];
  }
}
