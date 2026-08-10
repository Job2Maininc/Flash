import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { leaveSessionForUser } from "@/lib/matching";
import type { SessionEndReason } from "@/lib/types";

const VALID_REASONS: SessionEndReason[] = [
  "left",
  "timeout",
  "recall",
  "peer_left",
  "disconnect",
];

export async function POST(request: Request) {
  try {
    const guest = await requireGuest();
    let reason: SessionEndReason = "disconnect";

    try {
      const body = (await request.json()) as { reason?: string };
      if (
        body.reason &&
        VALID_REASONS.includes(body.reason as SessionEndReason)
      ) {
        reason = body.reason as SessionEndReason;
      }
    } catch {
      // sendBeacon may send empty body
    }

    const session = await leaveSessionForUser(guest.id, reason);
    return NextResponse.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
