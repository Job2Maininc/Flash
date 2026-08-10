import { randomUUID } from "crypto";
import { getRedis, keys } from "./redis";
import type {
  Guest,
  MatchEntry,
  Session,
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
  return session;
}

async function tryPair(userId: string): Promise<Session | null> {
  const redis = getRedis();
  const locked = await redis.set(keys.pairLock, userId, { nx: true, px: 3000 });
  if (locked !== "OK") {
    await enqueue(userId);
    return null;
  }

  try {
    await removeFromQueue(userId);

    // Drain self / stale ids until a real peer appears
    for (let i = 0; i < 20; i++) {
      const peer = await redis.rpop<string>(keys.waiting);
      if (!peer) {
        await enqueue(userId);
        return null;
      }
      if (peer === userId) continue;

      const peerSessionId = await redis.get<string>(keys.userSession(peer));
      if (peerSessionId) {
        const existing = await getSession(peerSessionId);
        if (
          existing &&
          (existing.status === "active" || existing.status === "matched")
        ) {
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
  reason: Session["endReason"],
  requeue: boolean,
): Promise<Session> {
  session.status = "ended";
  session.endReason = reason;
  await saveSession(session);
  await clearUserSession(session.a);
  await clearUserSession(session.b);

  if (requeue) {
    await enqueue(session.a);
    await enqueue(session.b);
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
    return endSession(session, "timeout", true);
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

export async function joinQueue(userId: string): Promise<SessionView> {
  const redis = getRedis();
  const existingId = await redis.get<string>(keys.userSession(userId));
  if (existingId) {
    let session = await getSession(existingId);
    if (session) {
      session = await applyRightTimeout(session);
      if (session.status === "active" || session.status === "matched") {
        const view = toView(session, userId);
        const peer = await getGuest(view.peerId!);
        return { ...view, peerNickname: peer?.nickname ?? null };
      }
    }
  }

  await clearUserSession(userId);
  const paired = await tryPair(userId);
  if (!paired) {
    return toView(null, userId);
  }

  const view = toView(paired, userId);
  const peer = await getGuest(view.peerId!);
  return { ...view, peerNickname: peer?.nickname ?? null };
}

export async function getSessionForUser(userId: string): Promise<SessionView> {
  const redis = getRedis();
  const sessionId = await redis.get<string>(keys.userSession(userId));

  if (!sessionId) {
    // Still in waiting queue?
    const waiting = await redis.lrange<string>(keys.waiting, 0, -1);
    if (waiting.includes(userId)) {
      // Attempt pair opportunistically while polling
      const paired = await tryPair(userId);
      if (paired) {
        const view = toView(paired, userId);
        const peer = await getGuest(view.peerId!);
        return { ...view, peerNickname: peer?.nickname ?? null };
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

  session = await applyRightTimeout(session);
  const view = toView(session, userId);
  if (view.peerId) {
    const peer = await getGuest(view.peerId);
    view.peerNickname = peer?.nickname ?? null;
  }
  return view;
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
    return toView(session, userId);
  }

  // right
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

  const view = toView(session, userId);
  if (view.peerId) {
    const peer = await getGuest(view.peerId);
    view.peerNickname = peer?.nickname ?? null;
  }
  return view;
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

  // End any current sessions for both users without requeueing into random pool
  for (const uid of [userId, peerId]) {
    const sid = await redis.get<string>(keys.userSession(uid));
    if (sid) {
      const s = await getSession(sid);
      if (s && (s.status === "active" || s.status === "matched")) {
        await endSession(s, "recall", false);
      }
    }
    await removeFromQueue(uid);
  }

  const session = await createPairedSession(userId, peerId);
  session.status = "matched";
  session.voteA = "right";
  session.voteB = "right";
  await saveSession(session);

  const view = toView(session, userId);
  const peer = await getGuest(peerId);
  return { ...view, peerNickname: peer?.nickname ?? null };
}

export type { SwipeVote };
