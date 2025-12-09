import React, { useState, useMemo } from 'react';
import type {
  InstructorSession,
  StudentContext,
  Artifact,
  StudentAttendance,
  StudentObservations,
  CapacityObservation,
  ArtifactReviewAction,
  SessionWrapUp,
  Capacity,
  ObservationLevel,
  AttendanceStatus,
} from '../../../types/instructor';
import { CAPACITY_CONFIG, OBSERVATION_LEVELS } from '../../../types/instructor';

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type WrapUpStep = 'attendance' | 'artifacts' | 'observations' | 'summary';

interface WrapUpFlowProps {
  session: InstructorSession;
  pendingArtifacts: Artifact[];
  onComplete: (wrapUp: SessionWrapUp) => void;
  onCancel: () => void;
  sessionRate: number; // in cents
}

// -----------------------------------------------------------------------------
// Progress Stepper
// -----------------------------------------------------------------------------

const STEPS: { key: WrapUpStep; label: string; shortLabel: string }[] = [
  { key: 'attendance', label: 'Attendance', shortLabel: '1' },
  { key: 'artifacts', label: 'Artifacts', shortLabel: '2' },
  { key: 'observations', label: 'Observations', shortLabel: '3' },
  { key: 'summary', label: 'Summary', shortLabel: '4' },
];

