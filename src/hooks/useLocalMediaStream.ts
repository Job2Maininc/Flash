import { useEffect, useRef, useState } from "react";
import {
  humanizeMediaError,
  playVideoElement,
  PREVIEW_VIDEO_CONSTRAINTS,
} from "@/lib/media";

type Options = {
  onReady?: () => void;
  onError?: (message: string) => void;
};

export function useLocalMediaStream(active: boolean, options?: Options) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onReadyRef = useRef(options?.onReady);
  const onErrorRef = useRef(options?.onError);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  onReadyRef.current = options?.onReady;
  onErrorRef.current = options?.onError;

  useEffect(() => {
    if (!active) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setReady(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        const message = "HTTPS requis pour la caméra.";
        setError(message);
        onErrorRef.current?.(message);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: PREVIEW_VIDEO_CONSTRAINTS,
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await playVideoElement(videoRef.current);
        }
        setReady(true);
        setError(null);
        onReadyRef.current?.();
      } catch (err) {
        if (!cancelled) {
          const message = humanizeMediaError(err);
          setError(message);
          onErrorRef.current?.(message);
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setReady(false);
    };
  }, [active]);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      playVideoElement(videoRef.current);
    }
  }, [ready]);

  useEffect(() => {
    if (!active) return;

    function onVisible() {
      if (document.visibilityState !== "visible") return;
      if (videoRef.current?.srcObject) {
        playVideoElement(videoRef.current);
      }
    }

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [active]);

  return { videoRef, ready, error };
}
