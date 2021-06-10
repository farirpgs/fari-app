import { useState } from "react";

export enum Tags {
  Fantasy = "Fantasy",
  SciFi = "SciFi",
}

export type Card = { label: string; tags?: Array<Tags> };

export function useCards() {
  const [tags, setTags] = useState([Tags.Fantasy]);

  function toggle(tagToToggle: Tags) {
    setTags((prev) => {
      const exists = prev.some((t) => t === tagToToggle);

      if (!exists) {
        return [...prev, tagToToggle];
      }

      return prev.filter((t) => {
        return t !== tagToToggle;
      });
    });
  }

  function filterByTag(card: Card): boolean {
    if (!card.tags) {
      return true;
    }

    for (const cardTag of card.tags) {
      const match = tags.includes(cardTag);
      if (match) {
        return true;
      }
    }
    return false;
  }

  const archetypes = Archetypes.filter(filterByTag);
  const ancestry = Acenstry.filter(filterByTag);
  const backgrounds = Backgrounds.filter(filterByTag);
  const faces = Faces.filter(filterByTag);
  const places = Places.filter(filterByTag);
  const events = Events.filter(filterByTag);

  return {
    state: { tags, archetypes, ancestry, backgrounds, faces, places, events },
    actions: {
      toggle,
    },
  };
}

const Archetypes: Array<Card> = [
  { label: "Artificer", tags: [Tags.Fantasy] },
  { label: "Barbarian", tags: [Tags.Fantasy] },
  { label: "Bard", tags: [Tags.Fantasy] },
  { label: "Cleric", tags: [Tags.Fantasy] },
  { label: "Druid", tags: [Tags.Fantasy] },
  { label: "Fighter", tags: [Tags.Fantasy] },
  { label: "Vampire", tags: [Tags.Fantasy] },
  { label: "Werewolf", tags: [Tags.Fantasy] },
  { label: "Monk", tags: [Tags.Fantasy] },
  { label: "Paladin", tags: [Tags.Fantasy] },
  { label: "Ranger", tags: [Tags.Fantasy] },
  { label: "Rogue", tags: [Tags.Fantasy] },
  { label: "Sorcerer", tags: [Tags.Fantasy] },
  { label: "Warlock", tags: [Tags.Fantasy] },
  { label: "Wizard", tags: [Tags.Fantasy] },
  { label: "Pilot", tags: [Tags.SciFi] },
  { label: "Engineer", tags: [Tags.SciFi] },
];

const Acenstry: Array<Card> = [
  { label: "Orc", tags: [Tags.Fantasy] },
  { label: "Dragonborn", tags: [Tags.Fantasy] },
  { label: "Draft", tags: [Tags.Fantasy] },
  { label: "Gnome", tags: [Tags.Fantasy] },
  { label: "Human", tags: [Tags.Fantasy] },
  { label: "Halfling", tags: [Tags.Fantasy] },
  { label: "Half-Elf", tags: [Tags.Fantasy] },
  { label: "Half-Orc", tags: [Tags.Fantasy] },
  { label: "Tiefling", tags: [Tags.Fantasy] },
  { label: "Elf", tags: [Tags.Fantasy] },
];

const Backgrounds: Array<Card> = [
  { label: "Investigator" },
  { label: "Artist" },
  { label: "Ghost" },
  { label: "Necromancer" },
  { label: "Pirate" },
  { label: "Sailor" },
  { label: "Soldier" },
  { label: "Mercenary" },
  { label: "Anarchist" },
  { label: "Doctor" },
  { label: "Assassin" },
  { label: "The Chosen One" },
  { label: "King" },
  { label: "Queen" },
  { label: "Vassal" },
  { label: "Lord" },
  { label: "Vigilante" },
  { label: "Merchant" },
  { label: "Vagabond" },
  { label: "Bandit" },
  { label: "Monster" },
  { label: "Celestial" },
  { label: "Deman" },
  { label: "Deity" },
  { label: "Politician" },
  { label: "Diplomatic" },
];
const Faces: Array<Card> = [
  { label: "Mother" },
  { label: "Father" },
  { label: "Brother" },
  { label: "Sister" },
  { label: "Uncle" },
  { label: "Aunt" },
  { label: "Master" },
  { label: "Apprentice" },
  { label: "Ally" },
  { label: "Ennemy" },
  { label: "Son" },
  { label: "Daughter" },
  { label: "Lover" },
  { label: "Former Lover" },
  { label: "Chief" },
  { label: "Follower" },
];
const Places: Array<Card> = [
  { label: "River" },
  { label: "Forest" },
  { label: "Mountain" },
  { label: "Village" },
  { label: "Town" },
  { label: "City" },
  { label: "Cave" },
  { label: "Ruins" },
  { label: "Advanced Civilization" },
  { label: "Cemetary" },
  { label: "Temple" },
  { label: "Ship" },
  { label: "Port" },
  { label: "Castle" },
  { label: "Palace" },
  { label: "Heaven" },
  { label: "Hell" },
  { label: "Desert" },
  { label: "Arctic" },
  { label: "Inn" },
  { label: "Home" },
  { label: "Sea" },
  { label: "Island" },
  { label: "Dungeon" },
  { label: "Prison" },
];
const Events: Array<Card> = [
  { label: "Rise" },
  { label: "Fall" },
  { label: "Be Helped" },
  { label: "Give Helped" },
  { label: "Death" },
  { label: "Victory" },
  { label: "Defeat" },
  { label: "Love" },
  { label: "Hate" },
  { label: "Friendship" },
  { label: "Rivalry" },
  { label: "Romance" },
  { label: "Separation" },
  { label: "Fame" },
  { label: "Redemption" },
  { label: "Selfless Sacrifice" },
  { label: "Legend" },
  { label: "Secret" },
  { label: "Wealth" },
  { label: "Poverty" },
  { label: "Betrayed" },
  { label: "Dept" },
  { label: "Duty" },
  { label: "Training" },
  { label: "Search" },
  { label: "Corruption" },
  { label: "Reward" },
  { label: "Revenge" },
];
