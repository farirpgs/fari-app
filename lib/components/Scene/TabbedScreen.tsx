import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { BoxProps } from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";

export function TabbedScreen(props: {
  tabs: Array<{
    value: string;
    label: string;
    dataCy: string;
    render(): React.ReactNode;
    sx?: BoxProps["sx"];
  }>;
}) {
  const theme = useTheme();
  const [tab, setTab] = useState(props.tabs[0].value);

  const tabSx: BoxProps["sx"] = {
    textTransform: "none",
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
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
                label={<>{tab.label}</>}
                sx={tabSx}
              />
            );
          })}
        </Tabs>
        <TabContext value={tab}>
          {props.tabs.map((tab) => {
            return (
              <TabPanel
                key={tab.value}
                value={tab.value}
                sx={{
                  overflow: "auto",
                  ...(tab.sx || {}),
                }}
              >
                {tab.render()}
              </TabPanel>
            );
          })}
        </TabContext>
      </Paper>
    </>
  );
}
