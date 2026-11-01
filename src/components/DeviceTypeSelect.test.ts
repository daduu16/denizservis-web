import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DeviceTypeSelect } from "./DeviceTypeSelect";

describe("device type picker", () => {
  const callbacks = { onChange: () => {}, onBlur: () => {} };

  it("starts closed with a placeholder, not a preselected device", () => {
    const html = renderToStaticMarkup(createElement(DeviceTypeSelect, callbacks));
    expect(html).toContain("Cihaz növünü seçin");
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('role="listbox"');
    expect(html).not.toContain("Paltaryuyan");
  });

  it("shows the chosen device without opening the menu", () => {
    const html = renderToStaticMarkup(createElement(DeviceTypeSelect, { ...callbacks, value: "qabyuyan" }));
    expect(html).toContain("Qabyuyan");
    expect(html).not.toContain("Cihaz növünü seçin");
    expect(html).toContain('aria-expanded="false"');
  });

  it("links the validation message to the trigger", () => {
    const html = renderToStaticMarkup(createElement(DeviceTypeSelect, { ...callbacks, error: "Cihaz növünü seçin" }));
    expect(html).toContain('aria-invalid="true"');
    expect(html).toMatch(/aria-describedby="[^"]+-error"/);
    expect(html).toContain('role="alert"');
  });
});
