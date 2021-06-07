import Box from "@material-ui/core/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useContext, useState } from "react";
import { DiceFab } from "../lib/components/DiceFab/DiceFab";
import { DiceContext } from "../lib/contexts/DiceContext/DiceContext";
import LoremIpsumTemplate from "../lib/domains/character/character-templates/LoremIpsum.json";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { CharacterTemplates } from "../lib/domains/character/CharacterType";
import { ICharacter } from "../lib/domains/character/types";
import { dayJS } from "../lib/domains/dayjs/getDayJS";
import { IDiceRollResult } from "../lib/domains/dice/Dice";
import { CharacterV3Dialog } from "../lib/routes/Character/components/CharacterDialog/CharacterV3Dialog";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterSheet(
  props: Pick<
    Parameters<typeof CharacterV3Dialog>["0"],
    "character" | "dialog" | "readonly"
  >
) {
  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const diceManager = useContext(DiceContext);

  function handleSetNewRoll(result: IDiceRollResult) {
    setRolls((draft) => {
      return [result, ...draft];
    });
  }

  function handleOnRollPool() {
    const { result } = diceManager.actions.getPoolResult();
    handleSetNewRoll(result);
  }

  return (
    <>
      <DiceFab
        rollsForDiceBox={rolls}
        onRoll={handleSetNewRoll}
        onRollPool={handleOnRollPool}
      />
      <CharacterV3Dialog
        dialog={props.dialog}
        open={true}
        character={props.character}
        readonly={props.readonly}
        synced={false}
        onRoll={handleSetNewRoll}
        onClose={action("onClose")}
        onSave={action("onSave")}
        onToggleSync={action("onToggleSync")}
      />
    </>
  );
}

type IProps = Parameters<typeof StorybookCharacterSheet>["0"];

export default {
  title: "Main/Character",
  component: StorybookCharacterSheet,
  args: {
    dialog: false,
    readonly: false,
    character: undefined,
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => {
  const character = args.character ?? (context as any).loaded.character;
  return (
    <StoryProvider theme={context.globals.theme}>
      <Box>
        <StorybookCharacterSheet
          character={character}
          readonly={args.readonly}
          dialog={args.dialog}
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
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const FateCore = Template.bind({});
(FateCore as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(CharacterTemplates.FateCore);
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const FateAccelerated = Template.bind({});
(FateAccelerated as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.FateAccelerated
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const FateOfCthulhu = Template.bind({});
(FateOfCthulhu as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.FateOfCthulhu
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const DresdenFilesAccelerated = Template.bind({});
(DresdenFilesAccelerated as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.DresdenFilesAccelerated
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const VentureCity = Template.bind({});
(VentureCity as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.VentureCity
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const Heartbreaker = Template.bind({});
(Heartbreaker as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.Heartbreaker
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const IronEddaAccelerated = Template.bind({});
(IronEddaAccelerated as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.IronEddaAccelerated
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const Maze = Template.bind({});
(Maze as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(CharacterTemplates.Maze);
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const Dnd5e = Template.bind({});
(Dnd5e as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(CharacterTemplates.Dnd5e);
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const TheWitchIsDead = Template.bind({});
(TheWitchIsDead as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.TheWitchIsDead
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const EdgeOfTheEmpire = Template.bind({});
(EdgeOfTheEmpire as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.EdgeOfTheEmpire
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const EdgeOfTheEmpire_FR = Template.bind({});
(EdgeOfTheEmpire_FR as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.EdgeOfTheEmpire_FR
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const EvolutionPulseHydrah = Template.bind({});
(EvolutionPulseHydrah as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.EvolutionPulse_Hydrah
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const MärchenkriegerLOS = Template.bind({});
(MärchenkriegerLOS as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.MärchenkriegerLOS
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const FateCondensedSpanish = Template.bind({});
(FateCondensedSpanish as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.FateCondensedSpanish
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const FateCoreSpanish = Template.bind({});
(FateCoreSpanish as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.FateCoreSpanish
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const TachyonSquadronCharacter = Template.bind({});
(TachyonSquadronCharacter as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.TachyonSquadronCharacter
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const TachyonSquadronShip = Template.bind({});
(TachyonSquadronShip as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.TachyonSquadronShip
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const TachyonSquadronCharacterAndShip = Template.bind({});
(TachyonSquadronCharacterAndShip as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.TachyonSquadronCharacterAndShip
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const DresdenFilesRPGCharacter = Template.bind({});
(DresdenFilesRPGCharacter as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.DresdenFilesRPGCharacter
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const DresdenFilesRPGSpellCaster = Template.bind({});
(DresdenFilesRPGSpellCaster as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.DresdenFilesRPGSpellCaster
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const DresdenFilesRPGVampire = Template.bind({});
(DresdenFilesRPGVampire as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(
      CharacterTemplates.DresdenFilesRPGVampire
    );
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const Blank = Template.bind({});
(Blank as any).loaders = [
  async () => {
    const character = await CharacterFactory.make(CharacterTemplates.Blank);
    return { character: overrideCharacterDateForStorybook(character) };
  },
];
export const LoremIpsum = Template.bind({});
LoremIpsum.args = {
  character: CharacterFactory.migrate(LoremIpsumTemplate as any),
};

function overrideCharacterDateForStorybook(character: ICharacter): ICharacter {
  return {
    ...character,
    id: "50fa2",
    lastUpdated: dayJS("2021-01-01").unix(),
  };
}
