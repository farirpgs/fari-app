import Box from "@material-ui/core/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { PlayerRow } from "../lib/components/Scene/components/PlayerRow/PlayerRow";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import {
  BlockType,
  ICharacter,
  IPage,
  Position,
} from "../lib/domains/character/types";
import { IDiceRollResult, RollType } from "../lib/domains/dice/Dice";
import { Id } from "../lib/domains/Id/Id";
import { IPlayer } from "../lib/hooks/useScene/IScene";
import { StoryProvider } from "./StoryProvider";

function StorybookPlayerRow(props: {
  canRoll: boolean;
  canUpdatePoints: boolean;
  canUpdateInitiative: boolean;
  canLoadCharacterSheet: boolean;
  canLoadDuplicateCharacterSheet: boolean;
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
        canLoadDuplicateCharacterSheet: props.canLoadDuplicateCharacterSheet,
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
      onAssignOriginalCharacterSheet={action("onLoadCharacterSheet")}
      onAssignDuplicateCharacterSheet={action(
        "onLoadAndDuplicateCharacterSheet"
      )}
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
    canLoadDuplicateCharacterSheet: false,
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
        canLoadDuplicateCharacterSheet={args.canLoadDuplicateCharacterSheet}
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
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    playerName: "Game Master",
    isGM: true,
    rolls: [],
  }),
};

export const Player = Template.bind({});
Player.args = {
  highlight: true,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
};

export const Player_AsGM = Template.bind({});
Player_AsGM.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: true,
  canRemove: true,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
};

export const PlayerWithACharacterSheet = Template.bind({});
PlayerWithACharacterSheet.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    character: aCharacter("Meriadoc Brandybuck"),
  }),
};

export const PlayerWithARoll = Template.bind({});
PlayerWithARoll.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    character: aCharacter("Meriadoc Brandybuck"),
    rolls: [aRoll()],
  }),
};

export const PlayerWithARollAndLabel = Template.bind({});
PlayerWithARollAndLabel.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    character: aCharacter("Meriadoc Brandybuck"),
    rolls: [aRollWithLabel()],
  }),
};

export const PlayerWithARollAndModifier = Template.bind({});
PlayerWithARollAndModifier.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    character: aCharacter("Meriadoc Brandybuck"),
    rolls: [aRollWithModifier()],
  }),
};

export const PlayerReadOnly = Template.bind({});
PlayerReadOnly.args = {
  highlight: false,
  canLoadCharacterSheet: false,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: false,
  canUpdateInitiative: false,
  canUpdatePoints: false,
};

export const PlayerReadOnlyWithCharacter = Template.bind({});
PlayerReadOnlyWithCharacter.args = {
  highlight: false,
  canLoadCharacterSheet: false,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: false,
  canUpdateInitiative: false,
  canUpdatePoints: false,
  player: aPlayer({
    character: aCharacter("Meriadoc Brandybuck"),
  }),
};

export const PlayerOutOfBound = Template.bind({});
PlayerOutOfBound.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    playerName:
      "LongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongName",
    points: "3333333",
    rolls: [
      {
        total: 3,
        totalWithoutModifiers: 3,
        options: { listResults: false },
        commandResult: [
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
        ],
      },
    ],
  }),
};
export const PlayerOutOfBoundWithCharacter = Template.bind({});
PlayerOutOfBoundWithCharacter.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    playerName:
      "LongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongName",
    points: "3333333",
    character: aCharacter(
      "CharacterNameCharacterNameCharacterNameCharacterNameCharacterNameCharacterName"
    ),
    rolls: [
      {
        total: 3,
        totalWithoutModifiers: 3,
        options: { listResults: false },
        commandResult: [
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1dF",
            commandName: "1dF",
            type: RollType.DiceCommand,
          },
        ],
      },
    ],
  }),
};

export const PlayerOutOfBoundPool = Template.bind({});
PlayerOutOfBoundPool.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    playerName:
      "LongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongName",
    points: "3333333",
    rolls: [
      {
        total: 3,
        totalWithoutModifiers: 3,
        options: { listResults: false },
        commandResult: [
          {
            value: 1,
            commandGroupId: "1d4",
            commandName: "1d4",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d6",
            commandName: "1d6",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d8",
            commandName: "1d8",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d10",
            commandName: "1d10",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d12",
            commandName: "1d12",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d20",
            commandName: "1d20",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d4",
            commandName: "1d4",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d6",
            commandName: "1d6",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d8",
            commandName: "1d8",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d10",
            commandName: "1d10",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d12",
            commandName: "1d12",
            type: RollType.DiceCommand,
          },
          {
            value: 1,
            commandGroupId: "1d20",
            commandName: "1d20",
            type: RollType.DiceCommand,
          },
        ],
      },
    ],
  }),
};

function aRoll(): IDiceRollResult {
  return {
    total: 3,
    totalWithoutModifiers: 3,
    options: { listResults: false },
    commandResult: [
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 0,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
    ],
  };
}
function aRollWithModifier(): IDiceRollResult {
  return {
    total: 7,
    totalWithoutModifiers: 3,
    options: { listResults: false },
    commandResult: [
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 0,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        label: "Athletic",
        type: RollType.Modifier,
        value: 3,
      },
    ],
  };
}

function aRollWithLabel(): IDiceRollResult {
  return {
    total: 7,
    totalWithoutModifiers: 3,
    options: { listResults: false },
    commandResult: [
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 1,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        value: 0,
        commandGroupId: "1dF",
        commandName: "1dF",
        type: RollType.DiceCommand,
      },
      {
        label: "Athletic",
        type: RollType.Label,
      },
    ],
  };
}

function aCharacter(name: string): ICharacter {
  return {
    name: name,
    pages: [
      {
        id: "1",
        label: "Page",
        sections: [
          {
            id: "1",
            label: "Section",
            position: Position.Left,
            blocks: [
              {
                ...CharacterFactory.makeBlock(BlockType.PointCounter),
                value: "1",
                label: "Fate Points",
                meta: {
                  max: "3",
                  isMainPointCounter: true,
                },
              },
            ],
          },
        ],
      },
    ] as Array<IPage>,
  } as any;
}

function aPlayer(props: Partial<IPlayer> = {}): IPlayer {
  return {
    id: Id.generate(),
    points: "3",
    playerName: "René-Pier",
    isGM: false,
    offline: false,
    playedDuringTurn: false,
    rolls: [],
    ...props,
  };
}
