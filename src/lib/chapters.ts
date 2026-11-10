export const chapters = [
  { id: "intro", label: "Intro" },
  { id: "garden", label: "Garden" },
  { id: "story", label: "Story" },
  { id: "memories", label: "Memories" },
  { id: "letter", label: "Letter" },
  { id: "ocean", label: "Ocean" },
  { id: "secret", label: "Secret" },
  { id: "final", label: "29.12" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
