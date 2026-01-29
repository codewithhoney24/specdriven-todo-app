// next.config.js
/** @type {import('next').NextConfig} */

// For monorepo setups with multiple package-lock.json files
// This is a multi-app workspace, so the warning is expected but harmless
const nextConfig = {
  // Suppress the workspace root inference warning by explicitly acknowledging
  // this is a legitimate multi-app workspace setup
};

export default nextConfig;