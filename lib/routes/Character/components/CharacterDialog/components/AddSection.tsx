import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core/styles";
import useTheme from "@material-ui/core/styles/useTheme";
import React from "react";
import { useThemeFromColor } from "../../../../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";

export const AddSection: React.FC<{
  onAddSection(): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const blackButtonTheme = useThemeFromColor(theme.palette.text.primary);

  return (
    <Box p="1rem" justifyContent="center" display="flex">
      <ThemeProvider theme={blackButtonTheme}>
        <Button
          color="primary"
          variant="outlined"
          onClick={(e) => {
            props.onAddSection();
          }}
        >
          {t("character-dialog.control.add-section")}
        </Button>
      </ThemeProvider>
    </Box>
  );
};
AddSection.displayName = "AddSection";
