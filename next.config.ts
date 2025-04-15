import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...((config.externals as any) || []),
        "prisma",
        "@prisma/client",
      ];
    }
    return config;
  },
};

export default nextConfig;
