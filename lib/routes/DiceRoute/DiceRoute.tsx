"use client";

import { Container, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { Icons } from "../../domains/Icons/Icons";
import { Dice, ICommandResult, IDiceCommandId } from "../../domains/dice/Dice";
import { useEvent } from "../../hooks/useEvent/useEvent";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { DiceButtons } from "./components/DiceButtons";
import { DiceDrawer } from "./components/DiceDrawer";

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
      <Container sx={{ minHeight: "70vh" }}>
        <Heading icon={Icons.FateDice} title={t("dice-route.meta.title")} />
        <Stack spacing={2}>
          <Grid container justifyContent={"center"}>
            <Grid item>
              <Typography variant="h5">
                {t("dice-route.meta.subtitle")}
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
