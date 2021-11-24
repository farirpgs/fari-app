import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { CharacterFactory } from "../lib/domains/character/CharacterFactory";
import { BlockType, IBlock } from "../lib/domains/character/types";
import { BlockByType } from "../lib/routes/Character/components/CharacterDialog/components/BlockByType";
import { StoryProvider } from "./StoryProvider";

function StorybookBlock(props: {
  readonly: boolean;
  advanced: boolean;
  block: IBlock;
}) {
  return (
    <>
      <BlockByType
        readonly={props.readonly}
        advanced={props.advanced}
        block={props.block}
        dataCy="storybook"
        onRoll={action("onRoll")}
        onChange={action("onChange")}
        onMainPointCounterChange={action("onMainPointCounterChange")}
        onToggleSplit={action("onToggleSplit")}
      />
    </>
  );
}

type IProps = Parameters<typeof StorybookBlock>["0"];

export default {
  title: "Main/Block",
  component: StorybookBlock,
  args: {
    advanced: false,
    readonly: false,
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => {
  return (
    <StoryProvider theme={context.globals.theme}>
      <Box width="500px">
        <Paper>
          <Box p="1rem">
            <StorybookBlock
              advanced={args.advanced}
              block={args.block}
              readonly={args.readonly}
            />
          </Box>
        </Paper>
      </Box>
    </StoryProvider>
  );
};

export const Text = Template.bind({});
Text.args = makeNormalArgs(BlockType.Text);
export const TextAdvanced = Template.bind({});
TextAdvanced.args = makeAdvancedArgs(BlockType.Text);
export const TextReadonly = Template.bind({});
TextReadonly.args = makeReadonlyArgs(BlockType.Text);
export const TextContent = Template.bind({});
TextContent.args = makeNormalArgs(BlockType.Text, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  meta: {
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
    checked: false,
  },
});
export const TextContentChecked = Template.bind({});
TextContentChecked.args = makeNormalArgs(BlockType.Text, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  meta: {
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
    checked: true,
  },
});

export const Numeric = Template.bind({});
Numeric.args = makeNormalArgs(BlockType.Numeric);
export const NumericAdvanced = Template.bind({});
NumericAdvanced.args = makeAdvancedArgs(BlockType.Numeric);
export const NumericReadonly = Template.bind({});
NumericReadonly.args = makeReadonlyArgs(BlockType.Numeric);
export const NumericContent = Template.bind({});
NumericContent.args = makeNormalArgs(BlockType.Numeric, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "333",
  meta: {
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
    checked: false,
  },
});
export const NumericContentChecked = Template.bind({});
NumericContentChecked.args = makeNormalArgs(BlockType.Numeric, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "333",
  meta: {
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
    checked: true,
  },
});

export const Skill = Template.bind({});
Skill.args = makeNormalArgs(BlockType.Skill);
export const SkillAdvanced = Template.bind({});
SkillAdvanced.args = makeAdvancedArgs(BlockType.Skill);
export const SkillReadonly = Template.bind({});
SkillReadonly.args = makeReadonlyArgs(BlockType.Skill);
export const SkillContent = Template.bind({});
SkillContent.args = makeNormalArgs(BlockType.Skill, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "333",
  meta: {
    commands: ["1d20"],
    checked: false,
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});
export const SkillContentChecked = Template.bind({});
SkillContentChecked.args = makeNormalArgs(BlockType.Skill, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "333",
  meta: {
    commands: ["1d20"],
    checked: true,
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});
export const SkillContentNoModifier = Template.bind({});
SkillContentNoModifier.args = makeNormalArgs(BlockType.Skill, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "333",
  meta: {
    commands: ["1d20"],
    checked: true,
    hideModifier: true,
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});

