/**
 * Mock Waitlist API Endpoint
 * Route: /api/waitlist
 * 
 * For testing the centers flow without database.
 * Stores data in memory (resets on server restart).
 * 
 * Usage: Drop this file in /src/pages/api/waitlist.ts
 */

import type { APIRoute } from 'astro';

// In-memory storage (resets on server restart)
const waitlistEntries: any[] = [];
const cityDemand: Map<string, number> = new Map();

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'city', 'state', 'zip', 'childAge'];
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
    
    // Check for duplicate email
    const existingEntry = waitlistEntries.find(entry => entry.email === data.email);
    if (existingEntry) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'This email is already on the waitlist'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create waitlist entry
    const entry = {
      id: `wl_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // Store in memory
    waitlistEntries.push(entry);
    
    // Update city demand counter
    const cityKey = `${data.city}, ${data.state}`;
    const currentCount = cityDemand.get(cityKey) || 0;
    cityDemand.set(cityKey, currentCount + 1);
    
    // Log to console for visibility
    console.log('✅ New waitlist entry:', {
      id: entry.id,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      location: cityKey,
      totalEntries: waitlistEntries.length,
      cityRequests: cityDemand.get(cityKey)
    });
    
    // Simulate email sending
    console.log('📧 [MOCK] Confirmation email sent to:', data.email);
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        waitlistId: entry.id,
        location: {
          city: data.city,
          state: data.state,
          totalRequests: cityDemand.get(cityKey)
        },
        redirect: `/waitlist/confirmation?city=${encodeURIComponent(data.city)}`
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('❌ Waitlist API error:', error);
    
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

// Optional: GET endpoint to view all entries (for debugging)
export const GET: APIRoute = async () => {
  // Convert cityDemand Map to array for response
  const topCities = Array.from(cityDemand.entries())
    .map(([location, requests]) => {
      const [city, state] = location.split(', ');
      return { city, state, requests };
    })
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10);
  
  return new Response(
    JSON.stringify({
      totalEntries: waitlistEntries.length,
      totalCities: cityDemand.size,
      topCities,
      allEntries: waitlistEntries.map(entry => ({
        id: entry.id,
        name: `${entry.firstName} ${entry.lastName}`,
        email: entry.email,
        city: entry.city,
        state: entry.state,
        childAge: entry.childAge,
        createdAt: entry.createdAt
      }))
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
