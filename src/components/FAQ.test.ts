import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FAQ } from "./FAQ";
import { faqs } from "../data/content";
import { dishwasherFaqs } from "../data/dishwasher";
import { washingMachineFaqs } from "../data/washing-machine";

describe("collapsed FAQ defaults", () => {
  it.each([{ items: faqs }, { items: dishwasherFaqs }, { items: washingMachineFaqs }])("keeps all questions closed while retaining answers in server HTML", ({ items }) => {
    const html = renderToStaticMarkup(createElement(FAQ, { items }));
    expect(html.match(/<details\b/g)).toHaveLength(items.length);
    expect(html.match(/<summary\b/g)).toHaveLength(items.length);
    expect(html).not.toMatch(/<details\b[^>]*\bopen(?:\s|=|>)/);
    for (const item of items) {
      expect(html).toContain(item.question);
      expect(html).toContain(item.answer);
    }
  });
});
