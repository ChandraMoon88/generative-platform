'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Award, AlertTriangle } from 'lucide-react';
import EcosystemFoodWeb from './EcosystemFoodWeb';
import { 
  Species, 
  EcosystemState, 
  initializeEcosystem, 
  simulateEcosystem,
  getKeystoneSpecies,
  getEndangeredSpecies 
} from '@/lib/ecosystemData';

type Phase = 'intro' | 'exploration' | 'analysis' | 'intervention' | 'quiz' | 'complete';

const QUIZ_QUESTIONS = [
  {
    question: 'What is a keystone species?',
    options: [
      'The most common species in an ecosystem',
      'A species that has a disproportionately large effect on its environment',
      'The largest predator',
      'Any endangered species'
    ],
    correctAnswer: 1,
    explanation: 'Keystone species, like otters and trout in our river, have outsized impacts. Their removal causes cascading effects throughout the ecosystem.'
  },
  {
    question: 'What happens when a top predator is removed from an ecosystem?',
    options: [
      'Nothing significant',
      'Prey populations explode, overconsuming their food sources',
      'Plants grow better',
      'Water quality improves'
    ],
    correctAnswer: 1,
    explanation: 'Without top predators, prey populations grow unchecked, leading to overgrazing and ecosystem imbalance - a phenomenon called trophic cascade.'
  },
  {
    question: 'What indicates a healthy, balanced ecosystem?',
    options: [
      'One dominant species',
      'Only large animals',
      'High biodiversity with species at all trophic levels',
      'No predators'
    ],
    correctAnswer: 2,
    explanation: 'Healthy ecosystems have high biodiversity with producers, consumers, and decomposers all present and thriving.'
  },
  {
    question: 'Why do pollution-sensitive species (like mayflies) disappear first?',
    options: [
      'They are the weakest',
      'They have specific water quality requirements',
      'They are hunted more',
      'Random chance'
    ],
    correctAnswer: 1,
    explanation: 'Species like mayflies are "indicator species" - they require specific conditions and their absence signals environmental problems.'
  },
  {
    question: 'What role do decomposers play?',
    options: [
      'They just create waste',
      'They recycle nutrients back into the ecosystem',
      'They only eat dead things',
      'They harm other species'
    ],
    correctAnswer: 1,
    explanation: 'Decomposers like bacteria are essential - they break down dead matter and return nutrients to the soil and water, completing the cycle.'
  }
];

