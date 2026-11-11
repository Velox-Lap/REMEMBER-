"use client";

import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ProjectCheckpoint, ProjectContent } from "@/lib/project-2912-content";

export function SecretReveal({
  content: secretContent,
  questions,
}: {
  content: ProjectContent["secret"];
  questions: ProjectCheckpoint[];
}) {
  const [revealed, setRevealed] = useState<string[]>([]);
  const [finalOpen, setFinalOpen] = useState(false);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [checkpointAnswer, setCheckpointAnswer] = useState("");
  const [checkpointError, setCheckpointError] = useState("");
  const [checkpointUnlocked, setCheckpointUnlocked] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);

  const activeQuestion = questions[checkpointIndex];

  const verifyCheckpoint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeQuestion || !checkpointAnswer.trim() || checkingAnswer) return;

    setCheckingAnswer(true);
    setCheckpointError("");
    try {
      const client = getSupabaseBrowserClient();
      const { data, error } = await client.functions.invoke("project-2912-gateway", {
        body: {
          action: "verify_memory",
          questionKey: activeQuestion.question_key,
          answer: checkpointAnswer.trim(),
        },
      });

      if (error) throw error;
      if (data?.verified !== true) {
        setCheckpointError("ยังไม่ตรงกับความทรงจำ ลองนึกถึงวันนั้นอีกครั้งนะ");
        return;
      }

      setCheckpointAnswer("");
      if (checkpointIndex + 1 >= questions.length) {
        setCheckpointUnlocked(true);
        setCheckpointError("");
      } else {
        setCheckpointIndex((current) => current + 1);
      }
    } catch {
      setCheckpointError("ระบบตรวจสอบไม่พร้อมในขณะนี้ ลองใหม่อีกครั้งได้เลย");
    } finally {
      setCheckingAnswer(false);
    }
  };

  const revealFlower = (id: string) => {
    setRevealed((current) => current.includes(id) ? current : [...current, id]);
  };

  const replay = () => {
    setRevealed([]);
    setFinalOpen(false);
    setCheckpointIndex(0);
    setCheckpointAnswer("");
    setCheckpointError("");
    setCheckpointUnlocked(false);
  };

  return (
    <>
      <section className="secret-section" id="secret" aria-labelledby="secret-title">
        <div className="secret-shell">
          {!checkpointUnlocked ? (
            <div className="memory-checkpoint">
              <span className="secret-eyebrow">CHAPTER 08 — BEFORE THE SECRET GARDEN</span>
              <h2 id="secret-title">Three little dates,<br /><em>only we remember.</em></h2>
              <p className="memory-checkpoint-intro">
                ก่อนเปิดสวนลับ ลองย้อนกลับไปหาสามช่วงเวลาที่เป็นจุดเริ่มต้นของเรื่องราวนี้
              </p>

              {activeQuestion ? (
                <form className="memory-checkpoint-card" onSubmit={verifyCheckpoint}>
                  <div className="memory-checkpoint-meta">
                    <span>MEMORY CHECKPOINT</span>
                    <span>{String(checkpointIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
                  </div>
                  <div className="memory-checkpoint-progress" aria-hidden="true">
                    <span style={{ width: `${((checkpointIndex + 1) / questions.length) * 100}%` }} />
                  </div>
                  <h3>{activeQuestion.prompt}</h3>
                  <label className="memory-checkpoint-input">
                    <span>วันที่ของความทรงจำนี้</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={10}
                      placeholder="DD/MM/YY"
                      value={checkpointAnswer}
                      onChange={(event) => setCheckpointAnswer(event.target.value)}
                      aria-describedby="checkpoint-hint checkpoint-feedback"
                      required
                    />
                  </label>
                  <p className="memory-checkpoint-hint" id="checkpoint-hint">พิมพ์เป็นวัน/เดือน/ปี เช่น 03/07/25</p>
                  <button className="memory-checkpoint-submit" type="submit" disabled={checkingAnswer || !checkpointAnswer.trim()}>
                    {checkingAnswer ? "กำลังย้อนดูความทรงจำ..." : "ยืนยันความทรงจำ"}
                    <span aria-hidden="true">↗</span>
                  </button>
                  <p className="memory-checkpoint-feedback" id="checkpoint-feedback" aria-live="polite">{checkpointError}</p>
                </form>
              ) : (
                <div className="memory-checkpoint-card" role="status">
                  <span className="memory-checkpoint-meta">CHECKPOINTS NOT CONFIGURED</span>
                  <h3>สวนลับกำลังรอคำตอบ</h3>
                  <p>คำถามยังไม่พร้อมใช้งาน กรุณากลับมาอีกครั้งภายหลัง</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <header className="secret-heading">
                <span className="secret-eyebrow">{secretContent.eyebrow}</span>
                <h2 id="secret-title">{secretContent.title.split("\n").map((line, index) => (
                  <span key={line}>{index === 1 ? <em>{line}</em> : line}</span>
                ))}</h2>
                <p>{secretContent.description}</p>
              </header>

              <div className="secret-garden" role="group" aria-label="Interactive secret garden">
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
                <span>{String(revealed.length).padStart(2, "0")} / {String(secretContent.flowers.length).padStart(2, "0")} FLOWERS DISCOVERED</span>
                <div className="secret-progress-track">
                  <span style={{ width: `${(revealed.length / secretContent.flowers.length) * 100}%` }} />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="final-chapter" id="final" aria-labelledby="final-chapter-title">
        <div className="final-chapter-shell">
          <h2 className="final-chapter-eyebrow" id="final-chapter-title">CHAPTER 09 — THE FINALE</h2>
          <div className="final-reveal-wrap">
            {!finalOpen ? (
              <button
                className="final-reveal-button"
                type="button"
                onClick={() => setFinalOpen(true)}
                disabled={!checkpointUnlocked || revealed.length !== secretContent.flowers.length}
              >
                <span>THE LAST LITTLE SECRET</span>
                <strong>{!checkpointUnlocked
                  ? "Complete the three memory checkpoints first"
                  : revealed.length === secretContent.flowers.length
                    ? "Open the final chapter"
                    : `Find all ${secretContent.flowers.length} flowers first`} <i aria-hidden="true">↗</i></strong>
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
    </>
  );
}
