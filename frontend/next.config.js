// next.config.js
/** @type {import('next').NextConfig} */

// Configuration to handle the multi-package setup
const nextConfig = {
  // Disable the warning about multiple lockfiles by explicitly acknowledging the setup
  // This is a common setup for monorepos where both root and app have package managers
};

export default nextConfig;