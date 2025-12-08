import React, { useState } from 'react';
import type { Badge, Capacity } from '../../types/dashboard';

interface BadgeShowcaseProps {
  badges: Badge[];
  childName: string;
}

const CAPACITY_CONFIG: Record<Capacity, { 
  label: string; 
  emoji: string; 
  gradient: string;
  borderColor: string;
}> = {
  curiosity: { 
    label: 'Curiosity', 
    emoji: '🔍', 
    gradient: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-300',
  },
  reasoning: { 
    label: 'Reasoning', 
    emoji: '🧩', 
    gradient: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-300',
  },
  expression: { 
    label: 'Expression', 
    emoji: '💬', 
    gradient: 'from-pink-400 to-pink-600',
    borderColor: 'border-pink-300',
  },
  focus: { 
    label: 'Focus', 
    emoji: '🎯', 
    gradient: 'from-orange-400 to-orange-600',
    borderColor: 'border-orange-300',
  },
  collaboration: { 
    label: 'Collaboration', 
    emoji: '🤝', 
    gradient: 'from-green-400 to-green-600',
    borderColor: 'border-green-300',
  },
  adaptability: { 
    label: 'Adaptability', 
    emoji: '🌱', 
    gradient: 'from-teal-400 to-teal-600',
    borderColor: 'border-teal-300',
  },
};

const LEVEL_LABELS: Record<number, string> = {
  1: 'Exploring',
  2: 'Developing',
  3: 'Practicing',
  4: 'Confident',
  5: 'Leading',
};

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ badges, childName }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filterCapacity, setFilterCapacity] = useState<Capacity | 'all'>('all');

  const filteredBadges = filterCapacity === 'all' 
    ? badges 
    : badges.filter(b => b.capacity === filterCapacity);

  // Group badges by capacity for counting
  const badgesByCapacity = badges.reduce((acc, badge) => {
    acc[badge.capacity] = (acc[badge.capacity] || 0) + 1;
    return acc;
  }, {} as Record<Capacity, number>);

  if (badges.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-4xl">🏅</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Badges Yet</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          {childName} is working hard! Badges are earned by demonstrating growth in core capacities during sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCapacity('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            filterCapacity === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({badges.length})
        </button>
        {(Object.keys(CAPACITY_CONFIG) as Capacity[]).map((capacity) => {
          const count = badgesByCapacity[capacity] || 0;
          if (count === 0) return null;
          const config = CAPACITY_CONFIG[capacity];
          return (
            <button
              key={capacity}
              onClick={() => setFilterCapacity(capacity)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filterCapacity === capacity
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{config.emoji}</span>
              <span>{config.label}</span>
              <span className="ml-1 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const config = CAPACITY_CONFIG[badge.capacity];
          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-lg hover:-translate-y-1 ${config.borderColor}`}
            >
              {/* Badge Icon */}
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{config.emoji}</span>
              </div>

              {/* Badge Name */}
              <h4 className="font-semibold text-gray-900 text-center text-sm mb-1 line-clamp-2">
                {badge.name}
              </h4>

              {/* Level */}
              <p className="text-xs text-gray-500 text-center">
                Level {badge.level} • {LEVEL_LABELS[badge.level]}
              </p>

              {/* Earned Date */}
              <p className="text-xs text-gray-400 text-center mt-2">
                {new Date(badge.earnedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>

              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XIcon className="w-5 h-5 text-gray-500" />
            </button>

            {/* Badge Display */}
            <div className="text-center mb-6">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${CAPACITY_CONFIG[selectedBadge.capacity].gradient} flex items-center justify-center shadow-xl`}>
                <span className="text-5xl">{CAPACITY_CONFIG[selectedBadge.capacity].emoji}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedBadge.name}</h3>
              <p className={`text-sm font-medium ${CAPACITY_CONFIG[selectedBadge.capacity].gradient.includes('purple') ? 'text-purple-600' : CAPACITY_CONFIG[selectedBadge.capacity].gradient.includes('blue') ? 'text-blue-600' : CAPACITY_CONFIG[selectedBadge.capacity].gradient.includes('pink') ? 'text-pink-600' : CAPACITY_CONFIG[selectedBadge.capacity].gradient.includes('orange') ? 'text-orange-600' : CAPACITY_CONFIG[selectedBadge.capacity].gradient.includes('green') ? 'text-green-600' : 'text-teal-600'}`}>
                {CAPACITY_CONFIG[selectedBadge.capacity].label} • Level {selectedBadge.level}
              </p>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-700">{selectedBadge.description}</p>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Earned</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedBadge.earnedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {selectedBadge.courseName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Course</span>
                  <span className="font-medium text-gray-900">{selectedBadge.courseName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Growth Level</span>
                <span className="font-medium text-gray-900">{LEVEL_LABELS[selectedBadge.level]}</span>
              </div>
            </div>

            {/* Close Action */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Icons
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default BadgeShowcase;