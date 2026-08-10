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

/** Progressive fallback: both → video only → audio only */
export async function requestMediaAccess(): Promise<MediaAccess> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException("HTTPS requis", "SecurityError");
  }

  const attempts: MediaStreamConstraints[] = [
    { video: true, audio: true },
    { video: true, audio: false },
    { audio: true, video: false },
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
