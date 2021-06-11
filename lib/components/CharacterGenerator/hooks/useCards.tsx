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
  //#region
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
  //#endregion

  { label: "Pilot", tags: [Tags.SciFi] },
  { label: "Technician", tags: [Tags.SciFi] },
  { label: "Smuggler", tags: [Tags.SciFi] },
  { label: "Bounty Hunter", tags: [Tags.SciFi] },
  { label: "Soldier", tags: [Tags.SciFi] },
  { label: "Colonist", tags: [Tags.SciFi] },
  { label: "Explorer", tags: [Tags.SciFi] },
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
  //#region
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
  //#endregion
];

const Faces: Array<Card> = [
  //#region
  // { label: "Parent" },
  // { label: "Sibling" },
  // { label: "Child" },
  { label: "Mother" },
  { label: "Father" },
  { label: "Brother" },
  { label: "Sister" },
  { label: "Son" },
  { label: "Daughter" },
  { label: "Uncle" },
  { label: "Aunt" },
  { label: "Master" },
  { label: "Apprentice" },
  { label: "Ally" },
  { label: "Ennemy" },
  { label: "Child" },
  { label: "Lover" },
  { label: "Former Lover" },
  { label: "Chief" },
  { label: "Follower" },
  //#endregion
  { label: "Best Friend" },
  { label: "Admirer" },
  { label: "Rival" },
  { label: "Guide" },
  { label: "Mentor" },
  // Dealer, Secret Lover, Best Friend, Childhood Friend, School Rival, Blast from the Past, Soulmate,
  // Boss, Employee, Former Teammate, Total Stranger, Industry Mogul,
  // Local Business Person, Local Law Enforcement,
  // National Law Enforcement, Handler, Informant, Fence, Fixer
];
const Places: Array<Card> = [
  //#region
  { label: "Forest" },
  { label: "Mountain" },
  { label: "Village" },
  { label: "Town" },
  { label: "City" },
  { label: "Cave" },
  { label: "Ruins" },
  { label: "Advanced Civilization" },
  { label: "Graveyard" },
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
  { label: "Lake" },
  { label: "River" },
  { label: "Island" },
  { label: "Dungeon" },
  { label: "Prison" },
  //#endregion

  { label: "Along the Road" },
  { label: "Sewers" },
  { label: "Tunnels" },
  { label: "Swamps" },
  { label: "Forest Clearing" },
  { label: "Overgrown Forest" },

  { label: "Abandoned Tower", tags: [Tags.Fantasy] },
  { label: "Ritual Chamber", tags: [Tags.Fantasy] },
  { label: "Fae Forest", tags: [Tags.Fantasy] },
  { label: "Spirit Forest", tags: [Tags.Fantasy] },
  { label: "In Between Worlds", tags: [Tags.Fantasy] },
  { label: "Alchemist Lab", tags: [Tags.Fantasy] },
  { label: "Antiques Shop", tags: [Tags.Fantasy] },
  { label: "Forge", tags: [Tags.Fantasy] },
  { label: "Place of Worship", tags: [Tags.Fantasy] },
  { label: "Stables", tags: [Tags.Fantasy] },
  { label: "Public Square", tags: [Tags.Fantasy] },
  { label: "Gallows", tags: [Tags.Fantasy] },
  { label: "Throne Room", tags: [Tags.Fantasy] },
  { label: "Behind Enemy Lines ", tags: [Tags.Fantasy] },
  { label: "Crystal Clear Lake", tags: [Tags.Fantasy] },
];
const Events: Array<Card> = [
  //#region
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
  //#endregion
];
