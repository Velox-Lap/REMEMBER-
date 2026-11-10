"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { siteContent } from "@/content/site";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function CinematicIntro() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="intro-scene" id="intro" aria-labelledby="intro-title">
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-glow intro-glow--one" aria-hidden="true" />
      <div className="intro-glow intro-glow--two" aria-hidden="true" />
      <div className="intro-atmosphere" aria-hidden="true">
        <span className="atmosphere-particle atmosphere-particle--one" />
        <span className="atmosphere-particle atmosphere-particle--two" />
        <span className="atmosphere-particle atmosphere-particle--three" />
        <span className="atmosphere-particle atmosphere-particle--four" />
      </div>
      <SiteHeader />

      <div className="hero-layout">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <p className="hero-overline">
            <span className="overline-line" />
            AN EXPERIENCE MADE WITH CARE
          </p>
          <h1 id="intro-title">
            A Little World,
            <br />
            <em>Just for You.</em>
          </h1>
          <p className="hero-description">{siteContent.openingSubtitle}</p>
          <motion.a
            className="enter-link"
            href="#garden"
            whileHover={reduceMotion ? undefined : { x: 7 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <span className="enter-link-icon" aria-hidden="true">↘</span>
            <span>{siteContent.enterLabel}</span>
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-art"
          role="img"
          aria-label="An abstract flower surrounded by delicate botanical shapes"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.88, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <motion.div
            className="hero-art-halo"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          />
          <div className="hero-art-stem hero-art-stem--one" />
          <div className="hero-art-stem hero-art-stem--two" />
          <div className="hero-art-leaf hero-art-leaf--one" />
          <div className="hero-art-leaf hero-art-leaf--two" />
          <div className="hero-art-leaf hero-art-leaf--three" />
          <motion.div
            className="hero-art-flower"
            animate={reduceMotion ? undefined : { y: [0, -9, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span /><span /><span /><span /><span /><span />
            <i />
          </motion.div>
          <span className="hero-art-caption">A QUIET PLACE TO BEGIN</span>
        </motion.div>
      </div>

      <motion.a
        className="hero-bottom"
        href="#garden"
        aria-label="Scroll down to explore the garden"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <span>SCROLL TO EXPLORE</span>
        <motion.span
          className="scroll-indicator"
          aria-hidden="true"
          animate={reduceMotion ? undefined : { scaleY: [0.55, 1, 0.55], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span>01 — 08</span>
      </motion.a>
    </section>
  );
}
