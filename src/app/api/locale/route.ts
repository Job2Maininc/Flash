import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE_SEC,
} from "@/lib/i18n/config";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { locale?: string };
    if (!isLocale(body.locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const jar = await cookies();
    jar.set(LOCALE_COOKIE, body.locale, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE_SEC,
    });

    return NextResponse.json({ locale: body.locale });
  } catch {
    return NextResponse.json({ error: "Could not set locale" }, { status: 500 });
  }
}
