import Box from "@material-ui/core/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { PlayerRow } from "../lib/components/Scene/components/PlayerRow/PlayerRow";
import { RollType } from "../lib/domains/dice/Dice";
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
      isMe={props.highlight}
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

const Template: Story<IProps> = (args, context) => (
  <StoryProvider theme={context.globals.theme}>
    <Box width="300px">
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

export const PlayerWithACharacterSheet = Template.bind({});
PlayerWithACharacterSheet.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canRemove: true,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    character: { pages: [] } as any,
  }),
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
        totalWithoutModifiers: 3,
        options: { listResults: false },
        commandResult: [
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
        ],
      },
    ],
  }),
};
export const PlayerOutOfBoundWithCharacter = Template.bind({});
PlayerOutOfBoundWithCharacter.args = {
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
    character: { pages: [] } as any,
    rolls: [
      {
        total: 3,
        totalWithoutModifiers: 3,
        options: { listResults: false },
        commandResult: [
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
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
        totalWithoutModifiers: 3,
        options: { listResults: false },
        commandResult: [
          { value: 1, command: "1d4", type: RollType.DiceCommand },
          { value: 1, command: "1d6", type: RollType.DiceCommand },
          { value: 1, command: "1d8", type: RollType.DiceCommand },
          { value: 1, command: "1d10", type: RollType.DiceCommand },
          { value: 1, command: "1d12", type: RollType.DiceCommand },
          { value: 1, command: "1d20", type: RollType.DiceCommand },
          { value: 1, command: "1d4", type: RollType.DiceCommand },
          { value: 1, command: "1d6", type: RollType.DiceCommand },
          { value: 1, command: "1d8", type: RollType.DiceCommand },
          { value: 1, command: "1d10", type: RollType.DiceCommand },
          { value: 1, command: "1d12", type: RollType.DiceCommand },
          { value: 1, command: "1d20", type: RollType.DiceCommand },
        ],
      },
    ],
  }),
};

function aPlayer(props: Partial<IPlayer> = {}): IPlayer {
  return {
    id: "123",
    points: "3",
    playerName: "Meriadoc Brandybuck",
    isGM: false,
    offline: false,
    playedDuringTurn: false,
    rolls: [
      {
        total: 3,
        totalWithoutModifiers: 3,
        options: { listResults: false },
        commandResult: [
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 1, command: "1dF", type: RollType.DiceCommand },
          { value: 0, command: "1dF", type: RollType.DiceCommand },
        ],
      },
    ],
    ...props,
  };
}
