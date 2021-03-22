import Box from "@material-ui/core/Box";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { CharacterTemplates } from "../lib/domains/character/CharacterType";
import { CharacterV3Dialog } from "../lib/routes/Character/components/CharacterDialog/CharacterV3Dialog";
import { StoryProvider } from "./StoryProvider";

function StoryBookCharacterSheet(
  props: Pick<
    Parameters<typeof CharacterV3Dialog>["0"],
    "character" | "dialog" | "readonly"
  >
) {
  return (
    <CharacterV3Dialog
      dialog={props.dialog}
      open={true}
      character={props.character}
      readonly={props.readonly}
      pool={[]}
      rolls={[]}
      synced={false}
      onSkillClick={() => undefined}
      onPoolClick={() => undefined}
      onClose={() => undefined}
      onSave={() => undefined}
      onToggleSync={() => undefined}
    />
  );
}

type IProps = Parameters<typeof StoryBookCharacterSheet>["0"];

export default {
  title: "Main/Character",
  component: StoryBookCharacterSheet,
  args: {
    dialog: false,
    character: undefined,
    readonly: false,
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args) => (
  <StoryProvider>
    <Box mt="4rem">
      <StoryBookCharacterSheet
        character={args.character}
        readonly={args.readonly}
        dialog={args.dialog}
      />
    </Box>
  </StoryProvider>
);

export const FateCondensed = Template.bind({});
FateCondensed.args = {
  character: CharacterFactory.make(CharacterTemplates.FateCondensed),
};
export const FateCore = Template.bind({});
FateCore.args = {
  character: CharacterFactory.make(CharacterTemplates.FateCore),
};
export const FateAccelerated = Template.bind({});
FateAccelerated.args = {
  character: CharacterFactory.make(CharacterTemplates.FateAccelerated),
};
export const FateOfCthulhu = Template.bind({});
FateOfCthulhu.args = {
  character: CharacterFactory.make(CharacterTemplates.FateOfCthulhu),
};
export const DresdenFilesAccelerated = Template.bind({});
DresdenFilesAccelerated.args = {
  character: CharacterFactory.make(CharacterTemplates.DresdenFilesAccelerated),
};
export const Heartbreaker = Template.bind({});
Heartbreaker.args = {
  character: CharacterFactory.make(CharacterTemplates.Heartbreaker),
};
export const Maze = Template.bind({});
Maze.args = {
  character: CharacterFactory.make(CharacterTemplates.Maze),
};
export const Dnd5e = Template.bind({});
Dnd5e.args = {
  character: CharacterFactory.make(CharacterTemplates.Dnd5e),
};
export const TheWitchIsDead = Template.bind({});
TheWitchIsDead.args = {
  character: CharacterFactory.make(CharacterTemplates.TheWitchIsDead),
};
export const Blank = Template.bind({});
Blank.args = {
  character: CharacterFactory.make(CharacterTemplates.Blank),
};
