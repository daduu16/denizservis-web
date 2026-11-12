import { describe, expect, it } from "vitest";
import { BLOG_PAGE_SIZE, paginateBlog } from "./blog-pagination";

describe("blog pagination", () => {
  const items = Array.from({ length: 8 }, (_, i) => i + 1);
  it("shows three articles per page without duplicates or omissions", () => {
    expect(BLOG_PAGE_SIZE).toBe(3);
    expect([1, 2, 3].flatMap(page => paginateBlog(items, page).items)).toEqual(items);
    expect(paginateBlog(items, 3)).toEqual({ page: 3, pageCount: 3, items: [7, 8], first: 7, last: 8 });
  });
  it("clamps navigation and a filtered category to available pages", () => {
    expect(paginateBlog(items, -1).page).toBe(1);
    expect(paginateBlog(items, 99).page).toBe(3);
    expect(paginateBlog(items.slice(0, 1), 3)).toEqual({ page: 1, pageCount: 1, items: [1], first: 1, last: 1 });
    expect(paginateBlog(items, NaN).page).toBe(1);
  });
  it("handles an empty list without negative counters", () => {
    expect(paginateBlog([], 2)).toEqual({ page: 1, pageCount: 1, items: [], first: 0, last: 0 });
  });
});
