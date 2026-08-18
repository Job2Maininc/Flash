import { NextResponse } from "next/server";
import { countOnline, pingOnline } from "@/lib/online";

export async function GET() {
  try {
    const count = await countOnline();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { visitorId?: string };
    const visitorId = body.visitorId?.trim().slice(0, 64);
    if (!visitorId) {
      return NextResponse.json({ error: "visitorId required" }, { status: 400 });
    }
    const count = await pingOnline(visitorId);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
