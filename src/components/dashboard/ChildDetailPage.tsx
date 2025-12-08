import React, { useState } from 'react';
import type { Child, Session, Capacity } from '../../types/dashboard';
import CapacityDetailCard from './CapacityDetailCard';
import BadgeShowcase from './BadgeShowcase';
import EnrollmentProgressCard from './EnrollmentProgressCard';

interface ChildDetailPageProps {
  child: Child;
  allSessions: Session[];
}

type TabId = 'overview' | 'badges' | 'courses' | 'feedback';

const CAPACITY_ORDER: Capacity[] = ['curiosity', 'reasoning', 'expression', 'focus', 'collaboration', 'adaptability'];

const ChildDetailPage: React.FC<ChildDetailPageProps> = ({ child, allSessions }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedCapacity, setSelectedCapacity] = useState<Capacity | null>(null);

  // Handle different property names in mock data
  const enrollments = child.activeEnrollments || (child as any).enrollments || [];
  const badges = child.developmentProfile?.recentBadges || (child as any).badges || [];
  const capacityGrowth = child.developmentProfile?.capacities || (child as any).capacityGrowth || [];
  
  // Calculate age from dateOfBirth
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
  
  const childAge = (child as any).age || calculateAge(child.dateOfBirth);

  // Get sessions for this child
  const childSessions = allSessions.filter(s => 
    enrollments.some(e => e.id === s.enrollmentId)
  );

  // Completed sessions with feedback
  const completedWithFeedback = childSessions.filter(
    s => s.status === 'completed' && s.feedback
  );

  // Upcoming sessions
  const upcomingSessions = childSessions
    .filter(s => s.status === 'scheduled' && new Date(s.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  // Stats
  const totalBadges = badges.length;
  const totalSessions = childSessions.filter(s => s.status === 'completed').length;
  const activeEnrollments = enrollments.filter(e => e.status === 'active').length;

  // Get next session for each enrollment
  const getNextSessionForEnrollment = (enrollmentId: string): Session | undefined => {
    return upcomingSessions.find(s => s.enrollmentId === enrollmentId);
  };

  // Recent feedback (last 5)
  const recentFeedback = completedWithFeedback
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 5);

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'badges', label: 'Badges', count: totalBadges },
    { id: 'courses', label: 'Courses', count: enrollments.length },
    { id: 'feedback', label: 'Feedback', count: completedWithFeedback.length },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <a 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </a>

      {/* Child Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {child.photoUrl ? (
              <img
                src={child.photoUrl}
                alt={child.firstName}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-4 border-amber-100">
                <span className="text-4xl font-bold text-white">
                  {child.firstName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {child.firstName} {child.lastName}
            </h1>
            <p className="text-gray-500 mb-4">
              {childAge} years old • Grade {child.gradeLevel || 'N/A'}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
                <span className="text-lg">🏅</span>
                <span className="text-sm font-semibold text-amber-700">{totalBadges} Badges</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <span className="text-lg">📚</span>
                <span className="text-sm font-semibold text-blue-700">{activeEnrollments} Active Courses</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <span className="text-lg">✅</span>
                <span className="text-sm font-semibold text-green-700">{totalSessions} Sessions Completed</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <a
              href={`/dashboard/sessions?child=${child.id}`}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              View Schedule
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Capacity Growth Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Capacity Growth</h2>
              <p className="text-sm text-gray-500">
                Click a capacity for details
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CAPACITY_ORDER.map((capacity) => {
                const growth = capacityGrowth.find(g => g.capacity === capacity);
                if (!growth) return null;
                return (
                  <CapacityDetailCard
                    key={capacity}
                    capacityGrowth={growth}
                    isSelected={selectedCapacity === capacity}
                    onClick={() => setSelectedCapacity(
                      selectedCapacity === capacity ? null : capacity
                    )}
                  />
                );
              })}
            </div>
          </section>

          {/* Next Up Section */}
          {upcomingSessions.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Coming Up</h2>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-amber-700 font-medium">Next Session</p>
                    <p className="text-lg font-bold text-gray-900">
                      {enrollments.find(e => e.id === upcomingSessions[0].enrollmentId)?.course.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(upcomingSessions[0].scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <a
                    href={`/dashboard/sessions?child=${child.id}`}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-amber-600 font-semibold rounded-xl border border-amber-200 transition-colors"
                  >
                    View All
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Recent Badges Preview */}
          {badges.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Badges</h2>
                <button
                  onClick={() => setActiveTab('badges')}
                  className="text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {badges.slice(0, 6).map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white rounded-xl border border-gray-100 p-3 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <span className="text-xl">🏅</span>
                    </div>
                    <p className="text-xs font-medium text-gray-900 line-clamp-2">{badge.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Feedback Preview */}
          {recentFeedback.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Feedback</h2>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className="text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {recentFeedback.slice(0, 3).map((session) => {
                  const enrollment = enrollments.find(e => e.id === session.enrollmentId);
                  return (
                    <div
                      key={session.id}
                      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            {enrollment?.course.title || 'Course'}
                          </p>
                          <p className="text-sm text-gray-600 italic line-clamp-2">
                            "{session.feedback?.summary}"
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(session.scheduledAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === 'badges' && (
        <BadgeShowcase badges={badges} childName={child.firstName} />
      )}

      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Active Enrollments */}
          {enrollments.filter(e => e.status === 'active').length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments
                  .filter(e => e.status === 'active')
                  .map((enrollment) => (
                    <EnrollmentProgressCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      nextSession={getNextSessionForEnrollment(enrollment.id)}
                      onViewSessions={() => window.location.href = `/dashboard/sessions?child=${child.id}&enrollment=${enrollment.id}`}
                      onViewCourse={() => window.location.href = `/courses/${enrollment.course.id}`}
                    />
                  ))}
              </div>
            </section>
          )}

          {/* Completed Enrollments */}
          {enrollments.filter(e => e.status === 'completed').length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Completed Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments
                  .filter(e => e.status === 'completed')
                  .map((enrollment) => (
                    <EnrollmentProgressCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      onViewSessions={() => window.location.href = `/dashboard/sessions?child=${child.id}&enrollment=${enrollment.id}`}
                      onViewCourse={() => window.location.href = `/courses/${enrollment.course.id}`}
                    />
                  ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {enrollments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Browse our catalog to find the perfect learning experience for {child.firstName}.
              </p>
              <a
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
              >
                Browse Courses
              </a>
            </div>
          )}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {completedWithFeedback.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Feedback will appear here after {child.firstName} completes sessions.
              </p>
            </div>
          ) : (
            completedWithFeedback
              .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
              .map((session) => {
                const enrollment = enrollments.find(e => e.id === session.enrollmentId);
                return (
                  <FeedbackCard
                    key={session.id}
                    session={session}
                    courseName={enrollment?.course.title || 'Course'}
                  />
                );
              })
          )}
        </div>
      )}
    </div>
  );
};

