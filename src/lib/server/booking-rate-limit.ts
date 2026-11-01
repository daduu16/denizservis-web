// Best-effort per-isolate limits, not a globally durable quota. No database.
export function createBookingRateLimit(now: () => number = Date.now) {
  const entries = new Map<string, { count: number; resetAt: number }>();
  const windowMs = 10 * 60 * 1000;
  const maxEntries = 10_000;
  let total = { count: 0, resetAt: 0 };

  return (ip: string) => {
    const time = now();
    if (total.resetAt <= time) {
      total = { count: 0, resetAt: time + windowMs };
      for (const [key, value] of entries) if (value.resetAt <= time) entries.delete(key);
    }
    const current = entries.get(ip);
    if (total.count >= 50 || (current && current.resetAt > time && current.count >= 5)) {
      return { allowed: false, retryAfter: Math.max(1, Math.ceil(((total.count >= 50 ? total.resetAt : current!.resetAt) - time) / 1000)) };
    }
    if (!current || current.resetAt <= time) {
      if (!current && entries.size >= maxEntries) return { allowed: false, retryAfter: 600 };
      entries.set(ip, { count: 1, resetAt: time + windowMs });
    } else current.count++;
    total.count++;
    return { allowed: true, retryAfter: 0 };
  };
}
