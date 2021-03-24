import Box from "@material-ui/core/Box";
import { actions } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useState } from "react";
import { DiceFab, DiceFabMode } from "../lib/components/DiceFab/DiceFab";
import { IndexCard } from "../lib/components/IndexCard/IndexCard";
import {
  Dice,
  IDiceCommandOption,
  IDiceRollResult,
  RollType,
} from "../lib/domains/dice/Dice";
import { useDicePool } from "../lib/hooks/useDicePool/useDicePool";
import { AspectType } from "../lib/hooks/useScene/AspectType";
import { IAspect } from "../lib/hooks/useScene/IScene";
import { useScene } from "../lib/hooks/useScene/useScene";
import { IDicePoolElement } from "../lib/routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { StoryProvider } from "./StoryProvider";

function StorybookIndexCard(props: {
  aspect: IAspect;
  readonly: boolean;
  showClickableSkills: boolean;
}) {
  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const poolManager = useDicePool();

  const sceneManager: ReturnType<typeof useScene> = {
    state: {
      scene: {
        aspects: {
          "1": props.aspect,
        },
      } as any,
      actions: {
        setAspectDrawAreaObjects: actions("setAspectDrawAreaObjects"),
        setAspectIsPrivate: actions("setAspectIsPrivate"),
        resetAspect: actions("resetAspect"),
        updateAspectColor: actions("updateAspectColor"),
        removeAspect: actions("removeAspect"),
        toggleAspectPinned: actions("toggleAspectPinned"),
        updateAspectTitle: actions("updateAspectTitle"),
        updateAspectPlayerDuringTurn: actions("updateAspectPlayerDuringTurn"),
        addAspectTrack: actions("addAspectTrack"),
        addAspectConsequence: actions("addAspectConsequence"),
        addAspectDrawArea: actions("addAspectDrawArea"),
        updateAspectContent: actions("updateAspectContent"),
        updateAspectTrackName: actions("updateAspectTrackName"),
        removeAspectTrackBox: actions("removeAspectTrackBox"),
        addAspectTrackBox: actions("addAspectTrackBox"),
        removeAspectTrack: actions("removeAspectTrack"),
        toggleAspectTrackBox: actions("toggleAspectTrackBox"),
        updateStressBoxLabel: actions("updateStressBoxLabel"),
        updateAspectConsequenceName: actions("updateAspectConsequenceName"),
        removeAspectConsequence: actions("removeAspectConsequence"),
        updateAspectConsequenceValue: actions("updateAspectConsequenceValue"),
      } as any,
    } as any,
  } as any;

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
      <IndexCard
        index={0}
        aspectId={"1"}
        readonly={props.readonly}
        showClickableSkills={props.showClickableSkills}
        sceneManager={sceneManager}
        onRoll={(label, modifier) => {
          const options: Array<IDiceCommandOption> = [
            { command: "1dF", type: RollType.DiceCommand },
            { command: "1dF", type: RollType.DiceCommand },
            { command: "1dF", type: RollType.DiceCommand },
            { command: "1dF", type: RollType.DiceCommand },
          ];

          options.push({
            type: RollType.Modifier,
            label: label,
            modifier: modifier,
          });
          const result = Dice.rollCommandOptionList(options, {
            listResults: false,
          });
          handleOnNewRoll(result);
        }}
        onMove={actions("onMove") as any}
      />
    </>
  );
}

type IProps = Parameters<typeof StorybookIndexCard>["0"];

export default {
  title: "Main/IndexCard",
  component: StorybookIndexCard,
  args: {
    aspect: anAspect(),
    readonly: false,
    showClickableSkills: false,
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args) => (
  <StoryProvider>
    <Box width="350px" ml="5rem">
      <StorybookIndexCard
        aspect={args.aspect}
        readonly={args.readonly}
        showClickableSkills={args.showClickableSkills}
      />
    </Box>
  </StoryProvider>
);

export const Default = Template.bind({});

function anAspect(override: Partial<IAspect> = {}): IAspect {
  return {
    title: "",
    content: "<br/>",
    tracks: [],
    consequences: [],
    color: "white",
    type: AspectType.Aspect,
    playedDuringTurn: false,
    pinned: false,
    hasDrawArea: false,
    ...override,
  };
}
