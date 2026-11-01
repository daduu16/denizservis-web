import { describe, expect, it } from "vitest";
import { analyticsContext, eventForLink, validAnalyticsId } from "./analytics";

describe("privacy-first analytics", () => {
  it("is opt-in and accepts only a well formed public measurement ID", () => {
    expect(validAnalyticsId(undefined)).toBeNull();
    expect(validAnalyticsId("G-ABC1234567")).toBe("G-ABC1234567");
    for (const id of ["", "API-SECRET", "G-<script>", "UA-1234567"]) expect(validAnalyticsId(id)).toBeNull();
  });
  it("drops query, fragment, arbitrary page paths and user values", () => {
    expect(analyticsContext("/elaqe?phone=123#message")).toEqual({ page_location: "https://denizservis.az/elaqe", page_referrer: "", service: "general" });
    expect(analyticsContext("/someone-private-name")).toBeNull();
    expect(analyticsContext("/xidmetler/paltaryuyan-temiri")?.service).toBe("washing_machine");
    expect(analyticsContext("/xidmetler/qabyuyan-temiri")?.service).toBe("dishwasher");
  });
  it("classifies links without including their phone or text in payloads", () => {
    expect(eventForLink("tel:+994705522021", "/")).toBe("phone_click");
    expect(eventForLink("https://wa.me/994705522021?text=private", "/")).toBe("whatsapp_click");
    expect(eventForLink("https://www.youtube.com/playlist?list=PLP-tan1dbfMQ", "/")).toBe("youtube_open");
    expect(eventForLink("#sifaris", "/xidmetler/paltaryuyan-temiri")).toBe("service_cta_click");
    expect(eventForLink("https://example.com", "/")).toBeNull();
  });
});
