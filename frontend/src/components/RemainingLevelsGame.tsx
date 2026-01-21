'use client';

import { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock, Target, Users, DollarSign, Zap, Heart, Shield, Trophy, Star, Award, AlertTriangle, X } from 'lucide-react';
import { DynamicEvent, getRandomEvent, calculateEventOutcome } from '@/lib/dynamicEvents';

interface LevelConfig {
  level: number;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  tasks: {
    name: string;
    description: string;
    timeRequired: number; // seconds
    completed: boolean;
    inputType?: 'text' | 'number' | 'selection';
    inputPrompt?: string;
    inputOptions?: string[];
    userInput?: string;
  }[];
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

const LEVEL_CONFIGS: {[key: number]: LevelConfig} = {
  4: {
    level: 4,
    title: 'Implementation Phase',
    subtitle: 'Execute Your Plan',
    icon: Play,
    color: 'from-blue-500 to-cyan-600',
    tasks: [
      { name: 'Deploy Team Alpha', description: 'Assign team to wetland restoration site', timeRequired: 45, completed: false, inputType: 'text', inputPrompt: 'Describe your team deployment strategy and location assignment:' },
      { name: 'Secure Permits', description: 'Process regulatory approvals', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'List the permits you need and regulatory bodies involved:' },
      { name: 'Order Materials', description: 'Purchase water filtration equipment', timeRequired: 40, completed: false, inputType: 'number', inputPrompt: 'Enter budget allocation for materials (in dollars):' },
      { name: 'Community Briefing', description: 'Present plan to stakeholders', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Write key talking points for your stakeholder presentation:' },
      { name: 'Begin Construction', description: 'Start infrastructure work', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Describe the construction phases and safety protocols:' },
      { name: 'Monitor Progress', description: 'Track implementation metrics', timeRequired: 45, completed: false, inputType: 'text', inputPrompt: 'Define what metrics you will track (pH levels, flow rate, etc.):' }
    ],
    quiz: [
      { question: 'What is the most important factor in successful implementation?', options: ['Speed', 'Communication', 'Budget', 'Technology'], correctAnswer: 1 },
      { question: 'How often should progress be monitored?', options: ['Weekly', 'Monthly', 'Daily', 'Yearly'], correctAnswer: 0 },
      { question: 'What should you do when facing delays?', options: ['Ignore them', 'Reassess timeline', 'Cancel project', 'Blame team'], correctAnswer: 1 }
    ]
  },
  5: {
    level: 5,
    title: 'Ecosystem Mapping',
    subtitle: 'Understand Connections',
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    tasks: [
      { name: 'Survey Flora', description: 'Document all plant species', timeRequired: 50, completed: false },
      { name: 'Survey Fauna', description: 'Track animal populations', timeRequired: 55, completed: false },
      { name: 'Water Chemistry Analysis', description: 'Test pH, oxygen, nutrients', timeRequired: 45, completed: false },
      { name: 'Food Web Mapping', description: 'Identify predator-prey relationships', timeRequired: 60, completed: false },
      { name: 'Habitat Assessment', description: 'Evaluate breeding grounds', timeRequired: 50, completed: false },
      { name: 'Cascade Analysis', description: 'Predict ecosystem changes', timeRequired: 55, completed: false }
    ],
    quiz: [
      { question: 'What is a keystone species?', options: ['Most common species', 'Species critical to ecosystem', 'Largest animal', 'Invasive species'], correctAnswer: 1 },
      { question: 'What happens when a top predator is removed?', options: ['Nothing', 'Prey population explodes', 'Plants die', 'Water quality improves'], correctAnswer: 1 },
      { question: 'What indicates a healthy ecosystem?', options: ['One dominant species', 'High biodiversity', 'No predators', 'Clear water only'], correctAnswer: 1 }
    ]
  },
  6: {
    level: 6,
    title: 'Team Building',
    subtitle: 'Recruit Your Champions',
    icon: Users,
    color: 'from-purple-500 to-pink-600',
    tasks: [
      { name: 'Interview Scientists', description: 'Hire ecologist and chemist', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Describe the qualifications and expertise you are looking for in your scientific team:' },
      { name: 'Recruit Volunteers', description: 'Organize community support', timeRequired: 45, completed: false, inputType: 'number', inputPrompt: 'Enter target number of volunteers to recruit:' },
      { name: 'Train Team', description: 'Conduct safety and skills training', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'List the key safety protocols and skills you will train your team on:' },
      { name: 'Assign Roles', description: 'Define responsibilities', timeRequired: 40, completed: false, inputType: 'text', inputPrompt: 'Define specific roles and responsibilities for each team member:' },
      { name: 'Team Building Exercise', description: 'Build group cohesion', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Describe team building activities you will organize:' },
      { name: 'Set Communication Protocol', description: 'Establish reporting system', timeRequired: 45, completed: false, inputType: 'text', inputPrompt: 'Define how often and through what channels your team will communicate:' }
    ],
    quiz: [
      { question: 'What makes a good team leader?', options: ['Being the smartest', 'Good communication', 'Working alone', 'Giving orders'], correctAnswer: 1 },
      { question: 'How should conflict be handled?', options: ['Ignore it', 'Open discussion', 'Pick sides', 'Fire everyone'], correctAnswer: 1 },
      { question: 'What is team diversity important for?', options: ['Quotas', 'Different perspectives', 'Looking good', 'Confusion'], correctAnswer: 1 }
    ]
  },
  7: {
    level: 7,
    title: 'Financial Management',
    subtitle: 'Track Your Resources',
    icon: DollarSign,
    color: 'from-yellow-500 to-orange-600',
    tasks: [
      { name: 'Create Budget Spreadsheet', description: 'Detail all expenses', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'List main budget categories and estimated costs for your project:' },
      { name: 'Apply for Grants', description: 'Submit funding applications', timeRequired: 60, completed: false, inputType: 'number', inputPrompt: 'Enter total grant funding amount you are applying for (in dollars):' },
      { name: 'Track Expenditures', description: 'Monitor spending weekly', timeRequired: 45, completed: false, inputType: 'number', inputPrompt: 'Enter current week expenses (in dollars):' },
      { name: 'Adjust Allocations', description: 'Reallocate based on needs', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Explain what budget adjustments you need to make and why:' },
      { name: 'Generate Reports', description: 'Create financial summaries', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Summarize key financial metrics and spending trends:' },
      { name: 'Plan for Contingencies', description: 'Set aside emergency funds', timeRequired: 45, completed: false, inputType: 'number', inputPrompt: 'Enter emergency fund amount to set aside (in dollars):' }
    ],
    quiz: [
      { question: 'What percentage should be kept for emergencies?', options: ['0%', '5%', '10-15%', '50%'], correctAnswer: 2 },
      { question: 'How often should budgets be reviewed?', options: ['Never', 'Yearly', 'Monthly', 'Every 5 years'], correctAnswer: 2 },
      { question: 'What should you do when over budget?', options: ['Ignore it', 'Adjust plans', 'Borrow more', 'Quit'], correctAnswer: 1 }
    ]
  },
  8: {
    level: 8,
    title: 'Crisis Management',
    subtitle: 'Handle the Unexpected',
    icon: Zap,
    color: 'from-red-500 to-orange-600',
    tasks: [
      { name: 'Respond to Chemical Spill', description: 'Activate emergency protocol', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Outline immediate steps to respond to the chemical spill:' },
      { name: 'Evacuate Area', description: 'Ensure safety first', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Define evacuation radius and safety procedures:' },
      { name: 'Contain Contamination', description: 'Deploy barriers', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Describe containment strategy and equipment needed:' },
      { name: 'Communicate with Public', description: 'Issue safety updates', timeRequired: 45, completed: false, inputType: 'text', inputPrompt: 'Write a public safety announcement about the incident:' },
      { name: 'Coordinate with Authorities', description: 'Work with regulators', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'List which agencies to contact and what information to provide:' },
      { name: 'Document Incident', description: 'Create detailed report', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Write incident summary: what happened, actions taken, and lessons learned:' }
    ],
    quiz: [
      { question: 'What is the first priority in a crisis?', options: ['Money', 'Safety', 'Blame', 'Media'], correctAnswer: 1 },
      { question: 'Who should be notified first?', options: ['Media', 'Public', 'Emergency services', 'Boss'], correctAnswer: 2 },
      { question: 'What should crisis communication be?', options: ['Delayed', 'Honest and clear', 'Minimal', 'Defensive'], correctAnswer: 1 }
    ]
  },
  9: {
    level: 9,
    title: 'Community Engagement',
    subtitle: 'Win Hearts and Minds',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    tasks: [
      { name: 'Host Town Hall', description: 'Present progress to community', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Write key points you will present at the town hall meeting:' },
      { name: 'Create Education Program', description: 'Develop curriculum for schools', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Outline educational topics and activities for the school curriculum:' },
      { name: 'Organize Cleanup Day', description: 'Mobilize 100+ volunteers', timeRequired: 50, completed: false, inputType: 'number', inputPrompt: 'Enter target number of volunteers for cleanup day:' },
      { name: 'Launch Social Media', description: 'Share success stories online', timeRequired: 45, completed: false, inputType: 'text', inputPrompt: 'Write a social media post highlighting a project success story:' },
      { name: 'Partner with Businesses', description: 'Secure local sponsorships', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'List businesses you will approach and what you will offer them:' },
      { name: 'Celebrate Milestones', description: 'Recognition event for volunteers', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Plan the volunteer recognition event - venue, activities, awards:' }
    ],
    quiz: [
      { question: 'Why is community support important?', options: ['It is not', 'Long-term sustainability', 'Looks good', 'Free labor'], correctAnswer: 1 },
      { question: 'How should you handle opposition?', options: ['Fight back', 'Listen and address concerns', 'Ignore them', 'Give up'], correctAnswer: 1 },
      { question: 'What builds trust with the community?', options: ['Promises', 'Transparency', 'Authority', 'Speed'], correctAnswer: 1 }
    ]
  },
  10: {
    level: 10,
    title: 'Regulatory Compliance',
    subtitle: 'Navigate the Rules',
    icon: Shield,
    color: 'from-indigo-500 to-blue-600',
    tasks: [
      { name: 'Study Environmental Laws', description: 'Review all applicable regulations', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'List key environmental laws and regulations applicable to your project:' },
      { name: 'Submit Compliance Reports', description: 'File required documentation', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Summarize compliance status and progress for quarterly report:' },
      { name: 'Schedule Inspections', description: 'Coordinate with regulators', timeRequired: 45, completed: false, inputType: 'text', inputPrompt: 'Plan inspection schedule and list what will be inspected:' },
      { name: 'Address Violations', description: 'Correct any issues found', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Describe corrective actions for any compliance violations:' },
      { name: 'Update Permits', description: 'Renew necessary approvals', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'List permits that need renewal and any changes required:' },
      { name: 'Train Staff on Compliance', description: 'Ensure everyone follows rules', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Outline compliance training topics for your team:' }
    ],
    quiz: [
      { question: 'What happens if you violate environmental laws?', options: ['Nothing', 'Fines and shutdowns', 'Warning only', 'Promotion'], correctAnswer: 1 },
      { question: 'How often should compliance be checked?', options: ['Once', 'Never', 'Regularly', 'When caught'], correctAnswer: 2 },
      { question: 'Who is responsible for compliance?', options: ['No one', 'Everyone on team', 'Only lawyers', 'Government'], correctAnswer: 1 }
    ]
  },
  11: {
    level: 11,
    title: 'Data Analysis',
    subtitle: 'Prove Your Impact',
    icon: Trophy,
    color: 'from-cyan-500 to-blue-600',
    tasks: [
      { name: 'Collect Baseline Data', description: 'Establish before-restoration metrics', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Describe sampling locations and baseline metrics you will establish:' },
      { name: 'Ongoing Monitoring', description: 'Weekly water quality tests', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'List water quality parameters you will test weekly:' },
      { name: 'Analyze Trends', description: 'Use statistical methods', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Summarize key trends observed in your monitoring data:' },
      { name: 'Visualize Data', description: 'Create graphs and charts', timeRequired: 45, completed: false, inputType: 'text', inputPrompt: 'Describe charts/graphs you will create to show progress:' },
      { name: 'Compare Results', description: 'Measure against goals', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Compare current results vs. target goals and explain gaps:' },
      { name: 'Publish Findings', description: 'Share results publicly', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Write a summary of findings to share with the community:' }
    ],
    quiz: [
      { question: 'Why is baseline data important?', options: ['It is not', 'Shows change over time', 'Wastes time', 'Confuses people'], correctAnswer: 1 },
      { question: 'What does a trend analysis show?', options: ['Nothing', 'Patterns over time', 'Random data', 'Mistakes'], correctAnswer: 1 },
      { question: 'How should data be presented?', options: ['Hide it', 'Clearly and honestly', 'Only good news', 'Confusing charts'], correctAnswer: 1 }
    ]
  },
  12: {
    level: 12,
    title: 'Long-term Sustainability',
    subtitle: 'Plan for the Future',
    icon: Star,
    color: 'from-teal-500 to-green-600',
    tasks: [
      { name: 'Create Maintenance Plan', description: 'Schedule ongoing care', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Create a maintenance schedule with specific tasks and frequencies:' },
      { name: 'Establish Endowment', description: 'Secure long-term funding', timeRequired: 55, completed: false, inputType: 'number', inputPrompt: 'Enter target endowment amount for perpetual funding (in dollars):' },
      { name: 'Train Local Leaders', description: 'Transfer knowledge', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Describe training program for local leaders to take over management:' },
      { name: 'Build Partnerships', description: 'Ensure continued support', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'List partner organizations and their roles in long-term support:' },
      { name: 'Monitor for 5 Years', description: 'Commit to long-term tracking', timeRequired: 45, completed: false, inputType: 'text', inputPrompt: 'Define 5-year monitoring plan and key metrics to track:' },
      { name: 'Adaptive Management', description: 'Adjust based on results', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Explain how you will adapt strategies based on monitoring results:' }
    ],
    quiz: [
      { question: 'What is the biggest threat to restoration projects?', options: ['Initial failure', 'Lack of long-term care', 'Too much success', 'Overcrowding'], correctAnswer: 1 },
      { question: 'Who should maintain the restored ecosystem?', options: ['No one', 'Local community', 'Original team only', 'Government only'], correctAnswer: 1 },
      { question: 'How long should monitoring continue?', options: ['1 month', '1 year', '5+ years', 'Never'], correctAnswer: 2 }
    ]
  },
  13: {
    level: 13,
    title: 'Scaling Up',
    subtitle: 'Expand Your Impact',
    icon: Award,
    color: 'from-orange-500 to-red-600',
    tasks: [
      { name: 'Identify New Sites', description: 'Survey 5 additional rivers', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'List 5 new river sites and why they were selected for restoration:' },
      { name: 'Replicate Model', description: 'Apply successful strategies', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Describe which strategies from the first site will be replicated:' },
      { name: 'Recruit Regional Teams', description: 'Expand to 3 new locations', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Define team structure and roles for the 3 new locations:' },
      { name: 'Secure Major Funding', description: 'Apply for $500K grant', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Write grant proposal summary explaining why you need $500K:' },
      { name: 'Develop Training Materials', description: 'Create replication guide', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Outline key sections of your replication guide:' },
      { name: 'Launch Regional Network', description: 'Connect all restoration sites', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Describe how sites will collaborate and share resources:' }
    ],
    quiz: [
      { question: 'What is key to successful scaling?', options: ['Speed', 'Replicable systems', 'Different approaches', 'Luck'], correctAnswer: 1 },
      { question: 'How should expansion be prioritized?', options: ['Random', 'Highest need areas', 'Easiest first', 'Richest areas'], correctAnswer: 1 },
      { question: 'What risk comes with rapid scaling?', options: ['None', 'Quality dilution', 'Too much success', 'Boredom'], correctAnswer: 1 }
    ]
  },
  14: {
    level: 14,
    title: 'Policy Advocacy',
    subtitle: 'Change the System',
    icon: Shield,
    color: 'from-violet-500 to-purple-600',
    tasks: [
      { name: 'Research Legislation', description: 'Identify policy gaps', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Identify environmental policy gaps that need to be addressed:' },
      { name: 'Draft Policy Proposal', description: 'Write environmental protection bill', timeRequired: 65, completed: false, inputType: 'text', inputPrompt: 'Write a summary of the environmental legislation you are proposing:' },
      { name: 'Build Coalition', description: 'Unite 20+ organizations', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'List organizations in your coalition and their key contributions:' },
      { name: 'Testify at Hearings', description: 'Present to lawmakers', timeRequired: 50, completed: false, inputType: 'text', inputPrompt: 'Write key talking points for your testimony to lawmakers:' },
      { name: 'Media Campaign', description: 'Generate public pressure', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Outline your media campaign strategy and key messages:' },
      { name: 'Negotiate with Officials', description: 'Secure commitments', timeRequired: 55, completed: false, inputType: 'text', inputPrompt: 'Describe your negotiation strategy and desired outcomes:' }
    ],
    quiz: [
      { question: 'Why is policy change important?', options: ['It is not', 'Systemic protection', 'Looks good', 'Easy wins'], correctAnswer: 1 },
      { question: 'What makes advocacy effective?', options: ['Yelling', 'Data and stories', 'Money only', 'Threats'], correctAnswer: 1 },
      { question: 'How long does policy change take?', options: ['Days', 'Weeks', 'Months to years', 'Never'], correctAnswer: 2 }
    ]
  },
  15: {
    level: 15,
    title: 'Legacy Creation',
    subtitle: 'The Final Challenge',
    icon: Trophy,
    color: 'from-yellow-500 to-amber-600',
    tasks: [
      { name: 'Document Journey', description: 'Write comprehensive history', timeRequired: 70, completed: false, inputType: 'text', inputPrompt: 'Write a summary of your entire restoration journey from start to finish:' },
      { name: 'Measure Total Impact', description: 'Calculate all metrics', timeRequired: 65, completed: false, inputType: 'text', inputPrompt: 'Summarize all measurable impacts (water quality, species, community benefits):' },
      { name: 'Create Educational Film', description: 'Inspire future generations', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Outline the script/storyline for your educational documentary:' },
      { name: 'Establish Foundation', description: 'Ensure perpetual funding', timeRequired: 70, completed: false, inputType: 'text', inputPrompt: 'Describe your foundation\'s mission and funding strategy:' },
      { name: 'Global Conference', description: 'Share model worldwide', timeRequired: 65, completed: false, inputType: 'text', inputPrompt: 'Write your conference presentation abstract for global audience:' },
      { name: 'Celebrate Victory', description: 'Recognition ceremony', timeRequired: 60, completed: false, inputType: 'text', inputPrompt: 'Plan the victory celebration - who to recognize and how:' }
    ],
    quiz: [
      { question: 'What defines a successful legacy?', options: ['Money', 'Lasting positive change', 'Fame', 'Awards'], correctAnswer: 1 },
      { question: 'How should success be measured?', options: ['By effort', 'By results', 'By intentions', 'By publicity'], correctAnswer: 1 },
      { question: 'What is most important for the future?', options: ['Your success', 'Inspiring others', 'Getting credit', 'Retiring rich'], correctAnswer: 1 }
    ]
  }
};

interface Props {
  levelNumber: number;
}

export default function RemainingLevelsGame({ levelNumber }: Props) {
  const config = LEVEL_CONFIGS[levelNumber];
  const [tasks, setTasks] = useState(config.tasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'tasks' | 'quiz' | 'complete'>('intro');
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Task input state
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskInputValue, setTaskInputValue] = useState('');
  
  // Dynamic events state
  const [currentEvent, setCurrentEvent] = useState<DynamicEvent | null>(null);
  const [budget, setBudget] = useState(50000);
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [teamMorale, setTeamMorale] = useState(75);
  const [eventsHandled, setEventsHandled] = useState<string[]>([]);
  const [eventConsequence, setEventConsequence] = useState<string | null>(null);

  useEffect(() => {
    if (phase === 'tasks' && currentTaskIndex < tasks.length && !showTaskInput) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev >= tasks[currentTaskIndex].timeRequired) {
            // Show input modal if task requires input
            if (tasks[currentTaskIndex].inputType) {
              setShowTaskInput(true);
              return prev; // Keep timer at max
            }
            
            // If no input required, complete immediately
            const newTasks = [...tasks];
            newTasks[currentTaskIndex].completed = true;
            setTasks(newTasks);
            
            // Increment days elapsed
            setDaysElapsed(d => d + 1);
            
            // Check for dynamic event (only on Level 4+)
            if (levelNumber >= 4 && !currentEvent && Math.random() < 0.3) {
              const event = getRandomEvent(levelNumber, budget, daysElapsed + 1);
              if (event && !eventsHandled.includes(event.id)) {
                setCurrentEvent(event);
              }
            }
            
            if (currentTaskIndex + 1 < tasks.length) {
              setCurrentTaskIndex(currentTaskIndex + 1);
              return 0;
            } else {
              setTimeout(() => setPhase(config.quiz ? 'quiz' : 'complete'), 1000);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [phase, currentTaskIndex, tasks, showTaskInput, config.quiz, levelNumber, budget, daysElapsed, currentEvent, eventsHandled]);

  const handleEventChoice = (choiceIndex: number) => {
    if (!currentEvent) return;
    
    const outcome = calculateEventOutcome(
      currentEvent,
      choiceIndex,
      { budget, daysRemaining: 30 - daysElapsed, teamMorale }
    );
    
    setBudget(outcome.budget);
    setTeamMorale(outcome.teamMorale);
    setEventsHandled([...eventsHandled, currentEvent.id]);
    setEventConsequence(outcome.consequences);
    
    // Clear event after showing consequence
    setTimeout(() => {
      setCurrentEvent(null);
      setEventConsequence(null);
    }, 4000);
  };

  const validateTaskInput = (task: typeof tasks[0], value: string): { valid: boolean; message: string } => {
    const input = value.toLowerCase().trim();
    
    // Number validation
    if (task.inputType === 'number') {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return { valid: false, message: '❌ Please enter a valid positive number' };
      }
      
      // Budget validation - should be reasonable
      if (task.name.includes('Budget') || task.name.includes('Fund') || task.name.includes('Grant')) {
        if (num < 1000) {
          return { valid: false, message: '❌ Amount too low - environmental projects typically cost thousands of dollars' };
        }
        if (num > 10000000) {
          return { valid: false, message: '❌ Amount unrealistic - enter a reasonable project budget' };
        }
      }
      
      // Volunteer count validation
      if (task.name.includes('Volunteer')) {
        if (num < 5) {
          return { valid: false, message: '❌ Need more volunteers for effective community mobilization (minimum 5)' };
        }
        if (num > 1000) {
          return { valid: false, message: '❌ Number unrealistic - be practical with volunteer targets' };
        }
      }
      
      return { valid: true, message: '✅ Valid input!' };
    }
    
    // Text validation - must contain relevant keywords
    if (task.inputType === 'text') {
      const words = input.split(/\s+/).filter(w => w.length > 2);
      
      if (words.length < 10) {
        return { valid: false, message: '❌ Response too brief - provide more detailed explanation (at least 10 meaningful words)' };
      }
      
      // Task-specific keyword validation
      if (task.name.includes('Team') || task.name.includes('Assign')) {
        const hasTeamWords = /\b(role|responsibility|member|lead|coordinator|specialist|assign|manage)\b/.test(input);
        if (!hasTeamWords) {
          return { valid: false, message: '❌ Please describe specific roles, responsibilities, or team structure' };
        }
      }
      
      if (task.name.includes('Budget') || task.name.includes('Financial') || task.name.includes('Cost')) {
        const hasFinanceWords = /\b(dollar|cost|expense|fund|budget|allocat|spend|invest|grant)\b/.test(input);
        if (!hasFinanceWords) {
          return { valid: false, message: '❌ Please include financial details (costs, budget allocation, funding)' };
        }
      }
      
      if (task.name.includes('Monitor') || task.name.includes('Track') || task.name.includes('Measure')) {
        const hasMetrics = /\b(metric|measure|track|monitor|data|test|ph|level|quality|sample|rate)\b/.test(input);
        if (!hasMetrics) {
          return { valid: false, message: '❌ Please specify what metrics or measurements you will track' };
        }
      }
      
      if (task.name.includes('Strategy') || task.name.includes('Plan') || task.name.includes('Deploy')) {
        const hasActionWords = /\b(will|plan|step|phase|first|then|next|schedule|timeline)\b/.test(input);
        if (!hasActionWords) {
          return { valid: false, message: '❌ Please describe specific steps or action plan' };
        }
      }
      
      if (task.name.includes('Communit') || task.name.includes('Public') || task.name.includes('Stakeholder')) {
        const hasCommunity = /\b(resident|community|public|people|stakeholder|citizen|local|neighbor)\b/.test(input);
        if (!hasCommunity) {
          return { valid: false, message: '❌ Please address community involvement or public engagement' };
        }
      }
      
      if (task.name.includes('Report') || task.name.includes('Document') || task.name.includes('Summary')) {
        const hasDoc = /\b(result|finding|data|metric|outcome|achievement|progress|status|report)\b/.test(input);
        if (!hasDoc) {
          return { valid: false, message: '❌ Please include specific findings, results, or documentation details' };
        }
      }
      
      if (task.name.includes('Crisis') || task.name.includes('Emergency') || task.name.includes('Spill')) {
        const hasCrisis = /\b(safety|evacuate|contain|emergency|protocol|immediate|response|alert)\b/.test(input);
        if (!hasCrisis) {
          return { valid: false, message: '❌ Please address safety and emergency response procedures' };
        }
      }
      
      if (task.name.includes('Permit') || task.name.includes('Compliance') || task.name.includes('Law') || task.name.includes('Regulation')) {
        const hasLegal = /\b(law|regulation|permit|compliance|legal|authority|agency|epa|requirement)\b/.test(input);
        if (!hasLegal) {
          return { valid: false, message: '❌ Please mention relevant laws, regulations, or regulatory agencies' };
        }
      }
      
      return { valid: true, message: '✅ Valid input!' };
    }
    
    return { valid: true, message: '✅ Valid input!' };
  };

  const handleTaskInput = () => {
    const currentTask = tasks[currentTaskIndex];
    
    const validation = validateTaskInput(currentTask, taskInputValue);
    
    if (!validation.valid) {
      alert(validation.message);
      return; // Don't close modal, let user try again
    }
    
    // Save input and complete task
    const newTasks = [...tasks];
    newTasks[currentTaskIndex].completed = true;
    newTasks[currentTaskIndex].userInput = taskInputValue;
    setTasks(newTasks);
    
    // Increment days elapsed
    setDaysElapsed(d => d + 1);
    
    // Check for dynamic event
    if (levelNumber >= 4 && !currentEvent && Math.random() < 0.3) {
      const event = getRandomEvent(levelNumber, budget, daysElapsed + 1);
      if (event && !eventsHandled.includes(event.id)) {
        setCurrentEvent(event);
      }
    }
    
    // Move to next task
    setShowTaskInput(false);
    setTaskInputValue('');
    
    if (currentTaskIndex + 1 < tasks.length) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setTimer(0);
    } else {
      setTimeout(() => setPhase(config.quiz ? 'quiz' : 'complete'), 1000);
    }
  };

  const Icon = config.icon;
  const EventIcon = currentEvent?.icon;
  
  // Event modals renderer (used in multiple phases)
  const renderEventModals = () => (
    <>
      {/* Dynamic Event Modal */}
      {currentEvent && !eventConsequence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className={`bg-gradient-to-br ${currentEvent.color} p-1 rounded-3xl max-w-3xl w-full`}>
            <div className="bg-slate-900 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {EventIcon && <EventIcon className="w-12 h-12 text-white" />}
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                      currentEvent.severity === 'critical' ? 'text-red-400' :
                      currentEvent.severity === 'high' ? 'text-orange-400' :
                      currentEvent.severity === 'medium' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {currentEvent.severity} Event
                    </div>
                    <h2 className="text-3xl font-bold text-white">{currentEvent.title}</h2>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 bg-white/5 rounded-xl p-6">
                <p className="text-lg text-white mb-4">{currentEvent.description}</p>
                <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-4">
                  <p className="text-red-300 font-bold">⚠️ Impact: {currentEvent.impact}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-white">Choose Your Response:</h3>
                <div className="space-y-3">
                  {currentEvent.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEventChoice(idx)}
                      className="w-full p-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-left group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {choice.text}
                        </h4>
                        <div className="flex gap-2 text-xs">
                          {choice.budgetChange !== 0 && (
                            <span className={`px-2 py-1 rounded ${choice.budgetChange && choice.budgetChange > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                              ${Math.abs(choice.budgetChange || 0).toLocaleString()}
                            </span>
                          )}
                          {choice.timeChange !== 0 && (
                            <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-300">
                              +{choice.timeChange}d
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{choice.consequences}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Current Budget</div>
                  <div className="text-lg font-bold text-green-400">${budget.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Team Morale</div>
                  <div className="text-lg font-bold text-blue-400">{teamMorale}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Days Elapsed</div>
                  <div className="text-lg font-bold text-purple-400">{daysElapsed}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Event Consequence Display */}
      {eventConsequence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-1 rounded-2xl max-w-2xl w-full">
            <div className="bg-slate-900 rounded-2xl p-8 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-4">Decision Made</h3>
              <p className="text-lg text-gray-300 mb-6">{eventConsequence}</p>
              <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">New Budget</div>
                  <div className="text-lg font-bold text-green-400">${budget.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Team Morale</div>
                  <div className="text-lg font-bold text-blue-400">{teamMorale}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Events Handled</div>
                  <div className="text-lg font-bold text-purple-400">{eventsHandled.length}</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4 italic">Returning to tasks...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto pt-20">
          <Icon className="w-32 h-32 mx-auto text-white animate-pulse mb-8" />
          <h1 className="text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r ${config.color}">
            Level {config.level}: {config.title}
          </h1>
          <p className="text-3xl mb-8 text-center text-gray-300">{config.subtitle}</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">📋 Tasks to Complete</h2>
            <div className="space-y-3 mb-6">
              {config.tasks.map((task, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{task.name}</h3>
                      <p className="text-sm text-gray-400">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <Clock className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm">{task.timeRequired}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-xl p-4 mb-6">
              <p className="text-sm">
                ⏱️ <strong>Estimated time:</strong> {Math.ceil(config.tasks.reduce((sum, t) => sum + t.timeRequired, 0) / 60)} minutes minimum
                {config.quiz && ' + quiz'}
              </p>
            </div>
            
            <button
              onClick={() => setPhase('tasks')}
              className={`w-full px-8 py-4 bg-gradient-to-r ${config.color} rounded-xl font-bold text-xl hover:scale-105 transition-transform`}
            >
              Begin Level {config.level}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'tasks') {
    const completedCount = tasks.filter(t => t.completed).length;
    const progress = (completedCount / tasks.length) * 100;
    const currentTask = tasks[currentTaskIndex];
    const taskProgress = (timer / currentTask.timeRequired) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 sticky top-0 z-10">
            <h2 className="text-3xl font-bold mb-4">Level {config.level} Progress</h2>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-bold">{completedCount}/{tasks.length}</span>
            </div>
            <div className="bg-white/20 rounded-full h-4 mb-4">
              <div 
                className={`bg-gradient-to-r ${config.color} h-4 rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-lg bg-gradient-to-r ${config.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{currentTask.name}</h3>
                <p className="text-gray-400">{currentTask.description}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm">Task Progress</span>
                <span className="font-bold">{timer}s / {currentTask.timeRequired}s</span>
              </div>
              <div className="bg-white/20 rounded-full h-6">
                <div 
                  className={`bg-gradient-to-r ${config.color} h-6 rounded-full transition-all duration-200 flex items-center justify-center text-sm font-bold`}
                  style={{ width: `${Math.min(taskProgress, 100)}%` }}
                >
                  {Math.round(taskProgress)}%
                </div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-3">
                Completing task automatically...
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl transition-all ${
                  task.completed
                    ? 'bg-green-500/20 border-2 border-green-400'
                    : idx === currentTaskIndex
                    ? 'bg-blue-500/20 border-2 border-blue-400 scale-105'
                    : 'bg-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold">{task.name}</h4>
                    <p className="text-xs text-gray-400">{task.description}</p>
                  </div>
                  {task.completed && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                </div>
              </div>
            ))}
          </div>
          
          {/* Level 4+ metrics dashboard */}
          {levelNumber >= 4 && (
            <div className="mt-6 grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div>
                <div className="text-xs text-gray-400 mb-1">Budget Remaining</div>
                <div className={`text-2xl font-bold ${budget > 20000 ? 'text-green-400' : budget > 10000 ? 'text-yellow-400' : 'text-red-400'}`}>
                  ${budget.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Team Morale</div>
                <div className={`text-2xl font-bold ${teamMorale > 60 ? 'text-green-400' : teamMorale > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {teamMorale}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Events Handled</div>
                <div className="text-2xl font-bold text-purple-400">{eventsHandled.length}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Task Input Modal */}
        {showTaskInput && currentTask && currentTask.inputType && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-8 border-2 border-white/20">
              <h3 className="text-2xl font-bold mb-4">✍️ Complete Task: {currentTask.name}</h3>
              
              <p className="text-gray-400 mb-6">{currentTask.inputPrompt}</p>

              {currentTask.inputType === 'number' ? (
                <input
                  type="number"
                  value={taskInputValue}
                  onChange={(e) => setTaskInputValue(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              ) : (
                <textarea
                  value={taskInputValue}
                  onChange={(e) => setTaskInputValue(e.target.value)}
                  placeholder="Type your answer here (minimum 20 characters)..."
                  className="w-full h-40 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleTaskInput()}
                  disabled={!taskInputValue.trim()}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r ${config.color} rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Submit & Continue
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Render event modals when they occur */}
        {renderEventModals()}
      </div>
    );
  }

  if (phase === 'quiz' && config.quiz) {
    const score = quizSubmitted ? quizAnswers.filter((ans, idx) => ans === config.quiz![idx].correctAnswer).length : 0;
    const passed = score >= Math.ceil(config.quiz.length * 0.7);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">📝 Knowledge Check</h2>
            
            {!quizSubmitted ? (
              <>
                <p className="text-gray-300 mb-6 text-center">
                  Answer these questions to demonstrate your understanding. You need {Math.ceil(config.quiz.length * 0.7)}/{config.quiz.length} correct to pass.
                </p>
                
                <div className="space-y-6">
                  {config.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white/5 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4">{qIdx + 1}. {q.question}</h3>
                      <div className="space-y-2">
                        {q.options.map((option, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              const newAnswers = [...quizAnswers];
                              newAnswers[qIdx] = oIdx;
                              setQuizAnswers(newAnswers);
                            }}
                            className={`w-full p-3 rounded-lg text-left transition-all ${
                              quizAnswers[qIdx] === oIdx
                                ? 'bg-blue-500/30 border-2 border-blue-400'
                                : 'bg-white/10 hover:bg-white/20'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {quizAnswers.length === config.quiz.length && (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
                  >
                    Submit Answers
                  </button>
                )}
              </>
            ) : (
              <>
                <div className={`text-center mb-6 p-8 rounded-xl ${passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {passed ? (
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-400 mb-4" />
                  ) : (
                    <AlertTriangle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                  )}
                  <h3 className="text-3xl font-bold mb-2">
                    Score: {score}/{config.quiz.length}
                  </h3>
                  <p className="text-xl">
                    {passed ? '✓ Passed! Well done!' : '✗ Not quite. Try again!'}
                  </p>
                </div>
                
                {passed ? (
                  <button
                    onClick={() => {
                      const saved = localStorage.getItem('ecosphere_game_state');
                      if (saved) {
                        const state = JSON.parse(saved);
                        state.completedLevels = [...new Set([...state.completedLevels, config.level])];
                        state.maxUnlockedLevel = Math.max(state.maxUnlockedLevel, config.level + 1);
                        state.currentLevel = config.level + 1;
                        localStorage.setItem('ecosphere_game_state', JSON.stringify(state));
                      }
                      setPhase('complete');
                    }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
                  >
                    Complete Level {config.level}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizAnswers([]);
                      setQuizSubmitted(false);
                    }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
                  >
                    Retake Quiz
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6 text-white flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <CheckCircle2 className="w-32 h-32 mx-auto text-emerald-400 animate-bounce mb-8" />
          <h1 className="text-6xl font-bold mb-6">Level {config.level} Complete!</h1>
          <p className="text-2xl text-gray-300 mb-8">
            {config.title} - {config.subtitle}
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Tasks Completed</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-4xl font-bold text-green-400">{tasks.length}</div>
                <div className="text-sm text-gray-400">All Tasks Done</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400">{Math.ceil(tasks.reduce((sum, t) => sum + t.timeRequired, 0) / 60)}min</div>
                <div className="text-sm text-gray-400">Time Invested</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              if (config.level < 15) {
                window.location.href = '/projects';
              } else {
                // Final level complete - show special ending
                alert('Congratulations! You have completed ALL 15 levels of EcoSphere Chronicles! You are now a master environmental restoration expert!');
                window.location.href = '/projects';
              }
            }}
            className={`px-12 py-4 bg-gradient-to-r ${config.color} rounded-xl font-bold text-xl hover:scale-105 transition-transform`}
          >
            {config.level < 15 ? `Continue to Level ${config.level + 1}` : '🏆 Complete Game 🏆'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}