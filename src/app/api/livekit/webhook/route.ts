import { NextResponse } from "next/server";
import { WebhookReceiver } from "livekit-server-sdk";
import { leaveSessionByGuestId } from "@/lib/matching";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit non configuré" },
        { status: 500 },
      );
    }

    const body = await request.text();
    const authHeader = request.headers.get("Authorization") ?? "";
    const receiver = new WebhookReceiver(apiKey, apiSecret);
    const event = await receiver.receive(body, authHeader);

    if (event.event === "participant_left") {
      const identity = event.participant?.identity;
      if (identity) {
        await leaveSessionByGuestId(identity, "disconnect");
      }
    }

    if (event.event === "room_finished") {
      const participants = event.room?.numParticipants ?? 0;
      if (participants === 0 && event.room?.name) {
        console.info("[flash] room finished", { room: event.room.name });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    console.error("[flash] livekit webhook failed", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
