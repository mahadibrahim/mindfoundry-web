import React, { useState } from 'react';
import type { ThreadType, ComposeMessageInput } from '../../types/messaging';
import type { Child, Enrollment } from '../../types/dashboard';

interface ComposeMessageProps {
  children: Child[];
  onSend: (input: ComposeMessageInput) => void;
  onCancel: () => void;
}

interface MessageTypeOption {
  type: ThreadType;
  icon: string;
  label: string;
  description: string;
  recipientLabel: string;
}

const MESSAGE_TYPES: MessageTypeOption[] = [
  {
    type: 'course',
    icon: '📚',
    label: 'Course Question',
    description: 'Ask about curriculum, homework, or progress',
    recipientLabel: 'Goes to instructor',
  },
  {
    type: 'schedule',
    icon: '📅',
    label: 'Scheduling',
    description: 'Reschedule, cancel, or makeup requests',
    recipientLabel: 'Goes to center director',
  },
  {
    type: 'billing',
    icon: '💳',
    label: 'Billing & Payments',
    description: 'Invoices, payments, or refund questions',
    recipientLabel: 'Goes to support team',
  },
  {
    type: 'general',
    icon: '💬',
    label: 'General Question',
    description: 'Programs, enrollment, or center info',
    recipientLabel: 'Goes to center director',
  },
  {
    type: 'support',
    icon: '🔧',
    label: 'Technical Support',
    description: 'App issues, login problems, online class help',
    recipientLabel: 'Goes to support team',
  },
];

const ComposeMessage: React.FC<ComposeMessageProps> = ({
  children,
  onSend,
  onCancel,
}) => {
  const [step, setStep] = useState<'type' | 'context' | 'compose'>('type');
  const [selectedType, setSelectedType] = useState<ThreadType | null>(null);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const selectedTypeConfig = MESSAGE_TYPES.find(t => t.type === selectedType);
  const requiresCourseSelection = selectedType === 'course';

  // Get all enrollments across children
  const getEnrollmentsForChild = (childId: string): Enrollment[] => {
    const child = children.find(c => c.id === childId);
    return child?.activeEnrollments || [];
  };

  const selectedEnrollments = selectedChild ? getEnrollmentsForChild(selectedChild) : [];
  const selectedEnrollment = selectedEnrollments.find(e => e.id === selectedCourse);

  const handleTypeSelect = (type: ThreadType) => {
    setSelectedType(type);
    if (type === 'course') {
      setStep('context');
    } else {
      setStep('compose');
    }
  };

  const handleContextNext = () => {
    if (requiresCourseSelection && (!selectedChild || !selectedCourse)) return;
    setStep('compose');
  };

  const handleSend = () => {
    if (!selectedType || !content.trim()) return;

    const input: ComposeMessageInput = {
      threadType: selectedType,
      content: content.trim(),
      subject: subject.trim() || undefined,
    };

    if (requiresCourseSelection && selectedEnrollment) {
      input.courseId = selectedEnrollment.course.id;
      input.childId = selectedChild;
    }

    onSend(input);
  };

  const getRecipientPreview = (): string => {
    if (selectedType === 'course' && selectedEnrollment) {
      return `${selectedEnrollment.course.instructor.firstName} ${selectedEnrollment.course.instructor.lastName}`;
    }
    return selectedTypeConfig?.recipientLabel.replace('Goes to ', '') || '';
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step !== 'type' && (
              <button
                onClick={() => setStep(step === 'compose' && requiresCourseSelection ? 'context' : 'type')}
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'type' && 'New Message'}
              {step === 'context' && 'Select Course'}
              {step === 'compose' && 'Compose'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-4">
          <div className={`h-1 flex-1 rounded-full ${step === 'type' ? 'bg-amber-500' : 'bg-amber-500'}`} />
          <div className={`h-1 flex-1 rounded-full ${step === 'context' || step === 'compose' ? 'bg-amber-500' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step === 'compose' ? 'bg-amber-500' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Select Type */}
        {step === 'type' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              What would you like help with?
            </p>
            {MESSAGE_TYPES.map((option) => (
              <button
                key={option.type}
                onClick={() => handleTypeSelect(option.type)}
                className="w-full p-4 bg-gray-50 hover:bg-amber-50 border-2 border-transparent hover:border-amber-200 rounded-xl text-left transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-700">
                        {option.label}
                      </h3>
                      <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-500" />
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {option.description}
                    </p>
                    <p className="text-xs text-amber-600 font-medium mt-1">
                      {option.recipientLabel}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Course Context (for course questions only) */}
        {step === 'context' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Which course is this about?
            </p>

            {/* Child Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Child
              </label>
              <div className="grid grid-cols-2 gap-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => {
                      setSelectedChild(child.id);
                      setSelectedCourse('');
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedChild === child.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {child.photoUrl ? (
                        <img src={child.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-amber-700 font-semibold text-sm">
                            {child.firstName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{child.firstName}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Selection */}
            {selectedChild && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                {selectedEnrollments.length === 0 ? (
                  <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-xl">
                    No active courses for {children.find(c => c.id === selectedChild)?.firstName}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedEnrollments.map((enrollment) => (
                      <button
                        key={enrollment.id}
                        onClick={() => setSelectedCourse(enrollment.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          selectedCourse === enrollment.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-900">
                          {enrollment.course.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-0.5">
                          with {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleContextNext}
              disabled={!selectedChild || !selectedCourse}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                selectedChild && selectedCourse
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Compose Message */}
        {step === 'compose' && (
          <div className="space-y-4">
            {/* Recipient Preview */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedTypeConfig?.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    To: {getRecipientPreview()}
                  </p>
                  {selectedEnrollment && (
                    <p className="text-xs text-gray-500">
                      Re: {selectedEnrollment.course.title} ({children.find(c => c.id === selectedChild)?.firstName})
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Subject (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your question"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!content.trim()}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                content.trim()
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <SendIcon className="w-5 h-5" />
              Send Message
            </button>

            {/* Response Time Notice */}
            <p className="text-xs text-gray-400 text-center">
              {selectedType === 'course' && 'Instructors typically respond within 24 hours'}
              {selectedType === 'schedule' && 'Scheduling requests are handled within 1 business day'}
              {selectedType === 'billing' && "We'll get back to you within 1-2 business days"}
              {selectedType === 'general' && 'Expect a response within 1-2 business days'}
              {selectedType === 'support' && 'Support typically responds within a few hours'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default ComposeMessage;