import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import type { Guest } from "./types";
import { getRedis, keys } from "./redis";
import { isNicknameBanned } from "./bans";

const COOKIE_NAME = "flash_guest";
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

function secretKey() {
  const secret = process.env.GUEST_COOKIE_SECRET;
  if (!secret) {
    throw new Error("GUEST_COOKIE_SECRET est requis");
  }
  return new TextEncoder().encode(secret);
}

export async function createGuest(nickname: string): Promise<Guest> {
  const trimmed = nickname.trim().slice(0, 24);
  if (trimmed.length < 2) {
    throw new Error("Le pseudo doit faire au moins 2 caractères");
  }

  if (await isNicknameBanned(trimmed)) {
    throw new Error(
      "Ce pseudo est temporairement bloqué. Choisis-en un autre.",
    );
  }

  const guest: Guest = {
    id: randomUUID(),
    nickname: trimmed,
    createdAt: Date.now(),
  };

  const redis = getRedis();
  await redis.set(keys.guest(guest.id), guest);

  const token = await new SignJWT({
    sub: guest.id,
    nick: guest.nickname,
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
    if (guest) return guest;

    const nick =
      typeof payload.nick === "string" ? payload.nick : "Invité";
    const restored: Guest = {
      id,
      nickname: nick,
      createdAt: Date.now(),
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
