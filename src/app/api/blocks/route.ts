import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { blockUser, rememberLastPartner } from "@/lib/safety";
import { leaveSessionForUser } from "@/lib/matching";

export async function POST(request: Request) {
  try {
    const guest = await requireGuest();
    const body = (await request.json()) as {
      blockedId?: string;
      roomId?: string | null;
    };
    if (!body.blockedId || typeof body.blockedId !== "string") {
      return NextResponse.json({ error: "blockedId required" }, { status: 400 });
    }

    // Identity from cookie only — never trust a client-supplied blockerId.
    await blockUser({
      blockerId: guest.id,
      blockedId: body.blockedId,
      roomId: body.roomId ?? null,
    });
    await rememberLastPartner(guest.id, body.blockedId, body.roomId ?? null);
    await leaveSessionForUser(guest.id, "peer_left");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
