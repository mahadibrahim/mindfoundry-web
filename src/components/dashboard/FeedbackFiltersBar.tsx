import React from 'react';
import type { Child, Course, Capacity } from '../../types/dashboard';

export interface FeedbackFilters {
  childId: string;
  courseId: string;
  capacity: Capacity | '';
  dateRange: 'all' | 'week' | 'month' | 'quarter' | 'year';
  hasReflection: 'all' | 'with' | 'without';
}

interface FeedbackFiltersBarProps {
  filters: FeedbackFilters;
  onFiltersChange: (filters: FeedbackFilters) => void;
  childrenData: Child[];
  courses: Course[];
  unreadCount?: number;
}

const CAPACITY_OPTIONS: { value: Capacity; label: string; emoji: string }[] = [
  { value: 'curiosity', label: 'Curiosity', emoji: '🔍' },
  { value: 'reasoning', label: 'Reasoning', emoji: '🧩' },
  { value: 'expression', label: 'Expression', emoji: '💬' },
  { value: 'focus', label: 'Focus', emoji: '🎯' },
  { value: 'collaboration', label: 'Collaboration', emoji: '🤝' },
  { value: 'adaptability', label: 'Adaptability', emoji: '🌱' },
];

const FeedbackFiltersBar: React.FC<FeedbackFiltersBarProps> = ({
  filters,
  onFiltersChange,
  childrenData,
  courses,
  unreadCount = 0,
}) => {
  const updateFilter = <K extends keyof FeedbackFilters>(key: K, value: FeedbackFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.childId !== '' || 
    filters.courseId !== '' || 
    filters.capacity !== '' || 
    filters.dateRange !== 'all' ||
    filters.hasReflection !== 'all';

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
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Capacity Filter */}
          <div className="relative">
            <select
              value={filters.capacity}
              onChange={(e) => updateFilter('capacity', e.target.value as Capacity | '')}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Capacities</option>
              {CAPACITY_OPTIONS.map((cap) => (
                <option key={cap.value} value={cap.value}>
                  {cap.emoji} {cap.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={filters.dateRange}
              onChange={(e) => updateFilter('dateRange', e.target.value as FeedbackFilters['dateRange'])}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past 3 Months</option>
              <option value="year">Past Year</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Reflection Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
            {(['all', 'without', 'with'] as const).map((option) => (
              <button
                key={option}
                onClick={() => updateFilter('hasReflection', option)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.hasReflection === option
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option === 'all' ? 'All' : option === 'with' ? 'Reflected' : 'Needs Reflection'}
              </button>
            ))}
          </div>
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-amber-700">
              {unreadCount} new
            </span>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
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
              label={courses.find(c => c.id === filters.courseId)?.title || ''}
              onRemove={() => updateFilter('courseId', '')}
            />
          )}
          {filters.capacity && (
            <FilterTag
              label={CAPACITY_OPTIONS.find(c => c.value === filters.capacity)?.label || ''}
              onRemove={() => updateFilter('capacity', '')}
            />
          )}
          {filters.dateRange !== 'all' && (
            <FilterTag
              label={filters.dateRange}
              onRemove={() => updateFilter('dateRange', 'all')}
            />
          )}
          {filters.hasReflection !== 'all' && (
            <FilterTag
              label={filters.hasReflection === 'with' ? 'Has Reflection' : 'Needs Reflection'}
              onRemove={() => updateFilter('hasReflection', 'all')}
            />
          )}
          <button
            onClick={() => onFiltersChange({
              childId: '',
              courseId: '',
              capacity: '',
              dateRange: 'all',
              hasReflection: 'all',
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

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default FeedbackFiltersBar;