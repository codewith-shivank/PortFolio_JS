import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow importing files from sibling packages in the monorepo (client/)
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
