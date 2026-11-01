import { describe, expect, it } from "vitest";
import { youtubePlaylist } from "./youtube";

describe("official YouTube playlist embed", () => {
  it("embeds the supplied playlist without a video ID or API key", () => {
    const embed = new URL(youtubePlaylist.embedUrl);
    expect(embed.origin).toBe("https://www.youtube.com");
    expect(embed.pathname).toBe("/embed");
    expect(embed.searchParams.get("listType")).toBe("playlist");
    expect(embed.searchParams.get("list")).toBe("PLP-tan1dbfMQ");
    expect(embed.searchParams.has("key")).toBe(false);
    expect(embed.searchParams.has("enablejsapi")).toBe(false);
  });

  it("opens the same playlist in YouTube and does not autoplay", () => {
    expect(new URL(youtubePlaylist.url).searchParams.get("list")).toBe(youtubePlaylist.id);
    const embed = new URL(youtubePlaylist.embedUrl);
    expect(embed.searchParams.get("playsinline")).toBe("1");
    expect(embed.searchParams.get("autoplay")).toBe("0");
  });
});
