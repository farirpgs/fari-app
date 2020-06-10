import {
  Box,
  Button,
  ButtonBase,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { css, cx } from "emotion";
import React, { useState } from "react";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Dice } from "../../domains/dice/Dice";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { Font } from "../../domains/font/Font";
import { useFudgeDice } from "../../hooks/useFudgeDice/useFudgeDice";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const DiceRoute = () => {
  const [rolls, setRolls] = useState<Array<IDiceRoll>>([Dice.roll4DF()]);
  const diceManager = useFudgeDice(rolls);
  const [, ...archivedRolls] = rolls;
  const fiveLatestRolls = archivedRolls.slice(0, 5);
  const theme = useTheme();
  const diceTextColors = useTextColors(theme.palette.background.paper);
  const { t } = useTranslate();

  function roll() {
    setRolls((draft) => {
      return [Dice.roll4DF(), ...draft];
    });
  }

  const diceStyle = css({
    fontSize: "5rem",
    lineHeight: Font.lineHeight(5),
    color: diceManager.state.color,
    background: theme.palette.background.paper,
    border: `.5rem solid ${theme.palette.primary.main}`,
    borderRadius: "4px",
    width: "7rem",
    height: "7rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "3px 5px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  });
  const diceRollingAnimationStyle = css({
    animationName: "spin",
    animationDuration: "250ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  });
  return (
    <Page>
      <PageMeta
        title={t("dice-route.meta.title")}
        description={t("dice-route.meta.description")}
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
            {t("dice-route.title")}
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
            {t("dice-route.button")}
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" pt="3rem">
          <Tooltip title={diceManager.state.tooltip}>
            <ButtonBase
              className={css({
                borderRadius: "50%",
                color: diceTextColors.primary,
              })}
              onClick={() => {
                roll();
              }}
            >
              <Typography
                className={cx(diceStyle, {
                  [diceRollingAnimationStyle]: diceManager.state.rolling,
                })}
              >
                {diceManager.state.label}
              </Typography>
            </ButtonBase>
          </Tooltip>
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
                  {roll.total}
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
