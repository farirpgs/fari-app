import Box from "@mui/material/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useContext, useState } from "react";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
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
      <CharacterV3Dialog
        dialog={props.dialog}
        open={true}
        character={props.character}
        readonly={props.readonly}
        synced={false}
        onRoll={handleOnNewRoll}
        onClose={action("onClose")}
        onSave={action("onSave")}
        onToggleSync={action("onToggleSync")}
      />
      <Box mt="6rem" />
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

// prettier-ignore
export const FateCondensed = makeCharacterSheetStory(CharacterTemplates.FateCondensed)
// prettier-ignore
export const FateCore = makeCharacterSheetStory(CharacterTemplates.FateCore)
// prettier-ignore
export const FateAccelerated = makeCharacterSheetStory(CharacterTemplates.FateAccelerated)
// prettier-ignore
export const FateOfCthulhu = makeCharacterSheetStory(CharacterTemplates.FateOfCthulhu)
// prettier-ignore
export const DresdenFilesAccelerated = makeCharacterSheetStory(CharacterTemplates.DresdenFilesAccelerated)
// prettier-ignore
export const VentureCity = makeCharacterSheetStory(CharacterTemplates.VentureCity)
// prettier-ignore
export const Heartbreaker = makeCharacterSheetStory(CharacterTemplates.Heartbreaker)
// prettier-ignore
export const IronEddaAccelerated = makeCharacterSheetStory(CharacterTemplates.IronEddaAccelerated)
// prettier-ignore
export const StrandsOfFate = makeCharacterSheetStory(CharacterTemplates.StrandsOfFate)
// prettier-ignore
export const EvolutionPulse_Hydrah = makeCharacterSheetStory(CharacterTemplates.EvolutionPulse_Hydrah)
// prettier-ignore
export const EvolutionPulse_Hyonos = makeCharacterSheetStory(CharacterTemplates.EvolutionPulse_Hyonos)
// prettier-ignore
export const EvolutionPulse_LostH = makeCharacterSheetStory(CharacterTemplates.EvolutionPulse_LostH)
// prettier-ignore
export const EvolutionPulse_Obscura = makeCharacterSheetStory(CharacterTemplates.EvolutionPulse_Obscura)
// prettier-ignore
export const EvolutionPulse_Proxy = makeCharacterSheetStory(CharacterTemplates.EvolutionPulse_Proxy)
// prettier-ignore
export const FateCoreSpanish = makeCharacterSheetStory(CharacterTemplates.FateCoreSpanish)
// prettier-ignore
export const FateCondensedSpanish = makeCharacterSheetStory(CharacterTemplates.FateCondensedSpanish)
// prettier-ignore
export const FateCondensedTurkish = makeCharacterSheetStory(CharacterTemplates.FateCondensedTurkish)
// prettier-ignore
export const FateCondensedBrazilianPortuguese = makeCharacterSheetStory(CharacterTemplates.FateCondensedBrazilianPortuguese)
// prettier-ignore
export const FateAcceleratedBrazilianPortuguese = makeCharacterSheetStory(CharacterTemplates.FateAcceleratedBrazilianPortuguese)
// prettier-ignore
export const MärchenkriegerLOS = makeCharacterSheetStory(CharacterTemplates.MärchenkriegerLOS)
// prettier-ignore
export const TachyonSquadronCharacter = makeCharacterSheetStory(CharacterTemplates.TachyonSquadronCharacter)
// prettier-ignore
export const TachyonSquadronShip = makeCharacterSheetStory(CharacterTemplates.TachyonSquadronShip)
// prettier-ignore
export const TachyonSquadronCharacterAndShip = makeCharacterSheetStory(CharacterTemplates.TachyonSquadronCharacterAndShip)
// prettier-ignore
export const DresdenFilesRPGCharacter = makeCharacterSheetStory(CharacterTemplates.DresdenFilesRPGCharacter)
// prettier-ignore
export const DresdenFilesRPGSpellCaster = makeCharacterSheetStory(CharacterTemplates.DresdenFilesRPGSpellCaster)
// prettier-ignore
export const DresdenFilesRPGVampire = makeCharacterSheetStory(CharacterTemplates.DresdenFilesRPGVampire)
// prettier-ignore
export const ThePool = makeCharacterSheetStory(CharacterTemplates.ThePool)
// prettier-ignore
export const TunnelsAndTrolls = makeCharacterSheetStory(CharacterTemplates.TunnelsAndTrolls)
// prettier-ignore
export const Maze = makeCharacterSheetStory(CharacterTemplates.Maze)
// prettier-ignore
export const Dnd5e = makeCharacterSheetStory(CharacterTemplates.Dnd5e)
// prettier-ignore
export const TheWitchIsDead = makeCharacterSheetStory(CharacterTemplates.TheWitchIsDead)
// prettier-ignore
export const EdgeOfTheEmpire = makeCharacterSheetStory(CharacterTemplates.EdgeOfTheEmpire)
// prettier-ignore
export const EdgeOfTheEmpire_FR = makeCharacterSheetStory(CharacterTemplates.EdgeOfTheEmpire_FR)
// prettier-ignore
export const Blank = makeCharacterSheetStory(CharacterTemplates.Blank)

export const LoremIpsum = Template.bind({});
LoremIpsum.args = {
  character: CharacterFactory.migrate(LoremIpsumTemplate as any),
};

function makeCharacterSheetStory(template: CharacterTemplates) {
  const story = Template.bind({});
  (story as any).loaders = [
    async () => {
      const character = await CharacterFactory.make(template);
      return { character: overrideCharacterDateForStorybook(character) };
    },
  ];
  return story;

  function overrideCharacterDateForStorybook(
    character: ICharacter
  ): ICharacter {
    return {
      ...character,
      id: "50fa2",
      lastUpdated: dayJS("2021-01-01").unix(),
    };
  }
}
