import { randomUUID } from "crypto";
import { getRedis, keys } from "./redis";
import {
  clearPresence,
  isUserStale,
  touchPresence,
} from "./presence";
import type {
  Guest,
  MatchEntry,
  Session,
  SessionEndReason,
  SessionView,
  SwipeVote,
} from "./types";

const RIGHT_TIMEOUT_MS = 30_000;
const SESSION_TTL_SEC = 60 * 60 * 6;
const MATCH_TTL_SEC = 60 * 60 * 24 * 90;

function isA(session: Session, userId: string): boolean {
  return session.a === userId;
}

function peerIdOf(session: Session, userId: string): string {
  return isA(session, userId) ? session.b : session.a;
}

function logSessionEnd(
  session: Session,
  triggeredBy: string,
  reason: SessionEndReason,
): void {
  console.info("[flash] session ended", {
    sessionId: session.id,
    roomName: session.roomName,
    triggeredBy,
    reason,
    a: session.a,
    b: session.b,
  });
}

async function saveSession(session: Session): Promise<void> {
  const redis = getRedis();
  await redis.set(keys.session(session.id), session, { ex: SESSION_TTL_SEC });
}

async function getSession(sessionId: string): Promise<Session | null> {
  const redis = getRedis();
  return redis.get<Session>(keys.session(sessionId));
}

async function getGuest(id: string): Promise<Guest | null> {
  const redis = getRedis();
  return redis.get<Guest>(keys.guest(id));
}

async function removeFromQueue(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.lrem(keys.waiting, 0, userId);
}

async function enqueue(userId: string): Promise<void> {
  const redis = getRedis();
  await removeFromQueue(userId);
  await redis.lpush(keys.waiting, userId);
}

async function clearUserSession(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(keys.userSession(userId));
}

async function bindUserSession(
  userId: string,
  sessionId: string,
): Promise<void> {
  const redis = getRedis();
  await redis.set(keys.userSession(userId), sessionId, { ex: SESSION_TTL_SEC });
}

async function getActiveSessionForUser(userId: string): Promise<Session | null> {
  const redis = getRedis();
  const sessionId = await redis.get<string>(keys.userSession(userId));
  if (!sessionId) return null;

  const session = await getSession(sessionId);
  if (
    !session ||
    (session.status !== "active" && session.status !== "matched")
  ) {
    return null;
  }
  return session;
}

async function enrichView(
  session: Session,
  userId: string,
): Promise<SessionView> {
  const view = toView(session, userId);
  if (view.peerId) {
    const peer = await getGuest(view.peerId);
    view.peerNickname = peer?.nickname ?? null;
  }
  return view;
}

async function applyStalePeerCheck(
  session: Session,
  userId: string,
): Promise<Session> {
  if (session.status !== "active" && session.status !== "matched") {
    return session;
  }

  const peerId = peerIdOf(session, userId);
  if (!(await isUserStale(peerId))) {
    return session;
  }

  const ended = await endSession(session, "peer_left", true);
  logSessionEnd(ended, userId, "peer_left");
  return ended;
}

async function cleanupStaleFromQueue(): Promise<void> {
  const redis = getRedis();
  const waiting = await redis.lrange<string>(keys.waiting, 0, -1);
  for (const userId of waiting) {
    if (await isUserStale(userId)) {
      await removeFromQueue(userId);
    }
  }
}

async function createPairedSession(
  userA: string,
  userB: string,
): Promise<Session> {
  const session: Session = {
    id: randomUUID(),
    a: userA,
    b: userB,
    roomName: `flash-${randomUUID()}`,
    voteA: null,
    voteB: null,
    status: "active",
    createdAt: Date.now(),
    rightStartedAt: null,
    endReason: null,
  };

  await saveSession(session);
  await bindUserSession(userA, session.id);
  await bindUserSession(userB, session.id);
  await touchPresence(userA);
  await touchPresence(userB);
  return session;
}

async function tryPair(userId: string): Promise<Session | null> {
  const redis = getRedis();

  await cleanupStaleFromQueue();

  const alreadyPaired = await getActiveSessionForUser(userId);
  if (alreadyPaired) {
    await removeFromQueue(userId);
    return alreadyPaired;
  }

  const locked = await redis.set(keys.pairLock, userId, { nx: true, px: 3000 });
  if (locked !== "OK") {
    const pairedWhileWaiting = await getActiveSessionForUser(userId);
    if (pairedWhileWaiting) {
      await removeFromQueue(userId);
      return pairedWhileWaiting;
    }
    await enqueue(userId);
    return null;
  }

  try {
    const pairedAfterLock = await getActiveSessionForUser(userId);
    if (pairedAfterLock) {
      await removeFromQueue(userId);
      return pairedAfterLock;
    }

    await removeFromQueue(userId);

    for (let i = 0; i < 20; i++) {
      const peer = await redis.rpop<string>(keys.waiting);
      if (!peer) {
        await enqueue(userId);
        return null;
      }
      if (peer === userId) continue;

      if (await isUserStale(peer)) {
        continue;
      }

      const peerSessionId = await redis.get<string>(keys.userSession(peer));
      if (peerSessionId) {
        const existing = await getSession(peerSessionId);
        if (
          existing &&
          (existing.status === "active" || existing.status === "matched")
        ) {
          await redis.lpush(keys.waiting, peer);
          continue;
        }
      }

      return createPairedSession(userId, peer);
    }

    await enqueue(userId);
    return null;
  } finally {
    await redis.del(keys.pairLock);
  }
}

