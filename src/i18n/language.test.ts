import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import en from "./en.json";
import ru from "./ru.json";
import { isLanguage, languages, translate, type Dictionary } from "./language";
import { LanguageProvider, T } from "../components/LanguageProvider";
import { contactConfig } from "../config/contact";
import { dishwasherProblems, dishwasherFaqs, dishwasherCareTips, dishwasherCodeGroups, dishwasherContent } from "../data/dishwasher";
import { washingMachineProblems, washingMachineFaqs, washingMachineCareTips, washingMachineCodeGroups, washingMachineContent } from "../data/washing-machine";
import { benefits, faqs, services } from "../data/content";
import { navigation } from "../config/site";

const normalize = (message: string) => message.trim().replace(/\s+/g, " ").replaceAll(contactConfig.phone, "{phone}");

describe("site languages", () => {
  it("supports only the three requested languages", () => {
    expect(languages.map(({ code }) => code)).toEqual(["az", "ru", "en"]);
    expect(isLanguage("ru")).toBe(true);
    expect(isLanguage("tr")).toBe(false);
    expect(isLanguage(null)).toBe(false);
  });

  it("keeps English and Russian message keys in sync", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(ru).sort());
    for (const dictionary of [en, ru]) for (const value of Object.values(dictionary)) expect(value.trim()).not.toBe("");
  });

  it("keeps Azerbaijani server HTML and stable branding without JavaScript", () => {
    expect(renderToStaticMarkup(createElement(LanguageProvider, null, createElement(T, null, "Usta sifariş et")))).toBe("Usta sifariş et");
    expect(translate("DənizServis", en, contactConfig.phone)).toBe("DənizServis");
    expect(translate("Bosch", ru, contactConfig.phone)).toBe("Bosch");
  });

  it("preserves inline spacing and configurable phone values", () => {
    expect(translate(" və ", en, contactConfig.phone)).toBe(" and ");
    const phone = "+994 70 111 22 33";
    expect(translate(`${phone} nömrəsinə zəng edə və ya WhatsApp vasitəsilə müraciət edə bilərsiniz. Cihazın markasını, modelini, nasazlığını və xidmət tələb olunan ünvanı bildirin.`, ru, phone)).toContain(phone);
    expect(translate("Mətn 600 simvoldan uzun olmamalıdır", en, contactConfig.phone)).toBe("Text must not exceed 600 characters");
  });

  it.each([en, ru])("translates navigation and all service content, not only the header", (dictionary) => {
    const records = [navigation, benefits, faqs, services, dishwasherProblems, dishwasherFaqs, dishwasherCodeGroups, washingMachineProblems, washingMachineFaqs, washingMachineCodeGroups];
    const fields = new Set(["label", "title", "heading", "text", "question", "answer", "shortDescription", "alt", "meaning"]);
    const assertMessage = (message: string) => expect((dictionary as Dictionary)[normalize(message)], message).toBeTruthy();
    const walk = (value: unknown) => {
      if (Array.isArray(value)) { value.forEach(walk); return; }
      if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
        if (fields.has(key) && typeof child === "string") assertMessage(child);
        else if (typeof child === "object") walk(child);
      }
    };
    records.forEach(walk);
    [...dishwasherCareTips, ...washingMachineCareTips, dishwasherContent.title, dishwasherContent.lead, washingMachineContent.title, washingMachineContent.lead].forEach(assertMessage);
  });

  it("has translations for every explicitly marked static text and form placeholder", () => {
    const files = ["Footer", "Hero", "HomeShowcase", "Benefits", "FAQ", "BrandMarquee", "ServiceHero", "Works", "ContactActions", "WhatsAppButton", "DishwasherServicePage", "WashingMachineServicePage", "BookingForm", "DeviceTypeSelect", "YouTubePlaylistGrid", "Analytics", "AnalyticsPreferences"].map((name) => `src/components/${name}.tsx`)
      .concat(["elaqe/page", "haqqimizda/page", "mexfilik/page", "not-found", "layout"].map((name) => `src/app/${name}.tsx`));
    for (const file of files) {
      const source = ts.createSourceFile(file, readFileSync(resolve(file), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const check = (message: string) => {
        const key = normalize(message);
        if (!/[\p{L}]/u.test(key) || key === "DənizServis") return;
        expect((en as Dictionary)[key], `${file}: ${key}`).toBeTruthy();
        expect((ru as Dictionary)[key], `${file}: ${key}`).toBeTruthy();
      };
      const visit = (node: ts.Node) => {
        if (ts.isJsxElement(node) && node.openingElement.tagName.getText(source) === "T") for (const child of node.children) if (ts.isJsxText(child)) check(child.text);
        if (ts.isJsxAttribute(node) && ["placeholder", "label", "text"].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer)) check(node.initializer.text);
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  });
});
