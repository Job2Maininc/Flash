import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { CALL_DURATION_MS } from "./constants";

export function getLiveKitUrl(): string {
  const url = process.env.LIVEKIT_URL;
  if (!url) {
    throw new Error("LIVEKIT_URL est requis");
  }
  return url;
}

function getLiveKitHttpHost(): string {
  return getLiveKitUrl().replace(/^wss:/, "https:").replace(/^ws:/, "http:");
}

function getLiveKitCredentials(): { apiKey: string; apiSecret: string } {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("LIVEKIT_API_KEY et LIVEKIT_API_SECRET sont requis");
  }
  return { apiKey, apiSecret };
}

export async function ensureCallRoom(roomName: string): Promise<{
  endsAt: number;
}> {
  const { apiKey, apiSecret } = getLiveKitCredentials();
  const client = new RoomServiceClient(
    getLiveKitHttpHost(),
    apiKey,
    apiSecret,
  );

  const endsAt = Date.now() + CALL_DURATION_MS;
  const metadata = JSON.stringify({ endsAt });

  try {
    await client.createRoom({
      name: roomName,
      maxParticipants: 2,
      emptyTimeout: 120,
      departureTimeout: 2,
      metadata,
    });
    return { endsAt };
  } catch {
    // Room already exists — keep the original endsAt; never rewrite it.
    try {
      const rooms = await client.listRooms([roomName]);
      const raw = rooms[0]?.metadata;
      if (raw) {
        const parsed = JSON.parse(raw) as { endsAt?: number };
        if (typeof parsed.endsAt === "number") {
          return { endsAt: parsed.endsAt };
        }
      }
    } catch {
      // Fall through to session-stored endsAt.
    }
  }

  return { endsAt };
}

export async function closeCallRoom(roomName: string): Promise<void> {
  const { apiKey, apiSecret } = getLiveKitCredentials();
  const client = new RoomServiceClient(
    getLiveKitHttpHost(),
    apiKey,
    apiSecret,
  );
  try {
    await client.deleteRoom(roomName);
  } catch {
    // Already gone.
  }
}

export async function createRoomToken(params: {
  identity: string;
  name: string;
  roomName: string;
}): Promise<string> {
  const { apiKey, apiSecret } = getLiveKitCredentials();

  const at = new AccessToken(apiKey, apiSecret, {
    identity: params.identity,
    name: params.name,
    ttl: "2h",
  });

  at.addGrant({
    roomJoin: true,
    room: params.roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return at.toJwt();
}
