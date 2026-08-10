import { BrowseClient } from "@/components/BrowseClient";
import { Suspense } from "react";
import { Spinner } from "@/components/Spinner";

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[var(--ink)]">
          <Spinner size="lg" />
        </div>
      }
    >
      <BrowseClient />
    </Suspense>
  );
}
