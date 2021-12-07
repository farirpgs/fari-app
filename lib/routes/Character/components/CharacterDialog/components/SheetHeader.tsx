import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { ContentEditable } from "../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../components/FateLabel/FateLabel";
import { useTextColors } from "../../../../../hooks/useTextColors/useTextColors";

export const SheetHeader: React.FC<{
  label: string;
  onLabelChange?: (newLabel: string) => void;
  actions?: React.ReactNode;
  advanced: boolean;
}> = (props) => {
  const theme = useTheme();
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);
  const headerTextColors = useTextColors(headerBackgroundColors.primary);
  const sheetHeaderClassName = css({
    label: "SheetHeader-box",
    // Hexagone
    // https://bennettfeely.com/clippy/
    // clipPath: "polygon(2% 0%, 100% 0, 100% 70%, 98% 100%, 0 100%, 0% 30%)",
    background: headerBackgroundColors.primary,
    color: headerTextColors.primary,
    width: "100%",
    padding: ".5rem",
  });

  return (
    <Box className={sheetHeaderClassName}>
      <Grid
        container
        justifyContent="space-between"
        wrap="nowrap"
        spacing={1}
        alignItems="center"
      >
        <Grid item xs>
          <FateLabel
            className={css({
              fontSize: "1rem",
            })}
          >
            <ContentEditable
              data-cy={`character-dialog.${props.label}.label`}
              readonly={!props.advanced || !props.onLabelChange}
              border={props.advanced && !!props.onLabelChange}
              borderColor={headerTextColors.primary}
              value={props.label}
              onChange={(newLabel) => {
                props.onLabelChange?.(newLabel);
              }}
            />
          </FateLabel>
        </Grid>
        {props.advanced && <Grid item>{props.actions}</Grid>}
      </Grid>
    </Box>
  );
};
SheetHeader.displayName = "SheetHeader";
