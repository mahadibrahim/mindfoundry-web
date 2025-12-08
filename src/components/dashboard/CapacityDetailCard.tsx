import React from 'react';
import type { Capacity, CapacityGrowth } from '../../types/dashboard';

// Icons (defined first to avoid initialization issues)
const TrendUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendStableIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);

const TrendDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
  </svg>
);

interface CapacityDetailCardProps {
  capacityGrowth: CapacityGrowth;
  onClick?: () => void;
  isSelected?: boolean;
}

const CAPACITY_CONFIG: Record<Capacity, { 
  label: string; 
  emoji: string; 
  color: string;
  bgColor: string;
  description: string;
}> = {
  curiosity: { 
    label: 'Curiosity', 
    emoji: '🔍', 
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    description: 'Exploring ideas, asking questions, seeking to understand',
  },
  reasoning: { 
    label: 'Reasoning', 
    emoji: '🧩', 
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: 'Logical thinking, problem-solving, making connections',
  },
  expression: { 
    label: 'Expression', 
    emoji: '💬', 
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    description: 'Communicating ideas, creativity, sharing perspectives',
  },
  focus: { 
    label: 'Focus', 
    emoji: '🎯', 
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    description: 'Sustained attention, persistence, task completion',
  },
  collaboration: { 
    label: 'Collaboration', 
    emoji: '🤝', 
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Working with others, empathy, teamwork',
  },
  adaptability: { 
    label: 'Adaptability', 
    emoji: '🌱', 
    color: 'text-teal-700',
    bgColor: 'bg-teal-100',
    description: 'Flexibility, resilience, handling change',
  },
};

const LEVEL_LABELS: Record<number, { name: string; description: string }> = {
  1: { name: 'Exploring', description: 'Beginning to engage with this capacity' },
  2: { name: 'Developing', description: 'Growing with support and guidance' },
  3: { name: 'Practicing', description: 'Demonstrating independently' },
  4: { name: 'Confident', description: 'Consistent and self-directed' },
  5: { name: 'Leading', description: 'Helping others develop this capacity' },
};

const TREND_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  'improving': { 
    icon: <TrendUpIcon className="w-4 h-4" />, 
    label: 'Improving', 
    color: 'text-green-600' 
  },
  'stable': { 
    icon: <TrendStableIcon className="w-4 h-4" />, 
    label: 'Stable', 
    color: 'text-blue-600' 
  },
  'needs-attention': { 
    icon: <TrendDownIcon className="w-4 h-4" />, 
    label: 'Needs attention', 
    color: 'text-amber-600' 
  },
};

const CapacityDetailCard: React.FC<CapacityDetailCardProps> = ({
  capacityGrowth,
  onClick,
  isSelected = false,
}) => {
  const config = CAPACITY_CONFIG[capacityGrowth.capacity];
  const levelInfo = LEVEL_LABELS[capacityGrowth.currentLevel] || LEVEL_LABELS[1];
  const trendInfo = TREND_CONFIG[capacityGrowth.trend || 'stable'];
  
  const progressPercent = (capacityGrowth.currentLevel / 5) * 100;

  return (
    <div 
      className={`bg-white rounded-2xl border-2 p-5 transition-all cursor-pointer hover:shadow-lg ${
        isSelected 
          ? 'border-amber-400 shadow-lg ring-2 ring-amber-100' 
          : 'border-gray-100 hover:border-gray-200'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
            <span className="text-2xl">{config.emoji}</span>
          </div>
          <div>
            <h3 className={`font-bold text-lg ${config.color}`}>{config.label}</h3>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </div>
        
        {/* Trend Badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 ${trendInfo.color}`}>
          {trendInfo.icon}
          <span className="text-xs font-medium">{trendInfo.label}</span>
        </div>
      </div>

      {/* Level Display */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-3xl font-bold text-gray-900">Level {capacityGrowth.currentLevel}</span>
            <span className="text-gray-500 ml-2">/ 5</span>
          </div>
          <span className={`text-sm font-semibold ${config.color}`}>{levelInfo.name}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${config.bgColor.replace('100', '500')}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {/* Level Labels */}
        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
          <span>Exploring</span>
          <span>Leading</span>
        </div>
      </div>

      {/* Level Description */}
      <p className="text-sm text-gray-600 mb-3">
        {levelInfo.description}
      </p>

      {/* Previous Level Indicator */}
      {capacityGrowth.previousLevel && capacityGrowth.previousLevel !== capacityGrowth.currentLevel && (
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span>Previous: Level {capacityGrowth.previousLevel}</span>
          <span className="text-green-600 font-medium">
            +{capacityGrowth.currentLevel - capacityGrowth.previousLevel} level
          </span>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-xs text-gray-400 mt-2">
        Last updated: {new Date(capacityGrowth.lastUpdated).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
    </div>
  );
};

export default CapacityDetailCard;