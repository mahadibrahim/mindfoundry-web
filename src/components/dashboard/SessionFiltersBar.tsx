import React from 'react';
import type { Child, Course } from '../../types/dashboard';

export type SessionFilterStatus = 'all' | 'upcoming' | 'completed' | 'cancelled';
export type SessionFilterDelivery = 'all' | 'online' | 'in-person';

export interface SessionFilters {
  childId: string;
  courseId: string;
  status: SessionFilterStatus;
  delivery: SessionFilterDelivery;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'past';
}

interface SessionFiltersBarProps {
  filters: SessionFilters;
  onFiltersChange: (filters: SessionFilters) => void;
  childrenData: Child[];
  courses: Course[];
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
}

const SessionFiltersBar: React.FC<SessionFiltersBarProps> = ({
  filters,
  onFiltersChange,
  childrenData,
  courses,
  viewMode,
  onViewModeChange,
}) => {
  const updateFilter = <K extends keyof SessionFilters>(key: K, value: SessionFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Get unique courses from children's enrollments
  const availableCourses = courses.length > 0 
    ? courses 
    : childrenData.flatMap(c => c.activeEnrollments.map(e => e.course));
  
  const uniqueCourses = Array.from(
    new Map(availableCourses.map(c => [c.id, c])).values()
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Child Filter */}
          <div className="relative">
            <select
              value={filters.childId}
              onChange={(e) => updateFilter('childId', e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Children</option>
              {childrenData.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Course Filter */}
          <div className="relative">
            <select
              value={filters.courseId}
              onChange={(e) => updateFilter('courseId', e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={filters.dateRange}
              onChange={(e) => updateFilter('dateRange', e.target.value as SessionFilters['dateRange'])}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="past">Past Sessions</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
            {(['all', 'upcoming', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => updateFilter('status', status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.status === status
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Delivery Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
            {(['all', 'online', 'in-person'] as const).map((delivery) => (
              <button
                key={delivery}
                onClick={() => updateFilter('delivery', delivery)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  filters.delivery === delivery
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {delivery === 'online' && <VideoIcon className="w-3.5 h-3.5" />}
                {delivery === 'in-person' && <MapPinIcon className="w-3.5 h-3.5" />}
                {delivery === 'all' ? 'All' : delivery === 'in-person' ? 'In-Person' : 'Online'}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="List view"
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('calendar')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Calendar view"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.childId || filters.courseId || filters.status !== 'all' || filters.delivery !== 'all' || filters.dateRange !== 'all') && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Active filters:</span>
          {filters.childId && (
            <FilterTag
              label={childrenData.find(c => c.id === filters.childId)?.firstName || ''}
              onRemove={() => updateFilter('childId', '')}
            />
          )}
          {filters.courseId && (
            <FilterTag
              label={uniqueCourses.find(c => c.id === filters.courseId)?.title || ''}
              onRemove={() => updateFilter('courseId', '')}
            />
          )}
          {filters.status !== 'all' && (
            <FilterTag
              label={filters.status}
              onRemove={() => updateFilter('status', 'all')}
            />
          )}
          {filters.delivery !== 'all' && (
            <FilterTag
              label={filters.delivery}
              onRemove={() => updateFilter('delivery', 'all')}
            />
          )}
          {filters.dateRange !== 'all' && (
            <FilterTag
              label={filters.dateRange}
              onRemove={() => updateFilter('dateRange', 'all')}
            />
          )}
          <button
            onClick={() => onFiltersChange({
              childId: '',
              courseId: '',
              status: 'all',
              delivery: 'all',
              dateRange: 'all',
            })}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

// Filter Tag Component
const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
    {label}
    <button onClick={onRemove} className="hover:text-amber-900">
      <XIcon className="w-3 h-3" />
    </button>
  </span>
);

// Icons
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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

const ListIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default SessionFiltersBar;