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

        // --- Style Guide Brand Colors ---
        'mf-teal': '#2B9EB3',        // Button/Highlight (primary teal)
        'mf-pink': '#E85A71',        // Important Button/Highlight (coral/pink)
        'mf-navy': '#1B4965',        // Tournament Background (dark navy)
        'mf-blue': '#4A90D9',        // Tournament Background 2 (bright blue)
        'mf-teal-dark': '#2B9EB3',   // League Hero Background
        'mf-mint': '#7FD8D4',        // League Background 2 (mint/aqua)
        'mf-footer': '#0D2B3E',      // Footer dark navy
        'mf-cyan': '#5FCFCF',        // Link color (cyan)

        // --- Corporate Site Colors (Based on "League Color Palette") ---
        corporate: {
          'primary': '#2B9EB3',   // Main teal from style guide
          'secondary': '#7FD8D4', // Mint/aqua from style guide
          'accent': '#E85A71',    // Pink for important CTAs
          'bg-dark': '#0D2B3E',   // Footer navy
          'bg-light': '#4A90D9',  // Bright blue
        },

        // --- Center Site Colors (Based on "Tournament Color Palette") ---
        center: {
          'primary': '#1B4965',   // Tournament navy
          'secondary': '#4A90D9', // Tournament blue
          'accent': '#E85A71',    // Pink for important actions
          'bg-light': '#F5F5F5',  // Light background
        },

        // --- Shorthand aliases for components ---
        'corp-primary': '#2B9EB3',    // Teal
        'corp-secondary': '#7FD8D4',  // Mint
        'corp-accent': '#E85A71',     // Pink/Coral
        'corp-navy': '#1B4965',       // Dark navy
        'corp-dark': '#0D2B3E',       // Footer navy
        'center-primary': '#1B4965',  // Navy
        'center-accent': '#E85A71',   // Pink
        'center-secondary': '#4A90D9', // Blue
        'center-light': '#F5F5F5',    // Light gray
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