/** Freeze the background on iOS as well as desktop, preserving existing styles. */
export type PageScrollPosition = { x: number; y: number };

export function lockPageScroll(position?: PageScrollPosition) {
  const { body, documentElement } = document;
  const x = position?.x ?? window.scrollX;
  const y = position?.y ?? window.scrollY;
  const previous = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
  };
  const previousBehavior = documentElement.style.scrollBehavior;
  Object.assign(body.style, { position: "fixed", top: `${-y}px`, left: "0", right: "0", width: "100%", overflow: "hidden" });
  let released = false;
  return () => {
    if (released) return;
    released = true;
    Object.assign(body.style, previous);
    // A global smooth-scroll rule must not animate the restoration on close.
    documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ left: x, top: y, behavior: "instant" });
    documentElement.style.scrollBehavior = previousBehavior;
  };
}

/** Safari touch blur may have no relatedTarget. That is not an outside click. */
export function focusMovedOutside(container: Pick<Node, "contains">, next: EventTarget | null) {
  return next !== null && next instanceof Node && !container.contains(next);
}
