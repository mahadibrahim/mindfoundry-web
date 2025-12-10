/**
 * Mock Visit Request API Endpoint
 * Route: /api/visit-request
 * 
 * For testing the VisitRequestForm component without database.
 * Stores data in memory (resets on server restart).
 * 
 * Usage: Drop this file in /src/pages/api/visit-request.ts
 */

import type { APIRoute } from 'astro';

// In-memory storage
const visitRequests: any[] = [];

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['center', 'firstName', 'lastName', 'email', 'phone', 'date', 'time', 'childAge'];
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
    
    // Validate date is in the future
    const requestedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (requestedDate < today) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Visit date must be in the future'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create visit request
    const visit = {
      id: `visit_${Date.now()}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Store in memory
    visitRequests.push(visit);
    
    // Log to console for visibility
    console.log('✅ New visit request:', {
      id: visit.id,
      center: data.centerName || data.center,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      date: data.date,
      time: data.time,
      totalRequests: visitRequests.length
    });
    
    // Simulate email sending
    console.log('📧 [MOCK] Visit confirmation email sent to:', data.email);
    console.log('📧 [MOCK] Staff notification sent for center:', data.center);
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        visitId: visit.id,
        confirmationSent: true,
        redirect: `/centers/${data.center}/visit-requested`
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('❌ Visit request API error:', error);
    
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

// Optional: GET endpoint to view all visit requests (for debugging)
export const GET: APIRoute = async () => {
  // Group by center
  const byCenter: Record<string, number> = {};
  visitRequests.forEach(visit => {
    byCenter[visit.center] = (byCenter[visit.center] || 0) + 1;
  });
  
  return new Response(
    JSON.stringify({
      totalRequests: visitRequests.length,
      byCenter,
      allRequests: visitRequests.map(visit => ({
        id: visit.id,
        center: visit.center,
        name: `${visit.firstName} ${visit.lastName}`,
        email: visit.email,
        date: visit.date,
        time: visit.time,
        status: visit.status,
        createdAt: visit.createdAt
      }))
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
