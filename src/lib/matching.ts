import { randomUUID } from "crypto";
import { getRedis, keys } from "./redis";
import { ensureCallRoom } from "./livekit";
import {
  banNickname,
  getIdleStrikes,
  incrementIdleStrike,
  isNicknameBanned,
  MAX_IDLE_STRIKES,
  resetIdleStrikes,
} from "./bans";
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

const ROUND_TIMEOUT_MS = 20_000;
const MATCH_EXTENSION_MS = 5 * 60 * 1000;
const SESSION_TTL_SEC = 60 * 60 * 6;
const MATCH_TTL_SEC = 60 * 60 * 24 * 90;

function bannedView(userId: string): SessionView {
  return {
    state: "banned",
    sessionId: null,
    roomName: null,
    peerId: null,
    peerNickname: null,
    myVote: null,
    peerVote: null,
    endReason: null,
    roundEndsAt: null,
    extendedUntil: null,
    idleStrikes: MAX_IDLE_STRIKES,
  };
}

async function isUserBanned(userId: string): Promise<boolean> {
  const guest = await getGuest(userId);
  if (!guest) return false;
  return isNicknameBanned(guest.nickname);
}

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

async function signalPeerLeft(
  session: Session,
  triggeredBy: string | null,
  reason: SessionEndReason,
): Promise<void> {
  const redis = getRedis();
  const payload = { reason, sessionId: session.id, at: Date.now() };
  for (const uid of [session.a, session.b]) {
    if (triggeredBy && uid === triggeredBy) continue;
    await redis.set(keys.peerSignal(uid), payload, { ex: 30 });
  }
}

async function consumePeerSignal(userId: string): Promise<boolean> {
  const redis = getRedis();
  const signal = await redis.get<{ reason: SessionEndReason }>(
    keys.peerSignal(userId),
  );
  if (!signal) return false;
  await redis.del(keys.peerSignal(userId));
  return true;
}

async function enrichView(
  session: Session,
  userId: string,
  peerLeft = false,
): Promise<SessionView> {
  const view = toView(session, userId);
  view.peerLeft = peerLeft;
  view.idleStrikes = await getIdleStrikes(userId);
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

  const ended = await endSession(session, "peer_left", true, peerId);
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
    roundStartedAt: Date.now(),
    extendedUntil: null,
    rightStartedAt: null,
    endReason: null,
  };

  await saveSession(session);
  await bindUserSession(userA, session.id);
  await bindUserSession(userB, session.id);
  await touchPresence(userA);
  await touchPresence(userB);
  await ensureCallRoom(session.roomName);
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
  triggeredBy: string | null = null,
): Promise<Session> {
  session.status = "ended";
  session.endReason = reason;
  await signalPeerLeft(session, triggeredBy, reason);
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

async function requeueUser(userId: string): Promise<void> {
  if (await isUserStale(userId)) return;
  await enqueue(userId);
  await touchPresence(userId);
}

async function handleRoundTimeout(session: Session): Promise<Session> {
  session.status = "ended";
  session.endReason = "round_timeout";
  await signalPeerLeft(session, null, "round_timeout");
  await saveSession(session);
  await clearUserSession(session.a);
  await clearUserSession(session.b);

  for (const uid of [session.a, session.b]) {
    const vote = uid === session.a ? session.voteA : session.voteB;
    if (vote === null) {
      const strikes = await incrementIdleStrike(uid);
      if (strikes >= MAX_IDLE_STRIKES) {
        const guest = await getGuest(uid);
        if (guest) await banNickname(guest.nickname);
        await clearPresence(uid);
        continue;
      }
    } else {
      await resetIdleStrikes(uid);
    }
    await requeueUser(uid);
  }

  logSessionEnd(session, "system", "round_timeout");
  return session;
}

async function applyRoundTimeout(session: Session): Promise<Session> {
  if (session.status !== "active") return session;
  if (Date.now() - session.roundStartedAt < ROUND_TIMEOUT_MS) return session;

  if (session.voteA === "right" && session.voteB === "right") {
    session.status = "matched";
    session.extendedUntil = Date.now() + MATCH_EXTENSION_MS;
    await recordMatch(session);
    await resetIdleStrikes(session.a);
    await resetIdleStrikes(session.b);
    await saveSession(session);
    return session;
  }

  return handleRoundTimeout(session);
}

async function applyMatchExtension(session: Session): Promise<Session> {
  if (session.status !== "matched" || !session.extendedUntil) return session;
  if (Date.now() < session.extendedUntil) return session;

  const ended = await endSession(session, "match_expired", true);
  logSessionEnd(ended, "system", "match_expired");
  return ended;
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
      roundEndsAt: null,
      extendedUntil: null,
      idleStrikes: 0,
    };
  }

  const mine = isA(session, userId);
  const myVote = mine ? session.voteA : session.voteB;
  const peerVote = mine ? session.voteB : session.voteA;

  let state: SessionView["state"] = "waiting";
  if (session.status === "active") state = "active";
  else if (session.status === "matched") state = "matched";
  else if (session.status === "ended") state = "ended";

  const roundEndsAt =
    session.status === "active"
      ? session.roundStartedAt + ROUND_TIMEOUT_MS
      : null;

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
    roundEndsAt,
    extendedUntil:
      session.status === "matched" ? session.extendedUntil : null,
    idleStrikes: 0,
  };
}

