'use client';

import { useState } from 'react';
import { Lightbulb, DollarSign, Users, Calendar, CheckCircle2, AlertTriangle, Target } from 'lucide-react';

interface Action {
  id: number;
  name: string;
  category: string;
  cost: number;
  duration: number; // months
  impact: number;
  teamRequired: number;
}

const AVAILABLE_ACTIONS: Action[] = [
  { id: 1, name: 'Install Water Filter Systems', category: 'Infrastructure', cost: 15000, duration: 3, impact: 8, teamRequired: 2 },
  { id: 2, name: 'Wetland Restoration', category: 'Ecology', cost: 12000, duration: 6, impact: 9, teamRequired: 3 },
  { id: 3, name: 'Community Education Program', category: 'Education', cost: 5000, duration: 2, impact: 6, teamRequired: 1 },
  { id: 4, name: 'Industrial Regulation Enforcement', category: 'Policy', cost: 8000, duration: 4, impact: 7, teamRequired: 2 },
  { id: 5, name: 'Agricultural Best Practices Training', category: 'Education', cost: 6000, duration: 3, impact: 7, teamRequired: 1 },
  { id: 6, name: 'Storm Drain System Upgrade', category: 'Infrastructure', cost: 20000, duration: 5, impact: 8, teamRequired: 3 },
  { id: 7, name: 'Riparian Buffer Zones', category: 'Ecology', cost: 10000, duration: 4, impact: 7, teamRequired: 2 },
  { id: 8, name: 'Water Quality Monitoring Network', category: 'Research', cost: 7000, duration: 2, impact: 6, teamRequired: 1 },
  { id: 9, name: 'Invasive Species Removal', category: 'Ecology', cost: 8000, duration: 3, impact: 6, teamRequired: 2 },
  { id: 10, name: 'Green Infrastructure Incentives', category: 'Policy', cost: 12000, duration: 6, impact: 8, teamRequired: 2 }
];

