import { acts, siteContent } from "@/content/site";
import { storyMoments, memoryItems } from "@/content/memories";
import { letterContent } from "@/content/letter";
import { oceanContent } from "@/content/ocean";
import { secretContent } from "@/content/secret";

export type ProjectAct = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  theme: "garden" | "ocean" | "secret";
};

export type ProjectStoryMoment = {
  date: string;
  title: string;
  description: string;
  chapter: string;
};

export type ProjectMemory = {
  id: string;
  title: string;
  caption: string;
  date: string;
  tone: "sage" | "sand" | "blue" | "moss";
  imageUrl?: string | null;
};

export type ProjectLetter = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  recipient: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  date: string;
};

export type ProjectOcean = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  introduction: string;
  horizonLabel: string;
  memoriesEyebrow: string;
  memoriesTitle: string;
  memoriesAccent: string;
  memoriesIntro: string;
  memories: { number: string; title: string; note: string; tone: "shore" | "blue" | "foam" }[];
  closing: string;
};

export type ProjectSecret = {
  eyebrow: string;
  title: string;
  description: string;
  flowers: { id: string; number: string; name: string; note: string; prompt: string }[];
  revealEyebrow: string;
  revealTitle: string;
  revealSubtitle: string;
  revealMessage: string;
  replayLabel: string;
};

export type ProjectCheckpoint = {
  question_key: "first_meeting" | "first_trip" | "first_24_hours";
  prompt: string;
  sort_order: number;
};

export type ProjectContent = {
  checkpoints: ProjectCheckpoint[];
  site: {
    title: string;
    concept: string;
    recipientName: string;
    openingHeadline: string;
    openingSubtitle: string;
    enterLabel: string;
    footerNote: string;
  };
  acts: ProjectAct[];
  storyMoments: ProjectStoryMoment[];
  memoryItems: ProjectMemory[];
  letter: ProjectLetter;
  ocean: ProjectOcean;
  secret: ProjectSecret;
};

export const defaultProjectContent: ProjectContent = {
  checkpoints: [
    { question_key: "first_meeting", prompt: "วันแรกที่เราเจอกันคือวันไหน?", sort_order: 1 },
    { question_key: "first_trip", prompt: "วันแรกที่เราไปเที่ยวด้วยกันคือวันไหน?", sort_order: 2 },
    { question_key: "first_24_hours", prompt: "วันแรกที่เราได้ใช้เวลาอยู่ด้วยกันครบ 24 ชั่วโมงคือวันไหน?", sort_order: 3 },
  ],
  site: { ...siteContent },
  acts: acts.map((act) => ({ ...act })),
  storyMoments: storyMoments.map((moment) => ({ ...moment })),
  memoryItems: memoryItems.map((memory) => ({ ...memory, imageUrl: null })),
  letter: { ...letterContent, paragraphs: [...letterContent.paragraphs] },
  ocean: {
    ...oceanContent,
    memories: oceanContent.memories.map((memory) => ({ ...memory })) as ProjectOcean["memories"],
  },
  secret: {
    ...secretContent,
    flowers: secretContent.flowers.map((flower) => ({ ...flower })),
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeStoredContent(value: unknown): ProjectContent {
  if (!isObject(value)) return defaultProjectContent;
  const candidate = value;
  const site = isObject(candidate.site) ? candidate.site : {};
  const letter = isObject(candidate.letter) ? candidate.letter : {};
  const ocean = isObject(candidate.ocean) ? candidate.ocean : {};
  const secret = isObject(candidate.secret) ? candidate.secret : {};

  return {
    ...defaultProjectContent,
    ...candidate,
    site: { ...defaultProjectContent.site, ...site },
    acts: Array.isArray(candidate.acts) ? candidate.acts as ProjectAct[] : defaultProjectContent.acts,
    storyMoments: Array.isArray(candidate.storyMoments) ? candidate.storyMoments as ProjectStoryMoment[] : defaultProjectContent.storyMoments,
    memoryItems: Array.isArray(candidate.memoryItems) ? candidate.memoryItems as ProjectMemory[] : defaultProjectContent.memoryItems,
    letter: {
      ...defaultProjectContent.letter,
      ...letter,
      paragraphs: Array.isArray(letter.paragraphs) ? letter.paragraphs as string[] : defaultProjectContent.letter.paragraphs,
    },
    ocean: {
      ...defaultProjectContent.ocean,
      ...ocean,
      memories: Array.isArray(ocean.memories) ? ocean.memories as ProjectOcean["memories"] : defaultProjectContent.ocean.memories,
    },
    secret: {
      ...defaultProjectContent.secret,
      ...secret,
      flowers: Array.isArray(secret.flowers) ? secret.flowers as ProjectSecret["flowers"] : defaultProjectContent.secret.flowers,
    },
  };
}

export async function getProjectContent(): Promise<ProjectContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return defaultProjectContent;

  try {
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    const [contentResponse, memoryResponse, questionResponse] = await Promise.all([
      fetch(`${url}/rest/v1/project_2912_content?id=eq.main&select=payload&is_published=eq.true&limit=1`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${url}/rest/v1/project_2912_memories?select=id,sort_order,title,caption,event_date,image_path,is_published&is_published=eq.true&order=sort_order.asc`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${url}/rest/v1/project_2912_questions?select=question_key,prompt,sort_order&is_active=eq.true&order=sort_order.asc`, {
        headers,
        cache: "no-store",
      }),
    ]);

    if (!contentResponse.ok) throw new Error("Could not load published content");
    const contentRows = await contentResponse.json() as { payload?: unknown }[];
    let content = mergeStoredContent(contentRows[0]?.payload);

    if (memoryResponse.ok) {
      const memoryRows = await memoryResponse.json() as {
        id: string;
        sort_order: number;
        title: string;
        caption: string;
        event_date: string | null;
        image_path: string | null;
      }[];
      if (memoryRows.length) {
        content = {
          ...content,
          memoryItems: memoryRows.map((item, index) => ({
            id: item.id,
            title: item.title,
            caption: item.caption,
            date: item.event_date ?? "",
            tone: (["sage", "sand", "blue", "moss"] as const)[index % 4],
            imageUrl: item.image_path,
          })),
        };
      }
    }

    if (questionResponse.ok) {
      const questions = await questionResponse.json() as ProjectCheckpoint[];
      if (questions.length) content = { ...content, checkpoints: questions };
    }

    return content;
  } catch (error) {
    console.error("PROJECT 29.12 public content fallback:", error);
    return defaultProjectContent;
  }
}