interface ProgressStepperProps {
  currentStep: WrapUpStep;
  completedSteps: WrapUpStep[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, completedSteps }) => {
  const currentIdx = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, idx) => {
        const isCompleted = completedSteps.includes(step.key);
        const isCurrent = step.key === currentStep;
        const isPast = idx < currentIdx;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                  ${isCompleted || isPast
                    ? 'bg-green-500 text-white'
                    : isCurrent
                      ? 'bg-corp-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {isCompleted || isPast ? <CheckIcon /> : step.shortLabel}
              </div>
              <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-corp-primary' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded ${isPast || isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Step 1: Attendance
// -----------------------------------------------------------------------------

interface AttendanceStepProps {
  students: StudentContext[];
  attendance: Record<string, StudentAttendance>;
  onUpdate: (childId: string, attendance: StudentAttendance) => void;
}

const AttendanceStep: React.FC<AttendanceStepProps> = ({ students, attendance, onUpdate }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Who attended today?</h2>
      <p className="text-gray-500 mb-6">Confirm attendance for each student.</p>

      <div className="space-y-4">
        {students.map(student => {
          const current = attendance[student.childId] || { childId: student.childId, status: 'attended' };

          return (
            <div key={student.childId} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.firstName}&background=FFC72C&color=1E1E1E&size=48`}
                  alt={student.firstName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Age {student.age}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['attended', 'no-show', 'left-early'] as AttendanceStatus[]).map(status => {
                  const isSelected = current.status === status;
                  const labels: Record<AttendanceStatus, string> = {
                    'attended': '✓ Attended',
                    'no-show': '✗ No-show',
                    'left-early': '↩ Left early',
                  };

                  return (
                    <button
                      key={status}
                      onClick={() => onUpdate(student.childId, { ...current, status })}
                      className={`
                        px-4 py-2 rounded-lg font-medium text-sm transition-all
                        ${isSelected
                          ? status === 'attended'
                            ? 'bg-green-500 text-white'
                            : status === 'no-show'
                              ? 'bg-red-500 text-white'
                              : 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {labels[status]}
                    </button>
                  );
                })}
              </div>

              {current.status === 'left-early' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Left at (optional)
                  </label>
                  <input
                    type="time"
                    value={current.leftEarlyAt ? new Date(current.leftEarlyAt).toTimeString().slice(0, 5) : ''}
                    onChange={(e) => {
                      const time = e.target.value;
                      if (time) {
                        const date = new Date();
                        const [hours, minutes] = time.split(':');
                        date.setHours(parseInt(hours), parseInt(minutes));
                        onUpdate(student.childId, { ...current, leftEarlyAt: date.toISOString() });
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}

              {current.status === 'no-show' && (
                <p className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Parent will be notified automatically. You'll still earn your session rate.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Step 2: Artifacts
// -----------------------------------------------------------------------------

interface ArtifactsStepProps {
  artifacts: Artifact[];
  reviews: Record<string, ArtifactReviewAction>;
  onReview: (artifactId: string, review: ArtifactReviewAction) => void;
  onSkipAll: () => void;
}

const ArtifactsStep: React.FC<ArtifactsStepProps> = ({ artifacts, reviews, onReview, onSkipAll }) => {
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});

  if (artifacts.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review Submitted Work</h2>
        <p className="text-gray-500 mb-6">Students can submit artifacts after the session.</p>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
            📭
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No artifacts submitted yet</h3>
          <p className="text-gray-500 text-sm mb-4">
            Students may submit work later. You can review it from your Artifacts queue.
          </p>
          <button
            onClick={onSkipAll}
            className="text-corp-primary font-medium hover:underline"
          >
            Continue to next step →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Review Submitted Work</h2>
      <p className="text-gray-500 mb-6">{artifacts.length} artifact{artifacts.length > 1 ? 's' : ''} pending review.</p>

      <div className="space-y-4">
        {artifacts.map(artifact => {
          const review = reviews[artifact.id];
          const feedback = feedbackText[artifact.id] || '';

          return (
            <div key={artifact.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  {/* File type icon */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {artifact.type === 'code' ? '💻' :
                     artifact.type === 'image' ? '🖼️' :
                     artifact.type === 'video' ? '🎬' :
                     artifact.type === 'project' ? '📦' : '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{artifact.title}</p>
                    <p className="text-sm text-gray-500">
                      From {artifact.childFirstName} • {artifact.files[0]?.filename}
                    </p>
                    {artifact.description && (
                      <p className="text-sm text-gray-600 mt-1 italic">"{artifact.description}"</p>
                    )}
                  </div>
                  <a
                    href={artifact.files[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Preview
                  </a>
                </div>
              </div>

              {/* Preview image if available */}
              {artifact.type === 'image' && artifact.files[0]?.thumbnailUrl && (
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <img
                    src={artifact.files[0].thumbnailUrl}
                    alt={artifact.title}
                    className="max-h-32 rounded-lg mx-auto"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => onReview(artifact.id, {
                      artifactId: artifact.id,
                      decision: 'approved',
                      feedback: feedback || undefined,
                      reviewedAt: new Date().toISOString(),
                    })}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
                      ${review?.decision === 'approved'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }
                    `}
                  >
                    <CheckIcon />
                    Approve
                  </button>
                  <button
                    onClick={() => onReview(artifact.id, {
                      artifactId: artifact.id,
                      decision: 'needs-revision',
                      feedback: feedback || 'Please review and resubmit.',
                      reviewedAt: new Date().toISOString(),
                    })}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
                      ${review?.decision === 'needs-revision'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }
                    `}
                  >
                    ↺ Needs Work
                  </button>
                  <button
                    onClick={() => onReview(artifact.id, {
                      artifactId: artifact.id,
                      decision: 'skipped',
                      reviewedAt: new Date().toISOString(),
                    })}
                    className={`
                      px-4 py-2.5 rounded-lg font-medium transition-all
                      ${review?.decision === 'skipped'
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    Skip
                  </button>
                </div>

                {/* Feedback field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback {review?.decision === 'needs-revision' ? '(required)' : '(optional)'}
                  </label>
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedbackText(prev => ({ ...prev, [artifact.id]: e.target.value }))}
                    placeholder="Great work! / Please add comments to your code."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* Badge hint */}
                {artifact.contributesToBadges && artifact.contributesToBadges.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    🎖️ This artifact counts toward badge progress
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Step 3: Observations
// -----------------------------------------------------------------------------

interface ObservationsStepProps {
  students: StudentContext[];
  observations: Record<string, StudentObservations>;
  onUpdate: (childId: string, obs: StudentObservations) => void;
}

const ObservationsStep: React.FC<ObservationsStepProps> = ({ students, observations, onUpdate }) => {
  const [additionalNotes, setAdditionalNotes] = useState<Record<string, string>>({});
  const capacities: Capacity[] = ['curiosity', 'reasoning', 'expression', 'focus', 'collaboration', 'adaptability'];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Observations</h2>
      <p className="text-gray-500 mb-6">What did you notice today? Select all that apply.</p>

      <div className="space-y-6">
        {students.map(student => {
          const current = observations[student.childId] || {
            childId: student.childId,
            capacityObservations: capacities.map(c => ({ capacity: c, level: 'not-observed' as ObservationLevel })),
          };
          const notes = additionalNotes[student.childId] || '';

          const updateCapacity = (capacity: Capacity, level: ObservationLevel) => {
            const newObs = current.capacityObservations.map(o =>
              o.capacity === capacity ? { ...o, level } : o
            );
            onUpdate(student.childId, { ...current, capacityObservations: newObs });
          };

          return (
            <div key={student.childId} className="bg-white rounded-xl border border-gray-200 p-4">
              {/* Student header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <img
                  src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.firstName}&background=FFC72C&color=1E1E1E&size=40`}
                  alt={student.firstName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                  <p className="text-sm text-gray-500">Age {student.age}</p>
                </div>
              </div>

              {/* Capacity grid */}
              <div className="space-y-3">
                {capacities.map(capacity => {
                  const config = CAPACITY_CONFIG[capacity];
                  const obs = current.capacityObservations.find(o => o.capacity === capacity);
                  const currentLevel = obs?.level || 'not-observed';

                  return (
                    <div key={capacity} className="flex items-center gap-3">
                      <div className="w-28 flex items-center gap-2">
                        <span className="text-lg">{config.emoji}</span>
                        <span className="text-sm font-medium text-gray-700">{config.label}</span>
                      </div>
                      <div className="flex gap-1 flex-1">
                        {(['strong', 'developing', 'not-observed'] as ObservationLevel[]).map(level => {
                          const levelConfig = OBSERVATION_LEVELS[level];
                          const isSelected = currentLevel === level;

                          return (
                            <button
                              key={level}
                              onClick={() => updateCapacity(capacity, level)}
                              className={`
                                flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all
                                ${isSelected
                                  ? `${levelConfig.bgColor} ${levelConfig.color} ring-2 ring-offset-1 ${
                                      level === 'strong' ? 'ring-green-300' :
                                      level === 'developing' ? 'ring-amber-300' : 'ring-gray-300'
                                    }`
                                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }
                              `}
                            >
                              {levelConfig.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Capacity hints */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Quick reference:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {capacities.slice(0, 4).map(capacity => (
                    <div key={capacity}>
                      <span className="font-medium">{CAPACITY_CONFIG[capacity].emoji}</span>
                      {' '}{CAPACITY_CONFIG[capacity].description}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional notes */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setAdditionalNotes(prev => ({ ...prev, [student.childId]: e.target.value }));
                    onUpdate(student.childId, { ...current, additionalNotes: e.target.value });
                  }}
                  placeholder="Any specific observations or highlights from this session..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Step 4: Summary
// -----------------------------------------------------------------------------

interface SummaryStepProps {
  session: InstructorSession;
  summary: string;
  onUpdateSummary: (summary: string) => void;
  attendance: Record<string, StudentAttendance>;
  artifactReviews: Record<string, ArtifactReviewAction>;
  observations: Record<string, StudentObservations>;
  sessionRate: number;
  badgesAwarded: string[];
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  session,
  summary,
  onUpdateSummary,
  attendance,
  artifactReviews,
  observations,
  sessionRate,
  badgesAwarded,
}) => {
  const attendedCount = Object.values(attendance).filter(a => a.status === 'attended').length;
  const approvedArtifacts = Object.values(artifactReviews).filter(r => r.decision === 'approved').length;

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Final Summary</h2>
      <p className="text-gray-500 mb-6">Write a brief summary for parents.</p>

      {/* Summary textarea */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session summary for parents (2-3 sentences)
        </label>
        <textarea
          value={summary}
          onChange={(e) => onUpdateSummary(e.target.value)}
          placeholder="Today we worked on... The students showed... A highlight was..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-corp-primary focus:border-corp-primary"
        />
        <p className="mt-1 text-xs text-gray-500">{summary.length}/500 characters</p>
      </div>

      {/* Review checklist */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Review</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon />
            </span>
            <span className="text-gray-700">
              Attendance confirmed ({attendedCount} attended)
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon />
            </span>
            <span className="text-gray-700">
              {Object.keys(artifactReviews).length} artifacts reviewed ({approvedArtifacts} approved)
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon />
            </span>
            <span className="text-gray-700">
              Observations recorded
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${summary.length > 10 ? 'bg-green-100' : 'bg-gray-200'}`}>
              {summary.length > 10 ? <CheckIcon /> : '4'}
            </span>
            <span className={summary.length > 10 ? 'text-gray-700' : 'text-gray-400'}>
              Summary written
            </span>
          </div>
        </div>
      </div>

      {/* Badges awarded */}
      {badgesAwarded.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            🎉 {badgesAwarded.length} badge{badgesAwarded.length > 1 ? 's' : ''} awarded this session
          </h3>
          <div className="space-y-1">
            {badgesAwarded.map((badge, idx) => (
              <p key={idx} className="text-sm text-amber-800">
                • {badge}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Earnings */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">Session earnings</p>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(sessionRate)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600">Added to current pay period</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Wrap-Up Flow Component
// -----------------------------------------------------------------------------

const WrapUpFlow: React.FC<WrapUpFlowProps> = ({
  session,
  pendingArtifacts,
  onComplete,
  onCancel,
  sessionRate,
}) => {
  const [currentStep, setCurrentStep] = useState<WrapUpStep>('attendance');
  const [completedSteps, setCompletedSteps] = useState<WrapUpStep[]>([]);

  // State for each step
  const [attendance, setAttendance] = useState<Record<string, StudentAttendance>>(() => {
    const initial: Record<string, StudentAttendance> = {};
    session.students.forEach(s => {
      initial[s.childId] = { childId: s.childId, status: 'attended' };
    });
    return initial;
  });

  const [artifactReviews, setArtifactReviews] = useState<Record<string, ArtifactReviewAction>>({});
  const [observations, setObservations] = useState<Record<string, StudentObservations>>({});
  const [summary, setSummary] = useState('');

  // Filter artifacts for this session's students
  const sessionArtifacts = useMemo(() => {
    const studentIds = session.students.map(s => s.childId);
    return pendingArtifacts.filter(a => studentIds.includes(a.childId));
  }, [pendingArtifacts, session.students]);

  // Mock badges awarded (in real implementation, this would come from the backend)
  const badgesAwarded = useMemo(() => {
    const approved = Object.values(artifactReviews).filter(r => r.decision === 'approved');
    if (approved.length >= 2) {
      return ['Debug Detective → Jamie T.'];
    }
    return [];
  }, [artifactReviews]);

  // Navigation
  const stepOrder: WrapUpStep[] = ['attendance', 'artifacts', 'observations', 'summary'];
  const currentIdx = stepOrder.indexOf(currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 'attendance':
        return Object.keys(attendance).length === session.students.length;
      case 'artifacts':
        return true; // Can always proceed (artifacts are optional)
      case 'observations':
        return Object.keys(observations).length === session.students.length;
      case 'summary':
        return summary.length >= 10;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (!canProceed()) return;

    setCompletedSteps(prev => [...prev, currentStep]);

    if (currentIdx < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIdx + 1]);
    }
  };

  const goBack = () => {
    if (currentIdx > 0) {
      setCurrentStep(stepOrder[currentIdx - 1]);
    }
  };

  const handleComplete = () => {
    const wrapUp: SessionWrapUp = {
      sessionId: session.id,
      instructorId: 'inst-001', // Would come from auth context
      attendance: Object.values(attendance),
      artifactReviews: Object.values(artifactReviews),
      observations: Object.values(observations),
      summary,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: 'completed',
    };
    onComplete(wrapUp);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-gray-900">Session Wrap-Up</h1>
              <p className="text-sm text-gray-500">
                {session.courseName} • Session {session.sessionNumber}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress */}
        <ProgressStepper currentStep={currentStep} completedSteps={completedSteps} />

        {/* Step content */}
        <div className="mb-8">
          {currentStep === 'attendance' && (
            <AttendanceStep
              students={session.students}
              attendance={attendance}
              onUpdate={(childId, att) => setAttendance(prev => ({ ...prev, [childId]: att }))}
            />
          )}

          {currentStep === 'artifacts' && (
            <ArtifactsStep
              artifacts={sessionArtifacts}
              reviews={artifactReviews}
              onReview={(id, review) => setArtifactReviews(prev => ({ ...prev, [id]: review }))}
              onSkipAll={() => goNext()}
            />
          )}

          {currentStep === 'observations' && (
            <ObservationsStep
              students={session.students.filter(s => attendance[s.childId]?.status === 'attended')}
              observations={observations}
              onUpdate={(childId, obs) => setObservations(prev => ({ ...prev, [childId]: obs }))}
            />
          )}

          {currentStep === 'summary' && (
            <SummaryStep
              session={session}
              summary={summary}
              onUpdateSummary={setSummary}
              attendance={attendance}
              artifactReviews={artifactReviews}
              observations={observations}
              sessionRate={sessionRate}
              badgesAwarded={badgesAwarded}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={currentIdx === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${currentIdx === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <ChevronLeftIcon />
            Back
          </button>

          {currentStep === 'summary' ? (
            <button
              onClick={handleComplete}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                ${canProceed()
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <CheckIcon />
              Complete Session
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                ${canProceed()
                  ? 'bg-corp-primary hover:bg-corp-primary/90 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Continue
              <ChevronRightIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WrapUpFlow;
