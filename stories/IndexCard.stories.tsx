import Box from "@mui/material/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import produce from "immer";
import React, { useContext, useState } from "react";
import { IndexCard } from "../lib/components/IndexCard/IndexCard";
import { IndexCardColor } from "../lib/components/IndexCard/IndexCardColor";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
import { DiceContext } from "../lib/contexts/DiceContext/DiceContext";
import { IDiceRollResult } from "../lib/domains/dice/Dice";
import { SceneFactory } from "../lib/domains/scene/SceneFactory";
import { IIndexCard } from "../lib/hooks/useScene/IScene";
import { IDicePoolElement } from "../lib/routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { StoryProvider } from "./StoryProvider";

function StorybookIndexCard(props: {
  isGM: boolean;
  indexCard: IIndexCard;
  pinned: boolean;
  playedDuringTurn: boolean;
  width: string;
}) {
  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const diceManager = useContext(DiceContext);
  const [collapse, setCollapse] = useState(false);

  function handleOnNewRoll(result: IDiceRollResult) {
    setRolls((draft) => {
      return [result, ...draft];
    });
  }

  function handleOnRollPool() {
    const { result } = diceManager.actions.getPoolResult();
    handleOnNewRoll(result);
  }

  function handleOnPoolClick(element: IDicePoolElement) {
    diceManager.actions.addOrRemovePoolElement(element);
  }

  return (
    <>
      <Toolbox
        dice={{
          rollsForDiceBox: rolls,
          onRoll: handleOnNewRoll,
          onRollPool: handleOnRollPool,
        }}
        hideDefaultRightActions={true}
      />

      <Box width={props.width}>
        <IndexCard
          type="public"
          allCards={[]}
          reactDndIndex={0}
          canMove={true}
          reactDndType={"storybook"}
          id="123"
          indexCard={{
            ...props.indexCard,
            pinned: props.pinned,
            playedDuringTurn: props.playedDuringTurn,
          }}
          indexCardHiddenRecord={{
            "123": collapse ? true : false,
          }}
          isGM={props.isGM}
          onRoll={(diceRollResult) => {
            handleOnNewRoll(diceRollResult);
          }}
          onPoolClick={handleOnPoolClick}
          onMoveTo={action("onMoveTo") as any}
          onChange={action("onChange") as any}
          onMove={action("onMove") as any}
          onRemove={action("onRemove") as any}
          onDuplicate={action("onDuplicate") as any}
          onTogglePrivate={action("onTogglePrivate") as any}
          onToggleVisibility={() => {
            setCollapse((prev) => !prev);
          }}
        />
      </Box>
      <Box mt="6rem" />
    </>
  );
}

type IProps = Parameters<typeof StorybookIndexCard>["0"];

export default {
  title: "Main/IndexCard",
  component: StorybookIndexCard,
  args: {
    indexCard: anIndexCard(),
    isGM: true,
    pinned: false,
    playedDuringTurn: false,
    width: "350px",
  },
  argTypes: {},
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => (
  <StoryProvider theme={context.globals.theme}>
    <Box width="100%">
      <StorybookIndexCard
        indexCard={args.indexCard}
        isGM={args.isGM}
        pinned={args.pinned}
        width={args.width}
        playedDuringTurn={args.playedDuringTurn}
      />
    </Box>
  </StoryProvider>
);

export const Default = Template.bind({});

export const DefaultDark = Template.bind({});
DefaultDark.args = {
  indexCard: anIndexCard((draft) => {
    draft.color = "#000";
  }),
};

export const Empty = Template.bind({});
Empty.args = {
  indexCard: anIndexCard((draft) => {
    draft.title = "";
    draft.content = "";
  }),
};

export const DefaultWithSkills = Template.bind({});
DefaultWithSkills.args = {
  indexCard: anIndexCard((draft) => {
    draft.title = "Title";
    draft.content =
      "Description <br> Description <br> Description <br> [Academic  : 4]";
  }),
};

export const Aspect = Template.bind({});
Aspect.args = {
  indexCard: anIndexCard((draft) => {
    draft.titleLabel = "Aspect";
    draft.title = "Title";
    draft.contentLabel = "Notes";
    draft.content = "Description <br> Description <br> Description <br>";
  }),
};
export const Boost = Template.bind({});
Boost.args = {
  indexCard: anIndexCard((draft) => {
    draft.titleLabel = "Boost";
    draft.title = "Title";
    draft.contentLabel = "Notes";
    draft.content = "Description <br> Description <br> Description <br>";
    draft.color = IndexCardColor.blue;
  }),
};
export const Zone = Template.bind({});
Zone.args = {
  indexCard: anIndexCard((draft) => {
    draft.color = "#eee";
    draft.subCards.push(SceneFactory.makeSubIndexCard());
    draft.subCards.push(SceneFactory.makeSubIndexCard());
    draft.subCards.push(SceneFactory.makeSubIndexCard());
  }),
  width: "100%",
};
export const ZoneDark = Template.bind({});
ZoneDark.args = {
  indexCard: anIndexCard((draft) => {
    draft.color = "#540000";
    draft.subCards.push(SceneFactory.makeSubIndexCard());
    draft.subCards.push(SceneFactory.makeSubIndexCard());
    draft.subCards.push(SceneFactory.makeSubIndexCard());
  }),
  width: "100%",
};
export const NPC = Template.bind({});
NPC.args = {
  indexCard: anIndexCard((draft) => {
    draft.titleLabel = "NPC";
    draft.title = "Title";
    draft.contentLabel = "Aspects";
    draft.content = "Description <br> Description <br> Description <br>";
    draft.color = IndexCardColor.green;
  }),
};
export const BadGuy = Template.bind({});
BadGuy.args = {
  indexCard: anIndexCard((draft) => {
    draft.titleLabel = "NPC";
    draft.title = "Title";
    draft.contentLabel = "Aspects";
    draft.content = "Description <br> Description <br> Description <br>";
    draft.color = IndexCardColor.red;
  }),
};
export const Index_Card = Template.bind({});
Index_Card.args = {
  indexCard: anIndexCard((draft) => {
    draft.title = "Title";
    draft.content = "Description <br> Description <br> Description <br>";
  }),
};

export const OutOfBound = Template.bind({});
OutOfBound.args = {
  indexCard: anIndexCard((draft) => {
    draft.title =
      "Orc dps charisma modifier wagon wisdom Orc dps charisma modifier wagon wisdom";
    draft.content =
      "Sense troll cartographer agility horse gnoll. Lance advantage advantage wizard falchion polearm. Longsword tavern spirit strength dexterity polearm. Longsword hobgoblin great axe axe lance initiative. Ship dexterity bow light spell casting poleaxe.";
  }),
};

function anIndexCard(recipe?: (indexCard: IIndexCard) => void): IIndexCard {
  return produce(SceneFactory.makeIndexCard(), (draft) => {
    draft.titleLabel = "Index Card";
    draft.title = "Title";
    draft.contentLabel = "Notes";
    draft.content = "Description";
    draft.color = "#fff";
    draft.playedDuringTurn = false;
    draft.pinned = false;
    draft.id = "123";
    draft.sub = false;
    draft.subCards = [];
    draft.blocks = [];
    recipe?.(draft);
  });
}
