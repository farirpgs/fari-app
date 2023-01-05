import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { CharacterCard } from "../lib/components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { ICharacterTemplate } from "../lib/domains/character/CharacterType";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../lib/routes/Character/components/CharacterDialog/MiniThemeContext";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterCard(
  props: Pick<
    Parameters<typeof CharacterCard>["0"],
    "characterSheet" | "readonly"
  >
) {
  const theme = useTheme();
  const miniTheme = useMiniTheme({
    enforceBackground: theme.palette.background.default,
  });

  return (
    <>
      <Toolbox
        diceFabProps={{
          onRoll: () => {},
        }}
        hideDefaultRightActions={true}
      />
      <MiniThemeContext.Provider value={miniTheme}>
        <CharacterCard
          readonly={props.readonly}
          characterSheet={props.characterSheet}
          onCharacterDialogOpen={action("onCharacterDialogOpen") as any}
          onRoll={() => {}}
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
