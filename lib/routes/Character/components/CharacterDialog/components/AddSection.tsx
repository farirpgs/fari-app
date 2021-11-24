import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";

export const AddSection: React.FC<{
  onAddSection(): void;
}> = (props) => {
  const { t } = useTranslate();

  return (
    <Box p="1rem" justifyContent="center" display="flex">
      <Button
        color="primary"
        variant="outlined"
        onClick={() => {
          props.onAddSection();
        }}
      >
        {t("character-dialog.control.add-section")}
      </Button>
    </Box>
  );
};
AddSection.displayName = "AddSection";
