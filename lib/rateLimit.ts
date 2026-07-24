// Simple in-memory rate limiter, keyed by string (e.g. username + IP).
// Resets on server restart/cold start — fine as a speed bump against a kid
// mashing PIN digits, not a substitute for a real rate-limit service if this
// app grows beyond a small family-business scale.

type Bucket = { failures: number; lockedUntil: number };
const buckets = new Map<string, Bucket>();

const MAX_ATTEMPTS = 5;
const LOCK_MS = 5 * 60 * 1000;

export function isLocked(key: string) {
  const bucket = buckets.get(key);
  if (!bucket) return false;
  if (bucket.lockedUntil && bucket.lockedUntil > Date.now()) return true;
  if (bucket.lockedUntil && bucket.lockedUntil <= Date.now()) {
    buckets.delete(key);
  }
  return false;
}

export function recordFailure(key: string) {
  const bucket = buckets.get(key) ?? { failures: 0, lockedUntil: 0 };
  bucket.failures += 1;
  if (bucket.failures >= MAX_ATTEMPTS) {
    bucket.lockedUntil = Date.now() + LOCK_MS;
  }
  buckets.set(key, bucket);
}

export function clearFailures(key: string) {
  buckets.delete(key);
}
