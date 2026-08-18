"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { FlashIntro } from "@/components/FlashIntro";
import { SiteHeader } from "@/components/SiteHeader";
import { INTRO_COOKIE } from "@/lib/intro";

type Props = {
  skipIntro?: boolean;
};

export function HomeIntroHeader({ skipIntro = false }: Props) {
  const brandRef = useRef<HTMLDivElement>(null);
  const [intro, setIntro] = useState<"play" | "off">(skipIntro ? "off" : "play");

  useLayoutEffect(() => {
    if (skipIntro) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntro("off");
    }
  }, [skipIntro]);

  const onComplete = useCallback(() => {
    document.cookie = `${INTRO_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax`;
    setIntro("off");
  }, []);

  return (
    <>
      {intro === "play" ? (
        <FlashIntro targetRef={brandRef} onComplete={onComplete} />
      ) : null}
      <SiteHeader brandRef={brandRef} brandHidden={intro === "play"} />
    </>
  );
}
