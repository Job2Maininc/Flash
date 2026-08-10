import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis(): Redis {
  if (client) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN sont requis",
    );
  }

  client = new Redis({ url, token });
  return client;
}

export const keys = {
  guest: (id: string) => `guest:${id}`,
  waiting: "queue:waiting",
  session: (id: string) => `session:${id}`,
  userSession: (id: string) => `user:${id}:session`,
  userMatches: (id: string) => `user:${id}:matches`,
  matchMeta: (a: string, b: string) => {
    const [x, y] = [a, b].sort();
    return `match:${x}:${y}`;
  },
  pairLock: "lock:pair",
  lastSeen: (id: string) => `user:${id}:lastSeen`,
  inBrowse: (id: string) => `user:${id}:inBrowse`,
  peerSignal: (id: string) => `user:${id}:peerSignal`,
} as const;
