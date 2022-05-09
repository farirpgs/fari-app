import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Meta, Story } from "@storybook/react";
import { default as React } from "react";
import { FateLabel } from "../lib/components/FateLabel/FateLabel";
import { StoryDiceIcons } from "../lib/domains/Icons/StoryDiceIcons/StoryDiceIcons";
import { StoryDie } from "../lib/routes/StoryDice/StoryDiceRoute";
import { StoryProvider } from "./StoryProvider";

function StorybookStoryBuilderIcons(props: {}) {
  return (
    <>
      <Box p="2rem">
        {Object.keys(StoryDiceIcons).map((diceName) => {
          return (
            <Box key={diceName} mb="1rem">
              <Box mb=".5rem">
                <FateLabel>{diceName}</FateLabel>
              </Box>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                {Object.keys((StoryDiceIcons as any)[diceName]).map(
                  (sideName) => {
                    return (
                      <Grid item key={sideName}>
                        <StoryDie diceName={diceName} sideName={sideName} />
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

type IProps = Parameters<typeof StorybookStoryBuilderIcons>["0"];

export default {
  title: "Main/StoryBuilderIcons",
  component: StorybookStoryBuilderIcons,
  args: {},
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => {
  return (
    <StoryProvider theme={context.globals.theme}>
      <Box width="800px">
        <Paper>
          <StorybookStoryBuilderIcons />
        </Paper>
      </Box>
    </StoryProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
