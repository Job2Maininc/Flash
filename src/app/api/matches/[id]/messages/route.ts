import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { listMatchMessages, sendMatchMessage } from "@/lib/hearts";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    const guest = await requireGuest();
    const { id } = await context.params;
    const matchId = decodeURIComponent(id);
    const messages = await listMatchMessages(guest.id, matchId);
    return NextResponse.json({ messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message === "GONE") {
      return NextResponse.json({ error: "Match closed" }, { status: 410 });
    }
    if (message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, context: Ctx) {
  try {
    const guest = await requireGuest();
    const { id } = await context.params;
    const matchId = decodeURIComponent(id);
    const body = (await request.json()) as { body?: string };
    const message = await sendMatchMessage({
      userId: guest.id,
      matchId,
      body: body.body ?? "",
    });
    return NextResponse.json({ message });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (message === "PAYMENT_REQUIRED") {
      return NextResponse.json({ error: "Conversation locked" }, { status: 402 });
    }
    if (message === "GONE") {
      return NextResponse.json({ error: "Match closed" }, { status: 410 });
    }
    if (message === "EMPTY") {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
