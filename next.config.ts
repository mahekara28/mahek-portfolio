import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  redirects() {
    return [{ source: "/about", destination: "/", permanent: true }];
  },
};

export default nextConfig;
