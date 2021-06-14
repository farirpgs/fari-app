import { useState } from "react";
import {
  Ancestry,
  Archetypes,
  Backgrounds,
  Events,
  Faces,
  Places,
} from "./Decks";

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
