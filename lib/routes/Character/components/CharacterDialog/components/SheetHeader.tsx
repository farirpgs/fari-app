import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import { ContentEditable } from "../../../../../components/ContentEditable/ContentEditable";
import { MiniThemeContext } from "../MiniThemeContext";

export const SheetHeader: React.FC<{
  label: string;
  index: number;
  onLabelChange?: (newLabel: string) => void;
  actions?: React.ReactNode;
  advanced: boolean;
}> = (props) => {
  const theme = useTheme();
  const miniTheme = useContext(MiniThemeContext);

  return (
    <Box mb=".5rem">
      <Box
        className={css({
          background: miniTheme.hideSectionBackground
            ? undefined
            : miniTheme.textPrimary,
          color: miniTheme.hideSectionBackground
            ? miniTheme.textPrimary
            : miniTheme.textPrimaryInverted,
          width: "100%",
          padding: miniTheme.hideSectionBackground ? "0 .5rem" : ".5rem",
        })}
      >
        {props.advanced && (
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
                  fontSize: ".7rem",
                  color: miniTheme.hideSectionBackground
                    ? miniTheme.textSecondary
                    : miniTheme.textPrimaryInverted,
                  fontWeight: theme.typography.fontWeightBold,
                })}
              >
                {`Section ${props.index + 1}`}
              </Typography>
            </Grid>
            <Grid item>{props.actions}</Grid>
          </Grid>
        )}
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
                fontFamily: miniTheme.sectionHeadingFontFamily,
                fontSize: `${miniTheme.sectionHeadingFontSize}rem`,
                fontWeight: miniTheme.sectionHeadingFontWeight,
              })}
            >
              <ContentEditable
                dataCy={`character-dialog.${props.label}.label`}
                readonly={!props.advanced || !props.onLabelChange}
                border={props.advanced && !!props.onLabelChange}
                borderColor={miniTheme.textPrimaryInverted}
                value={props.label}
                onChange={(newLabel) => {
                  props.onLabelChange?.(newLabel);
                }}
              />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
SheetHeader.displayName = "SheetHeader";
