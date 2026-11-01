import { describe, expect, it } from "vitest";
import { getYouTubeId } from "./youtube";

const id = "AbCdEf_12-3";

describe("getYouTubeId", () => {
  it.each([
    id,
    `https://www.youtube.com/watch?v=${id}&t=12`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}?si=share`,
    `https://www.youtube.com/shorts/${id}`,
    `https://youtube.com/shorts/${id}/`,
    `https://www.youtube.com/live/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
  ])("extracts an ID from %s", (value) => {
    expect(getYouTubeId(value)).toBe(id);
  });

  it.each([
    "",
    "not-a-video-url",
    `https://evil.example/watch?v=${id}`,
    `https://youtube.com.evil.example/watch?v=${id}`,
    `https://youtube.com@evil.example/watch?v=${id}`,
    `javascript:alert('${id}')`,
    `ftp://youtube.com/watch?v=${id}`,
    "https://youtube.com/watch?v=short",
    `https://youtube.com/channel/${id}`,
    "https://youtube.com/watch?v=%3Cscript%3E",
  ])("rejects untrusted or malformed values: %s", (value) => {
    expect(getYouTubeId(value)).toBeNull();
  });
});
