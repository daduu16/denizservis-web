import { afterEach, describe, expect, it, vi } from "vitest";
import { focusMovedOutside, lockPageScroll } from "./mobile-menu";

afterEach(() => vi.unstubAllGlobals());

describe("mobile background scroll lock", () => {
  it("freezes a scrolled page and restores its position and existing styles exactly once", () => {
    const previous = { position: "relative", top: "", left: "", right: "", width: "auto", overflow: "clip" };
    const body = { style: { ...previous } };
    const root = { style: { scrollBehavior: "smooth" } };
    const scrollTo = vi.fn(() => {
      expect(body.style).toEqual(previous);
      expect(root.style.scrollBehavior).toBe("auto");
    });
    vi.stubGlobal("document", { body, documentElement: root });
    vi.stubGlobal("window", { scrollX: 0, scrollY: 1680, scrollTo });
    const release = lockPageScroll();
    expect(body.style.position).toBe("fixed");
    expect(body.style.top).toBe("-1680px");
    expect(body.style.overflow).toBe("hidden");
    release();
    release();
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 0, top: 1680, behavior: "instant" });
    expect(root.style.scrollBehavior).toBe("smooth");
  });

  it("uses the pointer-down position even if mounting or focus has already shifted the viewport", () => {
    const body = { style: { position: "", top: "", left: "", right: "", width: "", overflow: "" } };
    const scrollTo = vi.fn();
    vi.stubGlobal("document", { body, documentElement: { style: { scrollBehavior: "" } } });
    vi.stubGlobal("window", { scrollX: 0, scrollY: 0, scrollTo });
    const release = lockPageScroll({ x: 0, y: 1688 });
    expect(body.style.top).toBe("-1688px");
    release();
    expect(scrollTo).toHaveBeenCalledWith({ left: 0, top: 1688, behavior: "instant" });
  });
});

describe("Safari touch focus", () => {
  it("does not treat a null blur target or an internal option as an outside click", () => {
    class TestNode extends EventTarget {}
    vi.stubGlobal("Node", TestNode);
    const inside = new TestNode();
    const outside = new TestNode();
    const container = { contains: vi.fn((target) => target === inside) } as Pick<Node, "contains">;
    expect(focusMovedOutside(container, null)).toBe(false);
    expect(focusMovedOutside(container, inside)).toBe(false);
    expect(focusMovedOutside(container, outside)).toBe(true);
    expect(focusMovedOutside(container, new EventTarget())).toBe(false);
  });
});
