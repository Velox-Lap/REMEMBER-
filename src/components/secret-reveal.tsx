"use client";

import { useState } from "react";
import { secretContent } from "@/content/secret";

export function SecretReveal() {
  const [revealed, setRevealed] = useState<string[]>([]);
  const [finalOpen, setFinalOpen] = useState(false);

  const revealFlower = (id: string) => {
    setRevealed((current) =>
      current.includes(id) ? current : [...current, id],
    );
  };

  const replay = () => {
    setRevealed([]);
    setFinalOpen(false);
  };

  return (
    <section className="secret-section" id="secret">
      <div className="secret-shell">
        <header className="secret-heading">
          <span className="secret-eyebrow">{secretContent.eyebrow}</span>
          <h2>{secretContent.title.split("\n").map((line, index) => (
            <span key={line}>{index === 1 ? <em>{line}</em> : line}</span>
          ))}</h2>
          <p>{secretContent.description}</p>
        </header>

        <div className="secret-garden" aria-label="Interactive secret garden">
          <div className="secret-garden-orbit secret-garden-orbit--one" />
          <div className="secret-garden-orbit secret-garden-orbit--two" />
          {secretContent.flowers.map((flower, index) => {
            const isRevealed = revealed.includes(flower.id);
            return (
              <article
                className={`secret-flower-card secret-flower-card--${index + 1}${isRevealed ? " is-revealed" : ""}`}
                key={flower.id}
              >
                <button
                  className="secret-flower-button"
                  type="button"
                  onClick={() => revealFlower(flower.id)}
                  aria-expanded={isRevealed}
                  aria-controls={`secret-note-${flower.id}`}
                >
                  <span className="secret-flower-illustration" aria-hidden="true">
                    <i /><i /><i /><i /><i /><i /><b />
                  </span>
                  <span className="secret-flower-number">{flower.number}</span>
                  <span className="secret-flower-name">{flower.name}</span>
                  <span className="secret-flower-action">
                    {isRevealed ? "DISCOVERED" : "TAP TO DISCOVER"}
                  </span>
                </button>
                <div
                  className="secret-flower-note"
                  id={`secret-note-${flower.id}`}
                  hidden={!isRevealed}
                >
                  <span>{flower.prompt}</span>
                  <p>{flower.note}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="secret-progress" aria-live="polite">
          <span>{String(revealed.length).padStart(2, "0")} / 03 FLOWERS DISCOVERED</span>
          <div className="secret-progress-track">
            <span style={{ width: `${(revealed.length / secretContent.flowers.length) * 100}%` }} />
          </div>
        </div>

        <div className="final-reveal-wrap" id="final">
          {!finalOpen ? (
            <button
              className="final-reveal-button"
              type="button"
              onClick={() => setFinalOpen(true)}
              disabled={revealed.length !== secretContent.flowers.length}
            >
              <span>THE LAST LITTLE SECRET</span>
              <strong>{revealed.length === secretContent.flowers.length ? "Open the final chapter" : "Find all three flowers first"} <i aria-hidden="true">↗</i></strong>
            </button>
          ) : (
            <div className="final-reveal-card" role="status">
              <span className="final-reveal-eyebrow">{secretContent.revealEyebrow}</span>
              <div className="final-reveal-date">{secretContent.revealTitle}</div>
              <h3>{secretContent.revealSubtitle}</h3>
              <p>{secretContent.revealMessage}</p>
              <span className="final-reveal-mark">PROJECT 29.12 · END OF CHAPTER</span>
              <button className="final-replay-button" type="button" onClick={replay}>
                {secretContent.replayLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
