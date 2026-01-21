'use client';

import { useState, useEffect } from 'react';
import { 
  Sprout, Droplets, ThermometerSun, Wind, AlertTriangle,
  CheckCircle, XCircle, Clock, Award, ChevronRight, RotateCcw
} from 'lucide-react';
import RiverMapVisualization from './RiverMapVisualization';
import { 
  generateRiverSegmentData, 
  RiverSegmentData, 
  LEVEL_1_QUIZ,
  QuizQuestion,
  calculateQuizScore,
  saveGameState,
  loadGameState,
  GameState,
  INITIAL_GAME_STATE
} from '@/lib/gameState';

type GamePhase = 'intro' | 'tutorial' | 'scanning' | 'analysis' | 'quiz' | 'complete';

export default function Level1Game() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [riverData, setRiverData] = useState<RiverSegmentData[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [scanningSegment, setScanningSegment] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(Array(LEVEL_1_QUIZ.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<{ score: number; passed: boolean } | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Initialize game
  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      setGameState(saved);
      // Check if level 1 is already in progress
      if (saved.levelProgress[1]?.started && !saved.levelProgress[1]?.completed) {
        setRiverData(saved.levelProgress[1].dataCollected);
        if (saved.levelProgress[1].dataCollected.length === 10 && saved.levelProgress[1].dataCollected.every(d => d.scanned)) {
          setPhase('analysis');
        } else {
          setPhase('scanning');
        }
      }
    } else {
      // Generate initial river data
      const initialData = Array.from({ length: 10 }, (_, i) => generateRiverSegmentData(i + 1));
      setRiverData(initialData);
    }
  }, []);

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      saveGameState(gameState);
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [gameState]);

  const startLevel = () => {
    const initialData = Array.from({ length: 10 }, (_, i) => generateRiverSegmentData(i + 1));
    setRiverData(initialData);
    setStartTime(Date.now());
    
    const updatedState = {
      ...gameState,
      levelProgress: {
        ...gameState.levelProgress,
        1: {
          levelNumber: 1,
          started: true,
          dataCollected: initialData,
          quizScore: null,
          quizAttempts: 0,
          timeSpent: 0,
          completed: false
        }
      }
    };
    setGameState(updatedState);
    saveGameState(updatedState);
    setPhase('tutorial');
  };

  const scanSegment = (segmentId: number) => {
    if (riverData[segmentId - 1].scanned) return;
    
    setScanningSegment(segmentId);
    
    // Simulate scanning delay
    setTimeout(() => {
      const updatedData = riverData.map(segment => 
        segment.segmentId === segmentId 
          ? { ...segment, scanned: true, timestamp: Date.now() }
          : segment
      );
      setRiverData(updatedData);
      setSelectedSegment(segmentId);
      setScanningSegment(null);
      
      // Update game state
      const updatedState = {
        ...gameState,
        levelProgress: {
          ...gameState.levelProgress,
          1: {
            ...gameState.levelProgress[1],
            dataCollected: updatedData
          }
        }
      };
      setGameState(updatedState);
      saveGameState(updatedState);
      
      // Check if all segments scanned
      if (updatedData.every(d => d.scanned)) {
        setTimeout(() => {
          setPhase('analysis');
        }, 1000);
      }
    }, 2000); // 2 second scan animation
  };

  const submitQuiz = () => {
    const results = calculateQuizScore(quizAnswers.map(a => a ?? -1));
    setQuizResults(results);
    setQuizSubmitted(true);
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
    
    const updatedState = {
      ...gameState,
      levelProgress: {
        ...gameState.levelProgress,
        1: {
          ...gameState.levelProgress[1],
          quizScore: results.score,
          quizAttempts: (gameState.levelProgress[1]?.quizAttempts || 0) + 1,
          timeSpent,
          completed: results.passed
        }
      }
    };
    
    if (results.passed) {
      updatedState.completedLevels = [...gameState.completedLevels, 1];
      updatedState.maxUnlockedLevel = Math.max(gameState.maxUnlockedLevel, 2);
      updatedState.totalScore += results.score;
      updatedState.levelProgress[1].completedAt = Date.now();
      setPhase('complete');
    }
    
    setGameState(updatedState);
    saveGameState(updatedState);
  };

  const retakeQuiz = () => {
    setQuizAnswers(Array(LEVEL_1_QUIZ.length).fill(null));
    setQuizSubmitted(false);
    setQuizResults(null);
  };

  const getPollutionColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthStatus = (segment: RiverSegmentData) => {
    if (segment.pollutionLevel === 'critical') return 'Critical - Immediate Action Needed';
    if (segment.pollutionLevel === 'high') return 'High Pollution - Urgent';
    if (segment.pollutionLevel === 'moderate') return 'Moderate Pollution - Attention Required';
    return 'Low Pollution - Monitoring Needed';
  };

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center">
            <Droplets className="w-32 h-32 mx-auto text-blue-400 animate-pulse mb-8" />
            
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Level 1: First Contact
            </h1>
            <p className="text-3xl mb-4 text-gray-300">The Arrival</p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-left">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">🌊 The Weeping River Valley</h2>
                <p className="text-lg text-gray-300 mb-4">
                  You descend through misty clouds and land beside a once-beautiful river that now struggles with pollution. 
                  The water is murky, the banks are littered with debris, and the sounds of nature are eerily quiet.
                </p>
                <p className="text-lg text-gray-300 mb-4">
                  A shimmering figure appears - Gaia, the spirit of EcoSphere.
                </p>
                <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-xl p-4 mb-4">
                  <p className="text-lg italic">
                    "Welcome, Restoration Architect. This river once sang with vitality, but now it suffers. 
                    Before we can heal it, you must understand its pain. Use your Environmental Scanner to investigate 
                    every part of this river. Learn what the water tells you."
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-green-400">📖 Your Mission</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Scan all 10 segments of the river to collect environmental data</li>
                  <li>• Record water quality measurements (pH, oxygen, temperature, turbidity)</li>
                  <li>• Identify patterns in pollution distribution</li>
                  <li>• Analyze your findings to understand the river's condition</li>
                  <li>• Demonstrate your understanding through a knowledge assessment</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-purple-400">⚡ What You'll Learn</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• How to assess water quality using scientific measurements</li>
                  <li>• Understanding pH, dissolved oxygen, and turbidity</li>
                  <li>• Identifying pollution patterns in aquatic ecosystems</li>
                  <li>• The importance of comprehensive data collection</li>
                  <li>• How to analyze environmental data systematically</li>
                </ul>
              </div>

              <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-xl p-4">
                <p className="text-sm">
                  <strong>⏱️ Estimated Time:</strong> 20-30 minutes for thorough investigation
                </p>
              </div>
            </div>

            <button
              onClick={startLevel}
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl text-white font-bold text-xl hover:scale-105 transition-transform shadow-lg"
            >
              Begin Investigation <ChevronRight className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TUTORIAL PHASE
  if (phase === 'tutorial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto pt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-4xl font-bold mb-6 text-center">🔬 Environmental Scanner Tutorial</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6">
                <Droplets className="w-12 h-12 text-blue-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">pH Level</h3>
                <p className="text-gray-300">
                  Measures acidity/alkalinity (0-14). Healthy rivers: 6.5-8.5. 
                  Low pH = acidic pollution.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <Wind className="w-12 h-12 text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">Dissolved Oxygen</h3>
                <p className="text-gray-300">
                  Oxygen in water (mg/L). Fish need 6+ mg/L to thrive. 
                  Low oxygen = struggling ecosystem.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <ThermometerSun className="w-12 h-12 text-orange-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">Temperature</h3>
                <p className="text-gray-300">
                  Water temperature (°F). Normal variation is expected. 
                  Extreme temps affect aquatic life.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <AlertTriangle className="w-12 h-12 text-yellow-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">Turbidity</h3>
                <p className="text-gray-300">
                  Cloudiness (NTU). Clear water &lt;10 NTU. 
                  High turbidity = suspended particles/pollution.
                </p>
              </div>
            </div>

            <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">📱 How to Use the Scanner</h3>
              <ol className="space-y-2 text-gray-300">
                <li>1. <strong>Click on any river segment</strong> to begin scanning</li>
                <li>2. <strong>Wait 2 seconds</strong> for the scan to complete</li>
                <li>3. <strong>Review the data</strong> displayed for that segment</li>
                <li>4. <strong>Scan all 10 segments</strong> to build a complete picture</li>
                <li>5. <strong>Analyze patterns</strong> to understand where pollution is worst</li>
              </ol>
            </div>

            <button
              onClick={() => setPhase('scanning')}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold text-xl hover:scale-105 transition-transform"
            >
              Start Scanning <ChevronRight className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCANNING PHASE
  if (phase === 'scanning') {
    const scannedCount = riverData.filter(d => d.scanned).length;
    const progress = (scannedCount / 10) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">🔬 Environmental Scanning</h2>
              <div className="text-right">
                <div className="text-3xl font-bold">{scannedCount}/10</div>
                <div className="text-sm text-gray-400">Segments Scanned</div>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* River Map Visualization */}
          <div className="lg:col-span-2">
            <RiverMapVisualization
              segments={riverData.map(seg => {
                // Convert pollution level string to number
                const pollutionMap = { critical: 85, high: 65, moderate: 40, low: 15 };
                const pollutionNum = pollutionMap[seg.pollutionLevel];
                
                return {
                  segmentId: seg.segmentId,
                  name: seg.name,
                  waterQuality: 100 - pollutionNum,
                  pollutionLevel: pollutionNum,
                  oxygenLevel: seg.dissolvedOxygen,
                  temperature: (seg.temperature - 32) * 5/9, // Convert to Celsius
                  scanned: seg.scanned,
                  timestamp: seg.timestamp
                };
              })}
              selectedSegment={selectedSegment}
              scanningSegment={scanningSegment}
              onSegmentClick={scanSegment}
            />
          </div>

          {/* Data Display */}
          <div className="lg:col-span-1">
            {selectedSegment && riverData[selectedSegment - 1]?.scanned ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sticky top-6">
                <h3 className="text-xl font-bold mb-4">
                  {riverData[selectedSegment - 1].name} Data
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-blue-400" />
                      <span className="font-bold">pH Level</span>
                    </div>
                    <div className="text-3xl font-bold">{riverData[selectedSegment - 1].pH}</div>
                    <div className="text-sm text-gray-400">Healthy: 6.5-8.5</div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-5 h-5 text-cyan-400" />
                      <span className="font-bold">Dissolved Oxygen</span>
                    </div>
                    <div className="text-3xl font-bold">{riverData[selectedSegment - 1].dissolvedOxygen} mg/L</div>
                    <div className="text-sm text-gray-400">Healthy: &gt;6 mg/L</div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ThermometerSun className="w-5 h-5 text-orange-400" />
                      <span className="font-bold">Temperature</span>
                    </div>
                    <div className="text-3xl font-bold">{riverData[selectedSegment - 1].temperature}°F</div>
                    <div className="text-sm text-gray-400">Normal: 65-72°F</div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold">Turbidity</span>
                    </div>
                    <div className="text-3xl font-bold">{riverData[selectedSegment - 1].turbidity} NTU</div>
                    <div className="text-sm text-gray-400">Clear: &lt;10 NTU</div>
                  </div>

                  <div className={`rounded-lg p-4 ${getPollutionColor(riverData[selectedSegment - 1].pollutionLevel)}`}>
                    <div className="font-bold mb-1">Status</div>
                    <div>{getHealthStatus(riverData[selectedSegment - 1])}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sticky top-6 text-center">
                <Droplets className="w-16 h-16 mx-auto text-blue-400 mb-4 opacity-50" />
                <p className="text-gray-400">
                  Scan a segment to view detailed environmental data
                </p>
              </div>
            )}
          </div>
        </div>

        {scannedCount === 10 && (
          <div className="max-w-7xl mx-auto mt-6">
            <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">All Segments Scanned!</h3>
              <p className="text-gray-300 mb-4">
                You've collected comprehensive data on the entire river. Time to analyze your findings!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ANALYSIS PHASE
  if (phase === 'analysis') {
    const criticalSegments = riverData.filter(d => d.pollutionLevel === 'critical').length;
    const highSegments = riverData.filter(d => d.pollutionLevel === 'high').length;
    const avgPH = (riverData.reduce((sum, d) => sum + d.pH, 0) / riverData.length).toFixed(2);
    const avgOxygen = (riverData.reduce((sum, d) => sum + d.dissolvedOxygen, 0) / riverData.length).toFixed(2);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-6">
            <h2 className="text-4xl font-bold mb-6 text-center">📊 Data Analysis</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-500/20 border-2 border-red-400 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold mb-1">{criticalSegments}</div>
                <div className="text-sm">Critical Segments</div>
              </div>
              <div className="bg-orange-500/20 border-2 border-orange-400 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold mb-1">{highSegments}</div>
                <div className="text-sm">High Pollution</div>
              </div>
              <div className="bg-blue-500/20 border-2 border-blue-400 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold mb-1">{avgPH}</div>
                <div className="text-sm">Average pH</div>
              </div>
              <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold mb-1">{avgOxygen}</div>
                <div className="text-sm">Avg Oxygen (mg/L)</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">Complete Data Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="px-4 py-2 text-left">Segment</th>
                      <th className="px-4 py-2 text-center">pH</th>
                      <th className="px-4 py-2 text-center">O₂</th>
                      <th className="px-4 py-2 text-center">Temp</th>
                      <th className="px-4 py-2 text-center">Turbidity</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riverData.map((segment) => (
                      <tr key={segment.segmentId} className="border-b border-white/10">
                        <td className="px-4 py-3 font-bold">{segment.name}</td>
                        <td className="px-4 py-3 text-center">{segment.pH}</td>
                        <td className="px-4 py-3 text-center">{segment.dissolvedOxygen}</td>
                        <td className="px-4 py-3 text-center">{segment.temperature}°F</td>
                        <td className="px-4 py-3 text-center">{segment.turbidity}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${getPollutionColor(segment.pollutionLevel)}`}>
                            {segment.pollutionLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">🧠 Key Observations</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Upstream segments (1-3) show the worst pollution - likely near source</li>
                <li>• pH levels are critically low in several segments (acidic pollution)</li>
                <li>• Dissolved oxygen is below safe levels throughout most of the river</li>
                <li>• High turbidity indicates significant suspended pollutants</li>
                <li>• Downstream conditions slightly better due to dilution</li>
              </ul>
            </div>

            <button
              onClick={() => setPhase('quiz')}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold text-xl hover:scale-105 transition-transform"
            >
              Proceed to Knowledge Assessment <ChevronRight className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ PHASE
  if (phase === 'quiz') {
    const allAnswered = quizAnswers.every(a => a !== null);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-4xl font-bold mb-6 text-center">📝 Knowledge Assessment</h2>
            
            {!quizSubmitted ? (
              <>
                <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-xl p-4 mb-6">
                  <p className="text-sm">
                    <strong>⏱️ Required Score:</strong> 70% or higher (7/10 questions correct) to pass and unlock Level 2
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  {LEVEL_1_QUIZ.map((question, qIndex) => (
                    <div key={question.id} className="bg-white/5 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Question {qIndex + 1}: {question.question}
                      </h3>
                      <div className="space-y-3">
                        {question.options.map((option, oIndex) => (
                          <button
                            key={oIndex}
                            onClick={() => {
                              const newAnswers = [...quizAnswers];
                              newAnswers[qIndex] = oIndex;
                              setQuizAnswers(newAnswers);
                            }}
                            className={`w-full p-4 rounded-lg text-left transition-all ${
                              quizAnswers[qIndex] === oIndex
                                ? 'bg-blue-500 border-2 border-blue-400'
                                : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={submitQuiz}
                  disabled={!allAnswered}
                  className={`w-full px-8 py-4 rounded-xl text-white font-bold text-xl transition-all ${
                    allAnswered
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 cursor-pointer'
                      : 'bg-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  {allAnswered ? 'Submit Assessment' : `Answer All Questions (${quizAnswers.filter(a => a !== null).length}/10)`}
                </button>
              </>
            ) : (
              <div>
                {quizResults && (
                  <>
                    <div className={`rounded-xl p-8 mb-6 text-center ${
                      quizResults.passed ? 'bg-green-500/20 border-2 border-green-400' : 'bg-red-500/20 border-2 border-red-400'
                    }`}>
                      {quizResults.passed ? (
                        <CheckCircle className="w-24 h-24 mx-auto text-green-400 mb-4" />
                      ) : (
                        <XCircle className="w-24 h-24 mx-auto text-red-400 mb-4" />
                      )}
                      <h3 className="text-4xl font-bold mb-2">
                        {quizResults.passed ? 'Congratulations!' : 'Not Quite There'}
                      </h3>
                      <div className="text-6xl font-bold mb-4">{quizResults.score}%</div>
                      <p className="text-xl">
                        {quizResults.passed 
                          ? 'You demonstrated excellent understanding of environmental assessment!' 
                          : 'You need 70% to pass. Review the material and try again.'}
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      {LEVEL_1_QUIZ.map((question, qIndex) => {
                        const userAnswer = quizAnswers[qIndex];
                        const isCorrect = userAnswer === question.correctAnswer;
                        
                        return (
                          <div key={question.id} className={`rounded-xl p-6 ${
                            isCorrect ? 'bg-green-500/10 border-2 border-green-400' : 'bg-red-500/10 border-2 border-red-400'
                          }`}>
                            <div className="flex items-start gap-3 mb-3">
                              {isCorrect ? (
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                              )}
                              <div>
                                <h4 className="font-bold mb-2">{question.question}</h4>
                                <p className="text-gray-300 mb-2">
                                  <strong>Your answer:</strong> {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                                </p>
                                {!isCorrect && (
                                  <p className="text-green-400 mb-2">
                                    <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                                  </p>
                                )}
                                <p className="text-sm text-gray-400">{question.explanation}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!quizResults.passed && (
                      <button
                        onClick={retakeQuiz}
                        className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white font-bold text-xl hover:scale-105 transition-transform"
                      >
                        <RotateCcw className="inline mr-2" /> Retake Assessment
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // COMPLETE PHASE
  if (phase === 'complete') {
    const timeSpent = gameState.levelProgress[1]?.timeSpent || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center">
            <Award className="w-32 h-32 mx-auto text-yellow-400 animate-bounce mb-8" />
            
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-green-400">
              Level 1 Complete!
            </h1>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">Achievement Unlocked: River Scholar</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{quizResults?.score}%</div>
                  <div className="text-gray-400">Quiz Score</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="text-4xl font-bold text-green-400 mb-2">{timeSpent}</div>
                  <div className="text-gray-400">Minutes Spent</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="text-4xl font-bold text-purple-400 mb-2">10/10</div>
                  <div className="text-gray-400">Segments Scanned</div>
                </div>
              </div>

              <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4">🎓 What You Learned</h3>
                <ul className="text-left space-y-2 text-gray-300">
                  <li>✓ How to assess water quality using scientific measurements</li>
                  <li>✓ Understanding pH, dissolved oxygen, temperature, and turbidity</li>
                  <li>✓ Identifying pollution patterns in river ecosystems</li>
                  <li>✓ The importance of systematic data collection</li>
                  <li>✓ How to analyze environmental data comprehensively</li>
                </ul>
              </div>

              <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold mb-4">🚀 Level 2 Unlocked!</h3>
                <p className="text-lg text-gray-300">
                  You've proven you can assess environmental damage. Now it's time to investigate 
                  the sources of pollution. In Level 2, you'll track pollutants to their origins 
                  and build a strategy to stop them.
                </p>
              </div>

              <button
                onClick={() => {
                  // Update game state to unlock Level 2
                  const currentState = loadGameState();
                  if (currentState) {
                    currentState.currentLevel = 2;
                    currentState.maxUnlockedLevel = Math.max(currentState.maxUnlockedLevel, 2);
                    localStorage.setItem('ecosphere_game_state', JSON.stringify(currentState));
                  }
                  window.location.href = '/projects';
                }}
                className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold text-xl hover:scale-105 transition-transform"
              >
                Continue to Level 2 <ChevronRight className="inline ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
