import Box from "@material-ui/core/Box";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useContext, useState } from "react";
import { DiceFab, DiceFabMode } from "../lib/components/DiceFab/DiceFab";
import { IndexCard } from "../lib/components/IndexCard/IndexCard";
import { IndexCardColorTypeEnum } from "../lib/components/IndexCard/IndexCardColor";
import { DiceContext } from "../lib/contexts/DiceContext/DiceContext";
import {
  IDiceCommandOption,
  IDiceRollResult,
  RollType,
} from "../lib/domains/dice/Dice";
import { Enum } from "../lib/domains/enum/Enum";
import { useDicePool } from "../lib/hooks/useDicePool/useDicePool";
import { AspectType } from "../lib/hooks/useScene/AspectType";
import { IAspectV1 } from "../lib/hooks/useScene/IScene";
import { useScene } from "../lib/hooks/useScene/useScene";
import { IDicePoolElement } from "../lib/routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { StoryProvider } from "./StoryProvider";

function StorybookIndexCard(props: {
  aspect: IAspectV1;
  readonly: boolean;
  showClickableSkills: boolean;
  pinned: boolean;
  playedDuringTurn: boolean;
  color: IndexCardColorTypeEnum;
  type: string;
}) {
  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const poolManager = useDicePool();
  const diceManager = useContext(DiceContext);

  const sceneManager: ReturnType<typeof useScene> = {
    state: {
      scene: {
        aspects: {
          "1": {
            ...props.aspect,
            color: props.color,
            playedDuringTurn: props.playedDuringTurn,
            pinned: props.pinned,
            type: AspectType[props.type as any] as any,
          } as IAspectV1,
        },
      } as any,
    } as any,
    actions: {
      setAspectDrawAreaObjects: action("setAspectDrawAreaObjects"),
      setAspectIsPrivate: action("setAspectIsPrivate"),
      resetAspect: action("resetAspect"),
      updateAspectColor: action("updateAspectColor"),
      removeAspect: action("removeAspect"),
      toggleAspectPinned: action("toggleAspectPinned"),
      updateAspectTitle: action("updateAspectTitle"),
      updateAspectPlayerDuringTurn: action("updateAspectPlayerDuringTurn"),
      addAspectTrack: action("addAspectTrack"),
      addAspectConsequence: action("addAspectConsequence"),
      addAspectDrawArea: action("addAspectDrawArea"),
      updateAspectContent: action("updateAspectContent"),
      updateAspectTrackName: action("updateAspectTrackName"),
      removeAspectTrackBox: action("removeAspectTrackBox"),
      addAspectTrackBox: action("addAspectTrackBox"),
      removeAspectTrack: action("removeAspectTrack"),
      toggleAspectTrackBox: action("toggleAspectTrackBox"),
      updateStressBoxLabel: action("updateStressBoxLabel"),
      updateAspectConsequenceName: action("updateAspectConsequenceName"),
      removeAspectConsequence: action("removeAspectConsequence"),
      updateAspectConsequenceValue: action("updateAspectConsequenceValue"),
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
    const { result } = poolManager.actions.getPoolResult();
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
            { commandGroupId: "4dF", type: RollType.DiceCommand },
          ];

          options.push({
            type: RollType.Modifier,
            label: label,
            modifier: modifier,
          });
          const result = diceManager.actions.roll(options, {
            listResults: false,
          });
          handleOnNewRoll(result);
        }}
        onMove={action("onMove") as any}
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
    pinned: false,
    playedDuringTurn: false,
    color: IndexCardColorTypeEnum.white,
    type: AspectType[AspectType.Aspect],
  },
  argTypes: {
    type: {
      control: {
        type: "select",
        options: Enum.getKeys(AspectType),
      },
    },
    color: {
      control: {
        type: "select",
        options: Object.keys(IndexCardColorTypeEnum),
      },
    },
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => (
  <StoryProvider theme={context.globals.theme}>
    <Box width="350px">
      <StorybookIndexCard
        aspect={args.aspect}
        readonly={args.readonly}
        showClickableSkills={args.showClickableSkills}
        color={args.color}
        type={args.type}
        pinned={args.pinned}
        playedDuringTurn={args.playedDuringTurn}
      />
    </Box>
  </StoryProvider>
);

export const Default = Template.bind({});
export const DefaultWithSkills = Template.bind({});
DefaultWithSkills.args = {
  aspect: anAspect({
    title: "Title",
    content:
      "Description <br> Description <br> Description <br> [Academic  : 4]",
  }),
  showClickableSkills: true,
};

export const Aspect = Template.bind({});
Aspect.args = {
  aspect: anAspect({
    title: "Title",
    content: "Description <br> Description <br> Description <br>",
  }),
  type: AspectType[AspectType.Aspect],
  color: IndexCardColorTypeEnum.white,
};
export const Boost = Template.bind({});
Boost.args = {
  aspect: anAspect({
    title: "Title",
    content: "Description <br> Description <br> Description <br>",
  }),
  type: AspectType[AspectType.Boost],
  color: IndexCardColorTypeEnum.blue,
};
export const NPC = Template.bind({});
NPC.args = {
  aspect: anAspect({
    title: "Title",
    content: "Description <br> Description <br> Description <br>",
  }),
  type: AspectType[AspectType.NPC],
  color: IndexCardColorTypeEnum.green,
};
export const BadGuy = Template.bind({});
BadGuy.args = {
  aspect: anAspect({
    title: "Title",
    content: "Description <br> Description <br> Description <br>",
  }),
  type: AspectType[AspectType.BadGuy],
  color: IndexCardColorTypeEnum.red,
};
export const Index_Card = Template.bind({});
Index_Card.args = {
  aspect: anAspect({
    title: "Title",
    content: "Description <br> Description <br> Description <br>",
  }),
  type: AspectType[AspectType.IndexCard],
  color: IndexCardColorTypeEnum.white,
};

export const OutOfBound = Template.bind({});
OutOfBound.args = {
  aspect: anAspect({
    title:
      "Orc dps charisma modifier wagon wisdom Orc dps charisma modifier wagon wisdom",
    content:
      "Sense troll cartographer agility horse gnoll. Lance advantage advantage wizard falchion polearm. Longsword tavern spirit strength dexterity polearm. Longsword hobgoblin great axe axe lance initiative. Ship dexterity bow light spell casting poleaxe.",
  }),
};

function anAspect(override: Partial<IAspectV1> = {}): IAspectV1 {
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
