import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { DiceBox } from "../../components/DiceBox/DiceBox";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { Dice, IDiceRollResult } from "../../domains/dice/Dice";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { ITranslationKeys } from "../../locale";
import { TheOracle } from "./domains/TheOracle";

type IMatrixItem = {
  label: string;
  value: number;
};

const Likeliness: Array<IMatrixItem> = [
  { label: "Almost Guaranteed", value: 4 },
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

  return (
    <Page>
      <PageMeta
        title={t("oracle-route.meta.title")}
        description={t("oracle-route.meta.description")}
      />
      <Oracle />
    </Page>
  );
};

OracleRoute.displayName = "OracleRoute";
export default OracleRoute;

export function Oracle() {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();

  const [rolls, setRolls] = useState<Array<IDiceRollResult>>([]);
  const [likeliness, setLikeliness] = useState<number>(0);
  const [rolling, setRolling] = useState<boolean>(false);
  const [finalRoll, setFinalRoll] = useState<IDiceRollResult>();
  const finalRollTotal = finalRoll?.total ?? 0;
  const finalResult = finalRollTotal + likeliness;
  const oracleValue = TheOracle.getValue(finalResult);
  const shouldDisplayFinalResult = !rolling && finalRoll?.total !== undefined;

  function roll() {
    setRolls((draft) => {
      const newRoll = Dice.rollGroups([{ commandSets: [{ id: "4dF" }] }], {
        listResults: false,
      });

      return [newRoll, ...draft];
    });
  }

  useEffect(() => {
    if (shouldDisplayFinalResult) {
      logger.track("view_oracle_result", {
        value: oracleValue,
      });
    }
  }, [shouldDisplayFinalResult, oracleValue]);

  return (
    <Box>
      <Box py="1rem">
        <DiceBox
          rolls={rolls ?? []}
          size="5rem"
          fontSize="2rem"
          borderSize=".2rem"
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
          <TableContainer component={Paper} elevation={4}>
            <Toolbar className={css({ padding: "1rem" })}>
              <FateLabel
                data-cy="oracle.value"
                data-cy-value={shouldDisplayFinalResult && oracleValue}
                variant="h5"
                align="center"
                color="primary"
                className={css({ width: "100%" })}
              >
                {shouldDisplayFinalResult
                  ? t(`oracle.value.${oracleValue}` as ITranslationKeys)
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
                        data-cy={`oracle.likeliness.${l.value}`}
                        onClick={() => {
                          setLikeliness(l.value);

                          logger.track("change_oracle_likeliness", {
                            likeliness: l.value,
                          });
                        }}
                      >
                        <FateLabel className={css({ fontWeight: "bold" })}>
                          {l.label} ({formatOracleDiceNumber(l.value)})
                        </FateLabel>
                      </TableCell>

                      {Rolls.map((r) => {
                        const cellValue = l.value + r.value;
                        const formattedValue =
                          formatOracleDiceNumber(cellValue);

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
                              transition:
                                theme.transitions.create("background"),
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
                                transition:
                                  theme.transitions.create("fontWeight"),
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
                          transition: theme.transitions.create(["background"]),
                          color: highlightValue
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                          background: highlightValue
                            ? theme.palette.primary.main
                            : "inherit",
                        })}
                      >
                        <FateLabel align="center">
                          {formatOracleDiceNumber(r.value)}
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
  );
}

function formatOracleDiceNumber(total: number): string {
  if (total > 0) {
    return `+${total}`;
  }

  return total.toString();
}
