'use client';

import { AlertTriangle, CloudRain, Zap, TrendingDown, Users, AlertCircle } from 'lucide-react';

export interface DynamicEvent {
  id: string;
  type: 'storm' | 'equipment_failure' | 'budget_alert' | 'wildlife_return' | 'pollution_spike' | 'community_concern';
  title: string;
  description: string;
  impact: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  choices: {
    text: string;
    consequences: string;
    budgetChange?: number;
    timeChange?: number;
    teamMoraleChange?: number;
  }[];
  icon: any;
  color: string;
}

export const DYNAMIC_EVENTS: DynamicEvent[] = [
  {
    id: 'storm_1',
    type: 'storm',
    title: 'Severe Storm Warning',
    description: 'A major storm is approaching the restoration site. Heavy rainfall could wash pollutants back into the river and damage newly planted vegetation.',
    impact: 'Your work from the past week could be undone. Equipment may be damaged.',
    severity: 'critical',
    choices: [
      {
        text: 'Secure Equipment & Evacuate',
        consequences: 'Team safe, minimal equipment loss, but restoration delayed 3 days',
        timeChange: 3,
        budgetChange: -2000,
        teamMoraleChange: 5
      },
      {
        text: 'Deploy Emergency Barriers',
        consequences: 'Protect recent work, but expensive and risky for team',
        timeChange: 1,
        budgetChange: -8000,
        teamMoraleChange: -10
      },
      {
        text: 'Continue Work & Hope',
        consequences: 'Save money now, but risk major setbacks if storm is severe',
        timeChange: 0,
        budgetChange: 0,
        teamMoraleChange: -20
      }
    ],
    icon: CloudRain,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'equipment_1',
    type: 'equipment_failure',
    title: 'Water Filtration System Failure',
    description: 'Your main filtration pump has broken down due to sediment buildup. The river cleanup is now on hold.',
    impact: 'Daily pollution removal capacity reduced by 60%',
    severity: 'high',
    choices: [
      {
        text: 'Emergency Repair (Expensive)',
        consequences: 'Back online in 6 hours, but costs 3x normal repair price',
        timeChange: 0,
        budgetChange: -6000,
        teamMoraleChange: 0
      },
      {
        text: 'Order Replacement Part',
        consequences: 'Cheaper but takes 3 days to arrive and install',
        timeChange: 3,
        budgetChange: -2500,
        teamMoraleChange: -5
      },
      {
        text: 'Temporary Manual Solution',
        consequences: 'Team works overtime with buckets and filters - slow but free',
        timeChange: 2,
        budgetChange: 0,
        teamMoraleChange: -15
      }
    ],
    icon: Zap,
    color: 'from-yellow-600 to-orange-700'
  },
  {
    id: 'budget_1',
    type: 'budget_alert',
    title: 'Budget Crisis',
    description: 'You\'ve spent 75% of your budget with only 50% of the work complete. A funding partner has pulled out unexpectedly.',
    impact: 'Project may run out of money before completion',
    severity: 'high',
    choices: [
      {
        text: 'Apply for Emergency Grant',
        consequences: 'Takes 2 weeks, 50% chance of approval for $15K',
        timeChange: 14,
        budgetChange: 7500, // average of 0 and 15000
        teamMoraleChange: -5
      },
      {
        text: 'Scale Back Scope',
        consequences: 'Focus only on critical areas, save money but less impact',
        timeChange: 0,
        budgetChange: 5000,
        teamMoraleChange: -10
      },
      {
        text: 'Organize Fundraiser',
        consequences: 'Community event could raise $5-10K but takes team time',
        timeChange: 7,
        budgetChange: 7500,
        teamMoraleChange: 15
      }
    ],
    icon: TrendingDown,
    color: 'from-red-600 to-pink-700'
  },
  {
    id: 'wildlife_1',
    type: 'wildlife_return',
    title: 'Unexpected Wildlife Discovery',
    description: 'A group of endangered river otters has been spotted in the recently cleaned section! This is great news, but they\'re sensitive to construction.',
    impact: 'Wildlife regulations now apply. Work restrictions likely.',
    severity: 'medium',
    choices: [
      {
        text: 'Halt Work & Study Otters',
        consequences: 'Delay project 1 week but could unlock bonus conservation funding',
        timeChange: 7,
        budgetChange: 5000,
        teamMoraleChange: 20
      },
      {
        text: 'Work Around Wildlife',
        consequences: 'Carefully adjust schedule to avoid disturbing otters',
        timeChange: 3,
        budgetChange: -2000,
        teamMoraleChange: 10
      },
      {
        text: 'Continue as Planned',
        consequences: 'Risk driving otters away and potential regulatory penalties',
        timeChange: 0,
        budgetChange: 0,
        teamMoraleChange: -15
      }
    ],
    icon: Users,
    color: 'from-green-600 to-emerald-700'
  },
  {
    id: 'pollution_1',
    type: 'pollution_spike',
    title: 'Pollution Reactivation',
    description: 'Heavy rain has stirred up contaminated sediment from the riverbed. Pollution levels have spiked back to 60% in cleaned areas.',
    impact: 'Your cleanup progress is being reversed',
    severity: 'high',
    choices: [
      {
        text: 'Deploy Sediment Barriers',
        consequences: 'Prevent further contamination spread, expensive but effective',
        timeChange: 2,
        budgetChange: -7000,
        teamMoraleChange: 0
      },
      {
        text: 'Re-clean Affected Areas',
        consequences: 'Start cleanup again in those segments, very time-consuming',
        timeChange: 5,
        budgetChange: -3000,
        teamMoraleChange: -10
      },
      {
        text: 'Address Root Sediment',
        consequences: 'Expensive dredging operation, but solves problem permanently',
        timeChange: 10,
        budgetChange: -12000,
        teamMoraleChange: 5
      }
    ],
    icon: AlertTriangle,
    color: 'from-red-600 to-orange-700'
  },
  {
    id: 'community_1',
    type: 'community_concern',
    title: 'Community Backlash',
    description: 'Local business owners are complaining that your restoration work is disrupting tourism and costing them revenue. They\'re demanding compensation.',
    impact: 'Public support is wavering. Project could face opposition.',
    severity: 'medium',
    choices: [
      {
        text: 'Compensate Businesses',
        consequences: 'Pay $8K to affected businesses, maintain good relations',
        timeChange: 0,
        budgetChange: -8000,
        teamMoraleChange: 0
      },
      {
        text: 'Hold Community Meeting',
        consequences: 'Explain long-term benefits, takes time but builds support',
        timeChange: 3,
        budgetChange: -500,
        teamMoraleChange: 10
      },
      {
        text: 'Adjust Work Schedule',
        consequences: 'Work only during off-peak hours, slower but less disruptive',
        timeChange: 7,
        budgetChange: -1000,
        teamMoraleChange: 5
      }
    ],
    icon: AlertCircle,
    color: 'from-purple-600 to-pink-700'
  }
];

