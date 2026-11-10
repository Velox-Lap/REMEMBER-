"use client";

import { useEffect, useState } from "react";

const chapters = [
  { id: "intro", label: "Beginning", number: "01" },
  { id: "garden", label: "The Garden", number: "02" },
  { id: "story", label: "Our Story", number: "03" },
  { id: "memories", label: "Memories", number: "04" },
  { id: "letter", label: "The Letter", number: "05" },
  { id: "ocean", label: "The Ocean", number: "06" },
  { id: "secret", label: "The Secret", number: "07" },
  { id: "final", label: "29.12", number: "08" },
];

export function ExperienceChrome() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("intro");
  const activeIndex = Math.max(0, chapters.findIndex((chapter) => chapter.id === active));

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const nodes = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
    if (!nodes.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target instanceof HTMLElement) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -48% 0px", threshold: [0, 0.15, 0.35, 0.6] });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <nav className="chapter-dock" aria-label="Journey chapters">
        <span className="chapter-dock-label">CHAPTERS</span>
        {chapters.map((chapter, index) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            className={active === chapter.id ? "is-active" : ""}
            aria-label={`${chapter.number} — ${chapter.label}`}
            aria-current={active === chapter.id ? "location" : undefined}
            title={chapter.label}
          >
            <span>{chapter.number}</span>
            <i aria-hidden="true" />
          </a>
        ))}
        <span className="chapter-dock-count">{String(activeIndex + 1).padStart(2, "0")} / 08</span>
      </nav>
      <a className="back-to-top" href="#intro" aria-label="Back to the beginning">
        <span aria-hidden="true">↑</span>
        <span>BACK TO TOP</span>
      </a>
    </>
  );
}
