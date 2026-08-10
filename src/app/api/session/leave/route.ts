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

function parseReason(request: Request, bodyReason?: string): SessionEndReason {
  const url = new URL(request.url);
  const queryReason = url.searchParams.get("reason");
  const candidate = bodyReason ?? queryReason;
  if (candidate && VALID_REASONS.includes(candidate as SessionEndReason)) {
    return candidate as SessionEndReason;
  }
  return "disconnect";
}

export async function POST(request: Request) {
  try {
    const guest = await requireGuest();
    let bodyReason: string | undefined;

    try {
      const text = await request.text();
      if (text) {
        const body = JSON.parse(text) as { reason?: string };
        bodyReason = body.reason;
      }
    } catch {
      // sendBeacon often sends an empty body
    }

    const reason = parseReason(request, bodyReason);
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
