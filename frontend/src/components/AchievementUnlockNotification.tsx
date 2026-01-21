'use client';

import { useState, useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import { Achievement, getRarityColor } from '@/lib/achievementSystem';

interface AchievementUnlockNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementUnlockNotification({ achievement, onClose }: AchievementUnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-1 rounded-2xl shadow-2xl">
        <div className="bg-slate-900 rounded-2xl p-6 relative">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 500);
            }}
            className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                Achievement Unlocked!
              </h3>

              <p className="text-lg font-bold text-yellow-400 mb-2">
                {achievement.title}
              </p>

              <p className="text-sm text-gray-300 mb-3">
                {achievement.description}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-400">+{achievement.points}</span>
                <span className="text-sm text-gray-400">points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
