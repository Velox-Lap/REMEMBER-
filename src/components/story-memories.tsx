"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { memoryItems, storyMoments, type MemoryItem } from "@/content/memories";

function MemoryArtwork({ tone }: { tone: MemoryItem["tone"] }) {
  return (
    <div className={`memory-art memory-art--${tone}`} aria-hidden="true">
      <span className="memory-art-orbit" />
      <span className="memory-art-shape memory-art-shape--one" />
      <span className="memory-art-shape memory-art-shape--two" />
      <span className="memory-art-stamp">29.12</span>
      <span className="memory-art-placeholder">YOUR PHOTO HERE</span>
    </div>
  );
}

export function StoryMemories() {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [filterTone, setFilterTone] = useState<"all" | MemoryItem["tone"]>("all");
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const filteredMemoryItems = filterTone === "all"
    ? memoryItems
    : memoryItems.filter((memory) => memory.tone === filterTone);
  const selectedIndex = selectedMemory
    ? memoryItems.findIndex((memory) => memory.id === selectedMemory.id)
    : -1;

  useEffect(() => {
    if (!selectedMemory) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedMemory(null);
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (selectedIndex + direction + memoryItems.length) % memoryItems.length;
        setSelectedMemory(memoryItems[nextIndex]);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [selectedMemory, selectedIndex]);

  const moveMemory = (direction: -1 | 1) => {
    const nextIndex = (selectedIndex + direction + memoryItems.length) % memoryItems.length;
    setSelectedMemory(memoryItems[nextIndex]);
  };

  const filters: { value: "all" | MemoryItem["tone"]; label: string }[] = [
    { value: "all", label: "ALL FRAMES" },
    { value: "sage", label: "SAGE" },
    { value: "sand", label: "SAND" },
    { value: "blue", label: "OCEAN" },
    { value: "moss", label: "MOSS" },
  ];

  return (
    <>
      <section className="story-section" id="story" aria-labelledby="story-title">
        <div className="story-shell">
          <div className="story-heading">
            <div>
              <span className="eyebrow">CHAPTER 02 — THE STORY</span>
              <h2 id="story-title">Little moments,<br /><em>along the way.</em></h2>
            </div>
            <p>Not every important moment is loud. Some simply find a place to stay.</p>
          </div>

          <div className="story-timeline">
            <div className="timeline-rail" aria-hidden="true" />
            {storyMoments.map((moment, index) => (
              <motion.article
                className={`timeline-entry timeline-entry--${index % 2 === 0 ? "left" : "right"}`}
                key={moment.chapter}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : index * 0.06 }}
              >
                <span className="timeline-marker" aria-hidden="true" />
                <div className="timeline-card">
                  <span className="timeline-chapter">{moment.chapter}</span>
                  <span className="timeline-date">{moment.date}</span>
                  <h3>{moment.title}</h3>
                  <p>{moment.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="memories-section" id="memories" aria-labelledby="memories-title">
        <div className="memories-shell">
          <div className="memories-heading">
            <span className="eyebrow">A SCRAPBOOK OF US</span>
            <h2 id="memories-title">Collected <em>memories.</em></h2>
            <p>Six little frames, ready for photographs and the stories behind them.</p>
          </div>

          <div className="memory-filters" role="group" aria-label="Filter memories by color theme">
            {filters.map((filter) => (
              <button
                className="memory-filter"
                key={filter.value}
                type="button"
                aria-pressed={filterTone === filter.value}
                onClick={() => setFilterTone(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="memory-grid" aria-live="polite">
            {filteredMemoryItems.map((memory, index) => (
              <motion.button
                className={`memory-card memory-card--${index % 3}`}
                key={memory.id}
                type="button"
                onClick={() => setSelectedMemory(memory)}
                whileHover={reduceMotion ? undefined : { y: -7, rotate: index % 2 === 0 ? -1 : 1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                aria-label={`Open memory: ${memory.title}`}
              >
                <MemoryArtwork tone={memory.tone} />
                <span className="memory-card-copy">
                  <span className="memory-card-date">{memory.date}</span>
                  <span className="memory-card-title">{memory.title}</span>
                  <span className="memory-card-caption">{memory.caption}</span>
                </span>
                <span className="memory-card-open">VIEW MEMORY ↗</span>
              </motion.button>
            ))}
          </div>
          <p className="memories-footnote">
            Showing {filteredMemoryItems.length} of {memoryItems.length} frames. Replace each illustrated frame with a photograph from your own collection.
          </p>
        </div>
      </section>

      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            className="memory-lightbox"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedMemory(null);
            }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <motion.div
              className="lightbox-panel"
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lightbox-title"
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            >
              <button ref={closeButtonRef} className="lightbox-close" type="button" onClick={() => setSelectedMemory(null)} aria-label="Close memory viewer">×</button>
              <MemoryArtwork tone={selectedMemory.tone} />
              <div className="lightbox-copy">
                <span className="eyebrow">{selectedMemory.date}</span>
                <h3 id="lightbox-title">{selectedMemory.title}</h3>
                <p>{selectedMemory.caption}</p>
                <span className="handwritten">A moment worth keeping.</span>
                <div className="lightbox-navigation">
                  <button type="button" onClick={() => moveMemory(-1)}>← PREVIOUS</button>
                  <span>{String(selectedIndex + 1).padStart(2, "0")} / {String(memoryItems.length).padStart(2, "0")}</span>
                  <button type="button" onClick={() => moveMemory(1)}>NEXT →</button>
                </div>
                <span className="lightbox-keyboard-hint">USE ← → TO EXPLORE · ESC TO CLOSE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
