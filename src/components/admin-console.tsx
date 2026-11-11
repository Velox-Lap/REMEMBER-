"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  defaultProjectContent,
  type ProjectContent,
  type ProjectMemory,
} from "@/lib/project-2912-content";

type Tab = "home" | "story" | "letter" | "ocean" | "secret" | "gallery" | "checkpoints";
type Question = { question_key: string; prompt: string; sort_order: number; is_active: boolean };

const tabs: { id: Tab; label: string }[] = [
  { id: "home", label: "หน้าแรก" },
  { id: "story", label: "เรื่องราว" },
  { id: "letter", label: "จดหมาย" },
  { id: "ocean", label: "ทะเล" },
  { id: "secret", label: "สวนลับ" },
  { id: "gallery", label: "รูปภาพ" },
  { id: "checkpoints", label: "คำถามความทรงจำ" },
];

function mergeContent(value: unknown): ProjectContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultProjectContent;
  const saved = value as Partial<ProjectContent>;
  return {
    ...defaultProjectContent,
    ...saved,
    site: { ...defaultProjectContent.site, ...saved.site },
    acts: Array.isArray(saved.acts) ? saved.acts : defaultProjectContent.acts,
    storyMoments: Array.isArray(saved.storyMoments) ? saved.storyMoments : defaultProjectContent.storyMoments,
    memoryItems: defaultProjectContent.memoryItems,
    letter: {
      ...defaultProjectContent.letter,
      ...saved.letter,
      paragraphs: Array.isArray(saved.letter?.paragraphs) ? saved.letter.paragraphs : defaultProjectContent.letter.paragraphs,
    },
    ocean: {
      ...defaultProjectContent.ocean,
      ...saved.ocean,
      memories: Array.isArray(saved.ocean?.memories) ? saved.ocean.memories : defaultProjectContent.ocean.memories,
    },
    secret: {
      ...defaultProjectContent.secret,
      ...saved.secret,
      flowers: Array.isArray(saved.secret?.flowers) ? saved.secret.flowers : defaultProjectContent.secret.flowers,
    },
  };
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="admin-panel">
      <header className="admin-panel-heading">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

