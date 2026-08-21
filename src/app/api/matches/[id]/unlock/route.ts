import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { unlockMatch } from "@/lib/hearts";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Ctx) {
  try {
    const guest = await requireGuest();
    const { id } = await context.params;
    const matchId = decodeURIComponent(id);
    const match = await unlockMatch(guest.id, matchId);
    return NextResponse.json({ match });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message === "PAYMENT_REQUIRED") {
      return NextResponse.json({ error: "Not enough hearts" }, { status: 402 });
    }
    if (message === "GONE") {
      return NextResponse.json({ error: "Match closed" }, { status: 410 });
    }
    if (message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
