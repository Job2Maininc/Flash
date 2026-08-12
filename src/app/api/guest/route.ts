import { NextResponse } from "next/server";
import { createGuest, getGuestFromCookie } from "@/lib/guest";
import { isLookingFor, isSex } from "@/lib/compatibility";

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
    const body = (await request.json()) as {
      nickname?: string;
      sex?: string;
      lookingFor?: string;
    };
    const nickname = body.nickname ?? "";
    if (!isSex(body.sex)) {
      return NextResponse.json(
        { error: "Choisis ton sexe" },
        { status: 400 },
      );
    }
    if (!isLookingFor(body.lookingFor)) {
      return NextResponse.json(
        { error: "Indique qui tu cherches" },
        { status: 400 },
      );
    }
    const guest = await createGuest({
      nickname,
      sex: body.sex,
      lookingFor: body.lookingFor,
    });
    return NextResponse.json({ guest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    const status =
      message.includes("pseudo") ||
      message.includes("sexe") ||
      message.includes("cherches")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
