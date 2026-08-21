import { NextResponse } from "next/server";
import { createGuest, getGuestFromCookie } from "@/lib/guest";
import { GUEST_ERROR } from "@/lib/guest-errors";
import { isLookingFor, isSex } from "@/lib/compatibility";
import { isMeetScope, readCountryFromHeaders } from "@/lib/geo";
import { normalizeCountryCode } from "@/lib/countries";

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
      meetScope?: string;
      preferredCountry?: string | null;
      ageConfirmed?: boolean;
    };
    const nickname = body.nickname ?? "";
    if (!isSex(body.sex)) {
      return NextResponse.json(
        { error: GUEST_ERROR.SEX_REQUIRED },
        { status: 400 },
      );
    }
    if (!isLookingFor(body.lookingFor)) {
      return NextResponse.json(
        { error: GUEST_ERROR.LOOKING_FOR_REQUIRED },
        { status: 400 },
      );
    }
    if (body.ageConfirmed !== true) {
      return NextResponse.json(
        { error: GUEST_ERROR.AGE_REQUIRED },
        { status: 400 },
      );
    }
    const meetScope = isMeetScope(body.meetScope) ? body.meetScope : "random";
    const preferredCountry =
      meetScope === "global"
        ? normalizeCountryCode(body.preferredCountry ?? "")
        : null;
    if (meetScope === "global" && !preferredCountry) {
      return NextResponse.json(
        { error: GUEST_ERROR.SCOPE_REQUIRED },
        { status: 400 },
      );
    }
    const guest = await createGuest({
      nickname,
      sex: body.sex,
      lookingFor: body.lookingFor,
      meetScope,
      preferredCountry,
      country: readCountryFromHeaders(request.headers),
      ageConfirmed: true,
    });
    return NextResponse.json({ guest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    const status =
      message === GUEST_ERROR.NICKNAME_TOO_SHORT ||
      message === GUEST_ERROR.SEX_REQUIRED ||
      message === GUEST_ERROR.LOOKING_FOR_REQUIRED ||
      message === GUEST_ERROR.NICKNAME_BANNED ||
      message === GUEST_ERROR.SCOPE_REQUIRED ||
      message === GUEST_ERROR.AGE_REQUIRED
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
