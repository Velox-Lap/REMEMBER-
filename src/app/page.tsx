import { ActCard } from "@/components/act-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { acts, siteContent } from "@/content/site";

export default function HomePage() {
  return (
    <main>
      <section className="intro-scene" id="intro" aria-labelledby="intro-title">
        <div className="intro-grain" aria-hidden="true" />
        <div className="intro-glow intro-glow--one" aria-hidden="true" />
        <div className="intro-glow intro-glow--two" aria-hidden="true" />
        <SiteHeader />

        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-overline">
              <span className="overline-line" />
              AN EXPERIENCE MADE WITH CARE
            </p>
            <h1 id="intro-title">
              A Little World,
              <br />
              <em>Just for You.</em>
            </h1>
            <p className="hero-description">
              {siteContent.openingSubtitle}
            </p>
            <a className="enter-link" href="#garden">
              <span className="enter-link-icon" aria-hidden="true">↘</span>
              <span>{siteContent.enterLabel}</span>
            </a>
          </div>

          <div className="hero-art" aria-label="Abstract botanical illustration">
            <div className="hero-art-halo" />
            <div className="hero-art-stem hero-art-stem--one" />
            <div className="hero-art-stem hero-art-stem--two" />
            <div className="hero-art-leaf hero-art-leaf--one" />
            <div className="hero-art-leaf hero-art-leaf--two" />
            <div className="hero-art-leaf hero-art-leaf--three" />
            <div className="hero-art-flower">
              <span /><span /><span /><span /><span /><span />
              <i />
            </div>
            <span className="hero-art-caption">A QUIET PLACE TO BEGIN</span>
          </div>
        </div>

        <div className="hero-bottom">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-indicator" aria-hidden="true" />
          <span>01 — 08</span>
        </div>
      </section>

      <section className="acts-section section-wrap" id="garden">
        <div className="acts-intro">
          <SectionHeading
            eyebrow="THE WORLD WE MADE"
            title="Three little worlds."
            description="One continuous journey, told in three acts. Take your time."
          />
          <p className="acts-side-note">
            Every chapter holds a different atmosphere.
            <span>None of it needs to be hurried.</span>
          </p>
        </div>

        <div className="acts-grid">
          {acts.map((act) => <ActCard key={act.number} {...act} />)}
        </div>
      </section>

      <section className="foundation-note" id="story">
        <div className="foundation-note-inner">
          <span className="eyebrow">A NOTE BEFORE WE BEGIN</span>
          <p>
            The most meaningful parts of this experience will come from
            <em> your own moments, words, and photographs.</em>
          </p>
          <span className="handwritten">The details will make it yours.</span>
        </div>
      </section>

      <section className="ocean-teaser" id="ocean">
        <div className="ocean-teaser-content">
          <span className="eyebrow">ACT II — THE OCEAN</span>
          <h2>Some things stay,<br /><em>like the sea.</em></h2>
          <p>A horizon is only the beginning of another story.</p>
        </div>
        <div className="ocean-sun" aria-hidden="true" />
        <div className="ocean-horizon" aria-hidden="true" />
      </section>

      <footer className="site-footer" id="final">
        <span>{siteContent.footerNote}</span>
        <span> A JOURNEY THROUGH OUR LITTLE UNIVERSE </span>
      </footer>
    </main>
  );
}
