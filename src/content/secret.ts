export const secretContent = {
  eyebrow: "CHAPTER 08 — THE SECRET GARDEN",
  title: "Some things bloom\nin their own time.",
  description:
    "A quiet place for the little things waiting to be discovered. Choose a flower to reveal its note.",
  flowers: [
    {
      id: "wildflower",
      number: "01",
      name: "Wildflower",
      note: "A reminder that the smallest moments can become the ones we keep closest.",
      prompt: "A little thing worth remembering",
    },
    {
      id: "moonflower",
      number: "02",
      name: "Moonflower",
      note: "Some memories feel like a soft light — quiet, steady, and easy to return to.",
      prompt: "A moment that still feels special",
    },
    {
      id: "seaflower",
      number: "03",
      name: "Sea Flower",
      note: "Like the ocean, meaningful moments can stay with us long after the waves have passed.",
      prompt: "A place you would revisit",
    },
  ],
  revealEyebrow: "A DATE TO REMEMBER",
  revealTitle: "29.12",
  revealSubtitle: "The little universe was made of moments all along.",
  revealMessage:
    "Thank you for being part of this little world. May there always be new places to discover, stories to tell, and moments worth keeping.",
  replayLabel: "EXPLORE THE GARDEN AGAIN",
} as const;
