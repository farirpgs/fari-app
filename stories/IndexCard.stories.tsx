import Box from "@mui/material/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { produce } from "immer";
import React, { useState } from "react";
import { IndexCard } from "../lib/components/IndexCard/IndexCard";
import { IndexCardColor } from "../lib/components/IndexCard/IndexCardColor";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
import { SceneFactory } from "../lib/domains/scene/SceneFactory";
import { IIndexCard } from "../lib/hooks/useScene/IScene";
import { StoryProvider } from "./StoryProvider";

function StorybookIndexCard(props: {
  isGM: boolean;
  indexCard: IIndexCard;
  pinned: boolean;
  playedDuringTurn: boolean;
  width: string;
}) {
  const [collapse, setCollapse] = useState(false);

  function handleOnNewRoll() {}

  return (
    <>
      <Toolbox
        diceFabProps={{
          onRoll: handleOnNewRoll,
        }}
        hideDefaultRightActions={true}
      />

      <Box width={props.width}>
        <IndexCard
          type="public"
          allCards={[]}
          canMove={true}
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
          onRoll={() => {}}
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
  }),
};

export const DefaultWithSkills = Template.bind({});
DefaultWithSkills.args = {
  indexCard: anIndexCard((draft) => {
    draft.title = "Title";
  }),
};

export const Aspect = Template.bind({});
Aspect.args = {
  indexCard: anIndexCard((draft) => {
    draft.titleLabel = "Aspect";
    draft.title = "Title";
  }),
};
export const Boost = Template.bind({});
Boost.args = {
  indexCard: anIndexCard((draft) => {
    draft.titleLabel = "Boost";
    draft.title = "Title";
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
    draft.color = IndexCardColor.green;
  }),
};
export const BadGuy = Template.bind({});
BadGuy.args = {
  indexCard: anIndexCard((draft) => {
    draft.titleLabel = "NPC";
    draft.title = "Title";
    draft.color = IndexCardColor.red;
  }),
};
export const Index_Card = Template.bind({});
Index_Card.args = {
  indexCard: anIndexCard((draft) => {
    draft.title = "Title";
  }),
};

export const OutOfBound = Template.bind({});
OutOfBound.args = {
  indexCard: anIndexCard((draft) => {
    draft.title =
      "Orc dps charisma modifier wagon wisdom Orc dps charisma modifier wagon wisdom";
  }),
};

function anIndexCard(recipe?: (indexCard: IIndexCard) => void): IIndexCard {
  return produce(SceneFactory.makeIndexCard(), (draft) => {
    draft.titleLabel = "Index Card";
    draft.title = "Title";
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
