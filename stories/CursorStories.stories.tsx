import Box from "@mui/material/Box";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { ArgumentsType } from "vitest";
import CursorWithMessage from "../lib/routes/Play/components/CursorWithMessage/CursorWithMessage";
import { DefaultPlayerColor } from "../lib/routes/Play/consts/PlayerColors";
import { StoryProvider } from "./StoryProvider";

function StorybookCursorWithMessage(
  props: Pick<
    ArgumentsType<typeof CursorWithMessage>[0],
    "color" | "label" | "message" | "rollOutput" | "readonly"
  >
) {
  return (
    <>
      <CursorWithMessage
        color={props.color}
        label={props.label}
        x={25}
        y={25}
        readonly={props.readonly}
        message={props.message}
        rollOutput={props.rollOutput}
      />
    </>
  );
}

type IProps = Parameters<typeof StorybookCursorWithMessage>["0"];

export default {
  title: "Presence/Cursor",
  component: StorybookCursorWithMessage,
  args: {},
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => {
  return (
    <StoryProvider theme={context.globals.theme}>
      <Box p="1rem">
        <StorybookCursorWithMessage
          color={args.color}
          label={args.label}
          message={args.message}
          rollOutput={args.rollOutput}
          readonly={args.readonly}
        />
      </Box>
    </StoryProvider>
  );
};

export const Me = Template.bind({});
Me.args = {
  color: DefaultPlayerColor,
  label: "",
  message: "",

  rollOutput: undefined,
};
export const MeWithLabel = Template.bind({});
MeWithLabel.args = {
  color: DefaultPlayerColor,
  label: "RP the GM",
  message: "",
  rollOutput: undefined,
};
export const MeTypings = Template.bind({});
MeTypings.args = {
  color: DefaultPlayerColor,
  label: "RP the GM",
  message: "I'm typing something cool",
  rollOutput: undefined,
};
export const MeWithRollResult = Template.bind({});
MeWithRollResult.args = {
  color: DefaultPlayerColor,
  label: "RP the GM",
  message: "",
  rollOutput: {
    text: "1d20 + 4 [13 + 4] = 17",
    total: "17",
  },
};
export const Other = Template.bind({});
Other.args = {
  readonly: true,
  color: DefaultPlayerColor,
  label: "",
  message: "",

  rollOutput: undefined,
};
export const OtherWithLabel = Template.bind({});
OtherWithLabel.args = {
  readonly: true,
  color: DefaultPlayerColor,
  label: "RP the GM",
  message: "",
  rollOutput: undefined,
};
export const OtherTypings = Template.bind({});
OtherTypings.args = {
  readonly: true,
  color: DefaultPlayerColor,
  label: "RP the GM",
  message: "I'm typing something cool",
  rollOutput: undefined,
};
export const OtherWithRollResult = Template.bind({});
OtherWithRollResult.args = {
  readonly: true,
  color: DefaultPlayerColor,
  label: "RP the GM",
  message: "",
  rollOutput: {
    text: "1d20 + 4 [13 + 4] = 17",
    total: "17",
  },
};
