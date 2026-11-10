import { ActCard } from "@/components/act-card";
import { SectionHeading } from "@/components/section-heading";
import { CinematicIntro } from "@/components/cinematic-intro";
import { acts, siteContent } from "@/content/site";

export default function HomePage() {
  return (
    <main>
      <CinematicIntro />

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
        <span>A JOURNEY THROUGH OUR LITTLE UNIVERSE</span>
      </footer>
    </main>
  );
}