export const DicePool = Template.bind({});
DicePool.args = makeNormalArgs(BlockType.DicePool);
export const DicePoolAdvanced = Template.bind({});
DicePoolAdvanced.args = makeAdvancedArgs(BlockType.DicePool);
export const DicePoolReadonly = Template.bind({});
DicePoolReadonly.args = makeReadonlyArgs(BlockType.DicePool);
export const DicePoolContent = Template.bind({});
DicePoolContent.args = makeNormalArgs(BlockType.DicePool, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  meta: {
    commands: ["1d8", "1d8"],
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});

export const PointCounter = Template.bind({});
PointCounter.args = makeNormalArgs(BlockType.PointCounter);
export const PointCounterAdvanced = Template.bind({});
PointCounterAdvanced.args = makeAdvancedArgs(BlockType.PointCounter);
export const PointCounterReadonly = Template.bind({});
PointCounterReadonly.args = makeReadonlyArgs(BlockType.PointCounter);
export const PointCounterContent = Template.bind({});
PointCounterContent.args = makeNormalArgs(BlockType.PointCounter, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "3",
  meta: {
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});
export const PointCounterContentMax = Template.bind({});
PointCounterContentMax.args = makeNormalArgs(BlockType.PointCounter, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "3",
  meta: {
    max: "5",
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});
export const PointCounterContentMain = Template.bind({});
PointCounterContentMain.args = makeNormalArgs(BlockType.PointCounter, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "3",
  meta: {
    max: "5",
    isMainPointCounter: true,
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});

export const SlotTracker = Template.bind({});
SlotTracker.args = makeNormalArgs(BlockType.SlotTracker);
export const SlotTrackerAdvanced = Template.bind({});
SlotTrackerAdvanced.args = makeAdvancedArgs(BlockType.SlotTracker);
export const SlotTrackerReadonly = Template.bind({});
SlotTrackerReadonly.args = makeReadonlyArgs(BlockType.SlotTracker);
export const SlotTrackerContent = Template.bind({});
SlotTrackerContent.args = makeNormalArgs(BlockType.SlotTracker, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: [
    { label: "1", checked: true },
    { label: "2", checked: true },
    { label: "3", checked: false },
  ],
  meta: {
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});
export const SlotTrackerClockEmpty = Template.bind({});
SlotTrackerClockEmpty.args = makeNormalArgs(BlockType.SlotTracker, {
  label: "Clock",
  value: [
    { label: "1", checked: true },
    { label: "2", checked: true },
    { label: "3", checked: false },
  ],
  meta: {
    asClock: true,
  },
});
export const SlotTrackerClockOne = Template.bind({});
SlotTrackerClockOne.args = makeNormalArgs(BlockType.SlotTracker, {
  label: "Clock",
  value: [{ label: "", checked: false }],
  meta: {
    asClock: true,
  },
});
export const SlotTrackerClockTwo = Template.bind({});
SlotTrackerClockTwo.args = makeNormalArgs(BlockType.SlotTracker, {
  label: "Clock",
  value: [
    { label: "", checked: false },
    { label: "", checked: false },
  ],
  meta: {
    asClock: true,
  },
});
export const SlotTrackerClockThree = Template.bind({});
SlotTrackerClockThree.args = makeNormalArgs(BlockType.SlotTracker, {
  label: "Clock",
  value: [
    { label: "", checked: false },
    { label: "", checked: false },
    { label: "", checked: false },
  ],
  meta: {
    asClock: true,
  },
});
export const SlotTrackerClockFour = Template.bind({});
SlotTrackerClockFour.args = makeNormalArgs(BlockType.SlotTracker, {
  label: "Clock",
  value: [
    { label: "", checked: false },
    { label: "", checked: false },
    { label: "", checked: false },
    { label: "", checked: false },
  ],
  meta: {
    asClock: true,
  },
});
export const SlotTrackerClockFive = Template.bind({});
SlotTrackerClockFive.args = makeNormalArgs(BlockType.SlotTracker, {
  label: "Clock",
  value: [
    { label: "", checked: true },
    { label: "", checked: true },
    { label: "", checked: false },
    { label: "", checked: false },
    { label: "", checked: false },
  ],
  meta: {
    asClock: true,
  },
});
export const SlotTrackerClockOneChecked = Template.bind({});
SlotTrackerClockOneChecked.args = makeNormalArgs(BlockType.SlotTracker, {
  label: "Clock",
  value: [{ label: "", checked: true }],
  meta: {
    asClock: true,
  },
});

