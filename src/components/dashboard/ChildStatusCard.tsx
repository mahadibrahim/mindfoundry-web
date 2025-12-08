import React from 'react';
import type { ChildOverview, GrowthLevel, Capacity } from '../../types/dashboard';
import { CapacityDescriptions, GrowthLevelNames } from '../../types/dashboard';

interface ChildStatusCardProps {
  childOverview: ChildOverview;
  onViewChild?: (childId: string) => void;
}

const ChildStatusCard: React.FC<ChildStatusCardProps> = ({ childOverview, onViewChild }) => {
  const { child, nextSession, recentFeedbackCount, hasUnreadFeedback, topCapacity } = childOverview;

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(child.dateOfBirth);
  const enrollmentCount = child.activeEnrollments.length;

  // Format next session time
  const formatNextSession = (scheduledAt: string): string => {
    const date = new Date(scheduledAt);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Get capacity color
  const getCapacityColor = (capacity: Capacity): string => {
    const colors: Record<Capacity, string> = {
      curiosity: 'from-purple-500 to-indigo-500',
      reasoning: 'from-blue-500 to-cyan-500',
      expression: 'from-pink-500 to-rose-500',
      focus: 'from-amber-500 to-orange-500',
      collaboration: 'from-green-500 to-emerald-500',
      adaptability: 'from-teal-500 to-cyan-500',
    };
    return colors[capacity];
  };

  // Render level dots
  const renderLevelDots = (level: GrowthLevel) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= level ? 'bg-current' : 'bg-current opacity-25'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header with gradient accent */}
      <div className={`h-2 bg-gradient-to-r ${getCapacityColor(topCapacity.capacity)}`} />

      <div className="p-6">
        {/* Child Info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <img
              src={child.photoUrl || `https://ui-avatars.com/api/?name=${child.firstName}&background=FFC72C&color=1E1E1E&size=80`}
              alt={child.firstName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-100 shadow-sm"
            />
            {hasUnreadFeedback && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{child.firstName}</h3>
            <p className="text-gray-500 text-sm">
              {age} years old • {enrollmentCount} active {enrollmentCount === 1 ? 'course' : 'courses'}
            </p>
          </div>
        </div>

        {/* Top Capacity Highlight */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Top Capacity
            </span>
            <span className={`text-xs font-bold bg-gradient-to-r ${getCapacityColor(topCapacity.capacity)} bg-clip-text text-transparent`}>
              {GrowthLevelNames[topCapacity.level]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">
              {CapacityDescriptions[topCapacity.capacity].name}
            </span>
            <div className={`bg-gradient-to-r ${getCapacityColor(topCapacity.capacity)} bg-clip-text text-transparent`}>
              {renderLevelDots(topCapacity.level)}
            </div>
          </div>
        </div>

        {/* Next Session */}
        {nextSession ? (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Next Session
            </p>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                {nextSession.delivery === 'online' ? (
                  <VideoIcon className="w-5 h-5 text-amber-600" />
                ) : (
                  <MapPinIcon className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {child.activeEnrollments.find(e => e.id === nextSession.enrollmentId)?.course.title || 'Session'}
                </p>
                <p className="text-sm text-gray-600">
                  {formatNextSession(nextSession.scheduledAt)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-500 text-sm">No upcoming sessions</p>
          </div>
        )}

        {/* Feedback indicator */}
        {recentFeedbackCount > 0 && (
          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className={`w-2 h-2 rounded-full ${hasUnreadFeedback ? 'bg-red-500' : 'bg-green-500'}`} />
            <span className="text-gray-600">
              {recentFeedbackCount} new feedback {recentFeedbackCount === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onViewChild?.(child.id)}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          View {child.firstName}'s Progress
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Icons
const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default ChildStatusCard;
