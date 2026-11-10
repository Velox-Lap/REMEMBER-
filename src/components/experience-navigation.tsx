"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Compass } from "lucide-react";

const chapters = [
  { id: "intro", label: "Intro", number: "01" },
  { id: "garden", label: "Garden", number: "02" },
  { id: "story", label: "Story", number: "03" },
  { id: "memories", label: "Memories", number: "04" },
  { id: "letter", label: "Letter", number: "05" },
  { id: "mixtape", label: "Mixtape", number: "06" },
  { id: "ocean", label: "Ocean", number: "07" },
  { id: "secret", label: "Secret", number: "08" },
  { id: "final", label: "Finale", number: "09" },
] as const;

export function ExperienceNavigation() {
  const [activeChapter, setActiveChapter] = useState<string>("intro");
  const [showTop, setShowTop] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [targetLabel, setTargetLabel] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveChapter(visible.target.id);
      },
      { rootMargin: "-28% 0px -48% 0px", threshold: [0, 0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    const onScroll = () => setShowTop(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navigateTo = (id: string, label: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    setTargetLabel(label);
    if (reduceMotion) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    setTransitioning(true);
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => setTransitioning(false), 720);
    }, 260);
  };

  return (
    <>
      <nav className="chapter-rail" aria-label="Chapter navigation">
        <span className="chapter-rail-label">JOURNEY</span>
        {chapters.map((chapter) => (
          <button
            className={`chapter-rail-link${activeChapter === chapter.id ? " is-active" : ""}`}
            key={chapter.id}
            type="button"
            onClick={() => navigateTo(chapter.id, chapter.label)}
            aria-label={`Go to chapter ${chapter.number}: ${chapter.label}`}
            aria-current={activeChapter === chapter.id ? "location" : undefined}
          >
            <span className="chapter-rail-number">{chapter.number}</span>
            <span className="chapter-rail-name">{chapter.label}</span>
            <span className="chapter-rail-dot" />
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="chapter-warp"
            initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
            animate={{ opacity: 1, clipPath: "circle(100% at 50% 50%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
            transition={{ duration: 0.26, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          >
            <span className="chapter-warp-orbit chapter-warp-orbit--one" />
            <span className="chapter-warp-orbit chapter-warp-orbit--two" />
            <span className="chapter-warp-kicker"><Compass size={13} /> CHANGING CHAPTER</span>
            <span className="chapter-warp-title">{targetLabel}</span>
            <span className="chapter-warp-coordinate">PROJECT 29.12 · A LITTLE WORLD</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTop && (
          <motion.button
            className="back-to-top"
            type="button"
            onClick={() => navigateTo("intro", "Back to the beginning")}
            aria-label="Back to top"
            title="Back to top"
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          >
            <ArrowUp size={17} strokeWidth={1.7} />
            <span>TOP</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
