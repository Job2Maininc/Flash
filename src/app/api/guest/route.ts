import { NextResponse } from "next/server";
import { createGuest, getGuestFromCookie } from "@/lib/guest";

export async function GET() {
  try {
    const guest = await getGuestFromCookie();
    if (!guest) {
      return NextResponse.json({ guest: null }, { status: 200 });
    }
    return NextResponse.json({ guest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { nickname?: string };
    const nickname = body.nickname ?? "";
    const guest = await createGuest(nickname);
    return NextResponse.json({ guest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    const status = message.includes("pseudo") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
