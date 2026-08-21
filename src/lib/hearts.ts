import { randomUUID } from "crypto";
import { getRedis, keys } from "./redis";
import {
  FIRST_MESSAGE_FREE,
  HEARTS_TO_UNLOCK_MATCH,
  MAX_MESSAGE_LENGTH,
} from "./constants";
import { orderedPair } from "./safety";

const MATCH_TTL_SEC = 60 * 60 * 24 * 90;
const WALLET_TTL_SEC = 60 * 60 * 24 * 365;

export type DurableMatch = {
  id: string;
  aId: string;
  bId: string;
  createdAt: number;
  closedAt: number | null;
  closedReason: string | null;
  unlockedBy: string | null;
  freeMessagesRemaining: number;
};

export type HeartLedgerEntry = {
  id: string;
  userId: string;
  delta: number;
  balanceAfter: number;
  reason: string;
  matchId: string | null;
  createdAt: number;
};

export type MatchMessage = {
  id: string;
  matchId: string;
  senderId: string;
  body: string;
  createdAt: number;
};

async function getWalletBalance(userId: string): Promise<number> {
  const redis = getRedis();
  const raw = await redis.get<number | string>(keys.heartWallet(userId));
  if (raw == null) return 0;
  const n = typeof raw === "string" ? Number(raw) : raw;
  return Number.isFinite(n) ? n : 0;
}

/** Append-only credit/debit. Only call from trusted server paths (webhooks, refunds). */
export async function creditHearts(
  userId: string,
  delta: number,
  reason: string,
  matchId: string | null = null,
): Promise<number> {
  const redis = getRedis();
  const before = await getWalletBalance(userId);
  const after = Math.max(0, before + delta);
  await redis.set(keys.heartWallet(userId), after, { ex: WALLET_TTL_SEC });
  const entry: HeartLedgerEntry = {
    id: randomUUID(),
    userId,
    delta,
    balanceAfter: after,
    reason,
    matchId,
    createdAt: Date.now(),
  };
  await redis.lpush(keys.heartLedger(userId), entry);
  await redis.ltrim(keys.heartLedger(userId), 0, 199);
  await redis.expire(keys.heartLedger(userId), WALLET_TTL_SEC);
  return after;
}

export async function getHeartBalance(userId: string): Promise<number> {
  return getWalletBalance(userId);
}

/** Create durable match on mutual like — exactly one row per pair (aId < bId). */
export async function ensureDurableMatch(
  userA: string,
  userB: string,
): Promise<DurableMatch> {
  const [aId, bId] = orderedPair(userA, userB);
  const redis = getRedis();
  const key = keys.durableMatch(aId, bId);
  const existing = await redis.get<DurableMatch>(key);
  if (existing && !existing.closedAt) return existing;

  const match: DurableMatch = {
    id: `${aId}:${bId}`,
    aId,
    bId,
    createdAt: Date.now(),
    closedAt: null,
    closedReason: null,
    unlockedBy: null,
    freeMessagesRemaining: FIRST_MESSAGE_FREE ? 1 : 0,
  };
  await redis.set(key, match, { ex: MATCH_TTL_SEC });
  await redis.sadd(keys.userDurableMatches(aId), match.id);
  await redis.sadd(keys.userDurableMatches(bId), match.id);
  await redis.expire(keys.userDurableMatches(aId), MATCH_TTL_SEC);
  await redis.expire(keys.userDurableMatches(bId), MATCH_TTL_SEC);
  return match;
}

export async function getDurableMatch(
  matchId: string,
): Promise<DurableMatch | null> {
  const [aId, bId] = matchId.split(":");
  if (!aId || !bId) return null;
  const redis = getRedis();
  return redis.get<DurableMatch>(keys.durableMatch(aId, bId));
}

export async function listDurableMatches(
  userId: string,
): Promise<DurableMatch[]> {
  const redis = getRedis();
  const ids = await redis.smembers(keys.userDurableMatches(userId));
  if (!ids?.length) return [];
  const matches: DurableMatch[] = [];
  for (const id of ids) {
    const m = await getDurableMatch(id);
    if (m && !m.closedAt) matches.push(m);
  }
  matches.sort((a, b) => b.createdAt - a.createdAt);
  return matches;
}

