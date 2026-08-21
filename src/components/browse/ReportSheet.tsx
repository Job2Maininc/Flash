"use client";

import { FormEvent, useState } from "react";
import { REPORT_REASONS, type ReportReason } from "@/lib/constants";
import { useI18n } from "@/components/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  partnerId: string | null;
  roomId: string | null;
  onClose: () => void;
};

const REASON_ORDER: ReportReason[] = [
  "seemed_underage",
  "harassment",
  "sexual_content",
  "spam",
  "other",
];

export function ReportSheet({ open, partnerId, roomId, onClose }: Props) {
  const { t } = useI18n();
  const [reason, setReason] = useState<ReportReason>("seemed_underage");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !partnerId) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reportedId: partnerId,
          reason,
          note: note.trim() || null,
          roomId,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? t.call.reportError);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.call.reportError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={t.call.reportTitle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-t-[1.5rem] border border-[var(--ink-600)] bg-[var(--ink-800)] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[var(--elev-2)] sm:rounded-[1.5rem]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-camera-display)] text-xl font-bold text-[var(--cam-paper)]">
              {t.call.reportTitle}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.call.reportLead}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ink-600)] text-[var(--cam-paper)]"
            aria-label={t.call.reportSkip}
          >
            ✕
          </button>
        </div>

        <fieldset className="mt-5 space-y-2">
          <legend className="sr-only">{t.call.reportReason}</legend>
          {REASON_ORDER.filter((r) =>
            (REPORT_REASONS as readonly string[]).includes(r),
          ).map((value) => (
            <label
              key={value}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2.5 text-sm",
                reason === value
                  ? "border-[var(--key-500)] bg-[var(--ink-700)] text-[var(--cam-paper)]"
                  : "border-[var(--ink-600)] text-[var(--muted)]",
              )}
            >
              <input
                type="radio"
                name="reason"
                value={value}
                checked={reason === value}
                onChange={() => setReason(value)}
                className="accent-[var(--key-500)]"
              />
              {t.call.reportReasons[value]}
            </label>
          ))}
        </fieldset>

        <label className="mt-4 block">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]">
            {t.call.reportNote}
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={280}
            rows={3}
            className="mt-1.5 w-full rounded-[var(--radius-md)] border border-[var(--ink-600)] bg-[var(--ink-900)] px-3 py-2.5 text-base text-[var(--cam-paper)] focus:outline-none focus:border-[var(--key-500)]/55"
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-2">
          <Button type="submit" size="lg" loading={loading} className="w-full">
            {t.call.reportSubmit}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 text-sm text-[var(--faint)] underline-offset-4 hover:underline"
          >
            {t.call.reportSkip}
          </button>
        </div>
      </form>
    </div>
  );
}
