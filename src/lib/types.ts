export type SwipeVote = "left" | "right" | null;

export type SessionStatus = "pairing" | "active" | "matched" | "ended";

export type SessionEndReason =
  | "left"
  | "timeout"
  | "recall"
  | "peer_left"
  | "disconnect"
  | null;

export type Guest = {
  id: string;
  nickname: string;
  createdAt: number;
};

export type Session = {
  id: string;
  a: string;
  b: string;
  roomName: string;
  voteA: SwipeVote;
  voteB: SwipeVote;
  status: SessionStatus;
  createdAt: number;
  /** Timestamp of first "right" vote — used for 30s mutual-match timeout */
  rightStartedAt: number | null;
  endReason: SessionEndReason;
};

export type MatchEntry = {
  peerId: string;
  nickname: string;
  matchedAt: number;
};

export type SessionView = {
  state: "waiting" | "active" | "matched" | "ended";
  sessionId: string | null;
  roomName: string | null;
  peerId: string | null;
  peerNickname: string | null;
  myVote: SwipeVote;
  peerVote: SwipeVote;
  endReason: SessionEndReason;
};
