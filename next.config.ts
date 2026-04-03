import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/quant-dashboard",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
