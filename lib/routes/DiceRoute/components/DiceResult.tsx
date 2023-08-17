import IsoIcon from "@mui/icons-material/Iso";
import {
  Box,
  Chip,
  Grid,
  Grow,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CommandResult,
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
  const allResults = props.poolResults.flatMap((e) => e.commandResults);
  const areAllSelectedValuesNumbers = allResults.every((result) =>
    result.value.match(/^-?\d+$/),
  );

  const [selectedCommandResultIds, setSelectedCommandResultIds] = useState<
    Array<string>
  >([]);
  const selectedCommandResults = allResults.filter((r) =>
    selectedCommandResultIds.includes(r.id),
  );
  const resultsForDetails =
    selectedCommandResults.length > 0 ? selectedCommandResults : allResults;

  const hasSelectedResults = selectedCommandResultIds.length > 0;

  const handleDiceResultClick = useEvent((id: string) => {
    if (selectedCommandResultIds.includes(id)) {
      setSelectedCommandResultIds(
        selectedCommandResultIds.filter((e) => e !== id),
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
            <Grid item key={poolResult.id}>
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
                        commandResult.id,
                      );
                      return (
                        <Grid item key={commandResult.id}>
                          <Grow in>
                            <Box>
                              <ResultCard
                                title={commandResult.details}
                                icon={options.icon}
                                iconTitle={commandResult.command}
                                selected={selected}
                                clickable={areAllSelectedValuesNumbers}
                                onClick={() =>
                                  handleDiceResultClick(commandResult.id)
                                }
                              >
                                <AnimatedResult
                                  result={commandResult.value}
                                  animate={props.animate}
                                  possibleResults={options.possibleResults}
                                />
                              </ResultCard>
                            </Box>
                          </Grow>
                        </Grid>
                      );
                    })}
                    {!!poolResult.modifier && (
                      <Grid item>
                        <ResultCard title={"Modifier"} icon={IsoIcon}>
                          {poolResult.modifier}
                        </ResultCard>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </>
    );
  }

  function renderSelectedResultsDetails() {
    const modifiersTotal = props.poolResults.reduce(
      (acc, poolResult) =>
        acc + (poolResult.modifier ? poolResult.modifier : 0),
      0,
    );

    const total = CommandResult.getTotal(resultsForDetails);
    const highest = CommandResult.getHighest(resultsForDetails);
    const lowest = CommandResult.getLowest(resultsForDetails);
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Chip
          color={hasSelectedResults ? "primary" : "default"}
          label={
            <>
              Total: {total}
              {modifiersTotal > 0 && (
                <>
                  +{modifiersTotal} = {total + modifiersTotal}
                </>
              )}
            </>
          }
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

function ResultCard(props: {
  children: React.ReactNode;
  icon: React.ElementType<any>;
  iconTitle?: string;
  title?: string;
  selected?: boolean;
  clickable?: boolean;
  animate?: boolean;
  onClick?: () => void;
}) {
  const theme = useTheme();
  return (
    <Tooltip
      placement="top"
      title={
        props.title ? (
          <>
            <Box
              sx={{
                fontSize: "1rem",
              }}
            >
              {props.title}
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
            "transition": theme.transitions.create(["background", "boxShadow"]),
            "background": props.selected
              ? theme.palette.action.selectedOpacity
              : theme.palette.background.paper,
            "boxShadow": props.selected ? theme.shadows[2] : theme.shadows[0],
            "cursor": props.clickable ? "pointer" : "inherit",
            "border": `1px solid ${
              props.selected
                ? theme.palette.primary.main
                : theme.palette.divider
            }`,
            "pointerEvents": props.clickable ? "inherit" : "none",
            "borderRadius": "4px",
            "&:hover": {
              background: props.clickable
                ? theme.palette.action.hover
                : "inherit",
            },
          }}
          onClick={props.onClick}
          alignItems={"center"}
        >
          <Box
            sx={{
              fontSize: "1.5rem",
              fontWeight: props.selected
                ? theme.typography.fontWeightBold
                : theme.typography.fontWeightRegular,
            }}
          >
            {props.children}
          </Box>
          <Box>
            <Tooltip title={props.iconTitle ?? ""}>
              <Box>
                <props.icon
                  style={{
                    fontSize: "2rem",
                    color: props.selected
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
  );
}
