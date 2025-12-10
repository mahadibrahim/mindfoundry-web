import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // The 'integrations' array tells Astro which external tools to use.
  // We include Tailwind (telling it to use our custom config file) and React.
  integrations: [
    tailwind({
      // Point the Tailwind integration to the custom configuration file
      config: './tailwind.config.js'
    }), 
    react()
  ],
  
  // Base site configuration
  site: 'https://mindfoundry.com',
  
  // Server mode: Pages are server-rendered by default
  // Static pages can opt-in with `export const prerender = true`
  // Dynamic pages use `export const prerender = false`
  output: 'server',
  
  // Use Netlify adapter for deployment
  adapter: netlify(),
  
  // Server configuration
  server: {
    host: true, // Allows access via network IP (useful for local development)
  },
});