import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import useTheme from "@material-ui/core/styles/useTheme";
import React from "react";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";

export const AddSection: React.FC<{
  onAddSection(): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();

  return (
    <Box p="1rem" justifyContent="center" display="flex">
      <Button
        color="primary"
        variant="outlined"
        onClick={(e) => {
          props.onAddSection();
        }}
      >
        {t("character-dialog.control.add-section")}
      </Button>
    </Box>
  );
};
AddSection.displayName = "AddSection";
