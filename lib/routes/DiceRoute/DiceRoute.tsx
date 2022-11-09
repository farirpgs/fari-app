import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import React, { useState } from "react";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Dice, ICommandResult, IDiceCommandId } from "../../domains/dice/Dice";
import { Icons } from "../../domains/Icons/Icons";
import { useEvent } from "../../hooks/useEvent/useEvent";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { DiceButtons } from "./components/DiceButtons";
import { DiceDrawer } from "./components/DiceDrawer";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DiceRoute(props: {}) {
  const { t } = useTranslate();
  const [results, setResults] = useState<Array<ICommandResult>>([]);

  const handleDiceClick = useEvent((diceCommand: IDiceCommandId) => {
    const result = Dice.roll(diceCommand);
    setResults((prev) => [...prev, result]);
  });

  const handleClear = useEvent(() => {
    setResults([]);
  });

  return (
    <Page maxWidth="sm" sx={{ paddingTop: "2rem" }}>
      <PageMeta
        title={t("dice-route.meta.title")}
        description={t("dice-route.meta.description")}
      />
      <Container sx={{ minHeight: "70vh" }}>
        <Heading icon={Icons.FateDice} title={t("dice-route.meta.title")} />
        <Stack spacing={2}>
          <Grid container justifyContent={"center"}>
            <Grid item>
              <Typography variant="h5">
                {"Click on a dice to roll it."}
              </Typography>
            </Grid>
          </Grid>
          <Stack>
            <DiceButtons
              onClick={handleDiceClick}
              commands={[
                "1d4",
                "1d6",
                "1d8",
                "1d10",
                "1d12",
                "1d20",
                "1d100",
                "4dF",
              ]}
            />
            <DiceButtons
              onClick={handleDiceClick}
              commands={["coin", "card", "2d6", "1dF"]}
            />
          </Stack>
          <DiceDrawer results={results} onClear={handleClear} />
        </Stack>
      </Container>
    </Page>
  );
}

DiceRoute.displayName = "DiceRoute";
export default DiceRoute;
