import type { NextConfig } from "next";

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
