import type { ImageLoaderProps } from "next/image";

/** Static builds generate these responsive WebPs before Next renders the HTML. */
export default function staticImageLoader({ src, width }: ImageLoaderProps) {
  const match = src.match(/^\/images\/([^/]+)\.(?:png|jpe?g|webp)$/i);
  return match ? `/images/static/${encodeURIComponent(match[1])}-w${width}.webp` : src;
}
