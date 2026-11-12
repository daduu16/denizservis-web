export const BLOG_PAGE_SIZE = 3;

export function paginateBlog<T>(items: readonly T[], requestedPage: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / BLOG_PAGE_SIZE));
  const page = Math.min(pageCount, Math.max(1, Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 1));
  const start = (page - 1) * BLOG_PAGE_SIZE;
  return { page, pageCount, items: items.slice(start, start + BLOG_PAGE_SIZE), first: items.length ? start + 1 : 0, last: Math.min(start + BLOG_PAGE_SIZE, items.length) };
}
