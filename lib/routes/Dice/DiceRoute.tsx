import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { DiceBox } from "../../components/DiceBox/DiceBox";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { Dice } from "../../domains/dice/Dice";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { Font } from "../../domains/font/Font";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const DiceRoute = () => {
  const [rolls, setRolls] = useState<Array<IDiceRoll>>([]);
  const [, ...archivedRolls] = rolls;
  const fiveLatestRolls = archivedRolls.slice(0, 5);
  const { t } = useTranslate();
  const logger = useLogger();

  useEffect(() => {
    logger.info("Route:Dice");
    roll();
  }, []);

  function roll() {
    setRolls((draft) => {
      const newRoll = Dice.roll4DF({});
      logger.info("DiceRoute:onDiceRoll", { roll: newRoll });
      return [newRoll, ...draft];
    });
  }

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
        <Box pt="3rem">
          <Box display="flex" justifyContent="center" pt="3rem">
            <DiceBox
              rolls={rolls}
              showDetails
              size="7rem"
              fontSize="5rem"
              borderSize=".5rem"
              onClick={() => {
                roll();
              }}
            />
          </Box>
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
export default DiceRoute;
