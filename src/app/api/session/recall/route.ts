import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { recall } from "@/lib/matching";

export async function POST(request: Request) {
  try {
    const guest = await requireGuest();
    const body = (await request.json()) as { peerId?: string };
    if (!body.peerId) {
      return NextResponse.json({ error: "peerId requis" }, { status: 400 });
    }

    const session = await recall(guest.id, body.peerId);
    return NextResponse.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const status = message.includes("match") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
