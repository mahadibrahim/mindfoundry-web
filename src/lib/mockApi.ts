/**
 * Mock API Utility for Development/Testing
 * 
 * Simulates backend API responses using localStorage.
 * Remove or disable when real backend is ready.
 * 
 * Usage: Import and use like real API calls
 */

// Demo mode flag - set to false when backend is ready
export const DEMO_MODE = true;

// Valid demo codes for testing
const DEMO_CODES = {
  'DEMO-TEST-CODE': { valid: true, used: false, book: 'Math Mastery' },
  'BK7X-M4P2-9QR5': { valid: true, used: false, book: 'Reading Adventures' },
  'TEST-ABCD-1234': { valid: true, used: false, book: 'Science Explorers' },
  'USED-CODE-HERE': { valid: true, used: true, book: 'Already Redeemed' },
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API: Redeem book code and create account
 */
export async function redeemCode(data: {
  code: string;
  email: string;
  password: string;
  childName: string;
}) {
  await delay(1500); // Simulate API call

  const codeInfo = DEMO_CODES[data.code as keyof typeof DEMO_CODES];

  // Validation checks
  if (!codeInfo || !codeInfo.valid) {
    throw new Error('Invalid code');
  }

  if (codeInfo.used) {
    throw new Error('This code has already been activated');
  }

  // Check if email already exists (in demo mode, check localStorage)
  const existingUsers = getDemoUsers();
  if (existingUsers.find((u: any) => u.email === data.email)) {
    throw new Error('An account with this email already exists');
  }

  // Create demo user
  const user = {
    id: `user_${Date.now()}`,
    email: data.email,
    childName: data.childName,
    code: data.code,
    bookTitle: codeInfo.book,
    trialStartDate: new Date().toISOString(),
    trialEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days
    creditsRemaining: 0,
    accountType: 'book_trial',
  };

  // Save to localStorage
  existingUsers.push(user);
  localStorage.setItem('mindfoundry_demo_users', JSON.stringify(existingUsers));
  localStorage.setItem('mindfoundry_current_user', JSON.stringify(user));

  // Mark code as used (in demo mode)
  markCodeAsUsed(data.code);

  return {
    success: true,
    user,
    redirect: `/welcome?child=${encodeURIComponent(data.childName)}`,
  };
}

/**
 * Mock API: Get current user trial status
 */
export async function getTrialStatus() {
  await delay(300);

  const userStr = localStorage.getItem('mindfoundry_current_user');
  if (!userStr) {
    throw new Error('Not logged in');
  }

  const user = JSON.parse(userStr);
  const trialEnd = new Date(user.trialEndDate);
  const now = new Date();
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    active: daysRemaining > 0,
    type: user.accountType,
    expires_at: user.trialEndDate,
    days_remaining: Math.max(0, daysRemaining),
    credits_remaining: user.creditsRemaining,
  };
}

/**
 * Mock API: Check if code is valid
 */
export async function validateCode(code: string) {
  await delay(500);

  const codeInfo = DEMO_CODES[code as keyof typeof DEMO_CODES];
  
  if (!codeInfo) {
    return { valid: false, reason: 'not_found' };
  }

  if (codeInfo.used) {
    return { valid: false, reason: 'already_used' };
  }

  return { valid: true, code: codeInfo };
}

/**
 * Helper: Get demo users from localStorage
 */
function getDemoUsers() {
  const usersStr = localStorage.getItem('mindfoundry_demo_users');
  return usersStr ? JSON.parse(usersStr) : [];
}

/**
 * Helper: Mark code as used
 */
function markCodeAsUsed(code: string) {
  const usedCodes = getUsedCodes();
  usedCodes.push(code);
  localStorage.setItem('mindfoundry_used_codes', JSON.stringify(usedCodes));
}

/**
 * Helper: Get used codes
 */
function getUsedCodes(): string[] {
  const codesStr = localStorage.getItem('mindfoundry_used_codes');
  return codesStr ? JSON.parse(codesStr) : [];
}

/**
 * Helper: Check if code is used
 */
export function isCodeUsed(code: string): boolean {
  return getUsedCodes().includes(code);
}

/**
 * Demo: Get current user (if logged in)
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('mindfoundry_current_user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Demo: Logout
 */
export function logout() {
  localStorage.removeItem('mindfoundry_current_user');
}

/**
 * Demo: Reset all demo data
 */
export function resetDemoData() {
  localStorage.removeItem('mindfoundry_demo_users');
  localStorage.removeItem('mindfoundry_current_user');
  localStorage.removeItem('mindfoundry_used_codes');
  console.log('Demo data reset! Try redeeming a code again.');
}

// Add reset function to window for easy access in console
if (typeof window !== 'undefined') {
  (window as any).resetDemo = resetDemoData;
}
