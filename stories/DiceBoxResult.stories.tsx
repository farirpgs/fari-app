import { Meta, Story } from "@storybook/react";
import React from "react";
import { DiceBoxResult } from "../lib/components/DiceBox/DiceBox";
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
      rollGroups: [
        {
          commandSets: [
            {
              id: "4dF",
              commands: [
                { value: 1, name: "1dF" },
                { value: 1, name: "1dF" },
                { value: 1, name: "1dF" },
                { value: 1, name: "1dF" },
              ],
            },
          ],
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
      rollGroups: [
        {
          commandSets: [
            {
              id: "1d20",
              commands: [{ value: 1, name: "1d20" }],
            },
          ],
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
      rollGroups: [
        {
          commandSets: [
            {
              id: "1d12",
              commands: [{ value: 1, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 2, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 3, name: "1d12" }],
            },
          ],
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
      rollGroups: [
        {
          commandSets: [
            {
              id: "1d12",
              commands: [{ value: 1, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 2, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 3, name: "1d12" }],
            },
          ],
        },
      ],
    },
  ],
};
