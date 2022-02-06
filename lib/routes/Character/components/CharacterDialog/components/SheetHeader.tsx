import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import { ContentEditable } from "../../../../../components/ContentEditable/ContentEditable";
import { CharacterSheetThemeContext } from "../CharacterSheetThemeContext";

export const SheetHeader: React.FC<{
  label: string;
  onLabelChange?: (newLabel: string) => void;
  actions?: React.ReactNode;
  advanced: boolean;
}> = (props) => {
  const theme = useTheme();
  const characterSheetTheme = useContext(CharacterSheetThemeContext);

  // const isVisible =
  //   props.label !== undefined &&
  //   (!!previewContentEditable({ value: props.label }) || props.advanced);

  // if (!isVisible) {
  //   return null;
  // }

  return (
    <Box mb=".5rem">
      <Box
        className={css({
          // Hexagone
          // https://bennettfeely.com/clippy/
          // clipPath:
          //   "polygon(2% 0%, 100% 0, 100% 70%, 98% 100%, 0 100%, 0% 30%)",
          background: characterSheetTheme.hideSectionBackground
            ? undefined
            : characterSheetTheme.textPrimary,
          color: characterSheetTheme.hideSectionBackground
            ? characterSheetTheme.textPrimary
            : characterSheetTheme.textPrimaryInverted,
          width: "100%",
          padding: characterSheetTheme.hideSectionBackground
            ? "0 .5rem"
            : ".5rem",
        })}
      >
        <Grid
          container
          justifyContent="space-between"
          wrap="nowrap"
          spacing={1}
          alignItems="center"
        >
          <Grid item xs>
            <Typography
              className={css({
                fontFamily: characterSheetTheme.sectionHeadingFontFamily,
                fontSize: `${characterSheetTheme.sectionHeadingFontSize}rem`,
                fontWeight: theme.typography.fontWeightBold,
              })}
            >
              <ContentEditable
                data-cy={`character-dialog.${props.label}.label`}
                readonly={!props.advanced || !props.onLabelChange}
                border={props.advanced && !!props.onLabelChange}
                borderColor={characterSheetTheme.textPrimaryInverted}
                value={props.label}
                onChange={(newLabel) => {
                  props.onLabelChange?.(newLabel);
                }}
              />
            </Typography>
          </Grid>
          {props.advanced && <Grid item>{props.actions}</Grid>}
        </Grid>
      </Box>
    </Box>
  );
};
SheetHeader.displayName = "SheetHeader";
