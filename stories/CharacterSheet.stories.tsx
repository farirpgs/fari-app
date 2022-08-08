import Box from "@mui/material/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useContext, useState } from "react";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
import { DiceContext } from "../lib/contexts/DiceContext/DiceContext";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { ICharacterTemplate } from "../lib/domains/character/CharacterType";
import { ICharacter } from "../lib/domains/character/types";
import { dayJS } from "../lib/domains/dayjs/getDayJS";
import { IDicePoolResult } from "../lib/domains/dice/Dice";
import { CharacterV3Dialog } from "../lib/routes/Character/components/CharacterDialog/CharacterV3Dialog";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterSheet(
  props: Pick<
    Parameters<typeof CharacterV3Dialog>["0"],
    "character" | "dialog" | "readonly"
  >
) {
  const [rolls, setRolls] = useState<Array<IDicePoolResult>>([]);
  const diceManager = useContext(DiceContext);

  function handleOnNewRoll(result: IDicePoolResult) {
    setRolls((draft) => {
      return [result, ...draft];
    });
  }

  function handleOnRollPool() {
    // const { result } = diceManager.actions.getPoolResult();
    // handleOnNewRoll(result);
  }

  return (
    <>
      <Toolbox
        diceFabProps={{
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

export const FateCondensed = makeCharacterSheetStory({
  fileName: "",
  category: "",
  importFunction: async () =>
    import(
      "../lib/domains/character/character-templates/Fate Condensed/Fate Condensed.json"
    ),
});

export const Charge = makeCharacterSheetStory({
  fileName: "",
  category: "",
  importFunction: async () =>
    import(
      "../lib/domains/character/character-templates/Fari RPGs/Charge RPG.json"
    ),
});

function makeCharacterSheetStory(template: ICharacterTemplate) {
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
