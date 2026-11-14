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
    date: "03/07/2025",
    title: "วันแรกที่เราเจอกัน",
    description: "วันเริ่มต้นของเรื่องราวที่ค่อย ๆ กลายเป็นความทรงจำของเรา",
    chapter: "01 / THE BEGINNING",
  },
  {
    date: "02/08/2026",
    title: "วันแรกที่เราได้อยู่ด้วยกัน 24 ชั่วโมง",
    description: "วันแรกที่เราได้ใช้เวลาร่วมกันครบหนึ่งวันเต็ม ๆ",
    chapter: "02 / 24 HOURS TOGETHER",
  },
  {
    date: "19/09/2026",
    title: "วันแรกที่เราไปเที่ยวด้วยกัน",
    description: "การเดินทางครั้งแรกของเราที่มีเรื่องราวให้เก็บกลับมา",
    chapter: "03 / OUR FIRST TRIP",
  },
  {
    date: "TO BE CONTINUED",
    title: "เรื่องราวที่ยังเขียนต่อ",
    description: "ยังมีวันธรรมดาและความทรงจำใหม่ ๆ รออยู่ข้างหน้า",
    chapter: "04 / THE NEXT PAGE",
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
