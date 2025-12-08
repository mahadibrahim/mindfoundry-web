import React from 'react';
import type { FamilyOverviewData, SessionWithChild } from '../../types/dashboard';
import ChildStatusCard from './ChildStatusCard';
import UpcomingSessionCard from './UpcomingSessionCard';
import RecentFeedbackCard from './RecentFeedbackCard';

interface FamilyOverviewProps {
  data: FamilyOverviewData;
  onViewChild?: (childId: string) => void;
  onJoinSession?: (session: SessionWithChild) => void;
  onViewFeedback?: (feedbackId: string) => void;
  onAddReflection?: (feedbackId: string) => void;
}

const FamilyOverview: React.FC<FamilyOverviewProps> = ({
  data,
  onViewChild,
  onJoinSession,
  onViewFeedback,
  onAddReflection,
}) => {
  const { parent, children, upcomingSessions, recentFeedback } = data;

  // Get greeting based on time of day
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get motivational message based on data
  const getMotivationalMessage = (): string => {
    const totalEnrollments = children.reduce((sum, c) => sum + c.child.activeEnrollments.length, 0);
    const feedbackNeedingReflection = recentFeedback.filter(f => !f.parentReflection).length;

    if (feedbackNeedingReflection > 0) {
      return `You have ${feedbackNeedingReflection} new feedback ${feedbackNeedingReflection === 1 ? 'entry' : 'entries'} to review`;
    }
    if (upcomingSessions.length > 0) {
      const nextSession = upcomingSessions[0];
      const isToday = new Date(nextSession.scheduledAt).toDateString() === new Date().toDateString();
      if (isToday) {
        return `${nextSession.childFirstName} has a session today!`;
      }
    }
    return `Your family is enrolled in ${totalEnrollments} ${totalEnrollments === 1 ? 'course' : 'courses'}`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-8 border border-amber-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {parent.firstName}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              {getMotivationalMessage()}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/dashboard/courses"
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              Browse Courses
            </a>
            <a
              href="/dashboard/sessions"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors shadow-sm"
            >
              View Schedule
            </a>
          </div>
        </div>
      </div>

      {/* Children Overview */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Your Children</h2>
          <a
            href="/dashboard/profile"
            className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
          >
            Manage family
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((childOverview) => (
            <ChildStatusCard
              key={childOverview.child.id}
              childOverview={childOverview}
              onViewChild={onViewChild}
            />
          ))}
          
          {/* Add Child Card */}
          <a
            href="/dashboard/profile/add-child"
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all duration-200 group min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-amber-100 flex items-center justify-center mb-4 transition-colors">
              <PlusIcon className="w-8 h-8 text-gray-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <span className="font-semibold text-gray-500 group-hover:text-amber-700 transition-colors">
              Add a child
            </span>
          </a>
        </div>
      </section>

      {/* Two Column Layout for Sessions and Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
            <a
              href="/dashboard/sessions"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
          
          {upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.slice(0, 4).map((session) => (
                <UpcomingSessionCard
                  key={session.id}
                  session={session}
                  onJoinSession={onJoinSession}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No upcoming sessions</h3>
              <p className="text-gray-500 mb-4">Browse courses to enroll in new sessions</p>
              <a
                href="/dashboard/courses"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
              >
                <SearchIcon className="w-4 h-4" />
                Find Courses
              </a>
            </div>
          )}
        </section>

        {/* Recent Feedback */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Recent Feedback</h2>
            <a
              href="/dashboard/feedback"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
            >
              View journal
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
          
          {recentFeedback.length > 0 ? (
            <div className="space-y-4">
              {recentFeedback.slice(0, 2).map((feedback) => (
                <RecentFeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onViewFeedback={onViewFeedback}
                  onAddReflection={onAddReflection}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <BookIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No feedback yet</h3>
              <p className="text-gray-500">
                Feedback from instructors will appear here after sessions
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            href="/dashboard/courses"
            icon={<SearchIcon className="w-6 h-6" />}
            label="Find Courses"
            description="Browse and enroll"
          />
          <QuickActionButton
            href="/dashboard/messages"
            icon={<MessageIcon className="w-6 h-6" />}
            label="Messages"
            description="Contact instructors"
            badge={data.unreadMessageCount > 0 ? data.unreadMessageCount : undefined}
          />
          <QuickActionButton
            href="/dashboard/billing"
            icon={<CreditCardIcon className="w-6 h-6" />}
            label="Billing"
            description="View invoices"
          />
          <QuickActionButton
            href="/dashboard/profile"
            icon={<UsersIcon className="w-6 h-6" />}
            label="Family Profile"
            description="Manage details"
          />
        </div>
      </section>
    </div>
  );
};

// Quick Action Button Component
interface QuickActionButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  badge?: number;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  href,
  icon,
  label,
  description,
  badge,
}) => (
  <a
    href={href}
    className="relative flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all duration-200 group"
  >
    {badge !== undefined && (
      <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
    <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-amber-100 flex items-center justify-center mb-3 text-gray-500 group-hover:text-amber-600 transition-colors shadow-sm">
      {icon}
    </div>
    <span className="font-semibold text-gray-900 text-sm">{label}</span>
    <span className="text-xs text-gray-500">{description}</span>
  </a>
);

// Icons
const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default FamilyOverview;
