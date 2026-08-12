import type { SessionView } from "./types";

export function sessionViewChanged(
  prev: SessionView | null,
  next: SessionView,
): boolean {
  if (!prev) return true;
  return (
    prev.state !== next.state ||
    prev.sessionId !== next.sessionId ||
    prev.roomName !== next.roomName ||
    prev.peerId !== next.peerId ||
    prev.peerNickname !== next.peerNickname ||
    prev.myVote !== next.myVote ||
    prev.peerVote !== next.peerVote ||
    prev.endReason !== next.endReason ||
    prev.roundEndsAt !== next.roundEndsAt ||
    prev.extendedUntil !== next.extendedUntil ||
    prev.idleStrikes !== next.idleStrikes ||
    prev.peerLeft !== next.peerLeft
  );
}
