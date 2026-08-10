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

export function humanizeMediaError(error: unknown): string {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "Accès refusé. Clique sur « Activer caméra » ou autorise le site dans Chrome (icône à gauche de l’URL).";
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "Aucune caméra ou micro détecté sur cet appareil.";
      case "NotReadableError":
      case "TrackStartError":
        return "Caméra ou micro déjà utilisé par une autre application.";
      case "OverconstrainedError":
        return "Impossible d’utiliser la caméra/micro avec les paramètres demandés.";
      case "SecurityError":
        return "HTTPS requis pour la caméra et le micro.";
      default:
        return error.message || "Impossible d’accéder à la caméra ou au micro.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Impossible d’accéder à la caméra ou au micro.";
}

/** Opens camera/mic for permission check — prefer LocalPreview stream on browse. */
export async function requestMediaAccess(): Promise<MediaAccess> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException("HTTPS requis", "SecurityError");
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
