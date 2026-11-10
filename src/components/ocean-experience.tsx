"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";\nimport { useRef } from "react";
import { oceanContent } from "@/content/ocean";

export function OceanExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="ocean-experience" id="ocean" aria-labelledby="ocean-title">
      <div className="ocean-sky" aria-hidden="true">
        <div className="ocean-sun-glow" />
        <motion.div className="ocean-sun-disc" style={reduceMotion ? undefined : { y: sunOffset }} />
        <div className="ocean-cloud ocean-cloud--one" />
        <div className="ocean-cloud ocean-cloud--two" />
        <div className="ocean-birds">⌁　⌁</div>
      </div>

      <div className="ocean-hero-copy">
        <span className="ocean-eyebrow">{oceanContent.eyebrow}</span>
        <motion.h2
          id="ocean-title"
          initial={reduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {oceanContent.title}<br /><em>{oceanContent.titleAccent}</em>
        </motion.h2>
        <p>{oceanContent.introduction}</p>
        <a href="#tide-notes" className="ocean-discover">
          <span>DISCOVER THE BLUE</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="ocean-horizon-scene" aria-hidden="true">
        <motion.div className="ocean-distant-shore" style={reduceMotion ? undefined : { y: shoreOffset }} />
        <div className="ocean-water">
          <div className="ocean-reflection" />
          <motion.div
            className="ocean-wave ocean-wave--back"
            animate={reduceMotion ? undefined : { x: ["-2%", "2%", "-2%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="ocean-wave ocean-wave--middle"
            animate={reduceMotion ? undefined : { x: ["2%", "-2%", "2%"] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="ocean-wave ocean-wave--front"
            animate={reduceMotion ? undefined : { x: ["-1%", "1%", "-1%"] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="ocean-water-glimmer" />
        </div>
        <div className="ocean-shoreline" />
      </div>

      <div className="ocean-horizon-caption">
        <span>{oceanContent.horizonLabel}</span>
        <span>29°12′ — A LITTLE UNIVERSE</span>
      </div>

      <div className="tide-notes" id="tide-notes">
        <div className="tide-notes-heading">
          <span className="ocean-eyebrow">{oceanContent.memoriesEyebrow}</span>
          <h3>{oceanContent.memoriesTitle}<br /><em>{oceanContent.memoriesAccent}</em></h3>
          <p>{oceanContent.memoriesIntro}</p>
        </div>

        <div className="tide-note-grid">
          {oceanContent.memories.map((memory, index) => (
            <motion.article
              className={`tide-note tide-note--${memory.tone}`}
              key={memory.number}
              initial={reduceMotion ? false : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.12 }}
            >
              <div className="tide-note-art" aria-hidden="true">
                <span className="tide-note-orbit" />
                <span className="tide-note-sun" />
                <span className="tide-note-wave tide-note-wave--one" />
                <span className="tide-note-wave tide-note-wave--two" />
                <span className="tide-note-number">{memory.number}</span>
              </div>
              <div className="tide-note-copy">
                <span>FIELD NOTE / {memory.number}</span>
                <h4>{memory.title}</h4>
                <p>{memory.note}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="ocean-closing">{oceanContent.closing}</p>
      </div>
    </section>
  );
}
