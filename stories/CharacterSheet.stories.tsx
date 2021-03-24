import Box from "@material-ui/core/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useState } from "react";
import { DiceFab, DiceFabMode } from "../lib/components/DiceFab/DiceFab";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { CharacterTemplates } from "../lib/domains/character/CharacterType";
import { IDiceRollResult } from "../lib/domains/dice/Dice";
import { useDicePool } from "../lib/hooks/useDicePool/useDicePool";
import { CharacterV3Dialog } from "../lib/routes/Character/components/CharacterDialog/CharacterV3Dialog";
import { IDicePoolElement } from "../lib/routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterSheet(
  props: Pick<
    Parameters<typeof CharacterV3Dialog>["0"],
    "character" | "dialog" | "readonly"
  >
) {
  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const poolManager = useDicePool();

  function handleOnNewRoll(result: IDiceRollResult) {
    setRolls((draft) => {
      return [result, ...draft];
    });
  }
  function handleOnClearPool() {
    poolManager.actions.clearPool();
  }

  function handleOnRollPool() {
    const result = poolManager.actions.getPoolResult();
    handleOnNewRoll(result);
  }

  function handleOnPoolClick(element: IDicePoolElement) {
    poolManager.actions.addOrRemovePoolElement(element);
  }

  return (
    <>
      <DiceFab
        type={DiceFabMode.RollAndPool}
        rollsForDiceBox={rolls}
        pool={poolManager.state.pool}
        onClearPool={handleOnClearPool}
        onSelect={handleOnNewRoll}
        onRollPool={handleOnRollPool}
      />
      <CharacterV3Dialog
        dialog={props.dialog}
        open={true}
        character={props.character}
        readonly={props.readonly}
        pool={poolManager.state.pool}
        synced={false}
        onPoolClick={handleOnPoolClick}
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
    character: undefined,
    readonly: false,
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args) => (
  <StoryProvider>
    <Box>
      <StorybookCharacterSheet
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
export const VentureCity = Template.bind({});
VentureCity.args = {
  character: CharacterFactory.make(CharacterTemplates.VentureCity),
};
export const Heartbreaker = Template.bind({});
Heartbreaker.args = {
  character: CharacterFactory.make(CharacterTemplates.Heartbreaker),
};
export const IronEddaAccelerated = Template.bind({});
IronEddaAccelerated.args = {
  character: CharacterFactory.make(CharacterTemplates.IronEddaAccelerated),
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
