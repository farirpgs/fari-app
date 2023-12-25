import { Box, Button, Drawer } from "@mui/material";
import React from "react";
import { ICommandResult } from "../../../domains/dice/Dice";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { DiceResult } from "./DiceResult";

export function DiceDrawer(props: {
  results: Array<ICommandResult>;

  onClear: () => void;
}) {
  const { t } = useTranslate();

  const hasResults = props.results.length > 0;
  return (
    <Drawer
      anchor={"bottom"}
      open={hasResults}
      hideBackdrop
      variant="persistent"
    >
      <Box sx={{ padding: "2rem" }}>
        <DiceResult
          animate={true}
          poolResults={[
            {
              id: "",
              commandResults: props.results,
            },
          ]}
        >
          <Box display="flex" justifyContent={"center"}>
            <Button variant="outlined" onClick={props.onClear}>
              {t("dice-drawer.clear")}
            </Button>
          </Box>
        </DiceResult>
      </Box>
    </Drawer>
  );
}
