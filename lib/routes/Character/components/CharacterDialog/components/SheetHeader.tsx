import { css } from "@emotion/css";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { ContentEditable } from "../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../components/FateLabel/FateLabel";
import { IPage, ISection } from "../../../../../domains/character/types";
import { useTextColors } from "../../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { smallIconButtonStyle } from "../CharacterV3Dialog";

export const SheetHeader: React.FC<{
  label: string;
  pageIndex: number;
  section: ISection;
  pages: Array<IPage> | undefined;
  advanced: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onLabelChange?: (newLabel: string) => void;
  onRemove(): void;

  visibleOnCard?: boolean;
  onToggleVisibleOnCard?: () => void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const headerColor = theme.palette.background.paper;
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);

  const sheetHeaderClassName = css({
    label: "SheetHeader-box",
    // Hexagone
    // https://bennettfeely.com/clippy/
    // clipPath: "polygon(2% 0%, 100% 0, 100% 70%, 98% 100%, 0 100%, 0% 30%)",
    background: headerBackgroundColors.primary,
    color: headerColor,
    width: "100%",
    padding: ".5rem",
  });

  const handleOpenMoveMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
              borderColor={headerColor}
              value={props.label}
              onChange={(newLabel) => {
                props.onLabelChange?.(newLabel);
              }}
            />
          </FateLabel>
        </Grid>
        {props.advanced && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.visible-on-card")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.visible-on-card`}
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  props.onToggleVisibleOnCard?.();
                }}
              >
                {props.visibleOnCard ? (
                  <VisibilityIcon
                    htmlColor={headerColor}
                    className={css({
                      fontSize: "1rem",
                    })}
                  />
                ) : (
                  <VisibilityOffIcon
                    htmlColor={headerColor}
                    className={css({
                      fontSize: "1rem",
                    })}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Grid>
        )}

        {props.advanced && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.move")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.move`}
                size="small"
                className={smallIconButtonStyle}
                onClick={handleOpenMoveMenu}
              >
                <ControlCameraIcon
                  htmlColor={headerColor}
                  className={css({
                    fontSize: "1rem",
                  })}
                />
              </IconButton>
            </Tooltip>
          </Grid>
        )}

        {props.advanced && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.remove-section")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.remove`}
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  props.onRemove?.();
                }}
              >
                <DeleteIcon
                  htmlColor={headerColor}
                  className={css({
                    fontSize: "1rem",
                  })}
                />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
SheetHeader.displayName = "SheetHeader";