async function endSession(
  session: Session,
  reason: SessionEndReason,
  requeue: boolean,
): Promise<Session> {
  session.status = "ended";
  session.endReason = reason;
  await saveSession(session);
  await clearUserSession(session.a);
  await clearUserSession(session.b);

  if (requeue) {
    for (const uid of [session.a, session.b]) {
      if (!(await isUserStale(uid))) {
        await enqueue(uid);
        await touchPresence(uid);
      }
    }
  }

  return session;
}

async function recordMatch(session: Session): Promise<void> {
  const redis = getRedis();
  const now = Date.now();
  const guestA = await getGuest(session.a);
  const guestB = await getGuest(session.b);

  await redis.sadd(keys.userMatches(session.a), session.b);
  await redis.sadd(keys.userMatches(session.b), session.a);
  await redis.expire(keys.userMatches(session.a), MATCH_TTL_SEC);
  await redis.expire(keys.userMatches(session.b), MATCH_TTL_SEC);

  await redis.set(
    keys.matchMeta(session.a, session.b),
    {
      matchedAt: now,
      a: session.a,
      b: session.b,
      nickA: guestA?.nickname ?? "Invité",
      nickB: guestB?.nickname ?? "Invité",
    },
    { ex: MATCH_TTL_SEC },
  );
}

async function applyRightTimeout(session: Session): Promise<Session> {
  if (
    session.status !== "active" ||
    !session.rightStartedAt ||
    (session.voteA === "right" && session.voteB === "right")
  ) {
    return session;
  }

  const oneRight =
    (session.voteA === "right" && session.voteB !== "right") ||
    (session.voteB === "right" && session.voteA !== "right");

  if (
    oneRight &&
    Date.now() - session.rightStartedAt >= RIGHT_TIMEOUT_MS
  ) {
    const ended = await endSession(session, "timeout", true);
    logSessionEnd(ended, "system", "timeout");
    return ended;
  }

  return session;
}

function toView(session: Session | null, userId: string): SessionView {
  if (!session) {
    return {
      state: "waiting",
      sessionId: null,
      roomName: null,
      peerId: null,
      peerNickname: null,
      myVote: null,
      peerVote: null,
      endReason: null,
    };
  }

  const mine = isA(session, userId);
  const myVote = mine ? session.voteA : session.voteB;
  const peerVote = mine ? session.voteB : session.voteA;

  let state: SessionView["state"] = "waiting";
  if (session.status === "active") state = "active";
  else if (session.status === "matched") state = "matched";
  else if (session.status === "ended") state = "ended";

  return {
    state,
    sessionId: session.id,
    roomName:
      session.status === "active" || session.status === "matched"
        ? session.roomName
        : null,
    peerId: peerIdOf(session, userId),
    peerNickname: null,
    myVote,
    peerVote,
    endReason: session.endReason,
  };
}

async function resolveSessionView(
  userId: string,
  session: Session,
): Promise<SessionView> {
  let current = await applyRightTimeout(session);
  current = await applyStalePeerCheck(current, userId);
  return enrichView(current, userId);
}

export async function heartbeat(userId: string): Promise<SessionView> {
  await touchPresence(userId);
  return getSessionForUser(userId);
}

export async function leaveSessionForUser(
  userId: string,
  reason: SessionEndReason = "disconnect",
): Promise<SessionView> {
  const redis = getRedis();
  await removeFromQueue(userId);
  await clearPresence(userId);

  const sessionId = await redis.get<string>(keys.userSession(userId));
  if (!sessionId) {
    return toView(null, userId);
  }

  const session = await getSession(sessionId);
  if (
    session &&
    (session.status === "active" || session.status === "matched")
  ) {
    const ended = await endSession(session, reason, true);
    logSessionEnd(ended, userId, reason);
    return toView(ended, userId);
  }

  await clearUserSession(userId);
  return toView(session, userId);
}

