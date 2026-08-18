import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import type { GlobalMode, Guest, LookingFor, MeetScope, Sex } from "./types";
import { getRedis, keys } from "./redis";
import { isNicknameBanned } from "./bans";
import { isLookingFor, isSex } from "./compatibility";
import { isGlobalMode, isMeetScope } from "./geo";
import { GUEST_ERROR } from "./guest-errors";

const COOKIE_NAME = "flash_guest";
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

export type CreateGuestInput = {
  nickname: string;
  sex: Sex;
  lookingFor: LookingFor;
  meetScope: MeetScope;
  globalMode?: GlobalMode | null;
  country?: string | null;
};

function secretKey() {
  const secret = process.env.GUEST_COOKIE_SECRET;
  if (!secret) {
    throw new Error("GUEST_COOKIE_SECRET est requis");
  }
  return new TextEncoder().encode(secret);
}

export async function createGuest(input: CreateGuestInput): Promise<Guest> {
  const trimmed = input.nickname.trim().slice(0, 24);
  if (trimmed.length < 2) {
    throw new Error(GUEST_ERROR.NICKNAME_TOO_SHORT);
  }
  if (!isSex(input.sex)) {
    throw new Error(GUEST_ERROR.SEX_REQUIRED);
  }
  if (!isLookingFor(input.lookingFor)) {
    throw new Error(GUEST_ERROR.LOOKING_FOR_REQUIRED);
  }
  if (!isMeetScope(input.meetScope)) {
    throw new Error(GUEST_ERROR.SCOPE_REQUIRED);
  }
  if (input.meetScope === "global" && !isGlobalMode(input.globalMode)) {
    throw new Error(GUEST_ERROR.SCOPE_REQUIRED);
  }

  if (await isNicknameBanned(trimmed)) {
    throw new Error(GUEST_ERROR.NICKNAME_BANNED);
  }

  const guest: Guest = {
    id: randomUUID(),
    nickname: trimmed,
    sex: input.sex,
    lookingFor: input.lookingFor,
    createdAt: Date.now(),
    meetScope: input.meetScope,
    globalMode: input.meetScope === "global" ? input.globalMode ?? "all" : null,
    country: input.country ?? null,
  };

  const redis = getRedis();
  await redis.set(keys.guest(guest.id), guest);

  const token = await new SignJWT({
    sub: guest.id,
    nick: guest.nickname,
    sex: guest.sex,
    lookingFor: guest.lookingFor,
    meetScope: guest.meetScope,
    ...(guest.globalMode ? { globalMode: guest.globalMode } : {}),
    ...(guest.country ? { country: guest.country } : {}),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });

  return guest;
}

export async function getGuestFromCookie(): Promise<Guest | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const id = payload.sub;
    if (!id || typeof id !== "string") return null;

    const redis = getRedis();
    const guest = await redis.get<Guest>(keys.guest(id));
    if (guest?.sex && guest?.lookingFor) return guest;

    const nick =
      typeof payload.nick === "string" ? payload.nick : "Guest";
    const sex = isSex(payload.sex) ? payload.sex : null;
    const lookingFor = isLookingFor(payload.lookingFor)
      ? payload.lookingFor
      : null;

    if (!sex || !lookingFor) {
      return null;
    }

    const restored: Guest = {
      id,
      nickname: nick,
      sex,
      lookingFor,
      createdAt: Date.now(),
      meetScope: isMeetScope(payload.meetScope) ? payload.meetScope : "random",
      globalMode: isGlobalMode(payload.globalMode) ? payload.globalMode : null,
      country: typeof payload.country === "string" ? payload.country : null,
    };
    await redis.set(keys.guest(id), restored);
    return restored;
  } catch {
    return null;
  }
}

export async function requireGuest(): Promise<Guest> {
  const guest = await getGuestFromCookie();
  if (!guest) {
    throw new Error("UNAUTHORIZED");
  }
  return guest;
}

/** Clears the guest cookie so the landing page always asks for a nickname. */
export async function clearGuestCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