export default function Level3Game() {
  const [phase, setPhase] = useState<'intro' | 'planning' | 'budgeting' | 'timeline' | 'team' | 'review' | 'complete'>('intro');
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [budget] = useState(50000);
  const [timeline] = useState(12); // months
  const [teamCapacity] = useState(5);
  const [actionSchedule, setActionSchedule] = useState<{[key: number]: number}>({});

  const toggleAction = (action: Action) => {
    if (selectedActions.find(a => a.id === action.id)) {
      setSelectedActions(selectedActions.filter(a => a.id !== action.id));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const totalCost = selectedActions.reduce((sum, a) => sum + a.cost, 0);
  const totalImpact = selectedActions.reduce((sum, a) => sum + a.impact, 0);
  const maxTeamNeeded = Math.max(...selectedActions.map(a => a.teamRequired), 0);

  const canProceed = totalCost <= budget && maxTeamNeeded <= teamCapacity && selectedActions.length >= 5;

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto pt-20">
          <Lightbulb className="w-32 h-32 mx-auto text-purple-400 animate-pulse mb-8" />
          <h1 className="text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Level 3: Grand Plan
          </h1>
          <p className="text-3xl mb-8 text-center text-gray-300">Strategy & Design</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">💡 Time to Build Your Strategy</h2>
            <p className="text-lg text-gray-300 mb-4">
              You know the problems. You know the sources. Now it's time to design a comprehensive 
              restoration strategy that balances impact, cost, timeline, and team capacity.
            </p>
            
            <div className="bg-purple-500/20 border-2 border-purple-400 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">🎯 Your Resources</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <DollarSign className="w-8 h-8 mx-auto text-green-400 mb-2" />
                  <div className="text-2xl font-bold text-green-400">${budget.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Budget</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <Calendar className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                  <div className="text-2xl font-bold text-blue-400">{timeline} months</div>
                  <div className="text-sm text-gray-400">Timeline</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <Users className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                  <div className="text-2xl font-bold text-purple-400">{teamCapacity} members</div>
                  <div className="text-sm text-gray-400">Team Size</div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">📋 Requirements</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Select at least 5 restoration actions</li>
                <li>• Stay within budget and team capacity</li>
                <li>• Create a realistic timeline</li>
                <li>• Maximize environmental impact</li>
              </ul>
            </div>
            
            <button
              onClick={() => setPhase('planning')}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
            >
              Begin Planning
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'planning') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 sticky top-0">
            <h2 className="text-3xl font-bold mb-4">📋 Action Selection</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-gray-400">Budget Used</div>
                <div className={`text-2xl font-bold ${totalCost > budget ? 'text-red-400' : 'text-green-400'}`}>
                  ${totalCost.toLocaleString()} / ${budget.toLocaleString()}
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-gray-400">Actions Selected</div>
                <div className={`text-2xl font-bold ${selectedActions.length < 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {selectedActions.length} / 5 minimum
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-gray-400">Total Impact</div>
                <div className="text-2xl font-bold text-purple-400">{totalImpact}</div>
              </div>
            </div>
            {!canProceed && (
              <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-3 text-sm">
                {totalCost > budget && '⚠️ Over budget! '}
                {selectedActions.length < 5 && '⚠️ Select at least 5 actions! '}
                {maxTeamNeeded > teamCapacity && '⚠️ Exceeds team capacity! '}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {AVAILABLE_ACTIONS.map(action => {
              const isSelected = selectedActions.find(a => a.id === action.id);
              return (
                <button
                  key={action.id}
                  onClick={() => toggleAction(action)}
                  className={`p-6 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-purple-500/30 border-2 border-purple-400 scale-105'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{action.name}</h3>
                      <p className="text-sm text-gray-400">{action.category}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-purple-400" />}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-400">Cost</div>
                      <div className="font-bold text-green-400">${action.cost.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Duration</div>
                      <div className="font-bold text-blue-400">{action.duration}mo</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Impact</div>
                      <div className="font-bold text-purple-400">{action.impact}/10</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{action.teamRequired} team members required</span>
                  </div>
                </button>
              );
            })}
          </div>

          {canProceed && (
            <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Strategy Looks Good!</h3>
              <p className="text-gray-300 mb-4">
                {selectedActions.length} actions selected, ${totalCost.toLocaleString()} total cost, {totalImpact} impact points
              </p>
              <button
                onClick={() => setPhase('timeline')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
              >
                Create Timeline
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'timeline') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
            <h2 className="text-3xl font-bold mb-4">📅 Timeline Planning</h2>
            <p className="text-gray-300">
              Schedule when each action will begin. Actions can overlap, but make sure your team capacity isn't exceeded.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {selectedActions.map(action => {
              const startMonth = actionSchedule[action.id] || 0;
              return (
                <div key={action.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{action.name}</h3>
                      <p className="text-sm text-gray-400">Duration: {action.duration} months</p>
                    </div>
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Start Month: {startMonth}</label>
                    <input
                      type="range"
                      min="0"
                      max={timeline - action.duration}
                      value={startMonth}
                      onChange={(e) => setActionSchedule({...actionSchedule, [action.id]: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="grid grid-cols-12 gap-1">
                      {Array.from({ length: timeline }).map((_, month) => {
                        const isActive = month >= startMonth && month < startMonth + action.duration;
                        return (
                          <div
                            key={month}
                            className={`h-6 rounded ${isActive ? 'bg-blue-500' : 'bg-white/10'}`}
                            title={`Month ${month + 1}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedActions.every(a => actionSchedule[a.id] !== undefined) && (
            <div className="bg-blue-500/20 border-2 border-blue-400 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Timeline Complete!</h3>
              <button
                onClick={() => setPhase('review')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
              >
                Review Strategy
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'review') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-6">
            <h2 className="text-3xl font-bold mb-6 text-center">🎯 Strategy Review</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center">
                <DollarSign className="w-12 h-12 mx-auto text-green-400 mb-3" />
                <div className="text-3xl font-bold text-green-400">${totalCost.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Budget Used</div>
                <div className="text-xs text-gray-500 mt-1">${budget - totalCost} remaining</div>
              </div>

              <div className="bg-purple-500/20 border-2 border-purple-400 rounded-xl p-6 text-center">
                <Target className="w-12 h-12 mx-auto text-purple-400 mb-3" />
                <div className="text-3xl font-bold text-purple-400">{totalImpact}</div>
                <div className="text-sm text-gray-400">Impact Score</div>
              </div>

              <div className="bg-blue-500/20 border-2 border-blue-400 rounded-xl p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto text-blue-400 mb-3" />
                <div className="text-3xl font-bold text-blue-400">{selectedActions.length}</div>
                <div className="text-sm text-gray-400">Actions Planned</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Selected Actions:</h3>
              <ul className="space-y-2">
                {selectedActions.map(action => (
                  <li key={action.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>{action.name}</span>
                    <span className="text-sm text-gray-400">${action.cost.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                const saved = localStorage.getItem('ecosphere_game_state');
                if (saved) {
                  const state = JSON.parse(saved);
                  state.completedLevels = [...new Set([...state.completedLevels, 3])];
                  state.maxUnlockedLevel = Math.max(state.maxUnlockedLevel, 4);
                  state.currentLevel = 4;
                  localStorage.setItem('ecosphere_game_state', JSON.stringify(state));
                }
                setPhase('complete');
              }}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
            >
              Approve Strategy & Complete Level
            </button>
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
          <h1 className="text-6xl font-bold mb-6">Level 3 Complete!</h1>
          <p className="text-2xl text-gray-300 mb-8">
            Your restoration strategy is approved! Time to put it into action.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Strategy Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold text-green-400">{selectedActions.length}</div>
                <div className="text-sm text-gray-400">Actions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">${totalCost.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Investment</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">{totalImpact}</div>
                <div className="text-sm text-gray-400">Impact</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              // Update game state to unlock Level 4
              const currentState = JSON.parse(localStorage.getItem('ecosphere_game_state') || '{}');
              if (currentState) {
                currentState.currentLevel = 4;
                currentState.maxUnlockedLevel = Math.max(currentState.maxUnlockedLevel || 1, 4);
                localStorage.setItem('ecosphere_game_state', JSON.stringify(currentState));
              }
              window.location.href = '/projects';
            }}
            className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
          >
            Continue to Level 4
          </button>
        </div>
      </div>
    );
  }

  return null;
}