async function resolveSessionView(
  userId: string,
  session: Session,
): Promise<SessionView> {
  let current = await applyRoundTimeout(session);
  current = await applyMatchExtension(current);
  current = await applyStalePeerCheck(current, userId);
  return enrichView(current, userId);
}

function withPeerLeft(view: SessionView, peerLeft: boolean): SessionView {
  if (peerLeft) view.peerLeft = true;
  return view;
}

export async function heartbeat(userId: string): Promise<SessionView> {
  if (await isUserBanned(userId)) {
    return bannedView(userId);
  }

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
    const ended = await endSession(session, reason, true, userId);
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

  const ended = await endSession(session, "peer_left", true, userId);
  logSessionEnd(ended, userId, "peer_left");
  return enrichView(ended, userId);
}

export async function joinQueue(userId: string): Promise<SessionView> {
  if (await isUserBanned(userId)) {
    return bannedView(userId);
  }

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
  if (await isUserBanned(userId)) {
    return bannedView(userId);
  }

  const peerLeft = await consumePeerSignal(userId);
  const redis = getRedis();
  const sessionId = await redis.get<string>(keys.userSession(userId));

  if (!sessionId) {
    const waiting = await redis.lrange<string>(keys.waiting, 0, -1);
    if (waiting.includes(userId)) {
      const paired = await tryPair(userId);
      if (paired) {
        return withPeerLeft(await enrichView(paired, userId), peerLeft);
      }
      const pairedLate = await getActiveSessionForUser(userId);
      if (pairedLate) {
        return withPeerLeft(await enrichView(pairedLate, userId), peerLeft);
      }
      return withPeerLeft(toView(null, userId), peerLeft);
    }
    return withPeerLeft(toView(null, userId), peerLeft);
  }

  let session = await getSession(sessionId);
  if (!session) {
    await clearUserSession(userId);
    return withPeerLeft(toView(null, userId), peerLeft);
  }

  return withPeerLeft(await resolveSessionView(userId, session), peerLeft);
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
    await resetIdleStrikes(userId);
    session = await endSession(session, "left", true, userId);
    logSessionEnd(session, userId, "left");
    return enrichView(session, userId);
  }

  await resetIdleStrikes(userId);

  if (!session.rightStartedAt) {
    session.rightStartedAt = Date.now();
  }

  if (session.voteA === "right" && session.voteB === "right") {
    session.status = "matched";
    session.extendedUntil = Date.now() + MATCH_EXTENSION_MS;
    await recordMatch(session);
    await resetIdleStrikes(session.a);
    await resetIdleStrikes(session.b);
    await saveSession(session);
  } else {
    await saveSession(session);
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
  session.extendedUntil = Date.now() + MATCH_EXTENSION_MS;
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
