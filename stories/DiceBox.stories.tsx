import Box from "@material-ui/core/Box";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { DiceBox } from "../lib/components/DiceBox/DiceBox";
import { StoryProvider } from "./StoryProvider";

type IProps = Parameters<typeof DiceBox>["0"];

export default {
  title: "Main/DiceBox",
  component: DiceBox,
  args: {
    tooltipOpen: true,
    onClick: () => undefined,
    tooltipPlacement: "right",
    size: "7rem",
    fontSize: "4.5rem",
    borderSize: ".5rem",
    disabled: false,
    reduceOpacityWithoutHover: false,
    showDetails: false,
    disableConfettis: true,
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args) => (
  <StoryProvider>
    <Box mt="4rem">
      <DiceBox
        rolls={args.rolls}
        onClick={args.onClick}
        tooltipOpen={args.tooltipOpen}
        tooltipPlacement={args.tooltipPlacement}
        size={args.size}
        fontSize={args.fontSize}
        borderSize={args.borderSize}
        disabled={args.disabled}
        reduceOpacityWithoutHover={args.reduceOpacityWithoutHover}
        showDetails={args.showDetails}
        disableConfettis={args.disableConfettis}
      />
    </Box>
  </StoryProvider>
);

export const Default = Template.bind({});
Default.args = {
  rolls: [
    {
      total: 4,
      pool: false,
      commandResults: [
        {
          value: 1,
          type: "1dF",
        },
        {
          value: 1,
          type: "1dF",
        },
        {
          value: 1,
          type: "1dF",
        },
        {
          value: 1,
          type: "1dF",
        },
      ],
    },
  ],
};
export const DefaultBadResult = Template.bind({});
DefaultBadResult.args = {
  rolls: [
    {
      total: -4,
      pool: false,
      commandResults: [
        {
          value: -1,
          type: "1dF",
        },
        {
          value: -1,
          type: "1dF",
        },
        {
          value: -1,
          type: "1dF",
        },
        {
          value: -1,
          type: "1dF",
        },
      ],
    },
  ],
};

export const DefaultD20 = Template.bind({});
DefaultD20.args = {
  rolls: [
    {
      total: 20,
      pool: false,
      commandResults: [
        {
          value: 20,
          type: "1d20",
        },
      ],
    },
  ],
};
export const DefaultD20BadResult = Template.bind({});
DefaultD20BadResult.args = {
  rolls: [
    {
      total: 1,
      pool: false,
      commandResults: [
        {
          value: 1,
          type: "1d20",
        },
      ],
    },
  ],
};

export const MultipleDice = Template.bind({});
MultipleDice.args = {
  rolls: [
    {
      total: 6,
      pool: false,
      commandResults: [
        {
          value: 1,
          type: "1d12",
        },
        {
          value: 2,
          type: "1d12",
        },
        {
          value: 3,
          type: "1d12",
        },
      ],
    },
  ],
};

export const Pool = Template.bind({});
Pool.args = {
  rolls: [
    {
      total: 6,
      pool: true,
      commandResults: [
        {
          value: 1,
          type: "1d12",
        },
        {
          value: 2,
          type: "1d12",
        },
        {
          value: 3,
          type: "1d12",
        },
      ],
    },
  ],
};

export const OutOfBound = Template.bind({});
OutOfBound.args = {
  rolls: [
    {
      total: 6,
      pool: false,
      commandResults: [
        {
          value: 1,
          type: "1d4",
        },
        {
          value: 1,
          type: "1d6",
        },
        {
          value: 1,
          type: "1d8",
        },
        {
          value: 1,
          type: "1d10",
        },
        {
          value: 1,
          type: "1d12",
        },
        {
          value: 1,
          type: "1d20",
        },
        {
          value: 1,
          type: "1d12",
        },
        {
          value: 1,
          type: "1d4",
        },
        {
          value: 1,
          type: "1d6",
        },
        {
          value: 1,
          type: "1d8",
        },
        {
          value: 1,
          type: "1d10",
        },
        {
          value: 1,
          type: "1d12",
        },
        {
          value: 1,
          type: "1d20",
        },
        {
          value: 1,
          type: "1d12",
        },
      ],
    },
  ],
};
export const OutOfBoundPool = Template.bind({});
OutOfBoundPool.args = {
  rolls: [
    {
      total: 6,
      pool: true,
      commandResults: [
        {
          value: 1,
          type: "1d4",
        },
        {
          value: 1,
          type: "1d6",
        },
        {
          value: 1,
          type: "1d8",
        },
        {
          value: 1,
          type: "1d10",
        },
        {
          value: 1,
          type: "1d12",
        },
        {
          value: 1,
          type: "1d20",
        },
        {
          value: 1,
          type: "1d12",
        },
        {
          value: 1,
          type: "1d4",
        },
        {
          value: 1,
          type: "1d6",
        },
        {
          value: 1,
          type: "1d8",
        },
        {
          value: 1,
          type: "1d10",
        },
        {
          value: 1,
          type: "1d12",
        },
        {
          value: 1,
          type: "1d20",
        },
        {
          value: 1,
          type: "1d12",
        },
      ],
    },
  ],
};
