'use client';

import { useState } from 'react';
import { Shield, Unlock, RotateCcw, Trash2, Download, Upload } from 'lucide-react';

export default function AdminPanel() {
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [password, setPassword] = useState('');

  const handleUnlock = () => {
    if (password === 'admin123' || password === 'ecosphere') {
      setAdminUnlocked(true);
    } else {
      alert('Invalid password');
    }
  };

  const unlockAllLevels = () => {
    const currentState = JSON.parse(localStorage.getItem('ecosphere_game_state') || '{}');
    currentState.maxUnlockedLevel = 15;
    currentState.completedLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    localStorage.setItem('ecosphere_game_state', JSON.stringify(currentState));
    alert('All levels unlocked!');
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('ecosphere_game_state');
      localStorage.removeItem('ecosphere_landing_zone');
      localStorage.removeItem('level1_segments');
      localStorage.removeItem('level1_river_name');
      alert('Progress reset! Reload the page to start fresh.');
    }
  };

  const exportData = () => {
    const data = {
      gameState: localStorage.getItem('ecosphere_game_state'),
      landingZone: localStorage.getItem('ecosphere_landing_zone'),
      level1Data: {
        segments: localStorage.getItem('level1_segments'),
        riverName: localStorage.getItem('level1_river_name')
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecosphere-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.gameState) localStorage.setItem('ecosphere_game_state', data.gameState);
            if (data.landingZone) localStorage.setItem('ecosphere_landing_zone', data.landingZone);
            if (data.level1Data?.segments) localStorage.setItem('level1_segments', data.level1Data.segments);
            if (data.level1Data?.riverName) localStorage.setItem('level1_river_name', data.level1Data.riverName);
            alert('Data imported successfully! Reload to see changes.');
          } catch (error) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const setCurrentLevel = (level: number) => {
    const currentState = JSON.parse(localStorage.getItem('ecosphere_game_state') || '{}');
    currentState.currentLevel = level;
    currentState.maxUnlockedLevel = Math.max(currentState.maxUnlockedLevel || 1, level);
    localStorage.setItem('ecosphere_game_state', JSON.stringify(currentState));
    alert(`Current level set to ${level}. Reload to see changes.`);
  };

  if (!adminUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Enter password to access admin controls</p>
          </div>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-purple-400"
          />
          
          <button
            onClick={handleUnlock}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-bold transition-all"
          >
            Unlock Admin Panel
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Password hint: admin123 or ecosphere
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Admin Control Panel</h1>
          </div>
          <a
            href="/projects"
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            Back to Game
          </a>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={unlockAllLevels}
            className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl hover:scale-105 transition-all"
          >
            <Unlock className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Unlock All Levels</h3>
            <p className="text-sm text-gray-400">Access all 15 levels instantly</p>
          </button>

          <button
            onClick={resetProgress}
            className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-xl hover:scale-105 transition-all"
          >
            <RotateCcw className="w-8 h-8 text-red-400 mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Reset Progress</h3>
            <p className="text-sm text-gray-400">Clear all saved data</p>
          </button>

          <button
            onClick={exportData}
            className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-xl hover:scale-105 transition-all"
          >
            <Download className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Export Data</h3>
            <p className="text-sm text-gray-400">Backup game progress</p>
          </button>

          <button
            onClick={importData}
            className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl hover:scale-105 transition-all"
          >
            <Upload className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Import Data</h3>
            <p className="text-sm text-gray-400">Restore saved progress</p>
          </button>
        </div>

        {/* Level Selector */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Jump to Level</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((level) => (
              <button
                key={level}
                onClick={() => setCurrentLevel(level)}
                className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg hover:scale-110 transition-all font-bold text-white text-lg"
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Current State Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Current Game State</h2>
          <div className="bg-slate-900/50 rounded-lg p-4 overflow-auto">
            <pre className="text-green-400 text-sm">
              {JSON.stringify(
                {
                  gameState: JSON.parse(localStorage.getItem('ecosphere_game_state') || '{}'),
                  landingZone: localStorage.getItem('ecosphere_landing_zone'),
                  level1RiverName: localStorage.getItem('level1_river_name')
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
