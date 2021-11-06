import { IndexCardColor } from "../../components/IndexCard/IndexCardColor";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import { BlockType, ISlotTrackerBlock } from "../../domains/character/types";
import { IIndexCardCollection } from "../../domains/index-card-collection/IndexCardCollectionFactory";
import { SceneFactory } from "../../domains/scene/SceneFactory";

export const defaultIndexCardCollection: Array<IIndexCardCollection> = [
  {
    id: "Fate",
    name: "Fate",
    group: undefined,
    indexCards: [
      (function () {
        const card = SceneFactory.makeIndexCard();
        card.titleLabel = "Aspect";
        card.contentLabel = "Notes";
        const freeInvokes = CharacterFactory.makeBlock(BlockType.SlotTracker);
        freeInvokes.label = "Free Invokes";
        freeInvokes.value = [];
        return card;
      })(),
      (function () {
        const card = SceneFactory.makeIndexCard();
        card.titleLabel = "Boost";
        card.contentLabel = "Notes";
        const freeInvokes = CharacterFactory.makeBlock(BlockType.SlotTracker);
        freeInvokes.label = "Free Invokes";
        card.blocks.push(freeInvokes);
        card.color = IndexCardColor.blue;
        return card;
      })(),
      (function () {
        const card = SceneFactory.makeIndexCard();
        card.titleLabel = "NPC";
        card.contentLabel = "Aspects";
        const stress = CharacterFactory.makeBlock(BlockType.SlotTracker);
        stress.label = "Stress";
        const consequences = CharacterFactory.makeBlock(BlockType.Text);
        consequences.label = "Consequences";
        card.blocks.push(stress);
        card.blocks.push(consequences);
        card.color = IndexCardColor.green;
        return card;
      })(),
      (function () {
        const card = SceneFactory.makeIndexCard();
        card.titleLabel = "Bad Guy";
        card.contentLabel = "Aspects";
        const stress = CharacterFactory.makeBlock(BlockType.SlotTracker);
        stress.label = "Stress";
        const consequences = CharacterFactory.makeBlock(BlockType.Text);
        consequences.label = "Consequences";
        card.blocks.push(stress);
        card.blocks.push(consequences);
        card.color = IndexCardColor.red;
        return card;
      })(),
    ],
    lastUpdated: 0,
    version: 1,
  },
  {
    id: "Blades in the Dark",
    name: "Blades in the Dark",
    group: undefined,
    indexCards: [
      (function () {
        const card = SceneFactory.makeIndexCard();
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
        return card;
      })(),
    ],
    lastUpdated: 0,
    version: 1,
  },
];
