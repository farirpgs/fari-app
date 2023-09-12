import { Box } from "@mui/material";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { Toolbox } from "../lib/components/Toolbox/Toolbox";
import { CharacterTemplatesProvider } from "../lib/contexts/CharacterTemplatesContext/CharacterTemplatesContext";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { ICharacter } from "../lib/domains/character/types";
import { dayJS } from "../lib/domains/dayjs/getDayJS";
import { CharacterV3Dialog } from "../lib/routes/Character/components/CharacterDialog/CharacterV3Dialog";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterSheet(
  props: Pick<
    Parameters<typeof CharacterV3Dialog>["0"],
    "character" | "dialog" | "readonly"
  >,
) {
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

        <CharacterV3Dialog
          dialog={props.dialog}
          open={true}
          character={props.character}
          readonly={props.readonly}
          synced={false}
          onClose={action("onClose")}
          onSave={action("onSave")}
          onToggleSync={action("onToggleSync")}
        />

        <Box mt="6rem" />
      </CharacterTemplatesProvider>
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
