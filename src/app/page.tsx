import { ActCard } from "@/components/act-card";
import { SectionHeading } from "@/components/section-heading";
import { CinematicIntro } from "@/components/cinematic-intro";
import { StoryMemories } from "@/components/story-memories";
import { LetterExperience } from "@/components/letter-experience";
import { OceanExperience } from "@/components/ocean-experience";
import { SecretReveal } from "@/components/secret-reveal";
import { MixtapeExperience } from "@/components/mixtape-experience";
import { ExperienceNavigation } from "@/components/experience-navigation";
import { acts, siteContent } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ExperienceNavigation />
      <main id="main-content" tabIndex={-1}>
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

      <StoryMemories />

      <section className="foundation-note">
        <div className="foundation-note-inner">
          <span className="eyebrow">A NOTE BEFORE WE BEGIN</span>
          <p>
            The most meaningful parts of this experience will come from
            <em> your own moments, words, and photographs.</em>
          </p>
          <span className="handwritten">The details will make it yours.</span>
        </div>
      </section>

      <LetterExperience />
      <MixtapeExperience />
      <OceanExperience />
      <SecretReveal />

      <footer className="site-footer" id="footer">
        <span>{siteContent.footerNote}</span>
        <span>A JOURNEY THROUGH OUR LITTLE UNIVERSE</span>
      </footer>
      </main>
    </>
  );
}
