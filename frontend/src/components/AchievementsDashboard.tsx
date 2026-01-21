'use client';

import { Trophy, Star, Lock, TrendingUp, Award, Target } from 'lucide-react';
import { Achievement, getAchievementsByCategory, getCategoryIcon, getRarityColor, getCompletionPercentage } from '@/lib/achievementSystem';
import { NarrativeState } from '@/lib/narrativeSystem';

interface AchievementsDashboardProps {
  achievements: Map<string, Achievement>;
  narrativeState: NarrativeState;
  onClose: () => void;
}

export default function AchievementsDashboard({ achievements, narrativeState, onClose }: AchievementsDashboardProps) {
  const categorizedAchievements = getAchievementsByCategory(achievements);
  const completionPercentage = getCompletionPercentage(achievements);
  const totalPoints = Array.from(achievements.values())
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = Array.from(achievements.values()).filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">Achievements</h1>
            <p className="text-xl text-gray-400">Track your restoration milestones</p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            Back to Game
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
            <Trophy className="w-12 h-12 text-yellow-400 mb-3" />
            <div className="text-4xl font-bold text-yellow-400 mb-1">{unlockedCount}</div>
            <div className="text-sm text-gray-400">Achievements Unlocked</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
            <Star className="w-12 h-12 text-purple-400 mb-3" />
            <div className="text-4xl font-bold text-purple-400 mb-1">{totalPoints}</div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
            <Target className="w-12 h-12 text-blue-400 mb-3" />
            <div className="text-4xl font-bold text-blue-400 mb-1">{completionPercentage}%</div>
            <div className="text-sm text-gray-400">Completion</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
            <Award className="w-12 h-12 text-green-400 mb-3" />
            <div className="text-4xl font-bold text-green-400 mb-1">
              {Array.from(achievements.values()).filter(a => a.unlocked && a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-gray-400">Legendary</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold">Overall Progress</span>
            <span className="text-2xl font-bold text-emerald-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-4 transition-all duration-1000"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-400">
            {unlockedCount} of {achievements.size} achievements unlocked
          </div>
        </div>

        {/* Achievements by Category */}
        <div className="space-y-8">
          {Array.from(categorizedAchievements.entries()).map(([category, categoryAchievements]) => {
            const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
            const categoryProgress = (unlockedInCategory / categoryAchievements.length) * 100;

            return (
              <div key={category} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getCategoryIcon(category)}</span>
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{category}</h2>
                      <p className="text-sm text-gray-400">
                        {unlockedInCategory} of {categoryAchievements.length} unlocked
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-400">
                      {Math.round(categoryProgress)}%
                    </div>
                    <div className="text-xs text-gray-400">Complete</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/50'
                          : 'bg-white/5 border-white/10 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                          {achievement.unlocked ? achievement.icon : '🔒'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">
                        {achievement.unlocked ? achievement.title : '???'}
                      </h3>

                      <p className="text-sm text-gray-400 mb-3">
                        {achievement.unlocked ? achievement.description : 'Complete requirements to unlock'}
                      </p>

                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className="text-xs text-emerald-400 mb-2">
                          ✓ Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-xs text-gray-500">{achievement.requirement}</span>
                        <span className="text-lg font-bold text-yellow-400">+{achievement.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reputation Section */}
        <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Faction Reputation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(narrativeState.reputationScores.entries()).map(([faction, score]) => {
              const getReputationColor = (score: number) => {
                if (score >= 80) return 'text-green-400 bg-green-500/20';
                if (score >= 60) return 'text-blue-400 bg-blue-500/20';
                if (score >= 40) return 'text-yellow-400 bg-yellow-500/20';
                if (score >= 20) return 'text-orange-400 bg-orange-500/20';
                return 'text-red-400 bg-red-500/20';
              };

              const getReputationLabel = (score: number) => {
                if (score >= 80) return 'Excellent';
                if (score >= 60) return 'Good';
                if (score >= 40) return 'Neutral';
                if (score >= 20) return 'Poor';
                return 'Hostile';
              };

              return (
                <div key={faction} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white">{faction}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getReputationColor(score)}`}>
                      {getReputationLabel(score)}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 transition-all duration-500 ${
                        score >= 80 ? 'bg-green-500' :
                        score >= 60 ? 'bg-blue-500' :
                        score >= 40 ? 'bg-yellow-500' :
                        score >= 20 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="mt-2 text-right text-sm text-gray-400">
                    {score}/100
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
