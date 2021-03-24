import Box from "@material-ui/core/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useState } from "react";
import { DiceFab, DiceFabMode } from "../lib/components/DiceFab/DiceFab";
import { CharacterCard } from "../lib/components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { CharacterTemplates } from "../lib/domains/character/CharacterType";
import { IDiceRollResult } from "../lib/domains/dice/Dice";
import { useDicePool } from "../lib/hooks/useDicePool/useDicePool";
import { IDicePoolElement } from "../lib/routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { StoryProvider } from "./StoryProvider";

function StorybookCharacterCard(
  props: Pick<
    Parameters<typeof CharacterCard>["0"],
    "characterSheet" | "readonly" | "playerName"
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
      <CharacterCard
        playerName={props.playerName}
        readonly={props.readonly}
        characterSheet={props.characterSheet}
        pool={poolManager.state.pool}
        onCharacterDialogOpen={action("onCharacterDialogOpen") as any}
        onPoolClick={handleOnPoolClick}
      />
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

const Template: Story<IProps> = (args) => (
  <StoryProvider>
    <Box width="350px" ml="5rem">
      <StorybookCharacterCard
        characterSheet={
          {
            ...args.characterSheet,
            name: "My Character",
          } as any
        }
        readonly={args.readonly}
        playerName={args.playerName}
      />
    </Box>
  </StoryProvider>
);

export const FateCondensed = Template.bind({});
FateCondensed.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.FateCondensed),
};
export const FateCore = Template.bind({});
FateCore.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.FateCore),
};
export const FateAccelerated = Template.bind({});
FateAccelerated.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.FateAccelerated),
};
export const FateOfCthulhu = Template.bind({});
FateOfCthulhu.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.FateOfCthulhu),
};
export const DresdenFilesAccelerated = Template.bind({});
DresdenFilesAccelerated.args = {
  characterSheet: CharacterFactory.make(
    CharacterTemplates.DresdenFilesAccelerated
  ),
};
export const VentureCity = Template.bind({});
VentureCity.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.VentureCity),
};
export const Heartbreaker = Template.bind({});
Heartbreaker.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.Heartbreaker),
};
export const IronEddaAccelerated = Template.bind({});
IronEddaAccelerated.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.IronEddaAccelerated),
};
export const Maze = Template.bind({});
Maze.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.Maze),
};
export const Dnd5e = Template.bind({});
Dnd5e.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.Dnd5e),
};
export const TheWitchIsDead = Template.bind({});
TheWitchIsDead.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.TheWitchIsDead),
};
export const Blank = Template.bind({});
Blank.args = {
  characterSheet: CharacterFactory.make(CharacterTemplates.Blank),
};
