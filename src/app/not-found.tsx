import Link from "next/link";

export default function NotFound() {
  return (
    <main className="system-state">
      <span className="system-state-eyebrow">PROJECT 29.12 · LOST IN THE GARDEN</span>
      <h1>This page is<br /><em>not in our story.</em></h1>
      <p>The page you are looking for does not exist or may have moved.</p>
      <Link href="/">RETURN TO THE BEGINNING <span aria-hidden="true">↗</span></Link>
    </main>
  );
}
