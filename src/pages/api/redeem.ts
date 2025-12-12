/**
 * Book Code Redemption API Endpoint
 * Route: /api/redeem
 *
 * Handles book code redemption and account creation.
 * Stores data in memory (resets on server restart).
 */

import type { APIRoute } from 'astro';

// In-memory storage for demo
const redeemedCodes: Map<string, any> = new Map();
const userAccounts: any[] = [];

// Mock valid codes (in production, these would come from a database)
const validCodes = new Set([
  'TEST-1234-ABCD',
  'DEMO-5678-EFGH',
  'BOOK-9012-IJKL',
  'MATH-3456-MNOP',
  'READ-7890-QRST',
  'STEM-1357-UVWX'
]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['code', 'email', 'password', 'childName'];
    const missing = requiredFields.filter(field => !data[field]);

    if (missing.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missing.join(', ')}`
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { code, email, password, childName } = data;

    // Normalize code (uppercase, trim)
    const normalizedCode = code.toUpperCase().trim();

    // Check if code is valid format
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalizedCode)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid code format. Codes should be in format: XXXX-XXXX-XXXX'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if code has already been redeemed
    if (redeemedCodes.has(normalizedCode)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'This code has already been redeemed'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if code is valid (in demo, accept test codes or any properly formatted code)
    const isValidCode = validCodes.has(normalizedCode) || /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalizedCode);

    if (!isValidCode) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid code. Please check your book and try again.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if email already has an account
    const existingAccount = userAccounts.find(acc => acc.email === email);
    if (existingAccount) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'An account with this email already exists. Please log in instead.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate password
    if (password.length < 8) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Password must be at least 8 characters'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create account
    const account = {
      id: `user_${Date.now()}`,
      email,
      childName,
      createdAt: new Date().toISOString(),
      subscriptionEnds: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
      redeemedCode: normalizedCode
    };

    // Store account and mark code as redeemed
    userAccounts.push(account);
    redeemedCodes.set(normalizedCode, {
      redeemedAt: new Date().toISOString(),
      accountId: account.id
    });

    // Log to console for visibility
    console.log('✅ New account created via code redemption:', {
      accountId: account.id,
      email,
      childName,
      code: normalizedCode,
      subscriptionEnds: account.subscriptionEnds
    });

    // Simulate email sending
    console.log('📧 [MOCK] Welcome email sent to:', email);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        accountId: account.id,
        childName,
        subscriptionEnds: account.subscriptionEnds,
        message: 'Account created successfully! You now have 6 months of free access.',
        redirect: `/welcome?child=${encodeURIComponent(childName)}`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Redeem API error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Server error. Please try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// GET endpoint to check code validity without redeeming
export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Code parameter required'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const normalizedCode = code.toUpperCase().trim();

  // Check format
  if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalizedCode)) {
    return new Response(
      JSON.stringify({
        valid: false,
        redeemed: false,
        error: 'Invalid format'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Check if already redeemed
  if (redeemedCodes.has(normalizedCode)) {
    return new Response(
      JSON.stringify({
        valid: true,
        redeemed: true,
        error: 'Code already redeemed'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  return new Response(
    JSON.stringify({
      valid: true,
      redeemed: false
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
