import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import useTheme from "@material-ui/core/styles/useTheme";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { DiceBox } from "../../components/DiceBox/DiceBox";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { Dice } from "../../domains/dice/Dice";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { EyeIcon } from "../../domains/Icons/Icons";
import { formatDiceNumber } from "../../hooks/useFudgeDice/useFudgeDice";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPossibleTranslationKeys } from "../../services/internationalization/IPossibleTranslationKeys";
import { Oracle } from "./domains/Oracle";

type IMatrixItem = {
  label: string;
  value: number;
};

const Likeliness: Array<IMatrixItem> = [
  { label: "Almost Garanteed", value: 4 },
  { label: "Very Likely", value: 3 },
  { label: "Likely", value: 2 },
  { label: "Possible", value: 1 },
  { label: "50/50", value: 0 },
  { label: "Improbable", value: -1 },
  { label: "Unlikely", value: -2 },
  { label: "Very Unlikely", value: -3 },
  { label: "Far Fetched", value: -4 },
];

const Rolls: Array<IMatrixItem> = [
  { label: "-4", value: -4 },
  { label: "-3", value: -3 },
  { label: "-2", value: -2 },
  { label: "-1", value: -1 },
  { label: "0", value: 0 },
  { label: "+1", value: 1 },
  { label: "+2", value: 2 },
  { label: "+3", value: 3 },
  { label: "+4", value: 4 },
];

export const OracleRoute = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();

  const [rolls, setRolls] = useState<Array<IDiceRoll>>([]);
  const [likeliness, setLikeliness] = useState<number>(0);
  const [rolling, setRolling] = useState<boolean>(false);
  const [finalRoll, setFinalRoll] = useState<IDiceRoll>();
  const finalRollTotal = finalRoll?.total ?? 0;
  const finalResult = finalRollTotal + likeliness;
  const oracleValue = Oracle.getValue(finalResult);
  const shouldDisplayFinalResult = !rolling && finalRoll?.total !== undefined;

  function roll() {
    setRolls((draft) => {
      const newRoll = Dice.roll4DF({});
      logger.info("OracleRoute:onDiceRoll", { roll: newRoll });
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
        <Box
          py="1rem"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <EyeIcon className={css({ fontSize: "3rem" })} color="primary" />
          <FateLabel variant="h4" align="center" color="primary">
            {"Oracle"}
          </FateLabel>
        </Box>

        <Box py="1rem">
          <DiceBox
            rolls={rolls ?? []}
            size="5rem"
            fontSize="2rem"
            borderSize=".2rem"
            borderColor="#000000"
            onClick={() => {
              roll();
            }}
            onRolling={(isRolling) => {
              setRolling(isRolling);
            }}
            onFinalResult={(latestRoll) => {
              setFinalRoll(latestRoll);
            }}
          />
        </Box>

        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" pt="3rem">
            <Box display="flex" textAlign="center" pr="1rem">
              <Box
                className={css({
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(-180deg)",
                })}
              >
                <FateLabel
                  className={css({ fontWeight: "bold", fontSize: "1.25rem" })}
                >
                  {"Likeliness"}
                </FateLabel>
              </Box>
            </Box>
            <TableContainer component={Paper}>
              <Toolbar className={css({ padding: "1rem" })}>
                <FateLabel
                  variant="h5"
                  align="center"
                  color="primary"
                  className={css({ width: "100%" })}
                >
                  {shouldDisplayFinalResult
                    ? t(
                        `oracle.value.${oracleValue}` as IPossibleTranslationKeys
                      )
                    : " ..."}
                </FateLabel>
              </Toolbar>
              <Table>
                <TableBody>
                  {Likeliness.map((l) => {
                    const isCurrentRow = l.value === likeliness;
                    return (
                      <TableRow key={l.label}>
                        <TableCell
                          align="left"
                          width="280px"
                          className={css({
                            cursor: "pointer",
                            transition: theme.transitions.create("background"),
                            color: isCurrentRow
                              ? theme.palette.primary.contrastText
                              : "inherit",
                            background: isCurrentRow
                              ? theme.palette.primary.main
                              : "inherit",
                          })}
                          onClick={() => {
                            setLikeliness(l.value);
                          }}
                        >
                          <FateLabel className={css({ fontWeight: "bold" })}>
                            {l.label} ({formatDiceNumber(l.value)})
                          </FateLabel>
                        </TableCell>

                        {Rolls.map((r) => {
                          const cellValue = l.value + r.value;
                          const formattedValue = formatDiceNumber(cellValue);

                          const isCurrentColumn = r.value === finalRollTotal;

                          const likelinessRow =
                            isCurrentRow && r.value <= finalRollTotal;
                          const rollColumn =
                            isCurrentColumn && l.value <= likeliness;

                          const shouldHighlightCell =
                            shouldDisplayFinalResult &&
                            (likelinessRow || rollColumn);

                          const isMatch =
                            shouldDisplayFinalResult &&
                            isCurrentColumn &&
                            isCurrentRow;
                          const highlightBackground = isMatch
                            ? theme.palette.primary.main
                            : theme.palette.primary.light;
                          return (
                            <TableCell
                              key={`${l.label}-${r.label}`}
                              align="center"
                              width="50px"
                              className={css({
                                transition: theme.transitions.create(
                                  "background"
                                ),
                                color: shouldHighlightCell
                                  ? theme.palette.primary.contrastText
                                  : "inherit",

                                background: shouldHighlightCell
                                  ? highlightBackground
                                  : "inherit",
                              })}
                            >
                              <Typography
                                align="center"
                                className={css({
                                  fontWeight: isMatch ? "bold" : "inherit",
                                })}
                              >
                                {formattedValue}
                              </Typography>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell />
                    {Rolls.map((r) => {
                      const highlightValue =
                        !rolling && finalRoll?.total === r.value;

                      return (
                        <TableCell
                          key={r.label}
                          align="center"
                          width="50px"
                          className={css({
                            transition: theme.transitions.create([
                              "background",
                            ]),
                            color: highlightValue
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                            background: highlightValue
                              ? theme.palette.primary.main
                              : "inherit",
                          })}
                        >
                          <FateLabel align="center">
                            {formatDiceNumber(r.value)}
                          </FateLabel>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
          <Box display="flex" justifyContent="center" pt="1rem">
            <FateLabel
              className={css({ fontWeight: "bold", fontSize: "1.25rem" })}
            >
              {"Roll"}
            </FateLabel>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

OracleRoute.displayName = "OracleRoute";
export default OracleRoute;
