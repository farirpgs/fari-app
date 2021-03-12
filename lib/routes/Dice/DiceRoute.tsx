import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useEffect, useState } from "react";
import { DiceBox } from "../../components/DiceBox/DiceBox";
import { DiceFab, DiceFabMode } from "../../components/DiceFab/DiceFab";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useRollDice } from "../../contexts/DiceContext/DiceContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { IDiceRollWithBonus } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { Icons } from "../../domains/Icons/Icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const DiceRoute = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [rolls, setRolls] = useState<Array<IDiceRollWithBonus>>([]);
  const [, ...archivedRolls] = rolls;
  const fiveLatestRolls = archivedRolls.slice(0, 5);
  const { t } = useTranslate();
  const logger = useLogger();
  const roll = useRollDice();

  useEffect(() => {
    logger.info("Route:Dice");
    setRollResult(roll({ pool: false }));
  }, []);

  const setRollResult = (result: IDiceRollWithBonus) => {
    setRolls((draft) => {
      logger.info("DiceRoute:onDiceRoll", { roll: result });
      return [result, ...draft];
    });
  };

  const handleRoll = () => {
    setRollResult(roll({ pool: false }));
  };

  return (
    <Page>
      <PageMeta
        title={t("dice-route.meta.title")}
        description={t("dice-route.meta.description")}
      />
      <Box>
        <Heading
          icon={Icons.FateDice}
          title={t("dice-route.meta.title")}
          subtitle={t("dice-route.meta.description")}
        />
        <DiceFab
          type={DiceFabMode.Roll}
          onSelect={(result) => {
            setRollResult(result);
          }}
        />

        <Box mb="2rem">
          <Box display="flex" justifyContent="center">
            <DiceBox
              rolls={rolls}
              tooltipOpen={!isSmall ? true : undefined}
              tooltipPlacement={isSmall ? "top" : "right"}
              size="7rem"
              fontSize="4.5rem"
              borderSize=".5rem"
              onClick={handleRoll}
            />
          </Box>
        </Box>
        <Fade in={!!fiveLatestRolls.length}>
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Heading title="History" mb="1rem" />
            {fiveLatestRolls.map((roll, index) => {
              return (
                <Box key={index}>
                  <Typography
                    className={css({
                      fontSize: "1rem",
                      lineHeight: Font.lineHeight(1),
                      textAlign: "center",
                    })}
                  >
                    {roll.total}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Fade>
      </Box>
    </Page>
  );
};

DiceRoute.displayName = "DiceRoute";
export default DiceRoute;
