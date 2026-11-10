export type StoryMoment = {
  date: string;
  title: string;
  description: string;
  chapter: string;
};

export type MemoryItem = {
  id: string;
  title: string;
  caption: string;
  date: string;
  tone: "sage" | "sand" | "blue" | "moss";
};

export const storyMoments: StoryMoment[] = [
  {
    date: "[A DATE TO REMEMBER]",
    title: "The beginning",
    description: "Add a few words about how this chapter of your story began.",
    chapter: "01 / BEGINNING",
  },
  {
    date: "[A DAY YOU BOTH REMEMBER]",
    title: "A little moment",
    description: "Describe a small moment that became important to you.",
    chapter: "02 / A MOMENT",
  },
  {
    date: "[A SPECIAL DATE]",
    title: "Somewhere along the way",
    description: "Write about a place, conversation, or experience worth keeping.",
    chapter: "03 / ALONG THE WAY",
  },
  {
    date: "[THE PRESENT]",
    title: "Still unfolding",
    description: "Leave this space for the next page of your shared story.",
    chapter: "04 / TO BE CONTINUED",
  },
];

export const memoryItems: MemoryItem[] = [
  { id: "memory-01", title: "A favorite day", caption: "Add a short caption for this photograph.", date: "[DATE]", tone: "sage" },
  { id: "memory-02", title: "A familiar place", caption: "Add the place or story behind this memory.", date: "[DATE]", tone: "sand" },
  { id: "memory-03", title: "A small detail", caption: "Sometimes the smallest details stay with us.", date: "[DATE]", tone: "blue" },
  { id: "memory-04", title: "An ordinary moment", caption: "Add a note about why this moment matters.", date: "[DATE]", tone: "moss" },
  { id: "memory-05", title: "A day to keep", caption: "Replace this card with one of your own photographs.", date: "[DATE]", tone: "sand" },
  { id: "memory-06", title: "The next page", caption: "A space waiting for a memory yet to come.", date: "[SOON]", tone: "sage" },
];
