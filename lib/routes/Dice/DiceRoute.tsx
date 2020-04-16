import { Box, Button, Typography } from "@material-ui/core";
import { css } from "emotion";
import React, { useState } from "react";
import { Page } from "../../components/Page/Page";
import { Dice } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useFudgeDice } from "../../hooks/useFudgeDice/useFudgeDice";

export const DiceRoute = () => {
  const [rolls, setRolls] = useState<Array<number>>([Dice.runFudgeDice()]);
  const diceManager = useFudgeDice(rolls);
  const [, ...archivedRolls] = rolls;
  const fiveLatestRolls = archivedRolls.slice(0, 5);

  function roll() {
    setRolls((draft) => {
      return [Dice.runFudgeDice(), ...draft];
    });
  }

  return (
    <Page h1="Dice">
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

DiceRoute.displayName = "Dice Route";
