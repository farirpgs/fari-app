import { Meta, Story } from "@storybook/react";
import React from "react";
import { DiceBoxResult } from "../lib/components/DiceBox/DiceBox";
import { StoryProvider } from "./StoryProvider";

type IProps = Parameters<typeof DiceBoxResult>["0"];

export default {
  title: "Main/DiceBoxResult",
  component: DiceBoxResult,
} as Meta;

const Template: Story<IProps> = (args) => (
  <StoryProvider>
    <DiceBoxResult rolls={args.rolls} />
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

export const SingleD20 = Template.bind({});
SingleD20.args = {
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
