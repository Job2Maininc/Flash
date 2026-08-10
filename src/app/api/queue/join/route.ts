import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { joinQueue } from "@/lib/matching";

export async function POST() {
  try {
    const guest = await requireGuest();
    const session = await joinQueue(guest.id);
    return NextResponse.json({ session, guest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
