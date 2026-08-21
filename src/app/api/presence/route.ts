import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { heartbeat } from "@/lib/matching";
import { getRedis, keys } from "@/lib/redis";

/** Honest wait-queue size for marketing PresenceLine — never invent a crowd. */
export async function GET() {
  try {
    const redis = getRedis();
    const waiting = await redis.llen(keys.waiting);
    const online =
      typeof waiting === "number" && Number.isFinite(waiting)
        ? Math.max(0, waiting)
        : null;
    // TODO: echte Quelle anbinden — heute: Länge der Matching-Warteschlange.
    // Aktive Calls / Browse-Presence sind hier noch nicht eingerechnet.
    return NextResponse.json({ online });
  } catch {
    return NextResponse.json({ online: null });
  }
}

export async function POST() {
  try {
    const guest = await requireGuest();
    const session = await heartbeat(guest.id);
    return NextResponse.json({ session, guest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
