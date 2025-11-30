import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // The 'integrations' array tells Astro which external tools to use.
  // We include Tailwind (telling it to use our custom config file) and React.
  integrations: [tailwind({
    // Point the Tailwind integration to the custom configuration file
    config: './tailwind.config.js'
  }), react()],
  
  // Base site configuration
  site: 'https://mindfoundry.com',
  
  // Server configuration
  server: {
    host: true, // Allows access via network IP (useful for local development)
  },
});