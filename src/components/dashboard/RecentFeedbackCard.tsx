import React from 'react';
import type { FeedbackWithContext, Capacity, ObservationLevel } from '../../types/dashboard';
import { CapacityDescriptions } from '../../types/dashboard';

interface RecentFeedbackCardProps {
  feedback: FeedbackWithContext;
  onViewFeedback?: (feedbackId: string) => void;
  onAddReflection?: (feedbackId: string) => void;
}

const RecentFeedbackCard: React.FC<RecentFeedbackCardProps> = ({
  feedback,
  onViewFeedback,
  onAddReflection,
}) => {
  // Format date
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get observation color
  const getObservationColor = (level: ObservationLevel): string => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'moderate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'developing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get capacity icon/emoji
  const getCapacityEmoji = (capacity: Capacity): string => {
    const emojis: Record<Capacity, string> = {
      curiosity: '🔍',
      reasoning: '🧩',
      expression: '🎨',
      focus: '🎯',
      collaboration: '🤝',
      adaptability: '🌱',
    };
    return emojis[capacity];
  };

  const hasReflection = !!feedback.parentReflection;
  const topObservations = feedback.capacityObservations.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              {feedback.childFirstName}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{feedback.courseName}</span>
          </div>
          <span className="text-xs text-gray-500">{formatDate(feedback.sessionDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            Session feedback from {feedback.instructorName}
          </span>
          {!hasReflection && (
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" title="Awaiting your reflection" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Capacity Observations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {topObservations.map((obs, index) => (
            <div
              key={index}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${getObservationColor(obs.level)}`}
            >
              <span>{getCapacityEmoji(obs.capacity)}</span>
              <span className="font-medium">{CapacityDescriptions[obs.capacity].name}</span>
              <span className="opacity-75">
                {obs.level === 'high' ? '↑' : obs.level === 'developing' ? '→' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
          "{feedback.summary}"
        </p>

        {/* Growth Focus */}
        {feedback.growthFocus && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl mb-4">
            <TargetIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
                Growth Focus
              </p>
              <p className="text-sm text-blue-800">{feedback.growthFocus}</p>
            </div>
          </div>
        )}

        {/* Parent Reflection Status */}
        {hasReflection ? (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-0.5">
                Your Reflection
              </p>
              <p className="text-sm text-green-800 line-clamp-2">
                "{feedback.parentReflection!.content}"
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onAddReflection?.(feedback.id)}
            className="w-full p-3 border-2 border-dashed border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-colors flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">Add your reflection</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => onViewFeedback?.(feedback.id)}
          className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
        >
          View full feedback
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Icons
const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default RecentFeedbackCard;
