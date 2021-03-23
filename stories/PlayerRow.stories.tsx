import Box from "@material-ui/core/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { PlayerRow } from "../lib/components/Scene/components/PlayerRow/PlayerRow";
import { IPlayer } from "../lib/hooks/useScene/IScene";
import { StoryProvider } from "./StoryProvider";

function StorybookPlayerRow(props: {
  canRoll: boolean;
  canUpdatePoints: boolean;
  canUpdateInitiative: boolean;
  canLoadCharacterSheet: boolean;
  canRemove: boolean;
  player: IPlayer;
  highlight: boolean;
}) {
  return (
    <PlayerRow
      permissions={{
        canRoll: props.canRoll,
        canUpdatePoints: props.canUpdatePoints,
        canUpdateInitiative: props.canUpdateInitiative,
        canLoadCharacterSheet: props.canLoadCharacterSheet,
        canRemove: props.canRemove,
      }}
      player={props.player}
      highlight={props.highlight}
      number={1}
      onDiceRoll={action("onDiceRoll")}
      onPlayedInTurnOrderChange={action("onPlayedInTurnOrderChange")}
      onPointsChange={action("onPointsChange")}
      onPlayerRemove={action("onPlayerRemove")}
      onCharacterSheetOpen={action("onCharacterSheetOpen")}
      onLoadCharacterSheet={action("onLoadCharacterSheet")}
    />
  );
}

type IProps = Parameters<typeof StorybookPlayerRow>["0"];

export default {
  title: "Main/PlayerRow",
  component: StorybookPlayerRow,
  args: {
    canRoll: false,
    canUpdatePoints: false,
    canUpdateInitiative: false,
    canLoadCharacterSheet: false,
    canRemove: false,
    highlight: false,
    player: aPlayer(),
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args) => (
  <StoryProvider>
    <Box width="300px" bgcolor="#fff">
      <StorybookPlayerRow
        canRoll={args.canRoll}
        canUpdatePoints={args.canUpdatePoints}
        canUpdateInitiative={args.canUpdateInitiative}
        canLoadCharacterSheet={args.canLoadCharacterSheet}
        canRemove={args.canRemove}
        player={args.player}
        highlight={args.highlight}
      />
    </Box>
  </StoryProvider>
);

export const GameMaster = Template.bind({});
GameMaster.args = {
  highlight: true,
  canLoadCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    playerName: "Game Master",
    isGM: true,
  }),
};

export const PlayerWithControls = Template.bind({});
PlayerWithControls.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canRemove: true,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
};

export const PlayerReadOnly = Template.bind({});
PlayerReadOnly.args = {
  highlight: false,
  canLoadCharacterSheet: false,
  canRemove: false,
  canRoll: false,
  canUpdateInitiative: false,
  canUpdatePoints: false,
};

export const PlayerOutOfBound = Template.bind({});
PlayerOutOfBound.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canRemove: true,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    playerName:
      "AVeryLongNameAVeryLongNameAVeryLongNameAVeryLongNameAVeryLongNameAVeryLongName",
    points: "3333333",
    rolls: [
      {
        total: 3,
        pool: false,
        commandResults: [
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
        ],
      },
    ],
  }),
};
export const PlayerOutOfBoundPool = Template.bind({});
PlayerOutOfBoundPool.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canRemove: true,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    playerName:
      "AVeryLongNameAVeryLongNameAVeryLongNameAVeryLongNameAVeryLongNameAVeryLongName",
    points: "3333333",
    rolls: [
      {
        total: 3,
        pool: true,
        commandResults: [
          { value: 1, type: "1d4" },
          { value: 1, type: "1d6" },
          { value: 1, type: "1d8" },
          { value: 1, type: "1d10" },
          { value: 1, type: "1d12" },
          { value: 1, type: "1d20" },
          { value: 1, type: "1d4" },
          { value: 1, type: "1d6" },
          { value: 1, type: "1d8" },
          { value: 1, type: "1d10" },
          { value: 1, type: "1d12" },
          { value: 1, type: "1d20" },
        ],
      },
    ],
  }),
};

function aPlayer(props: Partial<IPlayer> = {}): IPlayer {
  return {
    id: "123",
    points: "3",
    playerName: "RP",
    isGM: false,
    offline: false,
    playedDuringTurn: false,
    rolls: [
      {
        total: 3,
        pool: false,
        commandResults: [
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 1, type: "1dF" },
          { value: 0, type: "1dF" },
        ],
      },
    ],
    ...props,
  };
}
