import { Box, Button, Typography } from "@material-ui/core";
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
              textAlign: "center",
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
