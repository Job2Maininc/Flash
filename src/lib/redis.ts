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
  idleStrikes: (id: string) => `user:${id}:idleStrikes`,
  banNickname: (nick: string) => `ban:nickname:${nick}`,
  online: "stats:online",
  block: (blockerId: string, blockedId: string) =>
    `block:${blockerId}:${blockedId}`,
  blocksOut: (userId: string) => `user:${userId}:blocks:out`,
  blocksIn: (userId: string) => `user:${userId}:blocks:in`,
  report: (id: string) => `report:${id}`,
  reportsOpen: "reports:open",
  lastPartner: (userId: string) => `user:${userId}:lastPartner`,
  heartWallet: (userId: string) => `user:${userId}:hearts`,
  heartLedger: (userId: string) => `user:${userId}:heartLedger`,
  durableMatch: (a: string, b: string) => {
    const [x, y] = [a, b].sort();
    return `dm:${x}:${y}`;
  },
  userDurableMatches: (userId: string) => `user:${userId}:dm`,
  matchMessages: (matchId: string) => `dm:${matchId}:messages`,
  unlockLock: (matchId: string, userId: string) =>
    `dm:${matchId}:unlock:${userId}`,
} as const;
