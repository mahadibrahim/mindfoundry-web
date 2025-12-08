import React, { useState } from 'react';
import type { 
  SessionFeedback, 
  Session, 
  Enrollment, 
  Child, 
  Capacity,
  ObservationLevel 
} from '../../types/dashboard';

interface FeedbackEntryCardProps {
  feedback: SessionFeedback;
  session: Session;
  enrollment: Enrollment;
  child: Child;
  isNew?: boolean;
  onSaveReflection?: (feedbackId: string, reflection: string) => void;
  defaultExpanded?: boolean;
}

const CAPACITY_CONFIG: Record<Capacity, { label: string; emoji: string; color: string }> = {
  curiosity: { label: 'Curiosity', emoji: '🔍', color: 'purple' },
  reasoning: { label: 'Reasoning', emoji: '🧩', color: 'blue' },
  expression: { label: 'Expression', emoji: '💬', color: 'pink' },
  focus: { label: 'Focus', emoji: '🎯', color: 'orange' },
  collaboration: { label: 'Collaboration', emoji: '🤝', color: 'green' },
  adaptability: { label: 'Adaptability', emoji: '🌱', color: 'teal' },
};

const LEVEL_CONFIG: Record<ObservationLevel, { label: string; color: string; bgColor: string }> = {
  'high': { label: 'Strong', color: 'text-green-700', bgColor: 'bg-green-100' },
  'moderate': { label: 'Growing', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  'developing': { label: 'Emerging', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  'not-observed': { label: 'Not Observed', color: 'text-gray-500', bgColor: 'bg-gray-100' },
};

const FeedbackEntryCard: React.FC<FeedbackEntryCardProps> = ({
  feedback,
  session,
  enrollment,
  child,
  isNew = false,
  onSaveReflection,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState(feedback.parentReflection || '');

  const sessionDate = new Date(session.scheduledAt);
  const hasReflection = !!feedback.parentReflection;

  const handleSaveReflection = () => {
    if (reflectionText.trim() && onSaveReflection) {
      onSaveReflection(feedback.id, reflectionText.trim());
      setIsEditingReflection(false);
    }
  };

  // Get observed capacities (exclude not-observed)
  const observedCapacities = feedback.capacityObservations.filter(
    obs => obs.level !== 'not-observed'
  );

  // Get the primary/highlighted capacity
  const primaryCapacity = observedCapacities.find(obs => obs.level === 'high') || observedCapacities[0];

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      isNew ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-100'
    }`}>
      {/* Header - Always visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          {/* Child Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={child.photoUrl || `https://ui-avatars.com/api/?name=${child.firstName}&background=FFC72C&color=1E1E1E`}
              alt={child.firstName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
            />
            {isNew && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {child.firstName}'s {enrollment.course.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Session {session.sessionNumber} • {sessionDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Quick Capacity Preview */}
              {primaryCapacity && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${LEVEL_CONFIG[primaryCapacity.level].bgColor}`}>
                  <span className="text-sm">
                    {CAPACITY_CONFIG[primaryCapacity.capacity].emoji}
                  </span>
                  <span className={`text-xs font-medium ${LEVEL_CONFIG[primaryCapacity.level].color}`}>
                    {CAPACITY_CONFIG[primaryCapacity.capacity].label}
                  </span>
                </div>
              )}
            </div>

            {/* Summary Quote */}
            {feedback.summary && (
              <p className="mt-2 text-sm text-gray-600 italic line-clamp-2">
                "{feedback.summary}"
              </p>
            )}

            {/* Quick Stats Row */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                {feedback.instructorName}
              </span>
              <span className="flex items-center gap-1">
                <SparklesIcon className="w-3.5 h-3.5" />
                {observedCapacities.length} capacities observed
              </span>
              {hasReflection ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  Reflected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600">
                  <PencilIcon className="w-3.5 h-3.5" />
                  Add reflection
                </span>
              )}
            </div>
          </div>

          {/* Expand Toggle */}
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Capacity Observations */}
          <div className="p-4 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Capacity Observations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feedback.capacityObservations.map((observation) => {
                const config = CAPACITY_CONFIG[observation.capacity];
                const levelConfig = LEVEL_CONFIG[observation.level];
                
                if (observation.level === 'not-observed') return null;
                
                return (
                  <div 
                    key={observation.capacity}
                    className="bg-white rounded-xl p-3 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.emoji}</span>
                        <span className="font-medium text-gray-900">{config.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelConfig.bgColor} ${levelConfig.color}`}>
                        {levelConfig.label}
                      </span>
                    </div>
                    {observation.note && (
                      <p className="text-sm text-gray-600">{observation.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlights */}
          {feedback.highlights && feedback.highlights.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Session Highlights</h4>
              <ul className="space-y-1.5">
                {feedback.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <StarIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Growth Focus */}
          {feedback.growthFocus && (
            <div className="p-4 border-t border-gray-100 bg-blue-50">
              <h4 className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                <TargetIcon className="w-4 h-4" />
                Growth Focus
              </h4>
              <p className="text-sm text-blue-800">{feedback.growthFocus}</p>
            </div>
          )}

          {/* Parent Reflection */}
          <div className="p-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <HeartIcon className="w-4 h-4 text-pink-500" />
              Your Reflection
            </h4>
            
            {isEditingReflection || !hasReflection ? (
              <div className="space-y-3">
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="What did you notice at home? Any connections to what the instructor observed? This helps us understand your child's full learning journey..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Your reflections are private and help instructors personalize learning.
                  </p>
                  <div className="flex gap-2">
                    {hasReflection && (
                      <button
                        onClick={() => {
                          setReflectionText(feedback.parentReflection || '');
                          setIsEditingReflection(false);
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={handleSaveReflection}
                      disabled={!reflectionText.trim()}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium text-sm rounded-lg transition-colors"
                    >
                      Save Reflection
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-pink-50 rounded-xl p-3 border border-pink-100">
                <p className="text-sm text-gray-700 italic">"{feedback.parentReflection}"</p>
                <button
                  onClick={() => setIsEditingReflection(true)}
                  className="mt-2 text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
                >
                  <PencilIcon className="w-3 h-3" />
                  Edit reflection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Icons
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default FeedbackEntryCard;