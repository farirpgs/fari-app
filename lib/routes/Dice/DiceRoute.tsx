import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { DiceBox } from "../../components/DiceBox/DiceBox";
import { DiceFab } from "../../components/DiceFab/DiceFab";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useRollDice } from "../../contexts/DiceContext/DiceContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { IDiceRoll, IDiceRollWithBonus } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { DiceGameIcon } from "../../domains/Icons/Icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const DiceRoute = () => {
  const [rolls, setRolls] = useState<Array<IDiceRollWithBonus>>([]);
  const [, ...archivedRolls] = rolls;
  const fiveLatestRolls = archivedRolls.slice(0, 5);
  const { t } = useTranslate();
  const logger = useLogger();
  const roll = useRollDice();

  useEffect(() => {
    logger.info("Route:Dice");
    setRollResult(roll());
  }, []);

  const setRollResult = (result: IDiceRoll) => {
    setRolls((draft) => {
      logger.info("DiceRoute:onDiceRoll", { roll: result });
      return [result, ...draft];
    });
  };

  const handleRoll = () => {
    setRollResult(roll());
  };

  return (
    <Page>
      <PageMeta
        title={t("dice-route.meta.title")}
        description={t("dice-route.meta.description")}
      />
      <Box>
        <Heading icon={DiceGameIcon} title="Dice" />
        <DiceFab
          onSelect={(result) => {
            setRollResult(result);
          }}
        />
        <Box display="flex" justifyContent="center" pt="1rem">
          <Button
            onClick={handleRoll}
            size="large"
            variant="contained"
            color="primary"
          >
            {t("dice-route.button")}
          </Button>
        </Box>
        <Box pt="3rem">
          <Box display="flex" justifyContent="center" pt="1rem">
            <DiceBox
              rolls={rolls}
              showDetails
              size="7rem"
              fontSize="4.5rem"
              borderSize=".5rem"
              onClick={handleRoll}
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
