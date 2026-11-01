import { describe, expect, it } from "vitest";
import staticImageLoader from "./static-image-loader";

describe("static image loader", () => {
  it("points local raster images at pre-generated responsive WebP files", () => {
    expect(staticImageLoader({ src: "/images/qabyuyan.png", width: 640 })).toBe("/images/static/qabyuyan-w640.webp");
  });
  it.each(["/images/servisplus-logo.svg", "/images/brands/bosch.webp", "https://i.ytimg.com/vi/example/hqdefault.jpg"])("preserves already optimized/vector/remote artwork: %s", (src) => {
    expect(staticImageLoader({ src, width: 640 })).toBe(src);
  });
});
