import Box from "@mui/material/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { PlayerRow } from "../lib/components/Scene/components/PlayerRow/PlayerRow";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { BlockType, ICharacter, IPage } from "../lib/domains/character/types";
import { IPlayer } from "../lib/hooks/useScene/IScene";
import { DefaultPlayerColor } from "../lib/routes/Play/consts/PlayerColors";
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
  characterSheet: ICharacter;
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
        canMarkPrivate: props.canMarkPrivate,
      }}
      color={DefaultPlayerColor}
      isChild={false}
      characterName={props.characterSheet?.name}
      hasCharacterSheet={!!props.characterSheet}
      isPrivate={props.player.private}
      maxPoints={undefined}
      status={props.player.status}
      playerName={props.player.playerName}
      points={props.player.points}
      pointsLabel={"Points Label"}
      isMe={props.highlight}
      onDiceRoll={action("onDiceRoll")}
      onStatusChange={action("onPlayedInTurnOrderChange")}
      onPointsChange={action("onPointsChange")}
      onPlayerRemove={action("onPlayerRemove")}
      onTogglePrivate={action("onTogglePrivate")}
      onAssignCharacterSheet={action("onLoadCharacterSheet")}
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
        characterSheet={args.characterSheet}
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
  player: aPlayer({}),
  characterSheet: aCharacter("Meriadoc Brandybuck"),
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
  player: aPlayer({}),
  characterSheet: aCharacter("Meriadoc Brandybuck"),
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
  player: aPlayer({}),
  characterSheet: aCharacter("Meriadoc Brandybuck"),
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
  player: aPlayer({}),
  characterSheet: aCharacter("Meriadoc Brandybuck"),
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
  player: aPlayer({}),
  characterSheet: aCharacter("Meriadoc Brandybuck"),
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
  player: aPlayer({}),
  characterSheet: aCharacter("Meriadoc Brandybuck"),
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
  characterSheet: aCharacter(
    "CharacterNameCharacterNameCharacterNameCharacterNameCharacterNameCharacterName"
  ),
  player: aPlayer({
    playerName:
      "LongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongName",
    points: "3333333",
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
  }),
};

function aCharacter(name: string): ICharacter {
  return {
    name: name,
    pages: [
      {
        id: "1",
        label: "Page",
        rows: [
          {
            columns: [
              {
                sections: [
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
    id: "770a7",
    points: "3",
    playerName: "René-Pier",
    isGM: false,
    status: "",
    private: false,
    color: "#000000",
    ...props,
  };
}
