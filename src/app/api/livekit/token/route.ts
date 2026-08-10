import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { createRoomToken, getLiveKitUrl } from "@/lib/livekit";
import { getSessionForUser } from "@/lib/matching";

export async function POST(request: Request) {
  try {
    const guest = await requireGuest();
    const body = (await request.json()) as { roomName?: string };
    const session = await getSessionForUser(guest.id);

    const roomName = body.roomName ?? session.roomName;
    if (
      !roomName ||
      (session.state !== "active" && session.state !== "matched")
    ) {
      return NextResponse.json(
        { error: "Aucune room active" },
        { status: 400 },
      );
    }

    if (session.roomName && roomName !== session.roomName) {
      return NextResponse.json({ error: "Room invalide" }, { status: 403 });
    }

    const token = await createRoomToken({
      identity: guest.id,
      name: guest.nickname,
      roomName,
    });

    return NextResponse.json({
      token,
      url: getLiveKitUrl(),
      roomName,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
