/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Next.js to import CSS files from the legacy src/ directory.
  // Plain CSS Modules and global CSS are both supported out of the box.
  devIndicators: false,
  // Disable React Strict Mode to prevent double-mounting in dev,
  // which causes SignalR to connect then immediately disconnect on every render.
  reactStrictMode: false,
};

export default nextConfig;
