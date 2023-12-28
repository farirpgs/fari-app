import { Box, useTheme } from "@mui/material";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { CharacterCard } from "../lib/components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
import { CharacterTemplatesProvider } from "../lib/contexts/CharacterTemplatesContext/CharacterTemplatesContext";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { ICharacter } from "../lib/domains/character/types";
import { dayJS } from "../lib/domains/dayjs/getDayJS";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../lib/routes/Character/components/CharacterDialog/MiniThemeContext";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterCard(
  props: Pick<
    Parameters<typeof CharacterCard>["0"],
    "characterSheet" | "readonly"
  >,
) {
  const theme = useTheme();
  const miniTheme = useMiniTheme({
    enforceBackground: theme.palette.background.default,
  });

  return (
    <>
      <CharacterTemplatesProvider
        value={{
          templates: [],
        }}
      >
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
      </CharacterTemplatesProvider>
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

export const FateCondensed = makeCharacterSheetStory({
  importPath:
    "../public/character-templates/Fate Condensed/Fate Condensed.json",
});

export const Charge = makeCharacterSheetStory({
  importPath: "../public/character-templates/Fari RPGs/Charge RPG.json",
});

function makeCharacterSheetStory({ importPath }: { importPath: string }) {
  const story = Template.bind({});
  (story as any).loaders = [
    async () => {
      const file = await import(importPath);
      const character = await CharacterFactory.make({ json: file.default });
      return { character: overrideCharacterDateForStorybook(character) };
    },
  ];
  return story;

  function overrideCharacterDateForStorybook(
    character: ICharacter,
  ): ICharacter {
    return {
      ...character,
      id: "50fa2",
      lastUpdated: dayJS("2021-01-01").unix(),
    };
  }
}
