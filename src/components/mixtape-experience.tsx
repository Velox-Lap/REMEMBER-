"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectMixtape, ProjectMixtapeTrack } from "@/lib/project-2912-content";

type TapeTrack = ProjectMixtapeTrack & { src: string | null };

const timeLabel = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return mins + ":" + secs;
};

function publicMediaUrl(path: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !path) return null;
  const encodedPath = path.split("/").map((part) => encodeURIComponent(part)).join("/");
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/project-2912-media/${encodedPath}`;
}

export function MixtapeExperience({ content }: { content: ProjectMixtape }) {
  const tracks = useMemo<TapeTrack[]>(
    () => [...content.tracks]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((track) => ({ ...track, src: publicMediaUrl(track.storagePath) })),
    [content.tracks],
  );
  const [side, setSide] = useState<"A" | "B">("A");
  const [activeId, setActiveId] = useState("");
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const reduceMotion = useReducedMotion();

  const visibleTracks = useMemo(() => tracks.filter((track) => track.side === side), [tracks, side]);
  const activeTrack = visibleTracks.find((track) => track.id === activeId) ?? visibleTracks[0];
  const playableTracks = visibleTracks.filter((track) => track.src);
  const sideACount = tracks.filter((track) => track.side === "A" && track.src).length;
  const sideBCount = tracks.filter((track) => track.side === "B" && track.src).length;
  const coverImageUrl = publicMediaUrl(content.coverImagePath);

  useEffect(() => {
    if (!visibleTracks.some((track) => track.id === activeId)) {
      setActiveId(visibleTracks[0]?.id ?? "");
    }
  }, [activeId, visibleTracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");

    if (activeTrack?.src) audio.src = activeTrack.src;
    else audio.removeAttribute("src");

    audio.load();
  }, [activeTrack?.id, activeTrack?.src]);

  const chooseSide = (nextSide: "A" | "B") => {
    setSide(nextSide);
    setActiveId(tracks.find((track) => track.side === nextSide)?.id ?? "");
    setAudioError("");
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !activeTrack?.src) return;

    if (audio.paused) {
      try {
        setAudioError("");
        await audio.play();
      } catch {
        setPlaying(false);
        setAudioError("This song could not be played in this browser. Please try another audio format.");
      }
    } else {
      audio.pause();
    }
  };

  const moveTrack = (direction: -1 | 1) => {
    if (!playableTracks.length) return;
    const index = playableTracks.findIndex((track) => track.id === activeTrack?.id);
    const nextIndex = index < 0 ? 0 : (index + direction + playableTracks.length) % playableTracks.length;
    setActiveId(playableTracks[nextIndex].id);
  };

  const handleTrackEnded = () => {
    setPlaying(false);
    const index = playableTracks.findIndex((track) => track.id === activeTrack?.id);
    if (index >= 0 && index < playableTracks.length - 1) {
      setActiveId(playableTracks[index + 1].id);
    } else {
      setCurrentTime(duration);
    }
  };

  return (
    <section className="mixtape-section" id="mixtape" aria-labelledby="mixtape-title">
      <div className="mixtape-shell">
        <div className="mixtape-intro">
          <span className="mixtape-eyebrow">{content.eyebrow}</span>
          <h2 id="mixtape-title">{content.title}<br /><em>{content.titleAccent}</em></h2>
          <p>{content.description}</p>
        </div>

        <div className="mixtape-layout">
          <motion.div
            className={"cassette-player" + (playing ? " is-playing" : "")}
            initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cassette-player-topline">
              <span>PROJECT 29.12</span>
              <span>PERSONAL MIXTAPE · NO. 01</span>
            </div>
            {coverImageUrl ? (
              <img className="mixtape-cover-image" src={coverImageUrl} alt="Mixtape cover artwork" loading="lazy" />
            ) : null}
            <div className="cassette-shell">
              <div className="cassette-label">
                <div className="cassette-label-top">
                  <span>{content.tapeLabel || "THE LITTLE THINGS"}</span>
                  <span>29·12</span>
                </div>
                <div className="cassette-title">{side === "A" ? "A side" : "B side"}<i> / our soundtrack</i></div>
                <div className="cassette-flower" aria-hidden="true"><span /><span /><span /><span /><b /></div>
                <div className="cassette-window">
                  <div className="cassette-reel cassette-reel--left"><span /></div>
                  <div className="cassette-tape-line" />
                  <div className="cassette-reel cassette-reel--right"><span /></div>
                </div>
                <div className="cassette-label-bottom"><span>LOVE, IN EVERY LITTLE NOTE</span><span>60 MIN</span></div>
              </div>
              <div className="cassette-screws" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="cassette-notches" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            </div>
            <div className="cassette-player-bottomline">
              <span>AN OBJECT MADE OF MEMORIES</span>
              <span>{tracks.length.toString().padStart(2, "0")} TRACKS</span>
            </div>
          </motion.div>

          <div className="mixtape-console">
            <div className="mixtape-console-heading">
              <div>
                <span className="mixtape-small-label">NOW PLAYING</span>
                <h3>{activeTrack?.title || "A song waiting to be added"}</h3>
              </div>
              <span className={"mixtape-live-dot" + (playing ? " is-active" : "")} aria-hidden="true" />
            </div>
            <p className="mixtape-track-subtitle">
              {activeTrack ? [activeTrack.artist, activeTrack.fileName].filter(Boolean).join(" · ") : "The soundtrack is being prepared."}
            </p>
            {activeTrack?.note ? <p className="mixtape-track-note">{activeTrack.note}</p> : null}

            <div className="mixtape-side-tabs" aria-label="Tape sides">
              <button type="button" aria-pressed={side === "A"} className={side === "A" ? "is-active" : ""} onClick={() => chooseSide("A")}>SIDE A <span>{String(sideACount).padStart(2, "0")}</span></button>
              <button type="button" aria-pressed={side === "B"} className={side === "B" ? "is-active" : ""} onClick={() => chooseSide("B")}>SIDE B <span>{String(sideBCount).padStart(2, "0")}</span></button>
            </div>

            <div className="mixtape-track-list" aria-live="polite">
              {visibleTracks.length === 0 ? (
                <p className="mixtape-empty-side">This side is waiting for its songs.</p>
              ) : visibleTracks.map((track, index) => (
                <button
                  type="button"
                  key={track.id}
                  className={"mixtape-track" + (activeTrack?.id === track.id ? " is-current" : "")}
                  aria-pressed={activeTrack?.id === track.id}
                  onClick={() => setActiveId(track.id)}
                >
                  <span className="mixtape-track-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mixtape-track-info">
                    <strong>{track.title || "Untitled track"}</strong>
                    <small>{track.artist || track.fileName || "A place for a favourite song"}</small>
                  </span>
                  <span className="mixtape-track-state">{activeTrack?.id === track.id && playing ? "PLAYING" : track.src ? "READY" : "PENDING"}</span>
                </button>
              ))}
            </div>

            <div className="mixtape-progress">
              <div className="mixtape-progress-meta"><span>{timeLabel(currentTime)}</span><span>{timeLabel(duration)}</span></div>
              <input
                aria-label="Track position"
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                disabled={!activeTrack?.src || !duration}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (audioRef.current) audioRef.current.currentTime = value;
                  setCurrentTime(value);
                }}
              />
            </div>

            <div className="mixtape-controls">
              <button type="button" className="mixtape-skip" aria-label="Previous track" disabled={!playableTracks.length} onClick={() => moveTrack(-1)}>↶</button>
              <button type="button" className="mixtape-play" aria-label={playing ? "Pause" : "Play"} disabled={!activeTrack?.src} onClick={togglePlayback}>{playing ? "Ⅱ" : "▶"}</button>
              <button type="button" className="mixtape-skip" aria-label="Next track" disabled={!playableTracks.length} onClick={() => moveTrack(1)}>↷</button>
            </div>

            <p className="mixtape-local-note">A soundtrack chosen and arranged in the private studio.</p>
            <p className="mixtape-audio-status" role="status" aria-live="polite">{audioError}</p>
          </div>
        </div>

        <div className="mixtape-note">
          <span className="mixtape-note-mark">“</span>
          <p>{content.quote}</p>
          <span>— {content.quoteAttribution}</span>
        </div>
      </div>
      <audio
        hidden
        ref={audioRef}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          const nextDuration = event.currentTarget.duration;
          setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
        }}
        onError={() => {
          if (activeTrack?.src) {
            setPlaying(false);
            setAudioError("The selected audio file could not be loaded. Please try another format.");
          }
        }}
        onEnded={handleTrackEnded}
      />
    </section>
  );
}
