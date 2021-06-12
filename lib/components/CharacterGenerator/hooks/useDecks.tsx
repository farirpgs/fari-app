import { useState } from "react";

export enum Tags {
  Fantasy = "Fantasy",
  SciFi = "SciFi",
}

export type Card = { label: string; tags?: Array<Tags> };

export function useDecks() {
  const [selectedTags, setSelectedTags] = useState<Array<Tags>>([Tags.Fantasy]);

  function toggleTag(tagToToggle: Tags) {
    setSelectedTags((prev) => {
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
      const match = selectedTags.includes(cardTag);
      if (match) {
        return true;
      }
    }
    return false;
  }

  const archetypes = Archetypes.filter(filterByTag);
  const ancestry = Ancestry.filter(filterByTag);
  const backgrounds = Backgrounds.filter(filterByTag);
  const faces = Faces.filter(filterByTag);
  const places = Places.filter(filterByTag);
  const events = Events.filter(filterByTag);

  return {
    state: {
      selectedTags: selectedTags,
      decks: { archetypes, ancestry, backgrounds, faces, places, events },
    },
    actions: {
      toggleTag: toggleTag,
    },
  };
}

const Archetypes: Array<Card> = [
  //#region
  { label: "An Artificer", tags: [Tags.Fantasy] },
  { label: "A Barbarian", tags: [Tags.Fantasy] },
  { label: "A Bard", tags: [Tags.Fantasy] },
  { label: "A Cleric", tags: [Tags.Fantasy] },
  { label: "A Druid", tags: [Tags.Fantasy] },
  { label: "A Fighter", tags: [Tags.Fantasy] },
  { label: "A Vampire", tags: [Tags.Fantasy] },
  { label: "A Werewolf", tags: [Tags.Fantasy] },
  { label: "A Monk", tags: [Tags.Fantasy] },
  { label: "A Paladin", tags: [Tags.Fantasy] },
  { label: "A Ranger", tags: [Tags.Fantasy] },
  { label: "A Rogue", tags: [Tags.Fantasy] },
  { label: "A Sorcerer", tags: [Tags.Fantasy] },
  { label: "A Warlock", tags: [Tags.Fantasy] },
  { label: "A Wizard", tags: [Tags.Fantasy] },
  //#endregion

  { label: "A Pilot", tags: [Tags.SciFi] },
  { label: "A Technician", tags: [Tags.SciFi] },
  { label: "A Smuggler", tags: [Tags.SciFi] },
  { label: "A Bounty Hunter", tags: [Tags.SciFi] },
  { label: "A Soldier", tags: [Tags.SciFi] },
  { label: "A Colonist", tags: [Tags.SciFi] },
  { label: "An Explorer", tags: [Tags.SciFi] },
];

const Ancestry: Array<Card> = [
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
  { label: "An Investigator" },
  { label: "An Artist" },
  { label: "A Ghost" },
  { label: "A Necromancer" },
  { label: "A Pirate" },
  { label: "A Sailor" },
  { label: "A Soldier" },
  { label: "A Mercenary" },
  { label: "An Anarchist" },
  { label: "A Doctor" },
  { label: "An Assassin" },
  { label: "A Chosen One" },
  { label: "A King" },
  { label: "A Queen" },
  { label: "A Vassal" },
  { label: "A Lord" },
  { label: "A Vigilante" },
  { label: "A Merchant" },
  { label: "A Vagabond" },
  { label: "A Bandit" },
  { label: "A Monster" },
  { label: "A Celestial" },
  { label: "A Demon" },
  { label: "A Deity" },
  { label: "A Politician" },
  { label: "A Diplomatic" },
  //#endregion
  { label: "A Scholar" },
  { label: "Conman" },
];

const Faces: Array<Card> = [
  //#region
  // { label: "Parent" },
  // { label: "Sibling" },
  // { label: "Child" },
  { label: "A Mother" },
  { label: "A Father" },
  { label: "A Brother" },
  { label: "A Sister" },
  { label: "A Son" },
  { label: "A Daughter" },
  { label: "An Uncle" },
  { label: "An Aunt" },
  { label: "A Master" },
  { label: "An Apprentice" },
  { label: "An Ally" },
  { label: "An Ennemy" },
  { label: "A Lover" },
  { label: "A Former Lover" },
  { label: "A Chief" },
  { label: "A Follower" },
  //#endregion
  { label: "A Best Friend" },
  { label: "An Admirer" },
  { label: "A Rival" },
  { label: "A Guide" },
  { label: "A Mentor" },
  // Dealer, Secret Lover, Best Friend, Childhood Friend, School Rival, Blast from the Past, Soulmate,
  // Boss, Employee, Former Teammate, Total Stranger, Industry Mogul,
  // Local Business Person, Local Law Enforcement,
  // National Law Enforcement, Handler, Informant, Fence, Fixer
];
const Places: Array<Card> = [
  //#region
  { label: "A Forest" },
  { label: "A Mountain" },
  { label: "A Village" },
  { label: "A Town" },
  { label: "A City" },
  { label: "A Cave" },
  { label: "A Ruins" },
  { label: "An Advanced Civilization" },
  { label: "A Graveyard" },
  { label: "A Temple" },
  { label: "A Ship" },
  { label: "A Port" },
  { label: "A Castle" },
  { label: "A Palace" },
  { label: "A Promised Land" },
  { label: "An Infernal Land" },
  { label: "A Desert" },
  { label: "The Arctic" },
  { label: "An Inn" },
  { label: "A Home" },
  { label: "The Sea" },
  { label: "A Lake" },
  { label: "A River" },
  { label: "An Island" },
  { label: "A Dungeon" },
  { label: "A Prison" },
  //#endregion

  { label: "The Road" },
  { label: "The Sewers" },
  { label: "Tunnels" },
  { label: "A Swamp" },
  { label: "A Forest Clearing" },
  { label: "An Overgrown Forest" },

  { label: "An Abandoned Tower", tags: [Tags.Fantasy] },
  { label: "A Ritual Chamber", tags: [Tags.Fantasy] },
  { label: "A Fae Forest", tags: [Tags.Fantasy] },
  { label: "A Spirit Forest", tags: [Tags.Fantasy] },
  { label: "The Space Between Worlds", tags: [Tags.Fantasy] },
  { label: "An Alchemist Lab", tags: [Tags.Fantasy] },
  { label: "An Antiques Shop", tags: [Tags.Fantasy] },
  { label: "A Forge", tags: [Tags.Fantasy] },
  { label: "A Place of Worship", tags: [Tags.Fantasy] },
  { label: "The Stables", tags: [Tags.Fantasy] },
  { label: "The Public Square", tags: [Tags.Fantasy] },
  { label: "The Gallows", tags: [Tags.Fantasy] },
  { label: "The Throne Room", tags: [Tags.Fantasy] },
  { label: "Behind Enemy Lines ", tags: [Tags.Fantasy] },
  { label: "A Crystal Clear Lake", tags: [Tags.Fantasy] },
];

/**
 * It involves...
 */
const Events: Array<Card> = [
  //#region
  { label: "Ris" },
  { label: "Fall" },
  { label: "Being Help" },
  { label: "Giving Help" },
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
  { label: "Betrayal" },
  { label: "Dept" },
  { label: "Duty" },
  { label: "Training" },
  { label: "Research" },
  { label: "Corruption" },
  { label: "Reward" },
  { label: "Revenge" },
  //#endregion
];
