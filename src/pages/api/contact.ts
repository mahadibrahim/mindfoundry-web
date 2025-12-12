/**
 * Contact Form API Endpoint
 * Route: /api/contact
 *
 * Handles contact form submissions.
 * Stores data in memory (resets on server restart).
 */

import type { APIRoute } from 'astro';

// In-memory storage
const contactSubmissions: any[] = [];

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'reason', 'message'];
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

    // Create contact submission
    const submission = {
      id: `contact_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // Store in memory
    contactSubmissions.push(submission);

    // Log to console for visibility
    console.log('✅ New contact submission:', {
      id: submission.id,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      reason: data.reason,
      totalSubmissions: contactSubmissions.length
    });

    // Simulate email sending
    console.log('📧 [MOCK] Contact notification sent to support team');
    console.log('📧 [MOCK] Confirmation email sent to:', data.email);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        submissionId: submission.id,
        message: 'Your message has been received. We will respond within 24 hours.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Contact API error:', error);

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

// GET endpoint to view submissions (for debugging)
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      totalSubmissions: contactSubmissions.length,
      submissions: contactSubmissions.map(s => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        reason: s.reason,
        status: s.status,
        createdAt: s.createdAt
      }))
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
