export type ICreature = {
  title: string;
  description: string;
  character: {
    name: string;
    aspects: Array<string>;
    tracks: Array<{ name: string; values: Array<string> }>;
    skills: Array<string>;
    stunts: Array<{ name: string; description: string }>;
    notes?: string;
    image?: string;
  };
};

export const creatures: Array<ICreature> = [
  {
    title: "Monster Monday #1 - Draguin",
    description:
      "Draguins appear to be some ungodly mix of fearsome wyverns and your favorite polar-weather flightless birds. They are carnivorous ambush predators, hunting alone or in groups of two to four.\n\n**Massive and Mobile**. Draguins have an immense wingspan densely packed with small black and white feathers. In addition to swimming and flying, these beasts can use their slick hides to glide seamlessly across ice and snow. Even when immobilized, a draguin can be quite difficult to take down due to their thick, polar hides. This combination of size and speed can be devastating for anyone unlucky enough to engage a draguin unprepared.\n\n**Ice Breaker**. The beak is the most durable part of a draguin. While primarily used for pecking prey and cracking ice while swimming, it is not uncommon for a draguin to use its beak offensively, creating uneven ground or shattering frozen shelves to ambush their surprised bounty from below. ",
    character: {
      name: "Draguin",
      aspects: [
        "Ferocious",
        "Can swim AND fly",
        "Excitable",
        "Cold weather conditioning",
      ],
      tracks: [
        { name: "Physical Stress", values: ["1", "2", "3", "4"] },
        { name: "Mental Stress", values: ["1", "2"] },
      ],
      skills: [
        "+4 Razor claws (Fight)",
        "+4 Thick skin (Physique)",
        "+4 Vigor (Athletics)",
        "+3 Keen eyes (Notice)",
        "+3 Terrify (Provoke )",
        "+3 Feisty (Will)",
      ],
      stunts: [
        {
          name: "Ravage",
          description:
            "When the draguin Fights with its razor claws, it may make a razor claw attack against all other enemies it shares a zone with, rather than a single target.",
        },
        {
          name: "Shatter-beak",
          description:
            "The draguin may use its action to make a Fantastic (+6) fight check against nearby ice. If successful, the ice will crack or shatter. The draguin may spend a fate point to automatically succeed on this check.",
        },
        {
          name: "Slide, swim, fly",
          description:
            "The draguin can move an additional zone each turn in combat if on ice, snow, in water, or flying.",
        },
      ],
      notes:
        "A note for the GM: Draguins are quite powerful. A party of four characters with the default stats and abilities will likely have a hard time taking one of these down without proper preparation and an escape plan. I would advise against pitting new players against this monster.",
      image:
        "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/27112219/8cd050dce30f4d20a65cf711a7ea21be/1.png?token-time=1615741343&token-hash=l6ww2eO7XhZaSLOHOepAGM6L7KgWWCoDQAIGc3uzFI0%3D",
    },
  },
];
