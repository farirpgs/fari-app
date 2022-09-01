import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useContext, useState } from "react";
import { CharacterCard } from "../lib/components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
import { DiceContext } from "../lib/contexts/DiceContext/DiceContext";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { ICharacterTemplate } from "../lib/domains/character/CharacterType";
import { IDicePoolResult } from "../lib/domains/dice/Dice";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../lib/routes/Character/components/CharacterDialog/MiniThemeContext";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterCard(
  props: Pick<
    Parameters<typeof CharacterCard>["0"],
    "characterSheet" | "readonly" | "playerName"
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

  const theme = useTheme();
  const miniTheme = useMiniTheme({
    enforceBackground: theme.palette.background.default,
  });

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
      <MiniThemeContext.Provider value={miniTheme}>
        <CharacterCard
          readonly={props.readonly}
          characterSheet={props.characterSheet}
          onCharacterDialogOpen={action("onCharacterDialogOpen") as any}
          onRoll={handleOnNewRoll}
        />
      </MiniThemeContext.Provider>
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
    const template: ICharacterTemplate = {
      fileName: "",
      category: "",
      importFunction: async () =>
        import(
          "../lib/domains/character/character-templates/Fate Condensed/Fate Condensed.json"
        ),
    };

    const character = await CharacterFactory.make(template);

    return { character };
  },
];

export const Charge = Template.bind({});
(Charge as any).loaders = [
  async () => {
    const template: ICharacterTemplate = {
      fileName: "",
      category: "",
      importFunction: async () =>
        import(
          "../lib/domains/character/character-templates/Fari RPGs/Charge RPG.json"
        ),
    };

    const character = await CharacterFactory.make(template);

    return { character };
  },
];
