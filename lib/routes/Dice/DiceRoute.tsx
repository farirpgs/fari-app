import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { DiceBox } from "../../components/DiceBox/DiceBox";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Toolbox } from "../../components/Toolbox/Toolbox";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { IDiceRollResult } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { Icons } from "../../domains/Icons/Icons";
import { formatDiceNumber } from "../../hooks/useLatestDiceRoll/useLatestDiceRoll";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export function DiceRoute(props: { pool: boolean }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const [, ...archivedRolls] = rolls;
  const fiveLatestRolls = archivedRolls.slice(0, 5);
  const { t } = useTranslate();
  const logger = useLogger();
  const diceManager = useContext(DiceContext);

  useEffect(
    function onLoad() {
      if (!props.pool) {
        logger.track("view_dice_page");
        setRollResult(
          diceManager.actions.rollCommandGroups({ listResults: props.pool })
        );
      } else {
        logger.track("view_dice_pool_page");
      }
      diceManager.actions.setOptions({ listResults: props.pool });
    },
    [props.pool]
  );

  const setRollResult = (result: IDiceRollResult) => {
    setRolls((draft) => {
      return [result, ...draft];
    });
  };

  const handleRoll = () => {
    setRollResult(diceManager.actions.rollCommandGroups());
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
        <Toolbox
          hideDefaultRightActions
          dice={{
            onRoll: (result) => {
              setRollResult(result);
            },
            onRollPool: (result) => {
              setRollResult(result);
            },
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
                    {formatDiceNumber(roll)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Fade>
      </Box>
    </Page>
  );
}

DiceRoute.displayName = "DiceRoute";
export default DiceRoute;
