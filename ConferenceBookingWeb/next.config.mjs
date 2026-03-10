/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Disable React Strict Mode to prevent double-mounting in dev,
  // which causes SignalR to connect then immediately disconnect on every render.
  reactStrictMode: false,
};

export default nextConfig;
