import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import {
  DiceOptions as DiceCommandOptions,
  IDicePoolResult,
} from "../../../domains/dice/Dice";
import { useEvent } from "../../../hooks/useEvent/useEvent";
import { AnimatedResult } from "./AnimatedResult";

export function DiceResult(props: {
  poolResults: Array<IDicePoolResult>;
  animate: boolean;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const allResults = props.poolResults.flatMap((e) => e.commandResults);
  const areAllSelectedValuesNumbers = allResults.every((result) =>
    result.value.match(/^\d+$/)
  );

  const [selectedCommandResultIds, setSelectedCommandResultIds] = useState<
    Array<string>
  >([]);
  const selectedCommandResults = allResults.filter((r) =>
    selectedCommandResultIds.includes(r.id)
  );
  const resultsForDetails =
    selectedCommandResults.length > 0 ? selectedCommandResults : allResults;

  const hasSelectedResults = selectedCommandResultIds.length > 0;

  const handleDiceResultClick = useEvent((id: string) => {
    if (selectedCommandResultIds.includes(id)) {
      setSelectedCommandResultIds(
        selectedCommandResultIds.filter((e) => e !== id)
      );
    } else {
      setSelectedCommandResultIds([...selectedCommandResultIds, id]);
    }
  });

  const handleDeselectAll = useEvent(() => {
    setSelectedCommandResultIds([]);
  });

  useEffect(() => {
    if (!areAllSelectedValuesNumbers) {
      handleDeselectAll();
    }
  }, [areAllSelectedValuesNumbers]);

  return (
    <>
      <Stack spacing={2}>
        {resultsForDetails.length > 0 && areAllSelectedValuesNumbers && (
          <Box>{renderSelectedResultsDetails()}</Box>
        )}
        <Box>
          <Grid container spacing={1} justifyContent={"center"}>
            {renderResultGridItems()}
          </Grid>
        </Box>
        {props.children}
      </Stack>
    </>
  );

  function renderResultGridItems() {
    return (
      <>
        {props.poolResults.map((poolResult) => {
          return (
            <Box key={poolResult.id}>
              <Grid container>
                {poolResult.label && (
                  <Grid item sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        fontWeight={"bold"}
                        noWrap
                        sx={{
                          maxHeight: "100px",
                          textAlign: "center",
                          writingMode: "vertical-lr",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {poolResult.label}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid
                  item
                  sx={{ marginRight: poolResult.label ? ".5rem" : "0" }}
                >
                  <Grid container spacing={1}>
                    {poolResult.commandResults.map((commandResult) => {
                      const options = DiceCommandOptions[commandResult.command];
                      const selected = selectedCommandResultIds.includes(
                        commandResult.id
                      );
                      return (
                        <Grid item key={commandResult.id}>
                          <Grow in>
                            <Tooltip
                              placement="top"
                              title={
                                commandResult.details ? (
                                  <>
                                    <Box
                                      sx={{
                                        fontSize: "1.5rem",
                                      }}
                                    >
                                      {commandResult.details}
                                    </Box>
                                  </>
                                ) : (
                                  ""
                                )
                              }
                            >
                              <Box>
                                <Stack
                                  spacing={2}
                                  sx={{
                                    "padding": "1rem",
                                    "transition": theme.transitions.create([
                                      "background",
                                      "boxShadow",
                                    ]),
                                    "background": selected
                                      ? theme.palette.action.selectedOpacity
                                      : theme.palette.background.paper,
                                    "boxShadow": selected
                                      ? theme.shadows[2]
                                      : theme.shadows[0],
                                    "cursor": areAllSelectedValuesNumbers
                                      ? "pointer"
                                      : "inherit",
                                    "border": `1px solid ${
                                      selected
                                        ? theme.palette.primary.main
                                        : theme.palette.divider
                                    }`,
                                    "pointerEvents": areAllSelectedValuesNumbers
                                      ? "inherit"
                                      : "none",
                                    "borderRadius": "4px",
                                    "&:hover": {
                                      background: areAllSelectedValuesNumbers
                                        ? theme.palette.action.hover
                                        : "inherit",
                                    },
                                  }}
                                  onClick={() =>
                                    handleDiceResultClick(commandResult.id)
                                  }
                                  alignItems={"center"}
                                >
                                  <Box
                                    sx={{
                                      fontSize: "1.5rem",
                                      fontWeight: selected
                                        ? theme.typography.fontWeightBold
                                        : theme.typography.fontWeightRegular,
                                    }}
                                  >
                                    <AnimatedResult
                                      id={commandResult.id}
                                      result={commandResult.value}
                                      animate={props.animate}
                                      possibleResults={options.possibleResults}
                                    />
                                  </Box>
                                  <Box>
                                    <Tooltip title={commandResult.command}>
                                      <Box>
                                        <options.icon
                                          style={{
                                            fontSize: "2rem",
                                            color: selected
                                              ? theme.palette.primary.main
                                              : theme.palette.action.disabled,
                                          }}
                                        />
                                      </Box>
                                    </Tooltip>
                                  </Box>
                                </Stack>
                              </Box>
                            </Tooltip>
                          </Grow>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </>
    );
  }

  function renderSelectedResultsDetails() {
    const firstResult = resultsForDetails[0];
    const firstValue = parseInt(`${firstResult?.value}`);

    const total = resultsForDetails.reduce((acc, result) => {
      const value = parseInt(`${result.value}`);
      if (value >= 0) {
        return acc + value;
      }
      return 0;
    }, 0);
    const highest = resultsForDetails.reduce((acc, result) => {
      const value = parseInt(`${result.value}`);
      if (value >= 0) {
        return Math.max(acc, value);
      }
      return 0;
    }, firstValue);
    const lowest = resultsForDetails.reduce((acc, result) => {
      const value = parseInt(`${result.value}`);
      if (value >= 0) {
        return Math.min(acc, value);
      }
      return 0;
    }, firstValue);

    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Chip
          color={hasSelectedResults ? "primary" : "default"}
          label={<>Total: {total}</>}
        />
        <Chip
          color={hasSelectedResults ? "primary" : "default"}
          label={<>Highest: {highest}</>}
        />
        <Chip
          color={hasSelectedResults ? "primary" : "default"}
          label={<>Lowest: {lowest}</>}
        />
      </Stack>
    );
  }
}
