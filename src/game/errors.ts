export type ErrorCode =
  | "gameStarted"
  | "needPlayers"
  | "roomFull"
  | "notPlayingPhase"
  | "unknownPlayer"
  | "czarCantPlay"
  | "alreadyPlayed"
  | "invalidPlay"
  | "notJudgingPhase"
  | "onlyCzarPicks"
  | "invalidAnswer"
  | "roundNotOver"
  | "notEnded"
  | "needPack"
  | "notEnoughCards"
  | "unknownLanguage"
  | "onlyCzarOrHost"
  | "signalingUnreachable"
  | "signalingError"
  | "roomCodeFailed"
  | "roomNotFound"
  | "roomNoResponse"
  | "roomRefused"
  | "connectionClosed"
  | "connectionLost"
  | "kicked"
  | "hostClosed"
  | "savedRoomMissing"
  | "generic";

export type ErrorParams = Record<string, string | number>;

export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly params?: ErrorParams,
  ) {
    super(code);
  }
}

export interface Notice {
  code: ErrorCode;
  params?: ErrorParams;
}

export const toNotice = (err: unknown): Notice =>
  err instanceof AppError
    ? { code: err.code, params: err.params }
    : { code: "generic" };