// Feedback Card Component (inline for this page)
const FeedbackCard: React.FC<{
  session: Session;
  courseName: string;
}> = ({ session, courseName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const feedback = session.feedback;
  if (!feedback) return null;

  const CAPACITY_EMOJI: Record<Capacity, string> = {
    curiosity: '🔍',
    reasoning: '🧩',
    expression: '💬',
    focus: '🎯',
    collaboration: '🤝',
    adaptability: '🌱',
  };

  const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
    'strong': { label: 'Strong', color: 'bg-green-100 text-green-700' },
    'growing': { label: 'Growing', color: 'bg-amber-100 text-amber-700' },
    'emerging': { label: 'Emerging', color: 'bg-blue-100 text-blue-700' },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-gray-900">{courseName}</h3>
              <span className="text-xs text-gray-400">
                {new Date(session.scheduledAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <p className="text-sm text-gray-600 italic line-clamp-1">"{feedback.summary}"</p>
          </div>
          <ChevronIcon className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          {/* Instructor */}
          <p className="text-sm text-gray-500 mb-4">
            Feedback from <span className="font-medium text-gray-700">{feedback.instructorName}</span>
          </p>

          {/* Capacity Observations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {feedback.capacityObservations.map((obs, idx) => {
              const levelInfo = LEVEL_CONFIG[obs.level] || LEVEL_CONFIG.growing;
              return (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xl">{CAPACITY_EMOJI[obs.capacity]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 capitalize">{obs.capacity}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelInfo.color}`}>
                        {levelInfo.label}
                      </span>
                    </div>
                    {obs.note && <p className="text-sm text-gray-600">{obs.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlights */}
          {feedback.highlights && feedback.highlights.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Session Highlights</h4>
              <ul className="space-y-1">
                {feedback.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Growth Focus */}
          {feedback.growthFocus && (
            <div className="bg-blue-50 rounded-xl p-3">
              <h4 className="text-sm font-semibold text-blue-700 mb-1">Growth Focus</h4>
              <p className="text-sm text-blue-600">{feedback.growthFocus}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Icons
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default ChildDetailPage;