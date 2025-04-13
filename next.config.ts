import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // https://apod.nasa.gov adding to dallows domains
  images: {
    domains: ["apod.nasa.gov"],
  },
};

export default nextConfig;
