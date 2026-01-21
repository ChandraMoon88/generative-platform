'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface GaiaMessage {
  text: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'proud' | 'thoughtful';
}

interface Props {
  message: string | GaiaMessage;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  position?: 'top' | 'bottom' | 'center';
}

export default function GaiaGuide({ message, onClose, autoClose = false, autoCloseDelay = 5000, position = 'bottom' }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const messageObj: GaiaMessage = typeof message === 'string' 
    ? { text: message, emotion: 'neutral' }
    : message;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    
    if (autoClose) {
      const closeTimer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }
    
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose, autoCloseDelay, message]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  if (!isVisible) return null;

  const positionClasses = {
    top: 'top-4',
    bottom: 'bottom-4',
    center: 'top-1/2 -translate-y-1/2'
  };

  const emotionColors = {
    neutral: 'from-cyan-500 to-blue-600',
    happy: 'from-green-400 to-emerald-600',
    concerned: 'from-yellow-500 to-orange-600',
    proud: 'from-purple-500 to-pink-600',
    thoughtful: 'from-indigo-500 to-blue-600'
  };

  const emotionGlow = {
    neutral: 'shadow-cyan-500/50',
    happy: 'shadow-green-500/50',
    concerned: 'shadow-yellow-500/50',
    proud: 'shadow-purple-500/50',
    thoughtful: 'shadow-indigo-500/50'
  };

  return (
    <div className={`fixed left-1/2 -translate-x-1/2 ${positionClasses[position]} z-50 max-w-3xl w-full px-4 transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      <div className={`bg-gradient-to-br ${emotionColors[messageObj.emotion || 'neutral']} p-1 rounded-2xl shadow-2xl ${emotionGlow[messageObj.emotion || 'neutral']}`}>
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 relative">
          {/* Gaia Avatar */}
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${emotionColors[messageObj.emotion || 'neutral']} flex items-center justify-center animate-pulse`}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              {/* Floating particles around Gaia */}
              <div className="absolute inset-0 animate-ping opacity-20">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${emotionColors[messageObj.emotion || 'neutral']}`}></div>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xl font-bold bg-gradient-to-r ${emotionColors[messageObj.emotion || 'neutral']} bg-clip-text text-transparent`}>
                  Gaia
                </h3>
                {onClose && (
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <p className="text-white text-lg leading-relaxed italic">
                &ldquo;{messageObj.text}&rdquo;
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

// Pre-defined Gaia messages for different game moments
export const GaiaMessages = {
  welcome: {
    text: "Welcome, Restoration Architect. Together, we will heal this world.",
    emotion: 'neutral' as const
  },
  levelComplete: {
    text: "Excellent work! I can feel the ecosystem responding to your care.",
    emotion: 'proud' as const
  },
  challenge: {
    text: "This challenge requires wisdom. Take your time, observe carefully.",
    emotion: 'thoughtful' as const
  },
  concern: {
    text: "Be careful. The balance is delicate here. One wrong move could make things worse.",
    emotion: 'concerned' as const
  },
  encouragement: {
    text: "Don't give up! Every great restoration starts with small, patient steps.",
    emotion: 'happy' as const
  },
  discovery: {
    text: "You've discovered something important. This knowledge will serve you well.",
    emotion: 'proud' as const
  },
  milestone: {
    text: "Look at what you've accomplished! The life you've restored will flourish for generations.",
    emotion: 'happy' as const
  }
};
