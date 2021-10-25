import Box from "@mui/material/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { PlayerRow } from "../lib/components/Scene/components/PlayerRow/PlayerRow";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { BlockType, ICharacter, IPage } from "../lib/domains/character/types";
import { IDiceRollResult } from "../lib/domains/dice/Dice";
import { IPlayer } from "../lib/hooks/useScene/IScene";
import { StoryProvider } from "./StoryProvider";

function StorybookPlayerRow(props: {
  canRoll: boolean;
  canUpdatePoints: boolean;
  canUpdateInitiative: boolean;
  canLoadCharacterSheet: boolean;
  canLoadDuplicateCharacterSheet: boolean;
  canRemove: boolean;
  canMarkPrivate: boolean;
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
        canMarkPrivate: props.canMarkPrivate,
      }}
      player={props.player}
      isMe={props.highlight}
      onDiceRoll={action("onDiceRoll")}
      onPlayedInTurnOrderChange={action("onPlayedInTurnOrderChange")}
      onPointsChange={action("onPointsChange")}
      onPlayerRemove={action("onPlayerRemove")}
      onTogglePrivate={action("onTogglePrivate")}
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
    canMarkPrivate: false,
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
        canMarkPrivate={args.canMarkPrivate}
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

export const PlayerWithAPoolRoll = Template.bind({});
PlayerWithAPoolRoll.args = {
  highlight: false,
  canLoadCharacterSheet: true,
  canLoadDuplicateCharacterSheet: false,
  canRemove: false,
  canRoll: true,
  canUpdateInitiative: true,
  canUpdatePoints: true,
  player: aPlayer({
    character: aCharacter("Meriadoc Brandybuck"),
    rolls: [aPoolRoll()],
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
        rollGroups: [
          {
            commandSets: new Array(50).fill(1).map(() => ({
              id: "1dF",
              commands: [{ value: 1, name: "1dF" }],
            })),
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
        rollGroups: [
          {
            commandSets: new Array(50).fill(1).map(() => ({
              id: "1dF",
              commands: [{ value: 1, name: "1dF" }],
            })),
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
        rollGroups: [
          {
            commandSets: new Array(50)
              .fill(1)
              .fill(1)
              .map(() => ({
                id: "1dF",
                commands: [{ value: 1, name: "1dF" }],
              })),
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
    rollGroups: [
      {
        commandSets: [
          {
            id: "4dF",
            commands: [
              { value: 1, name: "1dF" },
              { value: 1, name: "1dF" },
              { value: 1, name: "1dF" },
              { value: 1, name: "1dF" },
            ],
          },
        ],
      },
    ],
  };
}
function aRollWithModifier(): IDiceRollResult {
  return {
    total: 7,
    totalWithoutModifiers: 3,
    options: { listResults: false },
    rollGroups: [
      {
        label: "Atheltic",
        modifier: 4,
        commandSets: [
          {
            id: "4dF",
            commands: [
              { value: 1, name: "1dF" },
              { value: 1, name: "1dF" },
              { value: 1, name: "1dF" },
              { value: 0, name: "1dF" },
            ],
          },
        ],
      },
    ],
  };
}

function aPoolRoll(): IDiceRollResult {
  return {
    total: 6,
    totalWithoutModifiers: 6,
    options: { listResults: true },
    rollGroups: [
      {
        label: "Atheltic",
        commandSets: [
          {
            id: "1d12",
            commands: [{ value: 1, name: "1d12" }],
          },
          {
            id: "1d12",
            commands: [{ value: 2, name: "1d12" }],
          },
          {
            id: "1d12",
            commands: [{ value: 3, name: "1d12" }],
          },
        ],
      },
      {
        label: "Fight",
        commandSets: [
          {
            id: "1d12",
            commands: [{ value: 4, name: "1d12" }],
          },
          {
            id: "1d12",
            commands: [{ value: 5, name: "1d12" }],
          },
        ],
      },
      {
        label: "Shoot",
        commandSets: [
          {
            id: "1d12",
            commands: [{ value: 6, name: "1d12" }],
          },
        ],
      },
    ],
  };
}

function aRollWithLabel(): IDiceRollResult {
  return {
    total: 7,
    totalWithoutModifiers: 3,
    options: { listResults: false },
    rollGroups: [
      {
        label: "Ahtletic",
        commandSets: [
          {
            id: "4dF",
            commands: [
              { value: 1, name: "1dF" },
              { value: 1, name: "1dF" },
              { value: 1, name: "1dF" },
              { value: 1, name: "1dF" },
            ],
          },
        ],
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
        sections: {
          left: [
            {
              id: "1",
              label: "Section",
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
          right: [],
        },
      },
    ] as Array<IPage>,
  } as any;
}

function aPlayer(props: Partial<IPlayer> = {}): IPlayer {
  return {
    id: "770a7",
    points: "3",
    playerName: "René-Pier",
    isGM: false,
    playedDuringTurn: false,
    rolls: [],
    private: false,
    ...props,
  };
}
