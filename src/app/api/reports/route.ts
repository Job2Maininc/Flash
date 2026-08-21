import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { reportUser, rememberLastPartner } from "@/lib/safety";
import { leaveSessionForUser } from "@/lib/matching";

export async function POST(request: Request) {
  try {
    const guest = await requireGuest();
    const body = (await request.json()) as {
      reportedId?: string;
      reason?: string;
      note?: string | null;
      roomId?: string | null;
    };
    if (!body.reportedId || typeof body.reportedId !== "string") {
      return NextResponse.json({ error: "reportedId required" }, { status: 400 });
    }

    const report = await reportUser({
      reporterId: guest.id,
      reportedId: body.reportedId,
      reason: body.reason,
      note: body.note,
      roomId: body.roomId,
    });
    await rememberLastPartner(guest.id, body.reportedId, body.roomId ?? null);
    await leaveSessionForUser(guest.id, "peer_left");

    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message === "INVALID_REASON") {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