export default function Level5Game() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [ecosystem, setEcosystem] = useState<EcosystemState>(initializeEcosystem(50));
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [waterQualityTarget, setWaterQualityTarget] = useState(75);
  const [interventionsMade, setInterventionsMade] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(Array(QUIZ_QUESTIONS.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Auto-simulate ecosystem over time when in exploration phase
  useEffect(() => {
    if (phase === 'exploration') {
      const interval = setInterval(() => {
        setDaysElapsed(d => d + 1);
        setEcosystem(prev => simulateEcosystem(prev, 0, daysElapsed + 1));
      }, 5000); // Simulate 1 day every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [phase, daysElapsed]);

  const handleIntervention = (type: 'improve_water' | 'remove_invasive' | 'reintroduce_species') => {
    let waterChange = 0;
    let interventionName = '';
    
    switch (type) {
      case 'improve_water':
        waterChange = 15;
        interventionName = 'Water quality improvement';
        break;
      case 'remove_invasive':
        waterChange = 10;
        interventionName = 'Invasive species removal';
        break;
      case 'reintroduce_species':
        waterChange = 5;
        interventionName = 'Species reintroduction';
        break;
    }
    
    setEcosystem(prev => simulateEcosystem(prev, waterChange, daysElapsed));
    setInterventionsMade([...interventionsMade, interventionName]);
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    const score = quizAnswers.filter((ans, idx) => ans === QUIZ_QUESTIONS[idx].correctAnswer).length;
    if (score >= 4) {
      setTimeout(() => setPhase('complete'), 2000);
    }
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-blue-900 p-6 text-white">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center mb-8">
            <span className="text-8xl">🕸️</span>
          </div>
          
          <h1 className="text-6xl font-bold text-center mb-6">
            Level 5: Ecosystem Mapping
          </h1>
          <p className="text-2xl text-center text-emerald-200 mb-8">
            The Ripple Effect - Understanding Connections
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-300">🌊 The Story So Far</h2>
            <p className="text-lg mb-4">
              Your river restoration is creating ripples throughout the ecosystem! A group of endangered 
              river otters has been spotted in the recently cleaned section. This is amazing news, but they&apos;re 
              sensitive to construction and pollution.
            </p>
            <p className="text-lg mb-4">
              You&apos;re about to discover something profound: in nature, everything is connected. 
              When you heal one part, you affect the whole system. But the connections are complex...
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-cyan-300">🎯 Your Mission</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                <div className="text-3xl">1️⃣</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Map the Ecosystem</h4>
                  <p className="text-gray-300">Document all species and their relationships in the river ecosystem</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                <div className="text-3xl">2️⃣</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Understand Food Webs</h4>
                  <p className="text-gray-300">Identify predator-prey relationships and keystone species</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                <div className="text-3xl">3️⃣</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Predict Cascades</h4>
                  <p className="text-gray-300">See how changes ripple through connected systems</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                <div className="text-3xl">4️⃣</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Make Strategic Interventions</h4>
                  <p className="text-gray-300">Apply your knowledge to restore ecosystem balance</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('exploration')}
            className="w-full px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl text-white font-bold text-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            Begin Ecosystem Analysis
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'exploration') {
    const keystoneSpecies = getKeystoneSpecies(ecosystem);
    const endangeredSpecies = getEndangeredSpecies(ecosystem);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">Ecosystem Exploration</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">{daysElapsed} days</div>
                <div className="text-sm text-gray-400">Monitoring Period</div>
              </div>
            </div>
            <p className="text-gray-300">
              Observe how species interact and respond to environmental changes. Click on species to learn more about their role.
            </p>
          </div>

          {/* Alerts for keystone/endangered species */}
          {(keystoneSpecies.some(s => s.health < 50) || endangeredSpecies.some(s => s.health < 50)) && (
            <div className="bg-red-500/10 border-2 border-red-400 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">⚠️ Critical Species Alert</h3>
                  <p className="text-red-200 mb-3">
                    Important species are in danger! Their decline will cascade through the entire ecosystem.
                  </p>
                  <div className="space-y-1">
                    {keystoneSpecies.filter(s => s.health < 50).map(s => (
                      <div key={s.id} className="text-sm">
                        <span className="font-bold">{s.icon} {s.name}</span> (Keystone) - Health: {s.health}%
                      </div>
                    ))}
                    {endangeredSpecies.filter(s => s.health < 50).map(s => (
                      <div key={s.id} className="text-sm">
                        <span className="font-bold">{s.icon} {s.name}</span> (Endangered) - Health: {s.health}%
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Food Web Visualization */}
            <div className="lg:col-span-2">
              <EcosystemFoodWeb
                ecosystem={ecosystem}
                onSpeciesClick={setSelectedSpecies}
                selectedSpecies={selectedSpecies}
              />
            </div>

            {/* Species Detail Panel */}
            <div className="lg:col-span-1">
              {selectedSpecies ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sticky top-6">
                  <div className="text-center mb-4">
                    <span className="text-6xl">{selectedSpecies.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedSpecies.name}</h3>
                  <p className="text-sm italic text-gray-400 mb-4">{selectedSpecies.scientificName}</p>
                  
                  {(selectedSpecies.isKeystone || selectedSpecies.isEndangered) && (
                    <div className="flex gap-2 mb-4">
                      {selectedSpecies.isKeystone && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-bold flex items-center gap-1">
                          ⭐ Keystone
                        </span>
                      )}
                      {selectedSpecies.isEndangered && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-bold flex items-center gap-1">
                          ⚠️ Endangered
                        </span>
                      )}
                    </div>
                  )}
                  
                  <p className="text-gray-300 mb-6">{selectedSpecies.description}</p>
                  
                  <div className="space-y-4 bg-white/5 rounded-lg p-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Population</div>
                      <div className="text-2xl font-bold text-white">
                        {selectedSpecies.population.toLocaleString()} / {selectedSpecies.maxPopulation.toLocaleString()}
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full transition-all"
                          style={{ width: `${(selectedSpecies.population / selectedSpecies.maxPopulation) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Health</div>
                      <div className={`text-2xl font-bold ${
                        selectedSpecies.health > 70 ? 'text-green-400' :
                        selectedSpecies.health > 40 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {selectedSpecies.health}%
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Trophic Level</div>
                      <div className="text-lg font-bold text-white">
                        Level {selectedSpecies.trophicLevel} - {selectedSpecies.type.replace('_', ' ')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Water Quality Need</div>
                      <div className="text-lg font-bold text-white">
                        {selectedSpecies.waterQualityRequirement}%+
                      </div>
                    </div>
                  </div>
                  
                  {selectedSpecies.diet.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-bold text-green-300 mb-2">🍽️ Eats (Prey):</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecies.diet.map(preyId => {
                          const prey = ecosystem.species.find(s => s.id === preyId);
                          return prey ? (
                            <span key={preyId} className="px-2 py-1 bg-green-500/20 rounded text-xs">
                              {prey.icon} {prey.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  {selectedSpecies.predators.length > 0 && (
                    <div>
                      <div className="text-sm font-bold text-red-300 mb-2">⚡ Eaten By (Predators):</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecies.predators.map(predId => {
                          const predator = ecosystem.species.find(s => s.id === predId);
                          return predator ? (
                            <span key={predId} className="px-2 py-1 bg-red-500/20 rounded text-xs">
                              {predator.icon} {predator.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center sticky top-6">
                  <div className="text-6xl mb-4">👆</div>
                  <p className="text-gray-400">
                    Click on any species in the food web to see detailed information
                  </p>
                </div>
              )}
              
              {/* Interventions */}
              {daysElapsed >= 5 && (
                <div className="mt-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3">🛠️ Available Interventions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleIntervention('improve_water')}
                      className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-left"
                      disabled={interventionsMade.includes('Water quality improvement')}
                    >
                      <div className="font-bold">Improve Water Quality</div>
                      <div className="text-xs opacity-90">+15% water quality</div>
                    </button>
                    <button
                      onClick={() => handleIntervention('remove_invasive')}
                      className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-left"
                      disabled={interventionsMade.includes('Invasive species removal')}
                    >
                      <div className="font-bold">Remove Invasive Species</div>
                      <div className="text-xs opacity-90">+10% water quality</div>
                    </button>
                    <button
                      onClick={() => handleIntervention('reintroduce_species')}
                      className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-left"
                      disabled={interventionsMade.includes('Species reintroduction')}
                    >
                      <div className="font-bold">Reintroduce Native Species</div>
                      <div className="text-xs opacity-90">+5% water quality</div>
                    </button>
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    Interventions: {interventionsMade.length}/3 used
                  </div>
                </div>
              )}
              
              {daysElapsed >= 10 && ecosystem.waterQuality >= waterQualityTarget && (
                <button
                  onClick={() => setPhase('quiz')}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Complete Analysis →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'quiz') {
    const score = quizSubmitted ? quizAnswers.filter((ans, idx) => ans === QUIZ_QUESTIONS[idx].correctAnswer).length : 0;
    const passed = score >= 4;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Ecosystem Knowledge Quiz</h2>
          
          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, qIdx) => (
              <div key={qIdx} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">
                  {qIdx + 1}. {q.question}
                </h3>
                
                <div className="space-y-2 mb-4">
                  {q.options.map((option, oIdx) => {
                    const isSelected = quizAnswers[qIdx] === oIdx;
                    const isCorrect = oIdx === q.correctAnswer;
                    const showResult = quizSubmitted;
                    
                    return (
                      <button
                        key={oIdx}
                        onClick={() => !quizSubmitted && handleQuizAnswer(qIdx, oIdx)}
                        disabled={quizSubmitted}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          showResult
                            ? isCorrect
                              ? 'bg-green-500/30 border-2 border-green-400'
                              : isSelected
                              ? 'bg-red-500/30 border-2 border-red-400'
                              : 'bg-white/5'
                            : isSelected
                            ? 'bg-blue-500/30 border-2 border-blue-400'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                
                {quizSubmitted && (
                  <div className="bg-cyan-500/20 border-l-4 border-cyan-400 p-4 rounded">
                    <p className="text-sm">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {!quizSubmitted && (
            <button
              onClick={submitQuiz}
              disabled={quizAnswers.some(a => a === null)}
              className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          )}
          
          {quizSubmitted && (
            <div className={`mt-8 p-8 rounded-xl text-center ${passed ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
              <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
              <h3 className="text-3xl font-bold mb-2">
                Score: {score}/{QUIZ_QUESTIONS.length}
              </h3>
              <p className="text-xl mb-4">
                {passed 
                  ? 'Excellent! You understand ecosystem dynamics!' 
                  : 'Keep studying ecosystem connections. You need 4/5 to pass.'}
              </p>
              {passed ? (
                <button
                  onClick={() => setPhase('complete')}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-blue-900 p-6 text-white flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <Award className="w-32 h-32 mx-auto text-emerald-400 animate-bounce mb-8" />
          <h1 className="text-6xl font-bold mb-6">Level 5 Complete!</h1>
          <p className="text-2xl mb-8">
            You&apos;ve mastered ecosystem mapping and understand the intricate web of life!
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Your Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-4xl font-bold text-green-400">{ecosystem.species.filter(s => s.population > 0).length}</div>
                <div className="text-sm text-gray-400">Species Documented</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400">{daysElapsed}</div>
                <div className="text-sm text-gray-400">Days Monitored</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400">{interventionsMade.length}</div>
                <div className="text-sm text-gray-400">Interventions Made</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400">{ecosystem.biodiversityScore}%</div>
                <div className="text-sm text-gray-400">Biodiversity Score</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.href = '/projects'}
            className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
          >
            Continue to Level 6
          </button>
        </div>
      </div>
    );
  }

  return null;
}
