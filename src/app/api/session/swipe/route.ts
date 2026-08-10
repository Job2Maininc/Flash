import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { swipe } from "@/lib/matching";

export async function POST(request: Request) {
  try {
    const guest = await requireGuest();
    const body = (await request.json()) as { direction?: string };
    if (body.direction !== "left" && body.direction !== "right") {
      return NextResponse.json(
        { error: "direction doit être left ou right" },
        { status: 400 },
      );
    }

    const session = await swipe(guest.id, body.direction);
    return NextResponse.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
