export type SwipeVote = "left" | "right" | null;

export type SessionStatus = "pairing" | "active" | "matched" | "ended";

export type SessionEndReason =
  | "left"
  | "timeout"
  | "round_timeout"
  | "match_expired"
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
  /** When the current 20s round started */
  roundStartedAt: number;
  /** After mutual match, call continues until this timestamp */
  extendedUntil: number | null;
  rightStartedAt: number | null;
  endReason: SessionEndReason;
};

export type MatchEntry = {
  peerId: string;
  nickname: string;
  matchedAt: number;
};

export type SessionView = {
  state: "waiting" | "active" | "matched" | "ended" | "banned";
  sessionId: string | null;
  roomName: string | null;
  peerId: string | null;
  peerNickname: string | null;
  myVote: SwipeVote;
  peerVote: SwipeVote;
  endReason: SessionEndReason;
  /** Unix ms — when the current 20s round ends (active state only) */
  roundEndsAt: number | null;
  /** Unix ms — when the 5min match extension ends */
  extendedUntil: number | null;
  /** Consecutive rounds without swiping (0–3) */
  idleStrikes: number;
  /** True when the peer just left — consumed once per poll */
  peerLeft?: boolean;
};
