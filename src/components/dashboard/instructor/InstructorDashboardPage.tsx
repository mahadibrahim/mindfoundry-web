import React, { useState } from 'react';
import InstructorDashboardLayout from './InstructorDashboardLayout';
import ScheduleView from './ScheduleView';
import WrapUpFlow from './WrapUpFlow';
import type { InstructorSession, SessionWrapUp } from '../../../types/instructor';
import { 
  mockInstructorDashboard, 
  mockAllSessions, 
  mockPendingArtifacts,
  RATE_TABLE,
} from '../../../data/mockInstructorData';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type NavSection = 'schedule' | 'wrap-up' | 'artifacts' | 'messages' | 'earnings' | 'profile';
type ViewMode = 'dashboard' | 'wrap-up' | 'session-detail';

interface ViewState {
  mode: ViewMode;
  selectedSession?: InstructorSession;
}

// -----------------------------------------------------------------------------
// Placeholder Components (to be built out)
// -----------------------------------------------------------------------------

const ArtifactsView: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
      📄
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">Artifacts Queue</h2>
    <p className="text-gray-500">
      {mockPendingArtifacts.length} artifacts pending review
    </p>
    <div className="mt-6 space-y-2">
      {mockPendingArtifacts.map(artifact => (
        <div key={artifact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {artifact.type === 'code' ? '💻' : artifact.type === 'image' ? '🖼️' : '📄'}
            </span>
            <div className="text-left">
              <p className="font-medium text-gray-900">{artifact.title}</p>
              <p className="text-sm text-gray-500">From {artifact.childFirstName}</p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-corp-primary text-white text-sm font-medium rounded-lg">
            Review
          </button>
        </div>
      ))}
    </div>
  </div>
);

const MessagesView: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
      💬
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">Messages</h2>
    <p className="text-gray-500">
      2 unread messages from parents
    </p>
    <p className="text-sm text-gray-400 mt-4">
      Full messaging interface coming soon
    </p>
  </div>
);

