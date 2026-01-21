'use client';

import { useState } from 'react';
import { X, Heart, Brain, Users, Leaf, Scale } from 'lucide-react';
import { StoryReveal, MoralChoice, NarrativeState, applyChoice } from '@/lib/narrativeSystem';

interface NarrativeModalProps {
  story: StoryReveal;
  narrativeState: NarrativeState;
  onChoiceSelect: (choiceId: string) => void;
  onClose: () => void;
}

export default function NarrativeModal({ story, narrativeState, onChoiceSelect, onClose }: NarrativeModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConsequences, setShowConsequences] = useState(false);

  const handleChoiceClick = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowConsequences(true);
  };

  const handleConfirm = () => {
    if (selectedChoice) {
      onChoiceSelect(selectedChoice);
      onClose();
    }
  };

  const getEmotionGradient = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'from-green-500 to-emerald-500';
      case 'concerned': return 'from-orange-500 to-red-500';
      case 'proud': return 'from-purple-500 to-pink-500';
      case 'thoughtful': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'backstory': return '📖';
      case 'discovery': return '🔍';
      case 'warning': return '⚠️';
      case 'revelation': return '💡';
      case 'celebration': return '🎉';
      default: return '✨';
    }
  };

  const getSpeakerInfo = (speaker?: string) => {
    switch (speaker) {
      case 'gaia': return { emoji: '✨', name: 'Gaia' };
      case 'scientist': return { emoji: '👩‍🔬', name: 'Dr. Maria Santos' };
      case 'elder': return { emoji: '👵', name: 'Elder Sarah Redcrow' };
      case 'activist': return { emoji: '👨‍🦱', name: 'Marcus Webb' };
      case 'child': return { emoji: '👧', name: 'Yuki Tanaka' };
      default: return { emoji: '✨', name: 'Narrator' };
    }
  };

  const speaker = getSpeakerInfo(story.characterSpeaker);
  const selectedChoiceData = story.choices?.find(c => c.id === selectedChoice);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getEmotionGradient(story.emotion)} p-6 rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">{getTypeIcon(story.type)}</span>
            <div>
              <div className="text-sm text-white/80 mb-1">
                {speaker.emoji} {speaker.name}
              </div>
              <h2 className="text-3xl font-bold text-white">{story.title}</h2>
            </div>
          </div>
          
          <div className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-full text-sm text-white">
            {story.type.charAt(0).toUpperCase() + story.type.slice(1)}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
              {story.content}
            </p>
          </div>

          {/* Moral Choices */}
          {story.choices && story.choices.length > 0 && (
            <div className="space-y-6">
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Scale className="w-6 h-6" />
                  How will you respond?
                </h3>
                <p className="text-gray-400 mb-6">
                  Your choice will affect your relationships, reputation, and the long-term outcomes of your restoration work.
                </p>
              </div>

              <div className="grid gap-4">
                {story.choices.map((choice) => {
                  const isSelected = selectedChoice === choice.id;
                  
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoiceClick(choice.id)}
                      className={`text-left p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-bold text-white">{choice.text}</h4>
                        {isSelected && (
                          <div className="flex-shrink-0 ml-4">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4">{choice.description}</p>
                      
                      {isSelected && showConsequences && (
                        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                          <div className="bg-cyan-500/10 border-l-4 border-cyan-400 p-3 rounded">
                            <div className="text-xs text-cyan-300 font-bold mb-1">IMMEDIATE IMPACT</div>
                            <div className="text-sm text-gray-300">{choice.consequences.immediate}</div>
                          </div>
                          
                          <div className="bg-purple-500/10 border-l-4 border-purple-400 p-3 rounded">
                            <div className="text-xs text-purple-300 font-bold mb-1">LONG-TERM IMPACT</div>
                            <div className="text-sm text-gray-300">{choice.consequences.longTerm}</div>
                          </div>
                          
                          <div className="bg-blue-500/10 border-l-4 border-blue-400 p-3 rounded">
                            <div className="text-xs text-blue-300 font-bold mb-2">REPUTATION CHANGES</div>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(choice.consequences.reputationImpact).map(([faction, impact]) => (
                                <div key={faction} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">{faction}</span>
                                  <span className={`font-bold ${
                                    impact > 0 ? 'text-green-400' : impact < 0 ? 'text-red-400' : 'text-gray-400'
                                  }`}>
                                    {impact > 0 ? '+' : ''}{impact}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-green-500/10 border-l-4 border-green-400 p-3 rounded">
                            <div className="text-xs text-green-300 font-bold mb-1">ENVIRONMENTAL IMPACT</div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all"
                                  style={{ width: `${choice.consequences.environmentalImpact}%` }}
                                />
                              </div>
                              <span className="text-green-400 font-bold text-sm">
                                {choice.consequences.environmentalImpact}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedChoice && showConsequences && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setSelectedChoice(null);
                      setShowConsequences(false);
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white transition-colors"
                  >
                    Choose Different Option
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-bold text-white transition-all hover:scale-105"
                  >
                    Confirm Choice
                  </button>
                </div>
              )}
            </div>
          )}

          {/* No choices - just acknowledgment */}
          {(!story.choices || story.choices.length === 0) && (
            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-bold text-white transition-all hover:scale-105"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
