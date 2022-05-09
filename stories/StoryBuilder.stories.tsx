import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Meta, Story } from "@storybook/react";
import { default as React } from "react";
import { useDecks } from "../lib/routes/StoryBuilder/hooks/useDecks";
import { StoryDecks } from "../lib/routes/StoryBuilder/StoryBuilderRoute";
import { StoryProvider } from "./StoryProvider";

function StorybookStoryDeck(props: {}) {
  const decksManager = useDecks();
  return (
    <>
      <Box p="2rem">
        <StoryDecks decksManager={decksManager} />
      </Box>
    </>
  );
}

type IProps = Parameters<typeof StorybookStoryDeck>["0"];

export default {
  title: "Main/StoryDecks",
  component: StorybookStoryDeck,
  args: {},
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => {
  return (
    <StoryProvider theme={context.globals.theme}>
      <Box width="800px">
        <Paper>
          <StorybookStoryDeck />
        </Paper>
      </Box>
    </StoryProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
