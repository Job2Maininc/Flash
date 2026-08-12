import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BrowseClient } from "@/components/BrowseClient";
import { Spinner } from "@/components/Spinner";
import { getGuestFromCookie } from "@/lib/guest";

export default async function BrowsePage() {
  let guest = null;
  try {
    guest = await getGuestFromCookie();
  } catch {
    guest = null;
  }

  if (!guest) {
    redirect("/");
  }

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
