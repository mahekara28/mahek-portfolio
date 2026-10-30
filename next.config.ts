import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  redirects() {
    return [
      { source: "/about", destination: "/", permanent: true },
      { source: "/blog/working-context", destination: "/blog/context-relay", permanent: true },
      ...["decision-assumptions", "inference-latency", "verify-the-result", "llm-routing"].map(slug => ({
        source: `/blog/${slug}`, destination: "/blog", permanent: false,
      })),
    ];
  },
};

export default nextConfig;
