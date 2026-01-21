'use client';

import { useState, useEffect } from 'react';
import { Droplets, Fish, Waves, AlertTriangle, Sparkles } from 'lucide-react';

interface RiverSegmentData {
  segmentId: number;
  name: string;
  waterQuality: number;
  pollutionLevel: number;
  oxygenLevel: number;
  temperature: number;
  scanned: boolean;
  timestamp?: number;
}

interface Props {
  segments: RiverSegmentData[];
  selectedSegment: number | null;
  scanningSegment: number | null;
  onSegmentClick: (segmentId: number) => void;
}

export default function RiverMapVisualization({ segments, selectedSegment, scanningSegment, onSegmentClick }: Props) {
  const [animatedSegments, setAnimatedSegments] = useState<Set<number>>(new Set());
  const [waterParticles, setWaterParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Generate water particles for visual effect
  useEffect(() => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setWaterParticles(particles);
  }, []);

  // Animate segments as they're scanned
  useEffect(() => {
    const scannedIds = segments.filter(s => s.scanned).map(s => s.segmentId);
    setAnimatedSegments(new Set(scannedIds));
  }, [segments]);

  const getSegmentColor = (segment: RiverSegmentData) => {
    if (!segment.scanned) return 'from-gray-700 to-gray-800';
    
    if (segment.pollutionLevel > 70) return 'from-red-900 to-red-800';
    if (segment.pollutionLevel > 50) return 'from-orange-800 to-orange-700';
    if (segment.pollutionLevel > 30) return 'from-yellow-700 to-yellow-600';
    if (segment.pollutionLevel > 10) return 'from-blue-600 to-blue-500';
    return 'from-cyan-500 to-blue-400';
  };

  const getWaterOpacity = (segment: RiverSegmentData) => {
    if (!segment.scanned) return 0.3;
    return 1 - (segment.pollutionLevel / 100) * 0.7;
  };

  const getSegmentIcon = (segment: RiverSegmentData) => {
    if (!segment.scanned) return <Droplets className="w-6 h-6 text-gray-500" />;
    
    if (segment.pollutionLevel > 70) return <AlertTriangle className="w-6 h-6 text-red-400" />;
    if (segment.pollutionLevel > 30) return <Waves className="w-6 h-6 text-orange-400" />;
    return <Fish className="w-6 h-6 text-cyan-400" />;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 rounded-2xl p-8 overflow-hidden">
      {/* Background water particles */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {waterParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Waves className="w-6 h-6 text-cyan-400" />
            River Map
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-gray-300">Clean</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span className="text-gray-300">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-800"></div>
              <span className="text-gray-300">Polluted</span>
            </div>
          </div>
        </div>

        {/* River flow visualization */}
        <div className="relative">
          {/* River path */}
          <svg className="w-full h-96" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* River background */}
            <path
              d="M 50,200 Q 150,150 250,180 T 450,200 T 650,180 L 750,200"
              fill="none"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="80"
              strokeLinecap="round"
            />
            
            {/* River segments */}
            {segments.map((segment, idx) => {
              const x = 50 + idx * 70;
              const y = 200 + Math.sin(idx * 0.8) * 30;
              const isScanned = segment.scanned;
              const isSelected = selectedSegment === segment.segmentId;
              const isScanning = scanningSegment === segment.segmentId;
              
              return (
                <g key={segment.segmentId}>
                  {/* Segment circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 35 : 30}
                    className={`cursor-pointer transition-all duration-300 ${
                      isScanning ? 'animate-pulse' : ''
                    }`}
                    fill={`url(#gradient-${segment.segmentId})`}
                    stroke={isSelected ? '#06b6d4' : isScanned ? '#3b82f6' : '#4b5563'}
                    strokeWidth={isSelected ? 4 : 2}
                    opacity={getWaterOpacity(segment)}
                    onClick={() => onSegmentClick(segment.segmentId)}
                  />
                  
                  {/* Gradient definition */}
                  <defs>
                    <radialGradient id={`gradient-${segment.segmentId}`}>
                      <stop offset="0%" stopColor={isScanned ? (segment.pollutionLevel > 50 ? '#dc2626' : '#06b6d4') : '#6b7280'} />
                      <stop offset="100%" stopColor={isScanned ? (segment.pollutionLevel > 50 ? '#991b1b' : '#0e7490') : '#374151'} />
                    </radialGradient>
                  </defs>
                  
                  {/* Segment number */}
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    className="text-sm font-bold fill-white"
                    style={{ pointerEvents: 'none' }}
                  >
                    {segment.segmentId}
                  </text>
                  
                  {/* Scanning effect */}
                  {isScanning && (
                    <>
                      <circle
                        cx={x}
                        cy={y}
                        r={30}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        opacity={0.5}
                        className="animate-ping"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={25}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth={1}
                        opacity={0.8}
                        className="animate-pulse"
                      />
                    </>
                  )}
                  
                  {/* Water clearing animation for clean segments */}
                  {isScanned && segment.pollutionLevel < 30 && animatedSegments.has(segment.segmentId) && (
                    <>
                      <circle
                        cx={x}
                        cy={y}
                        r={35}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        opacity={0}
                        className="animate-ripple"
                      />
                      {/* Sparkle effect for clean water */}
                      <g opacity={0.8} className="animate-pulse">
                        <circle cx={x - 15} cy={y - 15} r={2} fill="#22d3ee" />
                        <circle cx={x + 15} cy={y - 10} r={2} fill="#06b6d4" />
                        <circle cx={x + 10} cy={y + 15} r={2} fill="#22d3ee" />
                      </g>
                    </>
                  )}
                  
                  {/* Pollution indicator for highly polluted segments */}
                  {isScanned && segment.pollutionLevel > 70 && (
                    <g opacity={0.7} className="animate-pulse">
                      <circle cx={x} cy={y - 40} r={5} fill="#dc2626" />
                      <circle cx={x - 10} cy={y - 35} r={3} fill="#ef4444" />
                      <circle cx={x + 10} cy={y - 35} r={3} fill="#ef4444" />
                    </g>
                  )}
                  
                  {/* Connection line to next segment */}
                  {idx < segments.length - 1 && (
                    <line
                      x1={x}
                      y1={y}
                      x2={50 + (idx + 1) * 70}
                      y2={200 + Math.sin((idx + 1) * 0.8) * 30}
                      stroke={isScanned && segments[idx + 1].scanned ? '#3b82f6' : '#4b5563'}
                      strokeWidth={2}
                      strokeDasharray={isScanned && segments[idx + 1].scanned ? '0' : '5,5'}
                      opacity={0.5}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected segment details */}
        {selectedSegment && (
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-6 animate-fade-in">
            {(() => {
              const segment = segments.find(s => s.segmentId === selectedSegment);
              if (!segment) return null;
              
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">
                        Segment {segment.segmentId}: {segment.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {getSegmentIcon(segment)}
                        <span className={`text-sm font-medium ${
                          segment.scanned 
                            ? segment.pollutionLevel > 70 ? 'text-red-400' : segment.pollutionLevel > 30 ? 'text-yellow-400' : 'text-cyan-400'
                            : 'text-gray-400'
                        }`}>
                          {segment.scanned ? (
                            segment.pollutionLevel > 70 ? 'Severely Polluted' : segment.pollutionLevel > 30 ? 'Moderately Polluted' : 'Relatively Clean'
                          ) : 'Not Scanned'}
                        </span>
                      </div>
                    </div>
                    {segment.scanned && segment.pollutionLevel < 30 && (
                      <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                    )}
                  </div>
                  
                  {segment.scanned && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-500/20 rounded-lg p-3">
                        <div className="text-xs text-blue-300 mb-1">Water Quality</div>
                        <div className="text-lg font-bold text-white">{segment.waterQuality}%</div>
                      </div>
                      <div className="bg-red-500/20 rounded-lg p-3">
                        <div className="text-xs text-red-300 mb-1">Pollution</div>
                        <div className="text-lg font-bold text-white">{segment.pollutionLevel}%</div>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-3">
                        <div className="text-xs text-green-300 mb-1">Oxygen</div>
                        <div className="text-lg font-bold text-white">{segment.oxygenLevel.toFixed(1)} mg/L</div>
                      </div>
                      <div className="bg-orange-500/20 rounded-lg p-3">
                        <div className="text-xs text-orange-300 mb-1">Temperature</div>
                        <div className="text-lg font-bold text-white">{segment.temperature.toFixed(1)}°C</div>
                      </div>
                    </div>
                  )}
                  
                  {!segment.scanned && (
                    <div className="text-center py-4">
                      <p className="text-gray-400 italic">Scan this segment to reveal detailed data</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes ripple {
          0% { r: 35; opacity: 0.5; }
          100% { r: 50; opacity: 0; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
}
