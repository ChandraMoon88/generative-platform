'use client';

import { useState, useEffect } from 'react';
import { Search, Camera, FileText, AlertCircle, CheckCircle2, Factory, Tractor, Home, Trash2, Mountain } from 'lucide-react';

interface PollutionSource {
  id: number;
  name: string;
  type: 'industrial' | 'agricultural' | 'urban' | 'illegal' | 'natural';
  severity: number; // 1-10
  found: boolean;
  documented: boolean;
  evidence: {
    photo: boolean;
    photoDescription: string;
    measurement: boolean;
    measurementValue: string;
    interview: boolean;
    interviewNotes: string;
  };
}

const POLLUTION_SOURCES: Omit<PollutionSource, 'found' | 'documented' | 'evidence'>[] = [
  { id: 1, name: 'ChemCorp Factory Discharge', type: 'industrial', severity: 9 },
  { id: 2, name: 'Riverside Farm Runoff', type: 'agricultural', severity: 7 },
  { id: 3, name: 'City Storm Drains', type: 'urban', severity: 6 },
  { id: 4, name: 'Hidden Waste Dump', type: 'illegal', severity: 8 },
  { id: 5, name: 'Abandoned Mine Seepage', type: 'natural', severity: 5 },
  { id: 6, name: 'Industrial Park Overflow', type: 'industrial', severity: 6 },
  { id: 7, name: 'Pesticide Application Area', type: 'agricultural', severity: 7 }
];

