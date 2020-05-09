import { Box, Button, lighten, Typography, useTheme } from "@material-ui/core";
import { css } from "emotion";
import React, { useState } from "react";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Dice } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useFudgeDice } from "../../hooks/useFudgeDice/useFudgeDice";

export const DiceRoute = () => {
  const [rolls, setRolls] = useState<Array<number>>([Dice.rollFudgeDice()]);
  const diceManager = useFudgeDice(rolls);
  const [, ...archivedRolls] = rolls;
  const fiveLatestRolls = archivedRolls.slice(0, 5);
  const theme = useTheme();
  const highlightBackgroundColor = lighten(theme.palette.primary.main, 0.95);

  function roll() {
    setRolls((draft) => {
      return [Dice.rollFudgeDice(), ...draft];
    });
  }

  return (
    <Page>
      <PageMeta
        title="Roll Fate Dice Online"
        description="Roll Fate/Fudge dice online using this fair dice roller."
      />
      <Box>
        <Box display="flex" justifyContent="center" pt="3rem">
          <Typography
            className={css({
              fontSize: "2rem",
              lineHeight: Font.lineHeight(2),
              textAlign: "center",
            })}
          >
            Press the button to re-roll
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" pt="3rem">
          <Button
            onClick={() => {
              roll();
            }}
            size="large"
            variant="contained"
            color="primary"
          >
            Roll
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" pt="3rem">
          <Typography
            className={css({
              fontSize: "5rem",
              lineHeight: Font.lineHeight(5),
              color: diceManager.state.color,
              background: highlightBackgroundColor,
              border: `.5rem solid ${theme.palette.primary.main}`,
              borderRadius: "4px",
              width: "7rem",
              height: "7rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow:
                "3px 5px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
              animationName: diceManager.state.rolling ? "spin" : undefined,
              animationDuration: "250ms",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            })}
          >
            {diceManager.state.roll}
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          pt="3rem"
          flexDirection="column"
        >
          {fiveLatestRolls.map((roll, index) => {
            return (
              <Box key={index}>
                <Typography
                  className={css({
                    fontSize: ".8rem",
                    lineHeight: Font.lineHeight(0.8),
                    textAlign: "center",
                  })}
                >
                  {roll}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Page>
  );
};

DiceRoute.displayName = "DiceRoute";