export function AdminConsole() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const client = useMemo(() => {
    if (!configured) return null;
    try {
      return getSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, [configured]);

  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [content, setContent] = useState<ProjectContent>(defaultProjectContent);
  const [gallery, setGallery] = useState<ProjectMemory[]>([]);
  const [savedMemoryIds, setSavedMemoryIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newAnswers, setNewAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!client) return;
    let active = true;
    void client.auth.getSession().then(({ data }) => {
      if (active) setSession(data.session);
    });
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUnlocked(false);
      setPin("");
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [client]);

  const isAdminAccount = session?.user.app_metadata?.project_2912_admin === true;

  const loadWorkspace = useCallback(async () => {
    if (!client || !session?.user.id) return;
    setBusy(true);
    setStatus("กำลังโหลดข้อมูลจากฐานข้อมูล...");
    const [contentResult, memoryResult, questionResult] = await Promise.all([
      client.from("project_2912_content").select("payload").eq("id", "main").maybeSingle(),
      client.from("project_2912_memories").select("id,sort_order,title,caption,event_date,image_path").order("sort_order", { ascending: true }),
      client.from("project_2912_questions").select("question_key,prompt,sort_order,is_active").order("sort_order", { ascending: true }),
    ]);

    if (contentResult.error) {
      setStatus("โหลดเนื้อหาไม่สำเร็จ: " + contentResult.error.message);
      setBusy(false);
      return;
    }
    setContent(mergeContent(contentResult.data?.payload));

    if (!memoryResult.error && memoryResult.data?.length) {
      const items: ProjectMemory[] = memoryResult.data.map((row, index) => ({
        id: row.id,
        title: row.title,
        caption: row.caption,
        date: row.event_date ?? "",
        tone: (["sage", "sand", "blue", "moss"] as const)[index % 4],
        imageUrl: row.image_path,
      }));
      setGallery(items);
      setSavedMemoryIds(items.map((item) => item.id));
    } else {
      const fallback = defaultProjectContent.memoryItems.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        imageUrl: null,
      }));
      setGallery(fallback);
      setSavedMemoryIds([]);
    }

    if (!questionResult.error && questionResult.data) {
      setQuestions(questionResult.data as Question[]);
    } else {
      setStatus("โหลดคำถามไม่สำเร็จ: " + (questionResult.error?.message ?? "unknown error"));
      setBusy(false);
      return;
    }

    setStatus("โหลดข้อมูลสำเร็จ · พร้อมแก้ไข");
    setBusy(false);
  }, [client, session?.user.id]);

  useEffect(() => {
    if (unlocked) void loadWorkspace();
  }, [unlocked, loadWorkspace]);

  const sendMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client || !email.trim()) return;
    setBusy(true);
    setStatus("");
    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    setBusy(false);
    if (error) {
      setStatus("ส่งลิงก์ไม่สำเร็จ: " + error.message);
      return;
    }
    setEmailSent(true);
    setStatus("ส่งลิงก์เข้าสู่ระบบแล้ว กรุณาตรวจอีเมลและเปิดลิงก์จากอุปกรณ์นี้");
  };

  const verifyAdminPin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client || !pin) return;
    setBusy(true);
    setStatus("");
    const { data, error } = await client.functions.invoke("project-2912-gateway", {
      body: { action: "verify_admin_pin", pin },
    });
    setBusy(false);
    if (error) {
      setStatus("ตรวจรหัสไม่สำเร็จ กรุณาลองใหม่");
      return;
    }
    if (!data?.verified) {
      setStatus("รหัสไม่ถูกต้อง หรือเกินจำนวนครั้งที่อนุญาต");
      return;
    }
    setUnlocked(true);
    setStatus("ปลดล็อกโหมดแก้ไขสำเร็จ");
  };

  const saveContent = async () => {
    if (!client || !session?.user.id) return;
    setBusy(true);
    setStatus("กำลังบันทึกเนื้อหาออนไลน์...");
    const { error } = await client.from("project_2912_content").upsert({
      id: "main",
      payload: content,
      is_published: true,
      updated_by: session.user.id,
    }, { onConflict: "id" });
    setBusy(false);
    setStatus(error ? "บันทึกไม่สำเร็จ: " + error.message : "บันทึกเนื้อหาสำเร็จ · เผยแพร่ข้อมูลออนไลน์แล้ว");
  };

  const saveGallery = async () => {
    if (!client) return;
    setBusy(true);
    setStatus("กำลังบันทึก Gallery...");
    const currentIds = gallery.map((item) => item.id);
    const removedIds = savedMemoryIds.filter((id) => !currentIds.includes(id));
    if (removedIds.length) {
      const { error: deleteError } = await client.from("project_2912_memories").delete().in("id", removedIds);
      if (deleteError) {
        setBusy(false);
        setStatus("ลบรูปเดิมไม่สำเร็จ: " + deleteError.message);
        return;
      }
    }

    if (gallery.length) {
      const rows = gallery.map((item, index) => ({
        id: item.id,
        sort_order: index,
        title: item.title,
        caption: item.caption,
        event_date: item.date || null,
        image_path: item.imageUrl ?? null,
        is_published: true,
      }));
      const { error } = await client.from("project_2912_memories").upsert(rows, { onConflict: "id" });
      if (error) {
        setBusy(false);
        setStatus("บันทึก Gallery ไม่สำเร็จ: " + error.message);
        return;
      }
    }
    setSavedMemoryIds(currentIds);
    setBusy(false);
    setStatus("บันทึก Gallery สำเร็จ · รูปภาพพร้อมแสดงบนเว็บไซต์");
  };

  const uploadMemoryImage = async (memoryId: string, file: File) => {
    if (!client || !session?.user.id) return;
    if (!file.type.startsWith("image/") || file.size > 20 * 1024 * 1024) {
      setStatus("รองรับเฉพาะไฟล์รูปภาพ ขนาดไม่เกิน 20 MB");
      return;
    }
    setBusy(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `memories/${session.user.id}/${memoryId}.${extension}`;
    const { error } = await client.storage.from("project-2912-media").upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });
    if (error) {
      setBusy(false);
      setStatus("อัปโหลดรูปไม่สำเร็จ: " + error.message);
      return;
    }
    const { data } = client.storage.from("project-2912-media").getPublicUrl(path);
    setGallery((items) => items.map((item) => item.id === memoryId ? { ...item, imageUrl: data.publicUrl } : item));
    setBusy(false);
    setStatus("อัปโหลดรูปแล้ว อย่าลืมกดบันทึก Gallery");
  };

  const saveQuestionPrompts = async () => {
    if (!client) return;
    setBusy(true);
    const rows = questions.map((question) => ({
      question_key: question.question_key,
      prompt: question.prompt,
      sort_order: question.sort_order,
      is_active: question.is_active,
    }));
    const { error } = await client.from("project_2912_questions").upsert(rows, { onConflict: "question_key" });
    setBusy(false);
    setStatus(error ? "บันทึกคำถามไม่สำเร็จ: " + error.message : "บันทึกคำถามเรียบร้อย");
  };

  const saveQuestionAnswer = async (questionKey: string) => {
    if (!client) return;
    const answer = newAnswers[questionKey]?.trim();
    if (!answer) {
      setStatus("กรุณากรอกคำตอบใหม่ก่อนบันทึก");
      return;
    }
    setBusy(true);
    const { data, error } = await client.functions.invoke("project-2912-gateway", {
      body: { action: "update_memory_answer", pin, questionKey, answer },
    });
    setBusy(false);
    if (error || !data?.updated) {
      setStatus("เปลี่ยนคำตอบไม่สำเร็จ กรุณาตรวจสอบ PIN และรูปแบบวันที่");
      return;
    }
    setNewAnswers((current) => ({ ...current, [questionKey]: "" }));
    setStatus("เปลี่ยนคำตอบและบันทึกแบบ Hash สำเร็จ");
  };

  const updateSite = (key: keyof ProjectContent["site"], value: string) =>
    setContent((current) => ({ ...current, site: { ...current.site, [key]: value } }));
  const updateLetter = (key: keyof ProjectContent["letter"], value: string | string[]) =>
    setContent((current) => ({ ...current, letter: { ...current.letter, [key]: value } }));
  const updateOcean = (key: keyof ProjectContent["ocean"], value: string) =>
    setContent((current) => ({ ...current, ocean: { ...current.ocean, [key]: value } }));
  const updateSecret = (key: keyof ProjectContent["secret"], value: string) =>
    setContent((current) => ({ ...current, secret: { ...current.secret, [key]: value } }));

  const logout = async () => {
    if (!client) return;
    await client.auth.signOut();
    setUnlocked(false);
    setPin("");
    setStatus("ออกจากระบบแล้ว");
  };

  if (!configured || !client) {
    return (
      <main className="admin-page">
        <div className="admin-auth-card">
          <span className="admin-eyebrow">PROJECT 29.12 · PRIVATE STUDIO</span>
          <h1>Admin Studio</h1>
          <p>ยังไม่ได้ตั้งค่า Supabase สำหรับ Preview นี้ กรุณาตรวจ Environment Variables</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-page">
        <div className="admin-auth-card">
          <a className="admin-back" href="/">← กลับสู่เว็บไซต์</a>
          <span className="admin-eyebrow">PROJECT 29.12 · PRIVATE STUDIO</span>
          <h1>เข้าสู่พื้นที่<br /><em>ของผู้ดูแล</em></h1>
          <p>ระบบจะส่งลิงก์ยืนยันตัวตนไปยังอีเมลที่ได้รับอนุญาตเท่านั้น</p>
          <form onSubmit={sendMagicLink} className="admin-auth-form">
            <label className="admin-field">
              <span>อีเมลผู้ดูแล</span>
              <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="owner@example.com" />
            </label>
            <button className="admin-primary-button" disabled={busy || emailSent}>
              {busy ? "กำลังส่ง..." : emailSent ? "ส่งลิงก์แล้ว" : "ส่งลิงก์เข้าสู่ระบบ"}
            </button>
          </form>
          <p className="admin-security-note">การมีอีเมลอย่างเดียวไม่เพียงพอ บัญชีต้องได้รับสิทธิ์ Admin จากระบบก่อน</p>
          {status ? <p className="admin-status" role="status">{status}</p> : null}
        </div>
      </main>
    );
  }

  if (!isAdminAccount) {
    return (
      <main className="admin-page">
        <div className="admin-auth-card">
          <a className="admin-back" href="/">← กลับสู่เว็บไซต์</a>
          <span className="admin-eyebrow">ACCOUNT VERIFIED</span>
          <h1>บัญชียังไม่มี<br /><em>สิทธิ์ผู้ดูแล</em></h1>
          <p>เข้าสู่ระบบด้วย {session.user.email ?? "บัญชีนี้"} สำเร็จ แต่ยังไม่มีสิทธิ์ project_2912_admin จึงไม่สามารถแก้ไขข้อมูลได้</p>
          <p className="admin-security-note">นี่เป็นการป้องกันโดยตั้งใจ ต้องอนุมัติบัญชีผู้ดูแลก่อน จึงจะใช้ PIN 2912 ปลดล็อกได้</p>
          <button className="admin-secondary-button" onClick={() => void logout()}>ออกจากระบบ</button>
          {status ? <p className="admin-status" role="status">{status}</p> : null}
        </div>
      </main>
    );
  }

  if (!unlocked) {
    return (
      <main className="admin-page">
        <div className="admin-auth-card">
          <a className="admin-back" href="/">← กลับสู่เว็บไซต์</a>
          <span className="admin-eyebrow">SECOND SECURITY LAYER</span>
          <h1>ปลดล็อก<br /><em>Admin Studio</em></h1>
          <p>ยืนยันรหัส 4 หลักเพิ่มเติมเพื่อเข้าสู่ระบบแก้ไข</p>
          <form onSubmit={verifyAdminPin} className="admin-auth-form">
            <label className="admin-field">
              <span>Admin PIN</span>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="••••"
              />
            </label>
            <button className="admin-primary-button" disabled={busy || pin.length !== 4}>
              {busy ? "กำลังตรวจสอบ..." : "ปลดล็อก"}
            </button>
          </form>
          <p className="admin-security-note">รหัสผิดจะไม่สามารถแก้ไขเนื้อหา รูปภาพ หรือข้อมูลใด ๆ ได้ และมีการจำกัดจำนวนครั้ง</p>
          {status ? <p className="admin-status" role="status">{status}</p> : null}
          <button className="admin-text-button" onClick={() => void logout()}>ออกจากบัญชี</button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page admin-page--workspace">
      <header className="admin-topbar">
        <a href="/" className="admin-brand">PROJECT <strong>29.12</strong><span>ADMIN STUDIO</span></a>
        <div className="admin-account">
          <span>{session.user.email}</span>
          <button className="admin-secondary-button" onClick={() => void logout()}>ล็อกเอาต์</button>
        </div>
      </header>

      <div className="admin-workspace">
        <aside className="admin-sidebar">
          <span className="admin-eyebrow">CONTENT MANAGEMENT</span>
          <h1>จัดการโลก<br /><em>ของเรา</em></h1>
          <p>ข้อมูลที่บันทึกจะเปลี่ยนบนเว็บไซต์จริงหลังบันทึกสำเร็จ</p>
          <nav className="admin-tabs" aria-label="หมวดการแก้ไข">
            {tabs.map((tab) => (
              <button key={tab.id} className={activeTab === tab.id ? "is-active" : ""} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
                <span>↗</span>
              </button>
            ))}
          </nav>
          <div className="admin-sidebar-foot">
            <span className="admin-live-dot" /> ONLINE STORAGE
          </div>
        </aside>

        <section className="admin-editor">
          <div className="admin-editor-top">
            <div>
              <span className="admin-eyebrow">EDITING WORKSPACE</span>
              <h2>{tabs.find((tab) => tab.id === activeTab)?.label}</h2>
            </div>
            <span className="admin-saved-indicator">● PRIVATE SESSION</span>
          </div>

          {activeTab === "home" ? (
            <Panel title="หน้าแรกและชื่อผู้รับ" description="แก้หัวเรื่อง คำโปรย และข้อความที่ผู้รับจะเห็นตอนเปิดเว็บไซต์">
              <div className="admin-form-grid">
                <Field label="ชื่อผู้รับ" value={content.site.recipientName} onChange={(value) => updateSite("recipientName", value)} />
                <Field label="ข้อความปุ่มเริ่มต้น" value={content.site.enterLabel} onChange={(value) => updateSite("enterLabel", value)} />
              </div>
              <Field label="หัวเรื่องหน้าแรก (ขึ้นบรรทัดใหม่ด้วย Enter)" value={content.site.openingHeadline} onChange={(value) => updateSite("openingHeadline", value)} multiline />
              <Field label="คำโปรยหน้าแรก" value={content.site.openingSubtitle} onChange={(value) => updateSite("openingSubtitle", value)} multiline />
              <Field label="ข้อความท้ายเว็บไซต์" value={content.site.footerNote} onChange={(value) => updateSite("footerNote", value)} />
              <button className="admin-primary-button" disabled={busy} onClick={() => void saveContent()}>บันทึกหน้าแรก</button>
            </Panel>
          ) : null}

          {activeTab === "story" ? (
            <Panel title="Timeline ของเรา" description="ใส่วันที่ ชื่อเหตุการณ์ และเรื่องเล่าของแต่ละช่วงเวลา">
              {content.storyMoments.map((moment, index) => (
                <div className="admin-repeat-card" key={index}>
                  <span className="admin-card-index">MOMENT {String(index + 1).padStart(2, "0")}</span>
                  <Field label="วันที่" value={moment.date} onChange={(value) => setContent((current) => ({ ...current, storyMoments: current.storyMoments.map((item, itemIndex) => itemIndex === index ? { ...item, date: value } : item) }))} />
                  <Field label="หัวข้อความทรงจำ" value={moment.title} onChange={(value) => setContent((current) => ({ ...current, storyMoments: current.storyMoments.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) }))} />
                  <Field label="เรื่องราว" value={moment.description} onChange={(value) => setContent((current) => ({ ...current, storyMoments: current.storyMoments.map((item, itemIndex) => itemIndex === index ? { ...item, description: value } : item) }))} multiline />
                </div>
              ))}
              <button className="admin-primary-button" disabled={busy} onClick={() => void saveContent()}>บันทึก Timeline</button>
            </Panel>
          ) : null}

          {activeTab === "letter" ? (
            <Panel title="จดหมายส่วนตัว" description="ทุกบรรทัดที่เขียนจะปรากฏในซองจดหมายของผู้รับ">
              <div className="admin-form-grid">
                <Field label="ถึงใคร" value={content.letter.recipient} onChange={(value) => updateLetter("recipient", value)} />
                <Field label="วันที่บนจดหมาย" value={content.letter.date} onChange={(value) => updateLetter("date", value)} />
                <Field label="คำลงท้าย" value={content.letter.closing} onChange={(value) => updateLetter("closing", value)} />
                <Field label="ลายเซ็น" value={content.letter.signature} onChange={(value) => updateLetter("signature", value)} />
              </div>
              <Field label="หัวข้อจดหมาย" value={content.letter.title} onChange={(value) => updateLetter("title", value)} />
              <Field label="หัวข้อบรรทัดรอง" value={content.letter.titleAccent} onChange={(value) => updateLetter("titleAccent", value)} />
              <Field label="เนื้อหาจดหมาย (เว้นบรรทัดเพื่อขึ้นย่อหน้าใหม่)" value={content.letter.paragraphs.join("\n\n")} onChange={(value) => updateLetter("paragraphs", value.split(/\n\s*\n/).filter(Boolean))} multiline />
              <button className="admin-primary-button" disabled={busy} onClick={() => void saveContent()}>บันทึกจดหมาย</button>
            </Panel>
          ) : null}

          {activeTab === "ocean" ? (
            <Panel title="Ocean Chapter" description="กำหนดคำบรรยายทะเลและ Tide Notes">
              <Field label="ข้อความเปิดบท" value={content.ocean.introduction} onChange={(value) => updateOcean("introduction", value)} multiline />
              <div className="admin-form-grid">
                <Field label="หัวเรื่อง" value={content.ocean.title} onChange={(value) => updateOcean("title", value)} />
                <Field label="หัวเรื่องบรรทัดรอง" value={content.ocean.titleAccent} onChange={(value) => updateOcean("titleAccent", value)} />
                <Field label="ข้อความเส้นขอบฟ้า" value={content.ocean.horizonLabel} onChange={(value) => updateOcean("horizonLabel", value)} />
                <Field label="ข้อความปิดบท" value={content.ocean.closing} onChange={(value) => updateOcean("closing", value)} />
              </div>
              {content.ocean.memories.map((memory, index) => (
                <div className="admin-repeat-card" key={memory.number}>
                  <span className="admin-card-index">TIDE NOTE {memory.number}</span>
                  <Field label="หัวข้อ" value={memory.title} onChange={(value) => setContent((current) => ({ ...current, ocean: { ...current.ocean, memories: current.ocean.memories.map((item, i) => i === index ? { ...item, title: value } : item) } }))} />
                  <Field label="ข้อความ" value={memory.note} onChange={(value) => setContent((current) => ({ ...current, ocean: { ...current.ocean, memories: current.ocean.memories.map((item, i) => i === index ? { ...item, note: value } : item) } }))} multiline />
                </div>
              ))}
              <button className="admin-primary-button" disabled={busy} onClick={() => void saveContent()}>บันทึก Ocean</button>
            </Panel>
          ) : null}

          {activeTab === "secret" ? (
            <Panel title="สวนลับและบทสรุป" description="ปรับข้อความของดอกไม้แต่ละดอกและข้อความ Finale">
              {content.secret.flowers.map((flower, index) => (
                <div className="admin-repeat-card" key={flower.id}>
                  <span className="admin-card-index">FLOWER {flower.number}</span>
                  <Field label="ชื่อดอกไม้" value={flower.name} onChange={(value) => setContent((current) => ({ ...current, secret: { ...current.secret, flowers: current.secret.flowers.map((item, i) => i === index ? { ...item, name: value } : item) } }))} />
                  <Field label="คำใบ้" value={flower.prompt} onChange={(value) => setContent((current) => ({ ...current, secret: { ...current.secret, flowers: current.secret.flowers.map((item, i) => i === index ? { ...item, prompt: value } : item) } }))} />
                  <Field label="ข้อความที่ซ่อนอยู่" value={flower.note} onChange={(value) => setContent((current) => ({ ...current, secret: { ...current.secret, flowers: current.secret.flowers.map((item, i) => i === index ? { ...item, note: value } : item) } }))} multiline />
                </div>
              ))}
              <Field label="หัวข้อ Finale" value={content.secret.revealSubtitle} onChange={(value) => updateSecret("revealSubtitle", value)} />
              <Field label="ข้อความ Finale" value={content.secret.revealMessage} onChange={(value) => updateSecret("revealMessage", value)} multiline />
              <button className="admin-primary-button" disabled={busy} onClick={() => void saveContent()}>บันทึกสวนลับ</button>
            </Panel>
          ) : null}

          {activeTab === "gallery" ? (
            <Panel title="Memory Gallery" description="เพิ่มรูปภาพจริง พร้อมวันที่และคำบรรยาย รูปจะเก็บใน Supabase Storage">
              {gallery.map((memory, index) => (
                <div className="admin-repeat-card" key={memory.id}>
                  <div className="admin-card-heading">
                    <span className="admin-card-index">PHOTO {String(index + 1).padStart(2, "0")}</span>
                    <button className="admin-remove-button" onClick={() => setGallery((items) => items.filter((item) => item.id !== memory.id))}>ลบรูปนี้</button>
                  </div>
                  {memory.imageUrl ? <img className="admin-image-preview" src={memory.imageUrl} alt={memory.title || "Memory preview"} /> : <div className="admin-image-placeholder">ยังไม่ได้เลือกรูปภาพ</div>}
                  <label className="admin-upload-field">
                    <span>เลือกรูปภาพ (สูงสุด 20 MB)</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadMemoryImage(memory.id, file);
                      event.target.value = "";
                    }} />
                  </label>
                  <Field label="ชื่อความทรงจำ" value={memory.title} onChange={(value) => setGallery((items) => items.map((item) => item.id === memory.id ? { ...item, title: value } : item))} />
                  <Field label="วันที่" value={memory.date} onChange={(value) => setGallery((items) => items.map((item) => item.id === memory.id ? { ...item, date: value } : item))} />
                  <Field label="คำบรรยาย" value={memory.caption} onChange={(value) => setGallery((items) => items.map((item) => item.id === memory.id ? { ...item, caption: value } : item))} multiline />
                </div>
              ))}
              <div className="admin-button-row">
                <button className="admin-secondary-button" onClick={() => setGallery((items) => [...items, {
                  id: crypto.randomUUID(), title: "", caption: "", date: "", tone: (["sage", "sand", "blue", "moss"] as const)[items.length % 4], imageUrl: null,
                }])}>+ เพิ่มภาพความทรงจำ</button>
                <button className="admin-primary-button" disabled={busy} onClick={() => void saveGallery()}>บันทึก Gallery</button>
              </div>
            </Panel>
          ) : null}

          {activeTab === "checkpoints" ? (
            <Panel title="Memory Checkpoints" description="แก้ข้อความคำถามได้ ส่วนคำตอบจะเก็บเป็น Hash และแก้ผ่านการยืนยัน PIN ฝั่งเซิร์ฟเวอร์เท่านั้น">
              {questions.map((question, index) => (
                <div className="admin-repeat-card" key={question.question_key}>
                  <span className="admin-card-index">CHECKPOINT {String(index + 1).padStart(2, "0")}</span>
                  <Field label="ข้อความคำถาม" value={question.prompt} onChange={(value) => setQuestions((items) => items.map((item) => item.question_key === question.question_key ? { ...item, prompt: value } : item))} multiline />
                  <label className="admin-field">
                    <span>ตั้งคำตอบใหม่ (เว้นว่างถ้าไม่เปลี่ยน)</span>
                    <input type="password" autoComplete="new-password" value={newAnswers[question.question_key] ?? ""} onChange={(event) => setNewAnswers((current) => ({ ...current, [question.question_key]: event.target.value }))} placeholder="รูปแบบวันที่ เช่น 03/07/25" />
                    <small>คำตอบเดิมจะไม่ถูกเปิดเผย และระบบจะจัดเก็บค่าใหม่เป็น bcrypt hash</small>
                  </label>
                  <button className="admin-secondary-button" disabled={busy || !(newAnswers[question.question_key] ?? "").trim()} onClick={() => void saveQuestionAnswer(question.question_key)}>เปลี่ยนคำตอบแบบปลอดภัย</button>
                </div>
              ))}
              <button className="admin-primary-button" disabled={busy} onClick={() => void saveQuestionPrompts()}>บันทึกข้อความคำถาม</button>
            </Panel>
          ) : null}

          {status ? <p className="admin-status admin-status--workspace" role="status">{status}</p> : null}
          <footer className="admin-editor-foot">
            <span>PROJECT 29.12 · PRIVATE CONTENT</span>
            <span>บันทึกลง Supabase Online</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
