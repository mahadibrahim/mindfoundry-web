/** @type {import('tailwindcss').Config} */
// Note: This file uses .js extension for use with modern tooling like Astro
export default {
  // Ensure we are scanning all Astro, React, and other files for Tailwind classes
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ----------------------------------
      // 1. BRAND COLORS (Mapped from Style Guide)
      // ----------------------------------
      colors: {
        // Shared Neutrals
        'text-dark': '#1E1E1E', // Large/Medium/Small Header Text
        'text-body': '#3B3B3B', // Body text and small text

        // --- Corporate Site Colors (Based on "League Color Palette") ---
        // Aligns with: "Bright, optimistic, tech-forward"
        corporate: {
          'primary': '#00A896', // Main Hero/Title Background (A vibrant teal)
          'secondary': '#7FFFD4', // A lighter version of the primary (Aqua)
          'bg-dark': '#011F4B', // Dark Background (Deep Navy, often used for Footer)
          'bg-light': '#0097DA', // Background 2 (Bright Blue)
        },

        // --- Center Site Colors (Based on "Tournament Color Palette" & "Warm, welcoming" tone) ---
        // We repurpose the Button/Highlight colors for the Center brand emphasis.
        center: {
          // Assuming 'Button/Highlight' is the primary action color for local conversion
          'primary': '#FFC72C', // Bright Yellow/Gold for "Schedule a Visit"
          'secondary': '#FF6600', // Assuming 'Important Button/Highlight' (A strong Orange for enrollment)
          'bg-light': '#F5F5F5', // General light background for "Cozy, inviting" feel (default white/light grey)
          'accent': '#1E1E1E', // Dark contrast color for text
        }
      },

      // ----------------------------------
      // 2. TYPOGRAPHY (Mapped from Style Guide)
      // ----------------------------------
      fontFamily: {
        // Headers: Quattrocento Bold (using a fallback serif/display font for similar feel)
        'display': ['Quattrocento', 'serif'], 
        
        // Corporate Body: Helvetica (using system font or Inter for modern feel)
        'corp-body': ['Helvetica', 'Arial', 'sans-serif'], 
        
        // Center Body: Cabin Regular (Friendly, approachable feel)
        'center-body': ['Cabin', 'sans-serif'],
      },
      
      // Define a consistent text size scale based on the guide's explicit sizes
      fontSize: {
        // Headings (Quattrocento Bold)
        'h1': ['3.75rem', { lineHeight: '1.2' }], // ~60px
        'h2': ['2.5rem', { lineHeight: '1.3' }],  // ~40px
        'h3': ['1.875rem', { lineHeight: '1.4' }],// ~30px

        // Body Text
        'body-lg': ['1.6875rem', { lineHeight: '1.6' }], // ~27px (Cabin Regular)
        'body-base': ['1.5625rem', { lineHeight: '1.6' }], // ~25px (Helvetica/Buttons)
      }
    },
  },
  plugins: [],
}