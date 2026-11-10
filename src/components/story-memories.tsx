"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  useEffect(() => {
    if (!selectedMemory) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMemory(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedMemory]);

  return (
    <>
      <section className="story-section" aria-labelledby="story-title">
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, delay: index * 0.06 }}
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

      <section className="memories-section" aria-labelledby="memories-title">
        <div className="memories-shell">
          <div className="memories-heading">
            <span className="eyebrow">A SCRAPBOOK OF US</span>
            <h2 id="memories-title">Collected <em>memories.</em></h2>
            <p>Six little frames, ready for photographs and the stories behind them.</p>
          </div>

          <div className="memory-grid">
            {memoryItems.map((memory, index) => (
              <motion.button
                className={`memory-card memory-card--${index % 3}`}
                key={memory.id}
                type="button"
                onClick={() => setSelectedMemory(memory)}
                whileHover={{ y: -7, rotate: index % 2 === 0 ? -1 : 1 }}
                whileTap={{ scale: 0.985 }}
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
          <p className="memories-footnote">Replace each illustrated frame with a photograph from your own collection.</p>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.div
              className="lightbox-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="lightbox-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <button className="lightbox-close" type="button" onClick={() => setSelectedMemory(null)} aria-label="Close memory viewer">×</button>
              <MemoryArtwork tone={selectedMemory.tone} />
              <div className="lightbox-copy">
                <span className="eyebrow">{selectedMemory.date}</span>
                <h3 id="lightbox-title">{selectedMemory.title}</h3>
                <p>{selectedMemory.caption}</p>
                <span className="handwritten">A moment worth keeping.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
