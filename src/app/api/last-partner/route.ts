import { NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { getLastPartner } from "@/lib/safety";

export async function GET() {
  try {
    const guest = await requireGuest();
    const last = await getLastPartner(guest.id);
    return NextResponse.json({ last });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
