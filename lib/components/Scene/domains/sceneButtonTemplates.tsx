import { CharacterFactory } from "../../../domains/character/CharacterFactory";
import { BlockType, ISlotTrackerBlock } from "../../../domains/character/types";
import { IIndexCard } from "../../../hooks/useScene/IScene";
import { IndexCardColor } from "../../IndexCard/IndexCardColor";

export type ISceneButtonTemplate = {
  name: string;
  factory(indexCard: IIndexCard): void;
};

export const sceneButtonTemplates: Record<string, Array<ISceneButtonTemplate>> =
  {
    "Fate": [
      {
        name: "Aspect",
        factory(card) {
          card.titleLabel = "Aspect";
          card.contentLabel = "Notes";
          const freeInvokes = CharacterFactory.makeBlock(BlockType.SlotTracker);
          freeInvokes.label = "Free Invokes";
          freeInvokes.value = [];
          card.blocks.push(freeInvokes);
        },
      },
      {
        name: "Boost",
        factory(card) {
          card.titleLabel = "Boost";
          card.contentLabel = "Notes";
          const freeInvokes = CharacterFactory.makeBlock(BlockType.SlotTracker);
          freeInvokes.label = "Free Invokes";
          card.blocks.push(freeInvokes);
          card.color = IndexCardColor.blue;
        },
      },
      {
        name: "NPC",
        factory(card) {
          card.titleLabel = "NPC";
          card.contentLabel = "Aspects";
          const stress = CharacterFactory.makeBlock(BlockType.SlotTracker);
          stress.label = "Stress";
          const consequences = CharacterFactory.makeBlock(BlockType.Text);
          consequences.label = "Consequences";
          card.blocks.push(stress);
          card.blocks.push(consequences);
          card.color = IndexCardColor.green;
        },
      },
      {
        name: "BadGuy",
        factory(card) {
          card.titleLabel = "Bad Guy";
          card.contentLabel = "Aspects";
          const stress = CharacterFactory.makeBlock(BlockType.SlotTracker);
          stress.label = "Stress";
          const consequences = CharacterFactory.makeBlock(BlockType.Text);
          consequences.label = "Consequences";
          card.blocks.push(stress);
          card.blocks.push(consequences);
          card.color = IndexCardColor.red;
        },
      },
    ],
    "Blades in the Dark": [
      {
        name: "Clock",
        factory(card) {
          card.titleLabel = "Clock";
          card.contentLabel = "Notes";

          const slotTracker = CharacterFactory.makeBlock<ISlotTrackerBlock>(
            BlockType.SlotTracker
          );
          slotTracker.label = "Free Invokes";
          slotTracker.meta.asClock = true;
          slotTracker.value = [
            { label: "", checked: false },
            { label: "", checked: false },
            { label: "", checked: false },
            { label: "", checked: false },
          ];
          card.blocks.push(slotTracker);
        },
      },
    ],
  };
