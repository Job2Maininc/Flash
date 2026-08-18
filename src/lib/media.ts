import type { Dictionary } from "@/lib/i18n";

export const PREVIEW_VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  facingMode: { ideal: "user" },
  width: { ideal: 1280, max: 1920 },
  height: { ideal: 720, max: 1080 },
};

export const PREVIEW_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
};

export type MediaAccess = {
  video: boolean;
  audio: boolean;
};

type MediaErrorCopy = Pick<
  Dictionary["media"],
  "denied" | "notFound" | "inUse" | "overconstrained" | "https" | "generic"
>;

const DEFAULT_MEDIA_ERRORS: MediaErrorCopy = {
  denied:
    "Access denied. Tap “Enable camera” or allow the site in your browser (icon left of the URL).",
  notFound: "No camera or microphone detected on this device.",
  inUse: "Camera or microphone is already used by another app.",
  overconstrained: "Couldn’t use camera/mic with the requested settings.",
  https: "HTTPS is required for camera and microphone.",
  generic: "Couldn’t access the camera or microphone.",
};

export function humanizeMediaError(
  error: unknown,
  copy?: MediaErrorCopy,
): string {
  const messages = copy ?? DEFAULT_MEDIA_ERRORS;

  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return messages.denied;
      case "NotFoundError":
      case "DevicesNotFoundError":
        return messages.notFound;
      case "NotReadableError":
      case "TrackStartError":
        return messages.inUse;
      case "OverconstrainedError":
        return messages.overconstrained;
      case "SecurityError":
        return messages.https;
      default:
        return error.message || messages.generic;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return messages.generic;
}

/** Opens camera/mic for permission check — prefer LocalPreview stream on browse. */
export async function requestMediaAccess(): Promise<MediaAccess> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException("HTTPS required", "SecurityError");
  }

  const attempts: MediaStreamConstraints[] = [
    {
      video: PREVIEW_VIDEO_CONSTRAINTS,
      audio: PREVIEW_AUDIO_CONSTRAINTS,
    },
    { video: PREVIEW_VIDEO_CONSTRAINTS, audio: false },
    { audio: PREVIEW_AUDIO_CONSTRAINTS, video: false },
  ];

  let lastError: unknown = null;

  for (const constraints of attempts) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => track.stop());
      return {
        video: Boolean(constraints.video),
        audio: Boolean(constraints.audio),
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("getUserMedia failed");
}

export async function playVideoElement(video: HTMLVideoElement): Promise<void> {
  video.muted = true;
  video.playsInline = true;
  try {
    await video.play();
  } catch {
    // iOS may reject until next gesture — ignore
  }
}
