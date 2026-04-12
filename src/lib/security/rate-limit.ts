type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

type HitRecord = {
  count: number;
  resetAt: number;
};

const GLOBAL_STORE_KEY = "__charityapp_rate_limit_store__";

function getStore(): Map<string, HitRecord> {
  const globalRef = globalThis as typeof globalThis & {
    [GLOBAL_STORE_KEY]?: Map<string, HitRecord>;
  };

  if (!globalRef[GLOBAL_STORE_KEY]) {
    globalRef[GLOBAL_STORE_KEY] = new Map<string, HitRecord>();
  }

  return globalRef[GLOBAL_STORE_KEY];
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    if (firstIp) {
      return firstIp.trim();
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  return "unknown";
}

function cleanupExpiredEntries(store: Map<string, HitRecord>, now: number) {
  for (const [key, record] of store.entries()) {
    if (record.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(request: Request, scope: string, options: RateLimitOptions) {
  const now = Date.now();
  const store = getStore();
  const ip = getClientIp(request);
  const key = `${scope}:${ip}`;

  cleanupExpiredEntries(store, now);

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (existing.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: true,
    remaining: Math.max(0, options.maxRequests - existing.count),
    resetAt: existing.resetAt,
  };
}