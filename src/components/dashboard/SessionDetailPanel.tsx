import React, { useState } from 'react';
import type { Session, Enrollment, Child, Capacity, ObservationLevel } from '../../types/dashboard';
import { CapacityDescriptions } from '../../types/dashboard';

interface SessionDetailPanelProps {
  session: Session;
  enrollment: Enrollment;
  child: Child;
  onClose: () => void;
  onJoinSession?: (session: Session) => void;
  onSaveReflection?: (sessionId: string, reflection: string) => void;
}

const SessionDetailPanel: React.FC<SessionDetailPanelProps> = ({
  session,
  enrollment,
  child,
  onClose,
  onJoinSession,
  onSaveReflection,
}) => {
  const [reflectionText, setReflectionText] = useState(session.feedback?.parentReflection?.content || '');
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isOnline = session.delivery === 'online';
  const isPast = new Date(session.scheduledAt) < new Date();
  const hasFeedback = !!session.feedback;

  // Check if session is joinable
  const isJoinable = (): boolean => {
    if (!isOnline || !session.online) return false;
    const now = new Date();
    const joinableFrom = new Date(session.online.joinableFrom);
    const sessionEnd = new Date(new Date(session.scheduledAt).getTime() + session.durationMinutes * 60 * 1000);
    return now >= joinableFrom && now <= sessionEnd && session.status !== 'completed';
  };

  const canJoin = isJoinable();

  // Format date
  const formatDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (isoDate: string): string => {
    return new Date(isoDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
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

  // Get capacity emoji
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

  // Handle save reflection
  const handleSaveReflection = async () => {
    setIsSaving(true);
    try {
      await onSaveReflection?.(session.id, reflectionText);
      setIsEditingReflection(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={child.photoUrl || `https://ui-avatars.com/api/?name=${child.firstName}&background=FFC72C&color=1E1E1E&size=48`}
              alt={child.firstName}
              className="w-12 h-12 rounded-xl border-2 border-white shadow"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{enrollment.course.title}</h2>
              <p className="text-gray-600">
                {child.firstName} • Session {session.sessionNumber} of {enrollment.sessionsTotal}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Session Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date & Time</p>
            <p className="font-semibold text-gray-900">{formatDate(session.scheduledAt)}</p>
            <p className="text-gray-600">{formatTime(session.scheduledAt)} • {session.durationMinutes} minutes</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</p>
            {isOnline ? (
              <>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <VideoIcon className="w-4 h-4 text-amber-600" />
                  Online Session
                </p>
                {canJoin ? (
                  <button
                    onClick={() => onJoinSession?.(session)}
                    className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <VideoIcon className="w-4 h-4" />
                    Join Now
                  </button>
                ) : !isPast && session.online ? (
                  <p className="text-sm text-gray-500 mt-1">
                    Join available at {formatTime(session.online.joinableFrom)}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-amber-600" />
                  {session.location?.centerName}
                </p>
                <p className="text-sm text-gray-600">{session.location?.room}</p>
                <p className="text-sm text-gray-500">{session.location?.address}</p>
              </>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Instructor</p>
            <div className="flex items-center gap-3">
              <img
                src={enrollment.course.instructor.photoUrl || `https://ui-avatars.com/api/?name=${enrollment.course.instructor.firstName}+${enrollment.course.instructor.lastName}&background=FF6600&color=FFFFFF`}
                alt={enrollment.course.instructor.firstName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
                </p>
                <p className="text-sm text-gray-500">{enrollment.course.instructor.title}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Format</p>
            <p className="font-semibold text-gray-900">
              {enrollment.course.format === 'one-on-one' ? 'One-on-One' : 'Group Class'}
            </p>
            <p className="text-sm text-gray-500">
              Ages {enrollment.course.ageRange.min}-{enrollment.course.ageRange.max}
            </p>
          </div>
        </div>

        {/* Capacities Being Developed */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Capacities Being Developed
          </h3>
          <div className="flex flex-wrap gap-2">
            {enrollment.course.capacitiesDeveloped.map((capacity) => (
              <span
                key={capacity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
              >
                {getCapacityEmoji(capacity)} {CapacityDescriptions[capacity].name}
              </span>
            ))}
          </div>
        </div>

        {/* Session Feedback Section */}
        {hasFeedback && session.feedback && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-amber-600" />
              Instructor Feedback
            </h3>

            {/* Capacity Observations */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-500 mb-2">Capacity Observations</p>
              <div className="flex flex-wrap gap-2">
                {session.feedback.capacityObservations.map((obs, index) => (
                  <div
                    key={index}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${getObservationColor(obs.level)}`}
                  >
                    <span>{getCapacityEmoji(obs.capacity)}</span>
                    <div>
                      <span className="font-medium">{CapacityDescriptions[obs.capacity].name}</span>
                      <span className="ml-1.5 opacity-75">
                        {obs.level === 'high' ? '↑' : obs.level === 'developing' ? '→' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Notes */}
            {session.feedback.capacityObservations.some(obs => obs.note) && (
              <div className="mb-4 space-y-2">
                {session.feedback.capacityObservations
                  .filter(obs => obs.note)
                  .map((obs, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        {getCapacityEmoji(obs.capacity)} {CapacityDescriptions[obs.capacity].name}
                      </p>
                      <p className="text-sm text-gray-700">{obs.note}</p>
                    </div>
                  ))}
              </div>
            )}

            {/* Summary */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-amber-800 mb-2">Instructor Notes</p>
              <p className="text-gray-700 leading-relaxed">"{session.feedback.summary}"</p>
              <p className="text-sm text-amber-600 mt-2">
                — {session.feedback.instructorName}
              </p>
            </div>

            {/* Growth Focus */}
            {session.feedback.growthFocus && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 flex items-start gap-3">
                <TargetIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Growth Focus</p>
                  <p className="text-blue-800">{session.feedback.growthFocus}</p>
                </div>
              </div>
            )}

            {/* Highlights */}
            {session.feedback.highlights && session.feedback.highlights.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-500 mb-2">Highlights</p>
                <ul className="space-y-1">
                  {session.feedback.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <StarIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Parent Reflection */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageIcon className="w-4 h-4 text-gray-500" />
                Your Reflection
              </h4>

              {session.feedback.parentReflection && !isEditingReflection ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <p className="text-green-800 leading-relaxed">
                    "{session.feedback.parentReflection.content}"
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Added {new Date(session.feedback.parentReflection.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => setIsEditingReflection(true)}
                    className="mt-3 text-sm text-green-700 font-medium hover:text-green-800"
                  >
                    Edit reflection
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Share what you noticed at home, ask a question, or add context for the instructor..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500">
                      This reflection is saved to {child.firstName}'s feedback journal
                    </p>
                    <div className="flex gap-2">
                      {session.feedback.parentReflection && (
                        <button
                          onClick={() => {
                            setReflectionText(session.feedback?.parentReflection?.content || '');
                            setIsEditingReflection(false);
                          }}
                          className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={handleSaveReflection}
                        disabled={!reflectionText.trim() || isSaving}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                      >
                        {isSaving ? 'Saving...' : 'Save Reflection'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Feedback Yet */}
        {!hasFeedback && isPast && (
          <div className="border-t border-gray-200 pt-6">
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Feedback Pending</p>
              <p className="text-sm text-gray-500">
                The instructor will add feedback shortly after the session
              </p>
            </div>
          </div>
        )}

        {/* Future Session */}
        {!isPast && (
          <div className="border-t border-gray-200 pt-6">
            <div className="text-center py-8 bg-amber-50 rounded-xl">
              <CalendarIcon className="w-12 h-12 text-amber-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Upcoming Session</p>
              <p className="text-sm text-gray-600">
                Feedback will be available after the session is completed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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

const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default SessionDetailPanel;
