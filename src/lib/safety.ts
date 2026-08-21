import { randomUUID } from "crypto";
import { getRedis, keys } from "./redis";
import {
  isReportReason,
  MAX_REPORT_NOTE_LENGTH,
  reportPriority,
  type ReportReason,
} from "./constants";

const BLOCK_TTL_SEC = 60 * 60 * 24 * 365;
const REPORT_TTL_SEC = 60 * 60 * 24 * 180;
const LAST_PARTNER_TTL_SEC = 60 * 60 * 6;

export type BlockRecord = {
  blockerId: string;
  blockedId: string;
  roomId: string | null;
  createdAt: number;
};

export type ReportRecord = {
  id: string;
  reporterId: string;
  reportedId: string;
  roomId: string | null;
  reason: ReportReason;
  note: string | null;
  priority: number;
  status: "open" | "reviewed" | "actioned";
  createdAt: number;
};

/** Lexicographic pair key — aId < bId. */
export function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function blockUser(input: {
  blockerId: string;
  blockedId: string;
  roomId?: string | null;
}): Promise<void> {
  if (input.blockerId === input.blockedId) return;
  const redis = getRedis();
  const now = Date.now();
  const record: BlockRecord = {
    blockerId: input.blockerId,
    blockedId: input.blockedId,
    roomId: input.roomId ?? null,
    createdAt: now,
  };

  await redis.set(keys.block(input.blockerId, input.blockedId), record, {
    ex: BLOCK_TTL_SEC,
  });
  await redis.sadd(keys.blocksOut(input.blockerId), input.blockedId);
  await redis.sadd(keys.blocksIn(input.blockedId), input.blockerId);
  await redis.expire(keys.blocksOut(input.blockerId), BLOCK_TTL_SEC);
  await redis.expire(keys.blocksIn(input.blockedId), BLOCK_TTL_SEC);

  // Drop from recall lists on both sides.
  await redis.srem(keys.userMatches(input.blockerId), input.blockedId);
  await redis.srem(keys.userMatches(input.blockedId), input.blockerId);

  // Close any open durable match between the pair (soft-close).
  const { closeMatchBetween } = await import("./hearts");
  await closeMatchBetween(input.blockerId, input.blockedId, "blocked");
}

/** Ids this user must never be paired with (either direction). */
export async function blockedIdsFor(sessionId: string): Promise<Set<string>> {
  const redis = getRedis();
  const [out, inn] = await Promise.all([
    redis.smembers(keys.blocksOut(sessionId)),
    redis.smembers(keys.blocksIn(sessionId)),
  ]);
  return new Set([...(out ?? []), ...(inn ?? [])]);
}

export async function isBlockedEitherWay(
  a: string,
  b: string,
): Promise<boolean> {
  const redis = getRedis();
  const hit =
    (await redis.exists(keys.block(a, b))) ||
    (await redis.exists(keys.block(b, a)));
  return Boolean(hit);
}

export async function reportUser(input: {
  reporterId: string;
  reportedId: string;
  reason: unknown;
  note?: string | null;
  roomId?: string | null;
}): Promise<ReportRecord> {
  if (!isReportReason(input.reason)) {
    throw new Error("INVALID_REASON");
  }
  if (input.reporterId === input.reportedId) {
    throw new Error("INVALID_TARGET");
  }

  const note =
    typeof input.note === "string"
      ? input.note.trim().slice(0, MAX_REPORT_NOTE_LENGTH)
      : null;

  // A report always implies a block (server-side).
  await blockUser({
    blockerId: input.reporterId,
    blockedId: input.reportedId,
    roomId: input.roomId,
  });

  const id = randomUUID();
  const record: ReportRecord = {
    id,
    reporterId: input.reporterId,
    reportedId: input.reportedId,
    roomId: input.roomId ?? null,
    reason: input.reason,
    note: note || null,
    priority: reportPriority(input.reason),
    status: "open",
    createdAt: Date.now(),
  };

  const redis = getRedis();
  await redis.set(keys.report(id), record, { ex: REPORT_TTL_SEC });
  await redis.zadd(keys.reportsOpen, {
    score: record.priority * 1e13 + record.createdAt,
    member: id,
  });

  if (input.reason === "seemed_underage") {
    await notifyModeration(record);
  }

  return record;
}

async function notifyModeration(report: ReportRecord): Promise<void> {
  const url = process.env.MODERATION_WEBHOOK_URL;
  if (!url) {
    console.warn(
      "[flash] MODERATION_WEBHOOK_URL unset — underage report stored only",
      report.id,
    );
    return;
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "report",
        priority: report.priority,
        reason: report.reason,
        reportId: report.id,
        reporterId: report.reporterId,
        reportedId: report.reportedId,
        roomId: report.roomId,
        createdAt: report.createdAt,
      }),
    });
  } catch (err) {
    console.error("[flash] moderation webhook failed", err);
  }
}

/** Remember last call partner for post-call report (session-scoped). */
export async function rememberLastPartner(
  userId: string,
  partnerId: string,
  roomId: string | null,
): Promise<void> {
  const redis = getRedis();
  await redis.set(
    keys.lastPartner(userId),
    { partnerId, roomId, at: Date.now() },
    { ex: LAST_PARTNER_TTL_SEC },
  );
}

export async function getLastPartner(
  userId: string,
): Promise<{ partnerId: string; roomId: string | null } | null> {
  const redis = getRedis();
  const value = await redis.get<{
    partnerId: string;
    roomId: string | null;
  }>(keys.lastPartner(userId));
  return value ?? null;
}
