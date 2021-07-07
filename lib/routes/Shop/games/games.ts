import shuffle from "lodash/shuffle";

export const ShopCategories: Array<{ name: string; tags: string }> = [
  { name: "Fate Must Have", tags: "fate-must" },
  { name: "You will LOVE those games", tags: "staff-pick" },
  { name: "Fate Toolkits", tags: "fate-toolkit" },
  { name: "Forged in the Dark", tags: "fitd" },
];

export type IGame = {
  name: string;
  slug?: string;
  description: string;
  creator: string;
  image: string;
  tags: Array<string>;
  featured?: boolean;
  releaseDate?: string;
  rating: number;
  links: {
    driveThru?: string;
    itchIo?: string;
    gumroad?: string;
  };
};

export const driveThruRpgAffiliateCode = `?affiliate_id=2404514`;
export const itchIoAffiliateCode = `?ac=8MQvHZMDXvG`;

export const games: Array<IGame> = [
  {
    featured: true,
    name: "Fate Condensed",
    creator: "Evil Hat Productions",
    description: "The Essence of Fate",
    tags: ["fate", "fate-must", "ttrpg-system"],
    rating: 10,
    image: "https://img.itch.zone/aW1nLzM5OTk0OTUuanBn/original/KWgph%2B.jpg",
    links: {
      itchIo: "https://evilhat.itch.io/fate-condensed",
    },
  },
  {
    name: "Fate Core",
    creator: "Evil Hat Productions",
    description:
      "Flexible system that can support whatever worlds you dream up.",
    tags: ["fate", "fate-must", "ttrpg-system"],
    rating: 10,
    image: "https://img.itch.zone/aW1nLzI1NDE2OTEuanBn/original/SMTdsc.jpg",
    links: {
      itchIo: "https://evilhat.itch.io/fate-core",
    },
  },
  {
    name: "Fate Accelerated",
    creator: "Evil Hat Productions",
    description: "A Fate Core Build",
    tags: ["fate", "fate-must", "ttrpg-system"],
    rating: 10,
    image: "https://img.itch.zone/aW1nLzI1NDE2OTcuanBn/347x500/fKV4wE.jpg",
    links: {
      itchIo: "https://evilhat.itch.io/fate-accelerated",
    },
  },
  {
    featured: true,
    name: "The Book of Hanz",
    description:
      "The Quintessential Guide to Running the Fate Roleplaying Game",
    creator: "Robert Hanz",
    rating: 9,
    tags: ["fate", "fate-must"],
    image: "https://gyazo.com/c62c59be694f41d4e4c9682e7dc52ca6.png",
    links: {
      itchIo: "https://amazingrando.itch.io/book-of-hanz",
      driveThru: "https://www.drivethrurpg.com/product/350062/Book-of-Hanz",
    },
  },
  {
    name: "Spark in Fate Core",
    description: "A Collaborative World-building Toolkit for Fate Core",
    creator: "Genesis of Legend Publishing",
    tags: ["fate", "fate-must"],
    rating: 5,
    image: "https://img.itch.zone/aW1nLzQ5NjI0NDEuanBn/original/AlgGbL.jpg",
    links: {
      itchIo:
        "https://evilhat.itch.io/the-secrets-of-cats-a-world-of-adventure-for-fate-core",
      driveThru:
        "https://www.drivethrurpg.com/product/117868/A-Spark-in-Fate-Core#:~:text=This%20is%20an%20expansion%20of,danger%20and%20potential%20for%20growth.",
    },
  },
  {
    name: "Secret of Cats",
    description: "Sharpen your claws and prepare to defend your territory!",
    creator: "Richard Bellingham",
    tags: ["fate", "game", "staff-pick"],
    rating: 5,
    image: "https://img.itch.zone/aW1nLzE4Njc4NDAuanBn/original/v5%2B2cR.jpg",
    links: {
      itchIo:
        "https://evilhat.itch.io/the-secrets-of-cats-a-world-of-adventure-for-fate-core",
    },
  },
  {
    featured: true,
    name: "Aces In Space",
    description:
      "A Fate roleplaying game about a gang of space fighter pilots.",
    creator: "Vogt & Vriends",
    tags: ["fate", "game", "german-creator", "staff-pick"],
    rating: 5,
    image:
      "https://ksr-ugc.imgix.net/assets/026/884/332/993157e6b4de188f3cf6231ff5d4ed20_original.jpg?ixlib=rb-4.0.2&crop=faces&w=1552&h=873&fit=crop&v=1571347030&auto=format&frame=1&q=92&s=dcaabf68e71973f1896ee727ebf8e501",
    links: {
      driveThru: "https://www.drivethrurpg.com/product/317497/Aces-In-Space",
    },
  },
  {
    name: "Fate Adversary Toolkit",
    description: "Calling all adversaries!",
    creator: "Evil Hat Productions",
    tags: ["fate", "fate-toolkit"],
    rating: 8,
    image: "https://img.itch.zone/aW1nLzI1NDk0NjMuanBn/original/DL4zxa.jpg",
    links: {
      itchIo: "https://evilhat.itch.io/fate-adversary-toolkit",
    },
  },
  {
    name: "Fate Horror Toolkit",
    description: "Something lurks in the shadows...",
    creator: "Evil Hat Productions",
    tags: ["fate", "fate-toolkit"],
    rating: 8,
    image: "https://img.itch.zone/aW1nLzI1NDk0NzcuanBn/original/bzgpZf.jpg",
    links: {
      itchIo: "https://evilhat.itch.io/fate-horror-toolkit",
    },
  },
  {
    name: "Fate Space Toolkit",
    description: "Take your game into the great unknown!",
    creator: "Evil Hat Productions",
    tags: ["fate", "fate-toolkit"],
    rating: 8,
    image: "https://img.itch.zone/aW1nLzI3NDI0ODguanBn/original/DXru1v.jpg",
    links: {
      itchIo: "https://evilhat.itch.io/fate-space-toolkit",
    },
  },
  {
    name: "Fate System Toolkit",
    description: "Rules, glorious rules!",
    creator: "Evil Hat Productions",
    tags: ["fate", "fate-toolkit"],
    rating: 8,
    image: "https://img.itch.zone/aW1nLzI1NDk0OTIuanBn/original/d%2F%2BuqO.jpg",
    links: {
      itchIo: "https://evilhat.itch.io/fate-system-toolkit",
    },
  },
  {
    featured: true,
    name: "Heartbreaker",
    description: "Tabletop roleplaying game about dungeons and danger",
    creator: "A.C. Luke",
    tags: ["fate", "game", "staff-pick"],
    rating: 5,
    image: "https://img.itch.zone/aW1nLzU0NDA4MjIucG5n/315x250%23cb/FY5LK6.png",
    links: {
      itchIo: "https://ac-luke.itch.io/heartbreaker-trifold",
    },
  },
  {
    name: "Blades in the Dark",
    description:
      "Tabletop role-playing game about a crew of daring scoundrels seeking their fortunes on the haunted streets of an industrial-fantasy city",
    creator: "John Harper",
    tags: ["fitd", "game", "staff-pick"],
    rating: 10,
    image: "https://img.itch.zone/aW1nLzMzMTY2NTgucG5n/original/BWh368.png",
    links: {
      itchIo: "https://johnharper.itch.io/blades-in-the-dark",
      driveThru:
        "https://www.drivethrurpg.com/product/170689/Blades-in-the-Dark",
    },
  },
  {
    name: "Bande of Blades",
    description:
      "The Legion is in retreat following a failed battle against the armies of the undead. You are a member of the Legion, your bonds to one another forged in the dark by bone and blood.",
    creator: "Off Guard Games",
    tags: ["fitd", "game", "staff-pick"],
    rating: 9,
    image: "https://img.itch.zone/aW1nLzIzMDk4NDMuanBn/original/OvyJdD.jpg",
    links: {
      itchIo: "https://offguardgames.itch.io/band-of-blades",
      driveThru: "https://www.drivethrurpg.com/product/243347/Band-of-Blades",
    },
  },
  {
    name: "Scum and Villainy",
    description:
      "Unwise deals. Blaster fights. High adventure among the stars. Welcome to the world of Scum and Villainy.",
    creator: "Off Guard Games",
    tags: ["fitd", "game", "staff-pick"],
    rating: 9,
    image:
      "https://img.itch.zone/aW1hZ2UvMjY2NTc0LzEyODQ5NjkucG5n/original/RZVlbt.png",
    links: {
      itchIo: "https://offguardgames.itch.io/scum-and-villainy",
      driveThru:
        "https://www.drivethrurpg.com/product/198681/Scum-and-Villainy",
    },
  },
];

export const featuredGames = shuffle(games.filter((g) => g.featured));
