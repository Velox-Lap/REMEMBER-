"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { letterContent } from "@/content/letter";

export function LetterExperience() {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section className="letter-section" id="letter" aria-labelledby="letter-title">
      <div className="letter-shell">
        <div className="letter-intro">
          <span className="eyebrow">{letterContent.eyebrow}</span>
          <h2 id="letter-title">{letterContent.title}<br /><em>{letterContent.titleAccent}</em></h2>
          <p>Some thoughts deserve a little more than a message.</p>
        </div>

        <div className={`letter-stage ${isOpen ? "letter-stage--open" : ""}`}>
          <div className="letter-decoration letter-decoration--left" aria-hidden="true">✳</div>
          <div className="letter-decoration letter-decoration--right" aria-hidden="true">✳</div>

          <motion.div
            className="letter-paper"
            initial={false}
            animate={isOpen ? { y: reduceMotion ? 0 : -88, opacity: 1 } : { y: 0, opacity: 0.92 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: isOpen && !reduceMotion ? 0.35 : 0 }}
            aria-hidden={!isOpen}
          >
            <div className="letter-paper-inner">
              <span className="letter-date">{letterContent.date}</span>
              <p className="letter-recipient">{letterContent.recipient}</p>
              <div className="letter-body">
                {letterContent.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={false}
                    animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.45, delay: isOpen && !reduceMotion ? 0.65 + index * 0.18 : 0 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
              <p className="letter-closing">{letterContent.closing}</p>
              <p className="letter-signature">{letterContent.signature}</p>
              <span className="letter-paper-mark">29.12 · A LITTLE WORLD</span>
            </div>
          </motion.div>

          <div className="envelope" aria-hidden="true">
            <div className="envelope-back" />
            <div className="envelope-front" />
            <motion.div
              className="envelope-flap"
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.div
              className="envelope-seal"
              animate={isOpen ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            >
              <span>29</span>
            </motion.div>
          </div>

          <motion.button
            className="letter-open-button"
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            {isOpen ? "FOLD THE LETTER" : "OPEN YOUR LETTER"}
            <span aria-hidden="true">{isOpen ? "↗" : "↘"}</span>
          </motion.button>
          <p className="letter-hint" aria-live="polite">
            {isOpen ? "Take your time with every word." : "A small note, waiting to be opened."}
          </p>
        </div>
      </div>
    </section>
  );
}
