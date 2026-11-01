const videoIdPattern = /^[A-Za-z0-9_-]{11}$/;
const youtubeHosts = new Set([
  "youtube.com", "www.youtube.com", "m.youtube.com",
  "youtube-nocookie.com", "www.youtube-nocookie.com",
]);

/** Extract an ID, never an arbitrary iframe URL, from an approved YouTube URL. */
export function getYouTubeId(value: string): string | null {
  const input = value.trim();
  if (videoIdPattern.test(input)) return input;

  try {
    const url = new URL(input);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    let id: string | null = null;

    if (url.hostname === "youtu.be" || url.hostname === "www.youtu.be") {
      id = url.pathname.split("/")[1] || null;
    } else if (youtubeHosts.has(url.hostname)) {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v");
      } else {
        id = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)\/?$/)?.[1] || null;
      }
    }

    return id && videoIdPattern.test(id) ? id : null;
  } catch {
    return null;
  }
}
