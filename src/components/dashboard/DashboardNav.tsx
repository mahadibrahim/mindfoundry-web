import React, { useState } from 'react';
import type { Parent, Child } from '../../types/dashboard';

interface DashboardNavProps {
  parent: Parent;
  currentChildId?: string;
  currentPage: string;
  unreadMessageCount: number;
  onChildSelect?: (childId: string) => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({
  parent,
  currentChildId,
  currentPage,
  unreadMessageCount,
  onChildSelect,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);

  const selectedChild = currentChildId
    ? parent.children.find((c) => c.id === currentChildId)
    : null;

  // Navigation items
  const mainNavItems = [
    { id: 'overview', label: 'Family Overview', href: '/dashboard', icon: HomeIcon },
    { id: 'sessions', label: 'Sessions', href: '/dashboard/sessions', icon: CalendarIcon },
    { id: 'feedback', label: 'Feedback Journal', href: '/dashboard/feedback', icon: BookIcon },
    { id: 'courses', label: 'Find Courses', href: '/dashboard/courses', icon: SearchIcon },
    { 
      id: 'messages', 
      label: 'Messages', 
      href: '/dashboard/messages', 
      icon: MessageIcon,
      badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
    },
  ];

  const accountNavItems = [
    { id: 'profile', label: 'Family Profile', href: '/dashboard/profile', icon: UsersIcon },
    { id: 'billing', label: 'Billing', href: '/dashboard/billing', icon: CreditCardIcon },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/images/mind-foundry-logo.png"
              alt="Mind Foundry"
              className="h-8 w-auto"
            />
            <span className="font-bold text-gray-900">Dashboard</span>
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <a href="/" className="flex items-center gap-3 group">
              <img
                src="/images/mind-foundry-logo.png"
                alt="Mind Foundry"
                className="h-10 w-auto"
              />
              <div>
                <span className="text-lg font-bold text-gray-900 block leading-none group-hover:text-amber-600 transition-colors">
                  Mind Foundry
                </span>
                <span className="text-xs text-amber-600 font-medium leading-none">
                  Parent Dashboard
                </span>
              </div>
            </a>
          </div>

          {/* Child Selector */}
          {parent.children.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Viewing
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {selectedChild ? (
                      <>
                        <img
                          src={selectedChild.photoUrl || `https://ui-avatars.com/api/?name=${selectedChild.firstName}&background=FFC72C&color=1E1E1E`}
                          alt={selectedChild.firstName}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <span className="font-semibold text-gray-900">
                          {selectedChild.firstName}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                          <UsersIcon className="w-4 h-4 text-amber-700" />
                        </div>
                        <span className="font-semibold text-gray-900">All Children</span>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isChildDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isChildDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        onChildSelect?.('');
                        setIsChildDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                        !currentChildId ? 'bg-amber-50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                        <UsersIcon className="w-4 h-4 text-amber-700" />
                      </div>
                      <span className="font-medium text-gray-900">All Children</span>
                    </button>
                    {parent.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          onChildSelect?.(child.id);
                          setIsChildDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                          currentChildId === child.id ? 'bg-amber-50' : ''
                        }`}
                      >
                        <img
                          src={child.photoUrl || `https://ui-avatars.com/api/?name=${child.firstName}&background=FFC72C&color=1E1E1E`}
                          alt={child.firstName}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <span className="font-medium text-gray-900">{child.firstName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`
                          px-2 py-0.5 text-xs font-bold rounded-full
                          ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Account
              </p>
              <ul className="space-y-1">
                {accountNavItems.map((item) => {
                  const isActive = currentPage === item.id;
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
                          ${isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <img
                src={parent.photoUrl || `https://ui-avatars.com/api/?name=${parent.firstName}+${parent.lastName}&background=FF6600&color=FFFFFF`}
                alt={`${parent.firstName} ${parent.lastName}`}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {parent.firstName} {parent.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">{parent.email}</p>
              </div>
              <a
                href="/logout"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogoutIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// -----------------------------------------------------------------------------
// Icons (inline SVG components for simplicity)
// -----------------------------------------------------------------------------

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default DashboardNav;
