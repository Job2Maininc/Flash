import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { getRedis, keys } from "@/lib/redis";
import { listDurableMatches, getHeartBalance } from "@/lib/hearts";

export async function GET() {
  try {
    const guest = await requireGuest();
    const [matches, balance] = await Promise.all([
      listDurableMatches(guest.id),
      getHeartBalance(guest.id),
    ]);

    const redis = getRedis();
    const enriched = await Promise.all(
      matches.map(async (m) => {
        const peerId = m.aId === guest.id ? m.bId : m.aId;
        const peer = await redis.get<{ nickname?: string }>(keys.guest(peerId));
        return {
          id: m.id,
          peerId,
          peerNickname: peer?.nickname ?? "Guest",
          createdAt: m.createdAt,
          unlocked: Boolean(m.unlockedBy),
          freeMessagesRemaining: m.freeMessagesRemaining,
        };
      }),
    );

    return NextResponse.json({ matches: enriched, hearts: balance });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
