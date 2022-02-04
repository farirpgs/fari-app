import { css } from "@emotion/css";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { FateLabel } from "../FateLabel/FateLabel";

export function TabbedScreen(props: {
  tabs: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
    dataCy: string;
    render(): React.ReactNode;
  }>;
}) {
  const theme = useTheme();
  const [tab, setTab] = useState(props.tabs[0].value);

  const headerColor = theme.palette.background.paper;
  const headerBackgroundColor = useTextColors(
    theme.palette.background.paper
  ).primary;
  const tabClass = css({
    background: headerBackgroundColor,
    color: `${headerColor} !important`,
    padding: "0 1.5rem",
    marginRight: ".5rem",
    // Pentagone
    // https://bennettfeely.com/clippy/
    clipPath: "polygon(0 0, 90% 0, 100% 35%, 100% 100%, 0 100%)",
  });
  const tabLabelClass = css({
    fontSize: "1rem",
    width: "100%",
  });

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        classes={{
          flexContainer: css({
            borderBottom: `3px solid ${headerBackgroundColor}`,
          }),
          indicator: css({
            height: ".4rem",
            backgroundColor: theme.palette.secondary.main,
          }),
        }}
        onChange={(e, newValue) => {
          setTab(newValue);
        }}
      >
        {props.tabs.map((tab) => {
          return (
            <Tab
              key={tab.value}
              value={tab.value}
              data-cy={tab.dataCy}
              label={
                <>
                  <FateLabel className={tabLabelClass}>{tab.label}</FateLabel>
                </>
              }
              className={tabClass}
              icon={<>{tab.icon}</>}
            />
          );
        })}
      </Tabs>
      <TabContext value={tab}>
        <Box>
          <Box py="2rem" position="relative" minHeight="20rem">
            {props.tabs.map((tab) => {
              return (
                <TabPanel
                  key={tab.value}
                  value={tab.value}
                  className={css({ padding: "0" })}
                >
                  {tab.render()}
                </TabPanel>
              );
            })}
          </Box>
        </Box>
      </TabContext>
    </>
  );
}
