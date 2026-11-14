"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PROJECT 29.12 experience error:", error);
  }, [error]);

  return (
    <main className="system-state">
      <span className="system-state-eyebrow">PROJECT 29.12 · A LITTLE PAUSE</span>
      <h1>Something interrupted<br /><em>our little world.</em></h1>
      <p>The experience could not finish loading. You can try this chapter again.</p>
      <button type="button" onClick={() => reset()}>TRY AGAIN <span aria-hidden="true">↗</span></button>
    </main>
  );
}
