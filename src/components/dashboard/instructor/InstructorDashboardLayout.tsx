import React, { useState } from 'react';
import type { Instructor, PayPeriod } from '../../../types/instructor';

// Icons (using simple SVG - replace with lucide-react in your project)
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const DollarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type NavSection = 'schedule' | 'wrap-up' | 'artifacts' | 'messages' | 'earnings' | 'profile';

interface InstructorDashboardLayoutProps {
  instructor: Instructor;
  currentPayPeriod: PayPeriod;
  wrapUpCount: number;
  pendingArtifactsCount: number;
  unreadMessageCount: number;
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

// -----------------------------------------------------------------------------
// Navigation Item
// -----------------------------------------------------------------------------

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  section: NavSection;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, section, isActive, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
      ${isActive 
        ? 'bg-corp-primary text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-100'
      }
    `}
  >
    <span className={isActive ? 'text-white' : 'text-gray-400'}>{icon}</span>
    <span className="font-medium flex-1">{label}</span>
    {badge && badge > 0 && (
      <span className={`
        px-2 py-0.5 rounded-full text-xs font-bold
        ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}
      `}>
        {badge}
      </span>
    )}
  </button>
);

// -----------------------------------------------------------------------------
// Main Layout Component
// -----------------------------------------------------------------------------

const InstructorDashboardLayout: React.FC<InstructorDashboardLayoutProps> = ({
  instructor,
  currentPayPeriod,
  wrapUpCount,
  pendingArtifactsCount,
  unreadMessageCount,
  activeSection,
  onNavigate,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const navItems: { section: NavSection; icon: React.ReactNode; label: string; badge?: number }[] = [
    { section: 'schedule', icon: <CalendarIcon />, label: 'Schedule' },
    { section: 'wrap-up', icon: <ClipboardIcon />, label: 'Wrap-Up', badge: wrapUpCount },
    { section: 'artifacts', icon: <DocumentIcon />, label: 'Artifacts', badge: pendingArtifactsCount },
    { section: 'messages', icon: <MessageIcon />, label: 'Messages', badge: unreadMessageCount },
    { section: 'earnings', icon: <DollarIcon />, label: 'Earnings' },
    { section: 'profile', icon: <UserIcon />, label: 'Profile' },
  ];

  const renderNav = (isMobile = false) => (
    <nav className={`space-y-1 ${isMobile ? 'px-4' : ''}`}>
      {navItems.map(item => (
        <NavItem
          key={item.section}
          {...item}
          isActive={activeSection === item.section}
          onClick={() => {
            onNavigate(item.section);
            if (isMobile) setMobileMenuOpen(false);
          }}
        />
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/mind-foundry-logo.png"
              alt="Mind Foundry"
              className="h-8 w-auto"
            />
            <span className="font-bold text-gray-900">Instructor</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <CloseIcon />
              </button>
            </div>
            
            {/* Instructor Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={instructor.photoUrl || `https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&background=011F4B&color=FFFFFF`}
                  alt={instructor.firstName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {instructor.firstName} {instructor.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{instructor.title}</p>
                </div>
              </div>
            </div>

            <div className="py-4">
              {renderNav(true)}
            </div>

            {/* Earnings Preview */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">This Pay Period</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(currentPayPeriod.totalEarned)}
              </p>
              <p className="text-sm text-gray-500">
                {currentPayPeriod.sessionCount} sessions
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
            <img
              src="/images/mind-foundry-logo.png"
              alt="Mind Foundry"
              className="h-8 w-auto"
            />
            <div>
              <span className="font-bold text-gray-900">Mind Foundry</span>
              <p className="text-xs text-gray-500">Instructor Portal</p>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={instructor.photoUrl || `https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&background=011F4B&color=FFFFFF`}
                alt={instructor.firstName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {instructor.firstName} {instructor.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">{instructor.title}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            {renderNav()}
          </div>

          {/* Earnings Preview */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              This Pay Period
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(currentPayPeriod.totalEarned)}
            </p>
            <p className="text-sm text-gray-500">
              {currentPayPeriod.sessionCount} sessions completed
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="max-w-6xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboardLayout;