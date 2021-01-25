export type ICreature = {
  title: string;
  description: string;
  character: {
    name: string;
    aspects: Array<string>;
    tracks: Array<{ name: string; values: Array<number> }>;
    skills: Array<string>;
    stunts: Array<{ name: string; description: string }>;
    notes?: string;
    image?: string;
  };
};

export const creatures: Array<ICreature> = [
  {
    title: "Riddleraxxer",
    description: `
Any outsider who sets foot in the fae realm will very quickly be overwhelmed with its strangeness. Inanimate objects may appear to change places on their own. The celestial bodies move differently than in the material realm, if at all. The perception of time is unfamiliar. Very few things found in the wilds behave how you expect.

Riddleraxxers are no exception. These beings wander the fae wilds rambling confusing riddles to themselves and those around. While they are not immediately hostile to those they come across, they are excitable and quick to aggression. The things they spout have a way of disorienting and baffling outsiders. Their very presence makes little sense to those from the material plane. Being easily agitated is a dangerous trait to possess, as riddleraxxers have little concern for the wellbeing of others.
  `,
    character: {
      name: "Riddleraxxer",
      aspects: [
        "Wandering Unseelie Fae",
        "Thinly Comprehensible",
        "The Three’s Curse",
      ],
      tracks: [{ name: "Stress", values: [1, 2, 3, 4] }],
      skills: [
        "+4 Physics Is A Suggestion (Athletics)",
        "+3 Strong Willed (Will)",
        "+3 Sour Riddles (Deceive & Provoke)",
      ],
      stunts: [
        {
          name: "Riddle-Tongue",
          description: `Riddleraxxers use their pointed tongues to confuse and overwhelm those that they find while wandering. When a riddleraxxer deals stress with a Sour Riddle (Provoke) attack, they may choose to make it physical stress instead of mental stress.`,
        },

        {
          name: "Thinly Comprehensible",
          description: `Riddleraxxers, like many things in the wild realm of the fae, could be said to deny the expectations of reality. While it is true that the fae realm has few such expectations, riddleraxxers are an undeniably extreme example. These beings can simultaneously look bigger than the trees beside them and shorter than the bushes around them. Judging the distance or depth from the riddleraxxer to things around it is nearly impossible. When a scene begins, all of the players should collaborate and agree on an aspect related to the new, strange ways the riddleraxxer is bending reality around them in this instance. The riddleraxxer gets one free invoke of the aspect.`,
        },

        {
          name: "The Three’s Curse",
          description: `These creatures have an aversion to things that come in threes. This can range from words being spoken, to behaviors being acted out, to sets of items, to repetitive motions. The first time each scene that a riddleraxxor notices something that is in a set of three, it will take one mental stress and instantly become hostile to whoever it perceives as the offender.`,
        },
      ],
      notes:
        "This is a spot for notes, which are rare but do occasionally happen.",
      image: "https://i.imgur.com/AD3MbBi.jpg",
    },
  },
];
