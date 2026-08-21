"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export type LocalPreviewStatus =
  | "idle"
  | "requesting"
  | "live"
  | "denied"
  | "unsupported";

type Options = {
  /** Root watched by IntersectionObserver — stop when fully out of view. */
  rootRef?: RefObject<HTMLElement | null>;
};

/**
 * Local-only camera preview for the marketing hero.
 * Stream stays on a muted <video> — never LiveKit / peer / upload / lifted state.
 */
export function useLocalPreview(options?: Options) {
  const [status, setStatus] = useState<LocalPreviewStatus>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);
  const unsupportedRef = useRef(false);
  const rootRef = options?.rootRef;

  const stop = useCallback(() => {
    requestIdRef.current += 1;
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }
    setStatus(unsupportedRef.current ? "unsupported" : "idle");
  }, []);

  const start = useCallback(async () => {
    if (typeof window === "undefined") return;

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      unsupportedRef.current = true;
      setStatus("unsupported");
      return;
    }

    const requestId = ++requestIdRef.current;
    setStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
        },
        audio: false,
      });

      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        try {
          await video.play();
        } catch {
          // autoplay can fail briefly; track still attached
        }
      }
      unsupportedRef.current = false;
      setStatus("live");
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      if (
        error instanceof DOMException &&
        (error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError")
      ) {
        setStatus("denied");
        return;
      }
      if (
        error instanceof DOMException &&
        (error.name === "NotFoundError" ||
          error.name === "NotSupportedError" ||
          error.name === "SecurityError")
      ) {
        unsupportedRef.current = true;
        setStatus("unsupported");
        return;
      }
      setStatus("denied");
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "hidden") {
        stop();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [stop]);

  useEffect(() => {
    const el = rootRef?.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio === 0 && !entry.isIntersecting) {
          stop();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootRef, stop]);

  return { status, videoRef, start, stop };
}
