import { Meta, Story } from "@storybook/react";
import React from "react";
import { DiceBoxResult } from "../lib/components/DiceBox/DiceBox";
import { RollType } from "../lib/domains/dice/Dice";
import { StoryProvider } from "./StoryProvider";

type IProps = Parameters<typeof DiceBoxResult>["0"];

export default {
  title: "Main/DiceBoxResult",
  component: DiceBoxResult,
} as Meta;

const Template: Story<IProps> = (args, context) => (
  <StoryProvider theme={context.globals.theme}>
    <DiceBoxResult rolls={args.rolls} />
  </StoryProvider>
);

export const Default = Template.bind({});
Default.args = {
  rolls: [
    {
      total: 4,
      totalWithoutModifiers: 4,
      options: { listResults: false },
      commandResult: [
        {
          value: 1,
          command: "1dF",
          type: RollType.DiceCommand,
        },
        {
          value: 1,
          command: "1dF",
          type: RollType.DiceCommand,
        },
        {
          value: 1,
          command: "1dF",
          type: RollType.DiceCommand,
        },
        {
          value: 1,
          command: "1dF",
          type: RollType.DiceCommand,
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
      totalWithoutModifiers: 20,
      options: { listResults: false },
      commandResult: [
        {
          value: 20,
          command: "1d20",
          type: RollType.DiceCommand,
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
      totalWithoutModifiers: 6,
      options: { listResults: false },
      commandResult: [
        {
          value: 1,
          command: "1d12",
          type: RollType.DiceCommand,
        },
        {
          value: 2,
          command: "1d12",
          type: RollType.DiceCommand,
        },
        {
          value: 3,
          command: "1d12",
          type: RollType.DiceCommand,
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
      totalWithoutModifiers: 6,
      options: { listResults: true },
      commandResult: [
        {
          value: 1,
          command: "1d12",
          type: RollType.DiceCommand,
        },
        {
          value: 2,
          command: "1d12",
          type: RollType.DiceCommand,
        },
        {
          value: 3,
          command: "1d12",
          type: RollType.DiceCommand,
        },
      ],
    },
  ],
};
