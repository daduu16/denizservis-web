import type { NextConfig } from "next";

// npm run build prepares static assets and enables export in an isolated copy.
// Direct `next build` is reserved for build:server, which retains the POST API.
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  poweredByHeader: false,
  devIndicators: false,
  images: {
    ...(staticExport ? { loader: "custom" as const, loaderFile: "./src/lib/static-image-loader.ts" } : {}),
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**", search: "" }],
  },
};

export default nextConfig;
