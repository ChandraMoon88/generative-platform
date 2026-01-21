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
      { name: 'Deploy Team Alpha', description: 'Assign team to wetland restoration site', timeRequired: 45, completed: false },
      { name: 'Secure Permits', description: 'Process regulatory approvals', timeRequired: 60, completed: false },
      { name: 'Order Materials', description: 'Purchase water filtration equipment', timeRequired: 40, completed: false },
      { name: 'Community Briefing', description: 'Present plan to stakeholders', timeRequired: 50, completed: false },
      { name: 'Begin Construction', description: 'Start infrastructure work', timeRequired: 55, completed: false },
      { name: 'Monitor Progress', description: 'Track implementation metrics', timeRequired: 45, completed: false }
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
      { name: 'Interview Scientists', description: 'Hire ecologist and chemist', timeRequired: 50, completed: false },
      { name: 'Recruit Volunteers', description: 'Organize community support', timeRequired: 45, completed: false },
      { name: 'Train Team', description: 'Conduct safety and skills training', timeRequired: 60, completed: false },
      { name: 'Assign Roles', description: 'Define responsibilities', timeRequired: 40, completed: false },
      { name: 'Team Building Exercise', description: 'Build group cohesion', timeRequired: 50, completed: false },
      { name: 'Set Communication Protocol', description: 'Establish reporting system', timeRequired: 45, completed: false }
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
      { name: 'Create Budget Spreadsheet', description: 'Detail all expenses', timeRequired: 55, completed: false },
      { name: 'Apply for Grants', description: 'Submit funding applications', timeRequired: 60, completed: false },
      { name: 'Track Expenditures', description: 'Monitor spending weekly', timeRequired: 45, completed: false },
      { name: 'Adjust Allocations', description: 'Reallocate based on needs', timeRequired: 50, completed: false },
      { name: 'Generate Reports', description: 'Create financial summaries', timeRequired: 55, completed: false },
      { name: 'Plan for Contingencies', description: 'Set aside emergency funds', timeRequired: 45, completed: false }
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
      { name: 'Respond to Chemical Spill', description: 'Activate emergency protocol', timeRequired: 60, completed: false },
      { name: 'Evacuate Area', description: 'Ensure safety first', timeRequired: 50, completed: false },
      { name: 'Contain Contamination', description: 'Deploy barriers', timeRequired: 55, completed: false },
      { name: 'Communicate with Public', description: 'Issue safety updates', timeRequired: 45, completed: false },
      { name: 'Coordinate with Authorities', description: 'Work with regulators', timeRequired: 50, completed: false },
      { name: 'Document Incident', description: 'Create detailed report', timeRequired: 55, completed: false }
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
      { name: 'Host Town Hall', description: 'Present progress to community', timeRequired: 55, completed: false },
      { name: 'Create Education Program', description: 'Develop curriculum for schools', timeRequired: 60, completed: false },
      { name: 'Organize Cleanup Day', description: 'Mobilize 100+ volunteers', timeRequired: 50, completed: false },
      { name: 'Launch Social Media', description: 'Share success stories online', timeRequired: 45, completed: false },
      { name: 'Partner with Businesses', description: 'Secure local sponsorships', timeRequired: 55, completed: false },
      { name: 'Celebrate Milestones', description: 'Recognition event for volunteers', timeRequired: 50, completed: false }
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
      { name: 'Study Environmental Laws', description: 'Review all applicable regulations', timeRequired: 60, completed: false },
      { name: 'Submit Compliance Reports', description: 'File required documentation', timeRequired: 55, completed: false },
      { name: 'Schedule Inspections', description: 'Coordinate with regulators', timeRequired: 45, completed: false },
      { name: 'Address Violations', description: 'Correct any issues found', timeRequired: 50, completed: false },
      { name: 'Update Permits', description: 'Renew necessary approvals', timeRequired: 55, completed: false },
      { name: 'Train Staff on Compliance', description: 'Ensure everyone follows rules', timeRequired: 50, completed: false }
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
      { name: 'Collect Baseline Data', description: 'Establish before-restoration metrics', timeRequired: 55, completed: false },
      { name: 'Ongoing Monitoring', description: 'Weekly water quality tests', timeRequired: 50, completed: false },
      { name: 'Analyze Trends', description: 'Use statistical methods', timeRequired: 60, completed: false },
      { name: 'Visualize Data', description: 'Create graphs and charts', timeRequired: 45, completed: false },
      { name: 'Compare Results', description: 'Measure against goals', timeRequired: 55, completed: false },
      { name: 'Publish Findings', description: 'Share results publicly', timeRequired: 50, completed: false }
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
      { name: 'Create Maintenance Plan', description: 'Schedule ongoing care', timeRequired: 60, completed: false },
      { name: 'Establish Endowment', description: 'Secure long-term funding', timeRequired: 55, completed: false },
      { name: 'Train Local Leaders', description: 'Transfer knowledge', timeRequired: 50, completed: false },
      { name: 'Build Partnerships', description: 'Ensure continued support', timeRequired: 55, completed: false },
      { name: 'Monitor for 5 Years', description: 'Commit to long-term tracking', timeRequired: 45, completed: false },
      { name: 'Adaptive Management', description: 'Adjust based on results', timeRequired: 50, completed: false }
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
      { name: 'Identify New Sites', description: 'Survey 5 additional rivers', timeRequired: 60, completed: false },
      { name: 'Replicate Model', description: 'Apply successful strategies', timeRequired: 55, completed: false },
      { name: 'Recruit Regional Teams', description: 'Expand to 3 new locations', timeRequired: 50, completed: false },
      { name: 'Secure Major Funding', description: 'Apply for $500K grant', timeRequired: 60, completed: false },
      { name: 'Develop Training Materials', description: 'Create replication guide', timeRequired: 50, completed: false },
      { name: 'Launch Regional Network', description: 'Connect all restoration sites', timeRequired: 55, completed: false }
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
      { name: 'Research Legislation', description: 'Identify policy gaps', timeRequired: 60, completed: false },
      { name: 'Draft Policy Proposal', description: 'Write environmental protection bill', timeRequired: 65, completed: false },
      { name: 'Build Coalition', description: 'Unite 20+ organizations', timeRequired: 55, completed: false },
      { name: 'Testify at Hearings', description: 'Present to lawmakers', timeRequired: 50, completed: false },
      { name: 'Media Campaign', description: 'Generate public pressure', timeRequired: 60, completed: false },
      { name: 'Negotiate with Officials', description: 'Secure commitments', timeRequired: 55, completed: false }
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
      { name: 'Document Journey', description: 'Write comprehensive history', timeRequired: 70, completed: false },
      { name: 'Measure Total Impact', description: 'Calculate all metrics', timeRequired: 65, completed: false },
      { name: 'Create Educational Film', description: 'Inspire future generations', timeRequired: 60, completed: false },
      { name: 'Establish Foundation', description: 'Ensure perpetual funding', timeRequired: 70, completed: false },
      { name: 'Global Conference', description: 'Share model worldwide', timeRequired: 65, completed: false },
      { name: 'Celebrate Victory', description: 'Recognition ceremony', timeRequired: 60, completed: false }
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
  
  // Dynamic events state
  const [currentEvent, setCurrentEvent] = useState<DynamicEvent | null>(null);
  const [budget, setBudget] = useState(50000);
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [teamMorale, setTeamMorale] = useState(75);
  const [eventsHandled, setEventsHandled] = useState<string[]>([]);
  const [eventConsequence, setEventConsequence] = useState<string | null>(null);

  useEffect(() => {
    if (phase === 'tasks' && currentTaskIndex < tasks.length) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev >= tasks[currentTaskIndex].timeRequired) {
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
  }, [phase, currentTaskIndex, tasks, config.quiz, levelNumber, budget, daysElapsed, currentEvent, eventsHandled]);

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

  const Icon = config.icon;
  
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
        </div>
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
