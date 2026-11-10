"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type TapeTrack = {
  id: string;
  title: string;
  fileName: string;
  src: string | null;
  side: "A" | "B";
};

const initialTracks: TapeTrack[] = [
  { id: "a1", title: "The first little thing", fileName: "Add your first song", src: null, side: "A" },
  { id: "a2", title: "A familiar feeling", fileName: "A song that feels like home", src: null, side: "A" },
  { id: "b1", title: "Somewhere by the sea", fileName: "A memory in sound", src: null, side: "B" },
  { id: "b2", title: "Until the next chapter", fileName: "The last song on the tape", src: null, side: "B" },
];

const MAX_AUDIO_FILE_SIZE = 100 * 1024 * 1024;

const timeLabel = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return mins + ":" + secs;
};

export function MixtapeExperience() {
  const [tracks, setTracks] = useState<TapeTrack[]>(initialTracks);
  const [side, setSide] = useState<"A" | "B">("A");
  const [activeId, setActiveId] = useState("a1");
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const reduceMotion = useReducedMotion();

  const visibleTracks = useMemo(
    () => tracks.filter((track) => track.side === side),
    [tracks, side],
  );
  const activeTrack = visibleTracks.find((track) => track.id === activeId) ?? visibleTracks[0];
  const playableTracks = visibleTracks.filter((track) => track.src);
  const sideACount = tracks.filter((track) => track.side === "A" && track.src).length;
  const sideBCount = tracks.filter((track) => track.side === "B" && track.src).length;

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

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  const chooseSide = (nextSide: "A" | "B") => {
    setSide(nextSide);
    const nextTrack = tracks.find((track) => track.side === nextSide);
    setActiveId(nextTrack?.id ?? "");
    setAudioError("");
  };

  const addAudioFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const selectedFiles = Array.from(files);
    const audioFiles = selectedFiles.filter((file) => file.type.startsWith("audio/"));
    const oversizedFiles = audioFiles.filter((file) => file.size > MAX_AUDIO_FILE_SIZE);

    if (!audioFiles.length) {
      setAudioError("Please choose a supported audio file.");
      return;
    }
    if (oversizedFiles.length) {
      setAudioError("Each audio file must be 100 MB or smaller. Larger files were skipped.");
    } else {
      setAudioError("");
    }

    const acceptedFiles = audioFiles.filter((file) => file.size <= MAX_AUDIO_FILE_SIZE);
    if (!acceptedFiles.length) return;

    const existingAudioCount = tracks.filter((track) => track.src).length;
    const additions: TapeTrack[] = acceptedFiles.map((file, index) => {
      const src = URL.createObjectURL(file);
      objectUrlsRef.current.push(src);
      return {
        id: "local-" + Date.now() + "-" + index + "-" + Math.random().toString(36).slice(2, 8),
        title: file.name.replace(/\.[^/.]+$/, "") || "Untitled track",
        fileName: file.name,
        src,
        side: (existingAudioCount + index) % 2 === 0 ? "A" : "B",
      };
    });

    setTracks((current) => [...current.filter((track) => track.src), ...additions]);
    setSide(additions[0].side);
    setActiveId(additions[0].id);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        setAudioError("This file could not be played by your browser. Try another audio format.");
      }
    } else {
      audio.pause();
    }
  };

  const moveTrack = (direction: -1 | 1) => {
    if (!playableTracks.length) return;
    const index = playableTracks.findIndex((track) => track.id === activeTrack?.id);
    const nextIndex = index < 0
      ? 0
      : (index + direction + playableTracks.length) % playableTracks.length;
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
          <span className="mixtape-eyebrow">CHAPTER 06 — THE SOUNDTRACK</span>
          <h2 id="mixtape-title">Some moments<br /><em>sound like us.</em></h2>
          <p>A little collection of songs, saved like pressed flowers between the pages of a favourite book.</p>
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
            <div className="cassette-shell">
              <div className="cassette-label">
                <div className="cassette-label-top">
                  <span>THE LITTLE THINGS</span>
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
              <span>{(sideACount + sideBCount).toString().padStart(2, "0")} TRACKS ADDED</span>
            </div>
          </motion.div>

          <div className="mixtape-console">
            <div className="mixtape-console-heading">
              <div><span className="mixtape-small-label">NOW PLAYING</span><h3>{activeTrack?.title ?? "Choose a song"}</h3></div>
              <span className={"mixtape-live-dot" + (playing ? " is-active" : "")} aria-hidden="true" />
            </div>
            <p className="mixtape-track-subtitle">{activeTrack?.src ? activeTrack.fileName : "Your soundtrack is waiting for its songs."}</p>

            <div className="mixtape-side-tabs" aria-label="Tape sides">
              <button type="button" aria-pressed={side === "A"} className={side === "A" ? "is-active" : ""} onClick={() => chooseSide("A")}>SIDE A <span>{String(sideACount).padStart(2, "0")}</span></button>
              <button type="button" aria-pressed={side === "B"} className={side === "B" ? "is-active" : ""} onClick={() => chooseSide("B")}>SIDE B <span>{String(sideBCount).padStart(2, "0")}</span></button>
            </div>

            <div className="mixtape-track-list" aria-live="polite">
              {visibleTracks.length === 0 ? (
                <p className="mixtape-empty-side">This side is waiting for a song.</p>
              ) : visibleTracks.map((track, index) => (
                <button
                  type="button"
                  key={track.id}
                  className={"mixtape-track" + (activeTrack?.id === track.id ? " is-current" : "")}
                  aria-pressed={activeTrack?.id === track.id}
                  onClick={() => setActiveId(track.id)}
                >
                  <span className="mixtape-track-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mixtape-track-info"><strong>{track.title}</strong><small>{track.src ? track.fileName : "A place for a favourite song"}</small></span>
                  <span className="mixtape-track-state">{activeTrack?.id === track.id && playing ? "PLAYING" : track.src ? "READY" : "EMPTY"}</span>
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

            <div className="mixtape-add-row">
              <button type="button" className="mixtape-add-button" onClick={() => fileInputRef.current?.click()}>＋ ADD YOUR SONGS</button>
              <span>MP3 · WAV · M4A · OGG</span>
              <input ref={fileInputRef} type="file" accept="audio/*" multiple hidden onChange={(event) => addAudioFiles(event.target.files)} />
            </div>
            <p className="mixtape-local-note">Audio files stay in this browser session. Nothing is uploaded to a server.</p>
            <p className="mixtape-audio-status" role="status" aria-live="polite">{audioError}</p>
          </div>
        </div>

        <div className="mixtape-note">
          <span className="mixtape-note-mark">“</span>
          <p>Some songs become places. You hear the first note, and suddenly you are there again.</p>
          <span>— A NOTE BETWEEN TRACKS</span>
        </div>
      </div>
      <audio
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
            setAudioError("The selected audio file could not be loaded. Try a different file.");
          }
        }}
        onEnded={handleTrackEnded}
      />
    </section>
  );
}
