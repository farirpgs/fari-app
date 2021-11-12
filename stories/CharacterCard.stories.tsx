import Box from "@mui/material/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useContext, useState } from "react";
import { CharacterCard } from "../lib/components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
import { DiceContext } from "../lib/contexts/DiceContext/DiceContext";
import LoremIpsumTemplate from "../lib/domains/character/character-templates/LoremIpsum.json";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { CharacterTemplates } from "../lib/domains/character/CharacterType";
import { IDiceRollResult } from "../lib/domains/dice/Dice";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterCard(
  props: Pick<
    Parameters<typeof CharacterCard>["0"],
    "characterSheet" | "readonly" | "playerName"
  >
) {
  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const diceManager = useContext(DiceContext);

  function handleOnNewRoll(result: IDiceRollResult) {
    setRolls((draft) => {
      return [result, ...draft];
    });
  }

  function handleOnRollPool() {
    const { result } = diceManager.actions.getPoolResult();
    handleOnNewRoll(result);
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
      <CharacterCard
        playerName={props.playerName}
        readonly={props.readonly}
        characterSheet={props.characterSheet}
        onCharacterDialogOpen={action("onCharacterDialogOpen") as any}
        onRoll={handleOnNewRoll}
      />
      <Box mt="6rem" />
    </>
  );
}

type IProps = Parameters<typeof StorybookCharacterCard>["0"];

export default {
  title: "Main/CharacterCard",
  component: StorybookCharacterCard,
  args: {
    playerName: "",
    readonly: false,
    characterSheet: undefined,
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => {
  const character = args.characterSheet ?? (context as any).loaded.character;

  return (
    <StoryProvider theme={context.globals.theme}>
      <Box width="350px" ml="5rem">
        <StorybookCharacterCard
          characterSheet={
            {
              ...character,
              name: "My Character",
            } as any
          }
          readonly={args.readonly}
          playerName={args.playerName}
        />
      </Box>
    </StoryProvider>
  );
};

export const FateCondensed = Template.bind({});
(FateCondensed as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.FateCondensed
    );
    return { character };
  },
];

export const FateCore = Template.bind({});
(FateCore as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(CharacterTemplates.FateCore);
    return { character };
  },
];

export const FateAccelerated = Template.bind({});
(FateAccelerated as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.FateAccelerated
    );
    return { character };
  },
];

export const FateOfCthulhu = Template.bind({});
(FateOfCthulhu as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.FateOfCthulhu
    );
    return { character };
  },
];

export const DresdenFilesAccelerated = Template.bind({});
(DresdenFilesAccelerated as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.DresdenFilesAccelerated
    );
    return { character };
  },
];

export const VentureCity = Template.bind({});
(VentureCity as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.VentureCity
    );
    return { character };
  },
];

export const Heartbreaker = Template.bind({});
(Heartbreaker as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.Heartbreaker
    );
    return { character };
  },
];

export const IronEddaAccelerated = Template.bind({});
(IronEddaAccelerated as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.IronEddaAccelerated
    );
    return { character };
  },
];

export const Maze = Template.bind({});
(Maze as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(CharacterTemplates.Maze);
    return { character };
  },
];

export const Dnd5e = Template.bind({});
(Dnd5e as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(CharacterTemplates.Dnd5e);
    return { character };
  },
];

export const TheWitchIsDead = Template.bind({});
(TheWitchIsDead as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.TheWitchIsDead
    );
    return { character };
  },
];

export const EdgeOfTheEmpire = Template.bind({});
(EdgeOfTheEmpire as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.EdgeOfTheEmpire
    );
    return { character };
  },
];

export const EdgeOfTheEmpire_FR = Template.bind({});
(EdgeOfTheEmpire_FR as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.EdgeOfTheEmpire_FR
    );
    return { character };
  },
];
export const Blank = Template.bind({});
(Blank as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(CharacterTemplates.Blank);
    return { character };
  },
];

export const LoremIpsum = Template.bind({});
LoremIpsum.args = {
  characterSheet: CharacterFactory.migrate(LoremIpsumTemplate as any),
};