export const Image = Template.bind({});
Image.args = makeNormalArgs(BlockType.Image);
export const ImageAdvanced = Template.bind({});
ImageAdvanced.args = makeAdvancedArgs(BlockType.Image);
export const ImageReadonly = Template.bind({});
ImageReadonly.args = makeReadonlyArgs(BlockType.Image);
export const ImageContent = Template.bind({});
ImageContent.args = makeReadonlyArgs(BlockType.Image, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "https://i.imgur.com/GFvjpeu.png",
  meta: {
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});
export const ImageContentGif = Template.bind({});
ImageContentGif.parameters = {
  chromatic: { disableSnapshot: true },
};
ImageContentGif.args = makeReadonlyArgs(BlockType.Image, {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  value: "https://i.imgur.com/O3EIPHp.gif",
  meta: {
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});

export const Link = Template.bind({});
Link.args = makeNormalArgs(BlockType.Link, {
  value: "http://google.com",
});
export const LinkDisplayName = Template.bind({});
LinkDisplayName.args = makeNormalArgs(BlockType.Link, {
  value: "http://google.com",
  label: "Lorem ipsum",
  meta: {
    hasDisplayName: true,
  },
});
export const LinkAdvanced = Template.bind({});
LinkAdvanced.args = makeAdvancedArgs(BlockType.Link);
export const LinkAdvancedInvalid = Template.bind({});
LinkAdvancedInvalid.args = makeAdvancedArgs(BlockType.Link, {
  value: "NotALink",
});

export const LinkAdvancedMax = Template.bind({});
LinkAdvancedMax.args = makeAdvancedArgs(BlockType.Link, {
  value: "http://google.com",
  label: "Lorem ipsum",
  meta: {
    hasDisplayName: true,
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});

export const Separator = Template.bind({});
Separator.args = makeNormalArgs(BlockType.Separator);
export const SeparatorEmptyLabel = Template.bind({});
SeparatorEmptyLabel.args = makeNormalArgs(BlockType.Separator, {
  label: "",
  meta: {
    hasLabel: true,
  },
});
export const SeparatorLabel = Template.bind({});
SeparatorLabel.args = makeNormalArgs(BlockType.Separator, {
  label: "Lorem ipsum",
  meta: {
    hasLabel: true,
  },
});
export const SeparatorLabelHelpText = Template.bind({});
SeparatorLabelHelpText.args = makeNormalArgs(BlockType.Separator, {
  label: "Lorem ipsum",
  meta: {
    helperText: "Lorem ipsum",
    hasLabel: true,
  },
});
export const SeparatorAdvanced = Template.bind({});
SeparatorAdvanced.args = makeAdvancedArgs(BlockType.Separator);
export const SeparatorAdvancedMax = Template.bind({});
SeparatorAdvancedMax.args = makeAdvancedArgs(BlockType.Separator, {
  label: "Lorem ipsum",
  meta: {
    hasLabel: true,
    helperText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel posuere odio",
  },
});

function makeNormalArgs(type: BlockType, blockOverride: Partial<IBlock> = {}) {
  return {
    block: { ...CharacterFactory.makeBlock(type), ...blockOverride } as IBlock,
    advanced: false,
    readonly: false,
  };
}
function makeAdvancedArgs(
  type: BlockType,
  blockOverride: Partial<IBlock> = {}
) {
  return {
    block: { ...CharacterFactory.makeBlock(type), ...blockOverride } as IBlock,
    advanced: true,
    readonly: false,
  };
}
function makeReadonlyArgs(
  type: BlockType,
  blockOverride: Partial<IBlock> = {}
) {
  return {
    block: { ...CharacterFactory.makeBlock(type), ...blockOverride } as IBlock,
    advanced: false,
    readonly: true,
  };
}