export async function closeMatchBetween(
  a: string,
  b: string,
  reason: string,
): Promise<void> {
  const [aId, bId] = orderedPair(a, b);
  const redis = getRedis();
  const key = keys.durableMatch(aId, bId);
  const match = await redis.get<DurableMatch>(key);
  if (!match || match.closedAt) return;
  match.closedAt = Date.now();
  match.closedReason = reason;
  await redis.set(key, match, { ex: MATCH_TTL_SEC });

  if (match.unlockedBy && reason === "blocked") {
    await creditHearts(
      match.unlockedBy,
      HEARTS_TO_UNLOCK_MATCH,
      "refund_closed_match",
      match.id,
    );
  }
}

/**
 * Unlock messaging for a match. Atomic-ish via lock key.
 * Returns 402 semantics via thrown code when balance insufficient.
 */
export async function unlockMatch(
  userId: string,
  matchId: string,
): Promise<DurableMatch> {
  const match = await getDurableMatch(matchId);
  if (!match) throw new Error("NOT_FOUND");
  if (match.closedAt) throw new Error("GONE");
  if (match.aId !== userId && match.bId !== userId) throw new Error("FORBIDDEN");
  if (match.unlockedBy) return match;

  const redis = getRedis();
  const lockKey = keys.unlockLock(matchId, "global");
  const locked = await redis.set(lockKey, userId, { nx: true, px: 5000 });
  if (locked !== "OK") {
    const again = await getDurableMatch(matchId);
    if (again?.unlockedBy) return again;
    throw new Error("CONFLICT");
  }

  try {
    const current = await getDurableMatch(matchId);
    if (!current) throw new Error("NOT_FOUND");
    if (current.closedAt) throw new Error("GONE");
    if (current.unlockedBy) return current;

    const balance = await getWalletBalance(userId);
    if (balance < HEARTS_TO_UNLOCK_MATCH) {
      throw new Error("PAYMENT_REQUIRED");
    }

    await creditHearts(
      userId,
      -HEARTS_TO_UNLOCK_MATCH,
      "unlock_match",
      matchId,
    );
    current.unlockedBy = userId;
    await redis.set(keys.durableMatch(current.aId, current.bId), current, {
      ex: MATCH_TTL_SEC,
    });
    return current;
  } finally {
    await redis.del(lockKey);
  }
}

export async function canSendMessage(
  userId: string,
  match: DurableMatch,
): Promise<"ok" | "locked" | "gone"> {
  if (match.closedAt) return "gone";
  if (match.unlockedBy) return "ok";
  if (FIRST_MESSAGE_FREE && match.freeMessagesRemaining > 0) return "ok";
  return "locked";
}

export async function sendMatchMessage(input: {
  userId: string;
  matchId: string;
  body: string;
}): Promise<MatchMessage> {
  const match = await getDurableMatch(input.matchId);
  if (!match) throw new Error("NOT_FOUND");
  if (match.aId !== input.userId && match.bId !== input.userId) {
    throw new Error("FORBIDDEN");
  }
  if (match.closedAt) throw new Error("GONE");

  const access = await canSendMessage(input.userId, match);
  if (access === "gone") throw new Error("GONE");
  if (access === "locked") throw new Error("PAYMENT_REQUIRED");

  const body = input.body.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!body) throw new Error("EMPTY");

  const redis = getRedis();
  if (!match.unlockedBy && match.freeMessagesRemaining > 0) {
    match.freeMessagesRemaining -= 1;
    await redis.set(keys.durableMatch(match.aId, match.bId), match, {
      ex: MATCH_TTL_SEC,
    });
  }

  const message: MatchMessage = {
    id: randomUUID(),
    matchId: match.id,
    senderId: input.userId,
    body,
    createdAt: Date.now(),
  };
  await redis.rpush(keys.matchMessages(match.id), message);
  await redis.expire(keys.matchMessages(match.id), MATCH_TTL_SEC);
  return message;
}

export async function listMatchMessages(
  userId: string,
  matchId: string,
): Promise<MatchMessage[]> {
  const match = await getDurableMatch(matchId);
  if (!match) throw new Error("NOT_FOUND");
  if (match.aId !== userId && match.bId !== userId) throw new Error("FORBIDDEN");
  if (match.closedAt) throw new Error("GONE");
  const redis = getRedis();
  const rows = await redis.lrange<MatchMessage>(keys.matchMessages(matchId), 0, 199);
  return rows ?? [];
}