const EarningsView: React.FC = () => {
  const formatCurrency = (cents: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Earnings</h1>
      <p className="text-gray-500 mb-6">Track your session earnings</p>

      {/* Current Period Card */}
      <div className="bg-gradient-to-br from-corp-primary to-blue-600 rounded-2xl p-6 text-white mb-6">
        <p className="text-sm font-medium text-white/70 mb-1">Current Pay Period</p>
        <p className="text-4xl font-bold mb-2">
          {formatCurrency(mockInstructorDashboard.currentPayPeriod.totalEarned)}
        </p>
        <p className="text-white/80">
          {mockInstructorDashboard.currentPayPeriod.sessionCount} sessions completed
        </p>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-white/70">
            Period: Dec 1 - Dec 15, 2024
          </p>
        </div>
      </div>

      {/* Rate Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Session Rates</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {RATE_TABLE.map(rate => (
            <div key={rate.activity} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-gray-900">
                  {rate.activity.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </p>
                <p className="text-sm text-gray-500">
                  {rate.durationMinutes > 0 ? `${rate.durationMinutes} min` : 'Bonus'}
                  {rate.includesWrapUp && ' (includes wrap-up)'}
                </p>
              </div>
              <p className="font-bold text-gray-900">{formatCurrency(rate.baseRate)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
    
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={mockInstructorDashboard.instructor.photoUrl}
          alt={mockInstructorDashboard.instructor.firstName}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {mockInstructorDashboard.instructor.firstName} {mockInstructorDashboard.instructor.lastName}
          </h2>
          <p className="text-gray-500">{mockInstructorDashboard.instructor.title}</p>
          <p className="text-sm text-gray-400">{mockInstructorDashboard.instructor.email}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
        <p className="text-gray-600">{mockInstructorDashboard.instructor.bio}</p>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Qualifications</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Subjects</p>
          <div className="flex flex-wrap gap-2">
            {mockInstructorDashboard.instructor.qualifications[0]?.subjects.map(subject => (
              <span key={subject} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                {subject}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Delivery Types</p>
          <div className="flex flex-wrap gap-2">
            {mockInstructorDashboard.instructor.qualifications[0]?.deliveryTypes.map(type => (
              <span key={type} className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// Main Dashboard Page
// -----------------------------------------------------------------------------

const InstructorDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>('schedule');
  const [viewState, setViewState] = useState<ViewState>({ mode: 'dashboard' });

  // Get session rate based on format and delivery
  const getSessionRate = (session: InstructorSession): number => {
    const activity = `${session.format === 'group' ? 'group-session' : 'one-on-one'}-${session.delivery === 'online' ? 'online' : 'inperson'}`;
    const rate = RATE_TABLE.find(r => r.activity === activity);
    return rate?.baseRate || 2500;
  };

  // Handlers
  const handleSelectSession = (session: InstructorSession) => {
    setViewState({ mode: 'session-detail', selectedSession: session });
  };

  const handleStartSession = (session: InstructorSession) => {
    if (session.online?.hostRoomUrl) {
      window.open(session.online.hostRoomUrl, '_blank');
    }
  };

  const handleCompleteWrapUp = (session: InstructorSession) => {
    setViewState({ mode: 'wrap-up', selectedSession: session });
  };

  const handleWrapUpComplete = (wrapUp: SessionWrapUp) => {
    console.log('Wrap-up completed:', wrapUp);
    // In real implementation, send to API
    setViewState({ mode: 'dashboard' });
    // Show success toast
    alert(`Session completed! You earned ${(getSessionRate(viewState.selectedSession!) / 100).toFixed(2)}`);
  };

  const handleWrapUpCancel = () => {
    setViewState({ mode: 'dashboard' });
  };

  // Render wrap-up flow if active
  if (viewState.mode === 'wrap-up' && viewState.selectedSession) {
    return (
      <WrapUpFlow
        session={viewState.selectedSession}
        pendingArtifacts={mockPendingArtifacts}
        sessionRate={getSessionRate(viewState.selectedSession)}
        onComplete={handleWrapUpComplete}
        onCancel={handleWrapUpCancel}
      />
    );
  }

  // Render main dashboard
  return (
    <InstructorDashboardLayout
      instructor={mockInstructorDashboard.instructor}
      currentPayPeriod={mockInstructorDashboard.currentPayPeriod}
      wrapUpCount={mockInstructorDashboard.wrapUpPending.length}
      pendingArtifactsCount={mockPendingArtifacts.length}
      unreadMessageCount={mockInstructorDashboard.unreadMessageCount}
      activeSection={activeSection}
      onNavigate={setActiveSection}
    >
      {activeSection === 'schedule' && (
        <ScheduleView
          dashboardData={mockInstructorDashboard}
          allSessions={mockAllSessions}
          onSelectSession={handleSelectSession}
          onStartSession={handleStartSession}
          onCompleteWrapUp={handleCompleteWrapUp}
        />
      )}

      {activeSection === 'wrap-up' && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wrap-Up Queue</h1>
          <p className="text-gray-500 mb-6">Sessions needing wrap-up completion</p>
          
          {mockInstructorDashboard.wrapUpPending.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                ✓
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-gray-500">No sessions need wrap-up right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockInstructorDashboard.wrapUpPending.map(session => (
                <div key={session.id} className="bg-white rounded-xl border border-amber-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.courseName}</h3>
                      <p className="text-sm text-gray-500">
                        {session.students.map(s => s.firstName).join(', ')} • 
                        Session {session.sessionNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCompleteWrapUp(session)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Complete Wrap-Up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'artifacts' && <ArtifactsView />}
      {activeSection === 'messages' && <MessagesView />}
      {activeSection === 'earnings' && <EarningsView />}
      {activeSection === 'profile' && <ProfileView />}
    </InstructorDashboardLayout>
  );
};

export default InstructorDashboardPage;