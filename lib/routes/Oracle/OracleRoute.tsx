import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { Dice, ICommandResult } from "../../domains/dice/Dice";
import { useEvent } from "../../hooks/useEvent/useEvent";
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
    <Page sx={{ paddingTop: "2rem" }}>
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

  const [result, setResult] = useState<ICommandResult>();
  const [rolling, setRolling] = useState(false);
  const [likeliness, setLikeliness] = useState<number>(0);
  const finalResult = parseInt(result?.value || "0");
  const oracleValue = TheOracle.getValue(finalResult);

  const roll = useEvent(() => {
    setRolling(true);

    setTimeout(() => {
      setResult(Dice.roll("4dF"));
      setRolling(false);
    }, 500);
  });

  useEffect(() => {
    logger.track("view_oracle_result", {
      value: oracleValue,
    });
  }, [oracleValue]);

  return (
    <Box>
      <Box py="1rem" justifyContent={"center"} display="flex">
        <Button
          variant="contained"
          onClick={roll}
          size="large"
          data-cy="oracle-route.ask-button"
          disabled={rolling}
        >
          Ask The Oracle
        </Button>
      </Box>

      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" pt="3rem">
          <Box display="flex" textAlign="center" pr="1rem">
            <Box
              sx={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(-180deg)",
              }}
            >
              <FateLabel sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                {"Likeliness"}
              </FateLabel>
            </Box>
          </Box>
          <TableContainer component={Paper} elevation={4}>
            <Toolbar sx={{ padding: "1rem" }}>
              <FateLabel
                data-cy="oracle.value"
                data-cy-value={oracleValue}
                variant="h5"
                align="center"
                color="primary"
                sx={{ width: "100%" }}
              >
                {rolling
                  ? "..."
                  : t(`oracle.value.${oracleValue}` as ITranslationKeys)}
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
                        sx={{
                          cursor: "pointer",
                          transition: theme.transitions.create("background"),
                          color: isCurrentRow
                            ? theme.palette.primary.contrastText
                            : "inherit",
                          background: isCurrentRow
                            ? theme.palette.primary.main
                            : "inherit",
                        }}
                        data-cy={`oracle.likeliness.${l.value}`}
                        onClick={() => {
                          setLikeliness(l.value);

                          logger.track("change_oracle_likeliness", {
                            likeliness: l.value,
                          });
                        }}
                      >
                        <FateLabel sx={{ fontWeight: "bold" }}>
                          {l.label} ({formatOracleDiceNumber(l.value)})
                        </FateLabel>
                      </TableCell>

                      {Rolls.map((r) => {
                        const cellValue = l.value + r.value;
                        const formattedValue =
                          formatOracleDiceNumber(cellValue);

                        const isCurrentColumn = r.value === finalResult;

                        const likelinessRow =
                          isCurrentRow && r.value <= finalResult;
                        const rollColumn =
                          isCurrentColumn && l.value <= likeliness;

                        const shouldHighlightCell = likelinessRow || rollColumn;

                        const isMatch = isCurrentColumn && isCurrentRow;
                        const highlightBackground = isMatch
                          ? theme.palette.primary.main
                          : theme.palette.primary.light;
                        return (
                          <TableCell
                            key={`${l.label}-${r.label}`}
                            align="center"
                            width="50px"
                            sx={{
                              transition:
                                theme.transitions.create("background"),
                              color: shouldHighlightCell
                                ? theme.palette.primary.contrastText
                                : "inherit",

                              background: shouldHighlightCell
                                ? highlightBackground
                                : "inherit",
                            }}
                          >
                            <Typography
                              align="center"
                              sx={{
                                transition:
                                  theme.transitions.create("fontWeight"),
                                fontWeight: isMatch ? "bold" : "inherit",
                              }}
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
                    const highlightValue = finalResult === r.value;

                    return (
                      <TableCell
                        key={r.label}
                        align="center"
                        width="50px"
                        sx={{
                          transition: theme.transitions.create(["background"]),
                          color: highlightValue
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                          background: highlightValue
                            ? theme.palette.primary.main
                            : "inherit",
                        }}
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
          <FateLabel sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
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
