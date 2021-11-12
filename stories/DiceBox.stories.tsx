import Box from "@mui/material/Box";
import { action } from "@storybook/addon-actions";
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
    onClick: action("onClick"),
    onFinalResult: action("onFinalResult"),
    onRolling: action("onRolling"),
    rolls: [],
    tooltipPlacement: "right",
    size: "7rem",
    fontSize: "4.5rem",
    borderSize: ".5rem",
    disabled: false,
    showDetails: false,
    disableConfettis: true,
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => (
  <StoryProvider theme={context.globals.theme}>
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
        showDetails={args.showDetails}
        disableConfettis={args.disableConfettis}
      />
    </Box>
  </StoryProvider>
);

export const Empty = Template.bind({});
Empty.args = {
  rolls: [],
};

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { disableSnapshot: true },
};
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

export const DefaultWithModifiers = Template.bind({});
DefaultWithModifiers.args = {
  rolls: [
    {
      total: 6,
      totalWithoutModifiers: 4,
      options: { listResults: false },
      rollGroups: [
        {
          label: "Athletic",
          modifier: 2,
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

export const DefaultWithMultipleModifiers = Template.bind({});
DefaultWithMultipleModifiers.args = {
  rolls: [
    {
      total: 8,
      totalWithoutModifiers: 4,
      options: { listResults: false },
      rollGroups: [
        {
          label: "Academic",
          modifier: 2,
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
        {
          label: "Careful",
          modifier: 2,
          commandSets: [],
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
      totalWithoutModifiers: -4,
      options: { listResults: false },
      rollGroups: [
        {
          commandSets: [
            {
              id: "4dF",
              commands: [
                { value: -1, name: "1dF" },
                { value: -1, name: "1dF" },
                { value: -1, name: "1dF" },
                { value: -1, name: "1dF" },
              ],
            },
          ],
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
      totalWithoutModifiers: 20,
      options: { listResults: false },
      rollGroups: [
        {
          commandSets: [
            {
              id: "1d20",
              commands: [{ value: 20, name: "1d20" }],
            },
          ],
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
      totalWithoutModifiers: 1,
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

export const HeadsOrTrails = Template.bind({});
HeadsOrTrails.args = {
  rolls: [
    {
      total: 0,
      totalWithoutModifiers: 0,
      options: { listResults: true },
      rollGroups: [
        {
          commandSets: [
            {
              id: "coin",
              commands: [{ value: "Heads", name: "coin" }],
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

export const MultipleDiceWithLabel = Template.bind({});
MultipleDiceWithLabel.args = {
  rolls: [
    {
      total: 27,
      totalWithoutModifiers: 27,
      options: { listResults: true },
      rollGroups: [
        {
          label: "Combat",
          commandSets: [
            {
              id: "1d12",
              commands: [{ value: 6, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 6, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 2, name: "1d12" }],
            },
          ],
        },
        {
          label: "Strength",
          commandSets: [
            {
              id: "1d12",
              commands: [{ value: 2, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 6, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 4, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 1, name: "1d12" }],
            },
          ],
        },
        {
          label: "Shoot",
          commandSets: [
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

export const MultipleDiceWithModifiers = Template.bind({});
MultipleDiceWithModifiers.args = {
  rolls: [
    {
      total: 12,
      totalWithoutModifiers: 6,
      options: { listResults: false },
      rollGroups: [
        {
          commandSets: [
            {
              id: "1d12",
              commands: [
                { name: "1d12", value: 1 },
                { name: "1d12", value: 2 },
                { name: "1d12", value: 3 },
              ],
            },
          ],
        },
        {
          label: "Academic",
          modifier: 3,
          commandSets: [],
        },
        {
          label: "Lore",
          modifier: 3,
          commandSets: [],
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

export const PoolGroups = Template.bind({});
PoolGroups.args = {
  rolls: [
    {
      total: 6,
      totalWithoutModifiers: 6,
      options: { listResults: true },
      rollGroups: [
        {
          label: "Combat",
          commandSets: [
            {
              id: "1d12",
              commands: [{ value: 6, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 6, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 2, name: "1d12" }],
            },
          ],
        },
        {
          label: "Strength",
          commandSets: [
            {
              id: "1d12",
              commands: [{ value: 2, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 6, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 4, name: "1d12" }],
            },
            {
              id: "1d12",
              commands: [{ value: 1, name: "1d12" }],
            },
          ],
        },
        {
          label: "Shoot",
          commandSets: [
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

export const OutOfBound = Template.bind({});
OutOfBound.args = {
  rolls: [
    {
      total: 6,
      totalWithoutModifiers: 6,
      options: { listResults: false },
      rollGroups: [
        {
          commandSets: new Array(50).fill(1).map(() => ({
            id: "1dF",
            commands: [{ value: 1, name: "1dF" }],
          })),
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
      totalWithoutModifiers: 6,
      options: { listResults: true },
      rollGroups: [
        {
          commandSets: new Array(50).fill(1).map(() => ({
            id: "1dF",
            commands: [{ value: 1, name: "1dF" }],
          })),
        },
      ],
    },
  ],
};
