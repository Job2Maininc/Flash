"use client";

import { useCallback, useRef, useState } from "react";
import { FlashIntro } from "@/components/FlashIntro";
import { SiteHeader } from "@/components/SiteHeader";

export function HomeIntroHeader() {
  const brandRef = useRef<HTMLDivElement>(null);
  const [intro, setIntro] = useState<"play" | "off">("play");

  const onComplete = useCallback(() => {
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
