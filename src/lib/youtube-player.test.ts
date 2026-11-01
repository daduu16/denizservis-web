import { describe, expect, it } from "vitest";
import { isUnavailableVideoError, normalizePlaylistVideoIds } from "./youtube-player";

describe("official playlist player data", () => {
  it("keeps the playlist order and removes duplicate IDs", () => {
    expect(normalizePlaylistVideoIds(["AbCdEf_12-3", "123456789_-", "AbCdEf_12-3"])).toEqual(["AbCdEf_12-3", "123456789_-"]);
  });

  it("rejects malformed IDs and arbitrary URLs", () => {
    expect(normalizePlaylistVideoIds([null, 42, "short", "<script>bad", "https://youtube.com/watch?v=AbCdEf_12-3", "AbCdEf_12-3"])).toEqual(["AbCdEf_12-3"]);
  });

  it.each([undefined, null, {}, "AbCdEf_12-3"])("handles an unavailable playlist queue: %s", (queue) => {
    expect(normalizePlaylistVideoIds(queue)).toEqual([]);
  });

  it.each([100, 101, 150])("omits videos YouTube reports as unavailable: %s", (code) => {
    expect(isUnavailableVideoError(code)).toBe(true);
  });

  it.each([0, 2, 5, 153])("does not mistake client or playback errors for deleted videos: %s", (code) => {
    expect(isUnavailableVideoError(code)).toBe(false);
  });
});