export default function Level2Game() {
  const [sources, setSources] = useState<PollutionSource[]>([]);
  const [currentSource, setCurrentSource] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'tracking' | 'documenting' | 'prioritizing' | 'complete'>('intro');
  const [priorityMatrix, setPriorityMatrix] = useState<{[key: number]: {impact: number, feasibility: number}}>({});

  useEffect(() => {
    const initialSources = POLLUTION_SOURCES.map(s => ({
      ...s,
      found: false,
      documented: false,
      evidence: { photo: false, measurement: false, interview: false }
    }));
    setSources(initialSources);
  }, []);

  const startTracking = () => {
    setPhase('tracking');
    // Simulate finding sources one by one
    let foundCount = 0;
    const interval = setInterval(() => {
      if (foundCount < POLLUTION_SOURCES.length) {
        setSources(prev => prev.map((s, idx) => 
          idx === foundCount ? { ...s, found: true } : s
        ));
        foundCount++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('documenting'), 1000);
      }
    }, 3000);
  };

  const collectEvidence = (sourceId: number, evidenceType: 'photo' | 'measurement' | 'interview') => {
    setSources(prev => prev.map(s => 
      s.id === sourceId 
        ? { ...s, evidence: { ...s.evidence, [evidenceType]: true } }
        : s
    ));
  };

  const completeDocumentation = (sourceId: number) => {
    const source = sources.find(s => s.id === sourceId);
    if (source && source.evidence.photo && source.evidence.measurement && source.evidence.interview) {
      setSources(prev => prev.map(s => 
        s.id === sourceId ? { ...s, documented: true } : s
      ));
    }
  };

  const setPriority = (sourceId: number, impact: number, feasibility: number) => {
    setPriorityMatrix(prev => ({ ...prev, [sourceId]: { impact, feasibility } }));
  };

  const allDocumented = sources.every(s => s.documented);
  const allPrioritized = sources.every(s => priorityMatrix[s.id]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'industrial': return Factory;
      case 'agricultural': return Tractor;
      case 'urban': return Home;
      case 'illegal': return Trash2;
      case 'natural': return Mountain;
      default: return AlertCircle;
    }
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto pt-20">
          <Search className="w-32 h-32 mx-auto text-orange-400 animate-pulse mb-8" />
          <h1 className="text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
            Level 2: Source of Sorrow
          </h1>
          <p className="text-3xl mb-8 text-center text-gray-300">Investigation</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">🔍 The Investigation Begins</h2>
            <p className="text-lg text-gray-300 mb-4">
              You've assessed the river's condition. Now it's time to find the culprits. 
              Every polluted waterway has sources - factories, farms, illegal dumps, and more.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Use your Pollution Tracker to follow contamination back to its origins. 
              Each source must be documented with complete evidence before you can act.
            </p>
            
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">📋 Your Tasks</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Track pollution upstream to find 7 sources</li>
                <li>• Document each source with photos, measurements, and interviews</li>
                <li>• Prioritize sources using the Impact-Feasibility Matrix</li>
                <li>• Create an action plan based on priorities</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">⏱️ Estimated time: 15-25 minutes</p>
            
            <button
              onClick={startTracking}
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
            >
              Begin Tracking Pollution
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'tracking') {
    const foundCount = sources.filter(s => s.found).length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
            <h2 className="text-3xl font-bold mb-4">🔍 Tracking Pollution Sources</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white/20 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(foundCount / POLLUTION_SOURCES.length) * 100}%` }}
                />
              </div>
              <span className="text-2xl font-bold">{foundCount}/{POLLUTION_SOURCES.length}</span>
            </div>
            <p className="text-gray-400 mt-2">Following pollution trails upstream...</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {sources.map(source => {
              const Icon = getSourceIcon(source.type);
              return (
                <div
                  key={source.id}
                  className={`p-6 rounded-xl transition-all ${
                    source.found 
                      ? 'bg-orange-500/20 border-2 border-orange-400' 
                      : 'bg-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`p-3 rounded-lg ${source.found ? 'bg-orange-500' : 'bg-white/10'}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{source.found ? source.name : '???'}</h3>
                      <p className="text-sm text-gray-400 capitalize">{source.found ? source.type : 'Searching...'}</p>
                    </div>
                    {source.found && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-400">{source.severity}/10</div>
                        <div className="text-xs text-gray-400">Severity</div>
                      </div>
                    )}
                  </div>
                  {source.found && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-sm text-gray-300">
                        Source identified! Click to begin documentation.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'documenting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
            <h2 className="text-3xl font-bold mb-4">📸 Evidence Collection</h2>
            <p className="text-gray-300 mb-4">
              Document each pollution source with complete evidence: photos, measurements, and witness interviews.
            </p>
            <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-4">
              <p className="text-sm">
                <strong>Requirement:</strong> All three evidence types required for each source before proceeding
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sources.map(source => {
              const Icon = getSourceIcon(source.type);
              const allEvidence = source.evidence.photo && source.evidence.measurement && source.evidence.interview;
              
              return (
                <div
                  key={source.id}
                  className={`bg-white/10 backdrop-blur-md rounded-xl p-6 ${
                    source.documented ? 'border-2 border-green-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-500/20 rounded-lg">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{source.name}</h3>
                        <p className="text-sm text-gray-400">Severity: {source.severity}/10</p>
                      </div>
                    </div>
                    {source.documented && (
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    )}
                  </div>

                  {!source.documented && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <button
                        onClick={() => collectEvidence(source.id, 'photo')}
                        disabled={source.evidence.photo}
                        className={`p-4 rounded-lg transition-all ${
                          source.evidence.photo
                            ? 'bg-green-500/20 border-2 border-green-400'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <Camera className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">{source.evidence.photo ? '✓ Photo Taken' : 'Take Photo'}</div>
                      </button>

                      <button
                        onClick={() => collectEvidence(source.id, 'measurement')}
                        disabled={source.evidence.measurement}
                        className={`p-4 rounded-lg transition-all ${
                          source.evidence.measurement
                            ? 'bg-green-500/20 border-2 border-green-400'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">{source.evidence.measurement ? '✓ Measured' : 'Take Measurement'}</div>
                      </button>

                      <button
                        onClick={() => collectEvidence(source.id, 'interview')}
                        disabled={source.evidence.interview}
                        className={`p-4 rounded-lg transition-all ${
                          source.evidence.interview
                            ? 'bg-green-500/20 border-2 border-green-400'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <FileText className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">{source.evidence.interview ? '✓ Interview Done' : 'Interview Witness'}</div>
                      </button>
                    </div>
                  )}

                  {allEvidence && !source.documented && (
                    <button
                      onClick={() => completeDocumentation(source.id)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold hover:scale-105 transition-transform"
                    >
                      Complete Documentation
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {allDocumented && (
            <div className="mt-6 bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">All Sources Documented!</h3>
              <button
                onClick={() => setPhase('prioritizing')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
              >
                Proceed to Prioritization
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'prioritizing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
            <h2 className="text-3xl font-bold mb-4">📊 Priority Matrix</h2>
            <p className="text-gray-300 mb-4">
              Rate each source on Impact (harm caused) and Feasibility (ease of addressing). 
              High impact + high feasibility sources should be tackled first.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {sources.map(source => {
              const priority = priorityMatrix[source.id];
              const Icon = getSourceIcon(source.type);
              
              return (
                <div key={source.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{source.name}</h3>
                      <p className="text-sm text-gray-400">Severity: {source.severity}/10</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Impact (1-10)</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={priority?.impact || 5}
                        onChange={(e) => setPriority(source.id, parseInt(e.target.value), priority?.feasibility || 5)}
                        className="w-full"
                      />
                      <div className="text-center text-2xl font-bold text-orange-400">{priority?.impact || 5}</div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Feasibility (1-10)</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={priority?.feasibility || 5}
                        onChange={(e) => setPriority(source.id, priority?.impact || 5, parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-2xl font-bold text-green-400">{priority?.feasibility || 5}</div>
                    </div>
                  </div>

                  {priority && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg text-center">
                      <div className="text-sm text-gray-400">Priority Score</div>
                      <div className="text-3xl font-bold text-purple-400">{priority.impact * priority.feasibility}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allPrioritized && (
            <div className="bg-purple-500/20 border-2 border-purple-400 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Prioritization Complete!</h3>
              <button
                onClick={() => {
                  // Save progress and mark level complete
                  const saved = localStorage.getItem('ecosphere_game_state');
                  if (saved) {
                    const state = JSON.parse(saved);
                    state.completedLevels = [...new Set([...state.completedLevels, 2])];
                    state.maxUnlockedLevel = Math.max(state.maxUnlockedLevel, 3);
                    state.currentLevel = 3;
                    localStorage.setItem('ecosphere_game_state', JSON.stringify(state));
                  }
                  setPhase('complete');
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
              >
                Complete Level 2
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6 text-white flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <CheckCircle2 className="w-32 h-32 mx-auto text-green-400 animate-bounce mb-8" />
          <h1 className="text-6xl font-bold mb-6">Level 2 Complete!</h1>
          <p className="text-2xl text-gray-300 mb-8">
            You've identified all pollution sources and prioritized your restoration strategy.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What You Learned</h3>
            <ul className="text-left space-y-2 text-gray-300">
              <li>✓ How to trace pollution to its sources</li>
              <li>✓ Importance of complete evidence collection</li>
              <li>✓ Using impact-feasibility matrices for prioritization</li>
              <li>✓ Strategic planning for environmental restoration</li>
            </ul>
          </div>
          <button
            onClick={() => {
              // Update game state to unlock Level 3
              const currentState = JSON.parse(localStorage.getItem('ecosphere_game_state') || '{}');
              if (currentState) {
                currentState.currentLevel = 3;
                currentState.maxUnlockedLevel = Math.max(currentState.maxUnlockedLevel || 1, 3);
                localStorage.setItem('ecosphere_game_state', JSON.stringify(currentState));
              }
              window.location.href = '/projects';
            }}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
          >
            Continue to Level 3
          </button>
        </div>
      </div>
    );
  }

  return null;
}