export async function reportPeerLeft(userId: string): Promise<SessionView> {
  const session = await getActiveSessionForUser(userId);
  if (!session) {
    return toView(null, userId);
  }

  const ended = await endSession(session, "peer_left", true);
  logSessionEnd(ended, userId, "peer_left");
  return enrichView(ended, userId);
}

export async function joinQueue(userId: string): Promise<SessionView> {
  await touchPresence(userId);
  const redis = getRedis();
  const existingId = await redis.get<string>(keys.userSession(userId));
  if (existingId) {
    const session = await getSession(existingId);
    if (
      session &&
      (session.status === "active" || session.status === "matched")
    ) {
      return resolveSessionView(userId, session);
    }
    if (session) {
      await clearUserSession(userId);
    }
  }

  await clearUserSession(userId);
  const paired = await tryPair(userId);
  if (paired) {
    return enrichView(paired, userId);
  }

  const pairedLate = await getActiveSessionForUser(userId);
  if (pairedLate) {
    return enrichView(pairedLate, userId);
  }

  return toView(null, userId);
}

export async function getSessionForUser(userId: string): Promise<SessionView> {
  const redis = getRedis();
  const sessionId = await redis.get<string>(keys.userSession(userId));

  if (!sessionId) {
    const waiting = await redis.lrange<string>(keys.waiting, 0, -1);
    if (waiting.includes(userId)) {
      const paired = await tryPair(userId);
      if (paired) {
        return enrichView(paired, userId);
      }
      const pairedLate = await getActiveSessionForUser(userId);
      if (pairedLate) {
        return enrichView(pairedLate, userId);
      }
      return toView(null, userId);
    }
    return toView(null, userId);
  }

  let session = await getSession(sessionId);
  if (!session) {
    await clearUserSession(userId);
    return toView(null, userId);
  }

  return resolveSessionView(userId, session);
}

export async function swipe(
  userId: string,
  direction: "left" | "right",
): Promise<SessionView> {
  const redis = getRedis();
  const sessionId = await redis.get<string>(keys.userSession(userId));
  if (!sessionId) {
    return toView(null, userId);
  }

  let session = await getSession(sessionId);
  if (!session || (session.status !== "active" && session.status !== "matched")) {
    return toView(session, userId);
  }

  if (isA(session, userId)) {
    session.voteA = direction;
  } else {
    session.voteB = direction;
  }

  if (direction === "left") {
    session = await endSession(session, "left", true);
    logSessionEnd(session, userId, "left");
    return toView(session, userId);
  }

  if (!session.rightStartedAt) {
    session.rightStartedAt = Date.now();
  }

  if (session.voteA === "right" && session.voteB === "right") {
    session.status = "matched";
    await recordMatch(session);
    await saveSession(session);
  } else {
    await saveSession(session);
    session = await applyRightTimeout(session);
  }

  return enrichView(session, userId);
}

export async function listMatches(userId: string): Promise<MatchEntry[]> {
  const redis = getRedis();
  const peerIds = await redis.smembers(keys.userMatches(userId));
  const entries: MatchEntry[] = [];

  for (const peerId of peerIds) {
    const meta = await redis.get<{
      matchedAt: number;
      nickA: string;
      nickB: string;
      a: string;
      b: string;
    }>(keys.matchMeta(userId, peerId));
    const guest = await getGuest(peerId);
    let nickname = guest?.nickname;
    if (!nickname && meta) {
      nickname = meta.a === peerId ? meta.nickA : meta.nickB;
    }

    entries.push({
      peerId,
      nickname: nickname ?? "Invité",
      matchedAt: meta?.matchedAt ?? 0,
    });
  }

  return entries.sort((a, b) => b.matchedAt - a.matchedAt);
}

export async function recall(
  userId: string,
  peerId: string,
): Promise<SessionView> {
  const redis = getRedis();
  const isMatch = await redis.sismember(keys.userMatches(userId), peerId);
  if (!isMatch) {
    throw new Error("Pas de match avec cet utilisateur");
  }

  for (const uid of [userId, peerId]) {
    const sid = await redis.get<string>(keys.userSession(uid));
    if (sid) {
      const s = await getSession(sid);
      if (s && (s.status === "active" || s.status === "matched")) {
        const ended = await endSession(s, "recall", false);
        logSessionEnd(ended, userId, "recall");
      }
    }
    await removeFromQueue(uid);
  }

  const session = await createPairedSession(userId, peerId);
  session.status = "matched";
  session.voteA = "right";
  session.voteB = "right";
  await saveSession(session);

  return enrichView(session, userId);
}

export async function leaveSessionByGuestId(
  guestId: string,
  reason: SessionEndReason = "disconnect",
): Promise<void> {
  await leaveSessionForUser(guestId, reason);
}

export type { SwipeVote };