export const getRandomEvent = (levelNumber: number, currentBudget: number, daysElapsed: number): DynamicEvent | null => {
  // Events become more likely as level progresses
  const eventChance = Math.min(0.4, 0.1 + (levelNumber * 0.03) + (daysElapsed * 0.01));
  
  if (Math.random() > eventChance) {
    return null;
  }
  
  // Filter events based on context
  let availableEvents = [...DYNAMIC_EVENTS];
  
  // Budget alert only if budget is getting low
  if (currentBudget > 15000) {
    availableEvents = availableEvents.filter(e => e.type !== 'budget_alert');
  }
  
  // Wildlife return only after some progress
  if (daysElapsed < 10) {
    availableEvents = availableEvents.filter(e => e.type !== 'wildlife_return');
  }
  
  // Return random event
  return availableEvents[Math.floor(Math.random() * availableEvents.length)];
};

export const calculateEventOutcome = (
  event: DynamicEvent,
  choiceIndex: number,
  currentState: {
    budget: number;
    daysRemaining: number;
    teamMorale: number;
  }
) => {
  const choice = event.choices[choiceIndex];
  
  return {
    budget: currentState.budget + (choice.budgetChange || 0),
    daysRemaining: currentState.daysRemaining - (choice.timeChange || 0),
    teamMorale: Math.max(0, Math.min(100, currentState.teamMorale + (choice.teamMoraleChange || 0))),
    consequences: choice.consequences
  };
};
