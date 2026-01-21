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
  const [activeModal, setActiveModal] = useState<{sourceId: number, type: 'photo' | 'measurement' | 'interview'} | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const initialSources = POLLUTION_SOURCES.map(s => ({
      ...s,
      found: false,
      documented: false,
      evidence: { 
        photo: false, 
        photoDescription: '',
        measurement: false, 
        measurementValue: '',
        interview: false,
        interviewNotes: ''
      }
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
  const validateEvidence = (evidenceType: 'photo' | 'measurement' | 'interview', value: string): { valid: boolean; message: string } => {
    const input = value.toLowerCase().trim();
    
    if (evidenceType === 'photo') {
      // Must describe pollution indicators
      const hasColor = /\b(green|brown|black|grey|gray|yellow|orange|red|murky|dark|discolored)\b/.test(input);
      const hasPollution = /\b(chemical|discharge|foam|oil|waste|contamination|pollution|sludge|debris|dead|smell|odor)\b/.test(input);
      const hasLocation = /\b(pipe|drain|outlet|shore|surface|bank|water|river|stream|factory|plant|facility)\b/.test(input);
      
      if (!hasColor && !hasPollution) {
        return { valid: false, message: '❌ Photo description must mention pollution indicators (color, type, or visual evidence). Example: "Dark chemical discharge from pipe, foam on water surface"' };
      }
      if (!hasLocation) {
        return { valid: false, message: '❌ Please specify where you see the pollution (pipe, water surface, shore, etc.)' };
      }
    } else if (evidenceType === 'measurement') {
      // Must include unit and reasonable value
      const hasUnit = /\b(ppm|ph|mg\/l|ntu|percent|%|degrees|celsius|fahrenheit)\b/.test(input);
      const hasNumber = /\d+/.test(input);
      
      if (!hasNumber) {
        return { valid: false, message: '❌ Measurement must include numeric values. Example: "pH 3.2, Turbidity 850 NTU"' };
      }
      if (!hasUnit) {
        return { valid: false, message: '❌ Please include measurement units (pH, PPM, mg/L, NTU, etc.)' };
      }
    } else if (evidenceType === 'interview') {
      // Must mention impact or timeline
      const hasImpact = /\b(health|sick|smell|drinking|fish|dead|concern|worried|affected|problem|issue|damage|harm)\b/.test(input);
      const hasTimeline = /\b(\d+\s*(year|month|week|day)|recent|long|always|since|ago)\b/.test(input);
      
      if (!hasImpact) {
        return { valid: false, message: '❌ Interview must document impact on community or environment. Example: "Residents report health issues, strong chemical smell for 2 years"' };
      }
      if (!hasTimeline) {
        return { valid: false, message: '❌ Please include how long this has been happening (timeline)' };
      }
    }
    
    return { valid: true, message: '✅ Evidence accepted!' };
  };

  const collectEvidence = (sourceId: number, evidenceType: 'photo' | 'measurement' | 'interview', value: string) => {
    const validation = validateEvidence(evidenceType, value);
    
    if (!validation.valid) {
      alert(validation.message);
      return; // Don't close modal, let user try again
    }
    
    setSources(prev => prev.map(s => {
      if (s.id === sourceId) {
        const newEvidence = { ...s.evidence };
        if (evidenceType === 'photo') {
          newEvidence.photo = true;
          newEvidence.photoDescription = value;
        } else if (evidenceType === 'measurement') {
          newEvidence.measurement = true;
          newEvidence.measurementValue = value;
        } else if (evidenceType === 'interview') {
          newEvidence.interview = true;
          newEvidence.interviewNotes = value;
        }
        return { ...s, evidence: newEvidence };
      }
      return s;
    }));
    setActiveModal(null);
    setInputValue('');
  };

  const openEvidenceModal = (sourceId: number, type: 'photo' | 'measurement' | 'interview') => {
    setActiveModal({ sourceId, type });
    setInputValue('');
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
                        onClick={() => openEvidenceModal(source.id, 'photo')}
                        disabled={source.evidence.photo}
                        className={`p-4 rounded-lg transition-all ${
                          source.evidence.photo
                            ? 'bg-green-500/20 border-2 border-green-400'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <Camera className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-bold">{source.evidence.photo ? '✓ Photo Taken' : 'Take Photo'}</div>
                        {source.evidence.photo && (
                          <div className="text-xs mt-2 text-gray-400 truncate">{source.evidence.photoDescription}</div>
                        )}
                      </button>

                      <button
                        onClick={() => openEvidenceModal(source.id, 'measurement')}
                        disabled={source.evidence.measurement}
                        className={`p-4 rounded-lg transition-all ${
                          source.evidence.measurement
                            ? 'bg-green-500/20 border-2 border-green-400'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-bold">{source.evidence.measurement ? '✓ Measured' : 'Take Measurement'}</div>
                        {source.evidence.measurement && (
                          <div className="text-xs mt-2 text-gray-400">{source.evidence.measurementValue}</div>
                        )}
                      </button>

                      <button
                        onClick={() => openEvidenceModal(source.id, 'interview')}
                        disabled={source.evidence.interview}
                        className={`p-4 rounded-lg transition-all ${
                          source.evidence.interview
                            ? 'bg-green-500/20 border-2 border-green-400'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <FileText className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-bold">{source.evidence.interview ? '✓ Interview Done' : 'Interview Witness'}</div>
                        {source.evidence.interview && (
                          <div className="text-xs mt-2 text-gray-400 truncate">{source.evidence.interviewNotes}</div>
                        )}
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

        {/* Evidence Collection Modal */}
        {activeModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-8 border-2 border-white/20">
              <h3 className="text-2xl font-bold mb-4">
                {activeModal.type === 'photo' && '📸 Take Photo & Document'}
                {activeModal.type === 'measurement' && '📊 Record Measurements'}
                {activeModal.type === 'interview' && '🎤 Conduct Interview'}
              </h3>
              
              <p className="text-gray-400 mb-6">
                {activeModal.type === 'photo' && 'Describe what you observe in the photo. What pollution evidence do you see?'}
                {activeModal.type === 'measurement' && 'Record pollution levels (pH, chemical concentrations, turbidity, etc.)'}
                {activeModal.type === 'interview' && 'Document witness testimony. What did they tell you about this pollution source?'}
              </p>

              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  activeModal.type === 'photo' ? 'e.g., "Green chemical discharge visible from pipe, foam on water surface, dead fish nearby..."' :
                  activeModal.type === 'measurement' ? 'e.g., "pH: 3.2 (highly acidic), Turbidity: 850 NTU, Chemical oxygen demand: 450 mg/L..."' :
                  'e.g., "Local resident reports strong chemical smell for 3 years, health issues in community, company denies responsibility..."'
                }
                className="w-full h-40 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setInputValue('');
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (inputValue.trim().length >= 20) {
                      collectEvidence(activeModal.sourceId, activeModal.type, inputValue);
                    } else {
                      alert('Please provide more detailed information (at least 20 characters)');
                    }
                  }}
                  disabled={inputValue.trim().length < 20}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Evidence (Will Validate)
                </button>
              </div>
            </div>
          </div>
        )}
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
