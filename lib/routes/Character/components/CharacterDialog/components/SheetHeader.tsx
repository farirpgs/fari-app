import { css } from "@emotion/css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FlipToBackIcon from "@mui/icons-material/FlipToBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../components/FateLabel/FateLabel";
import {
  IPage,
  IPageSectionPosition,
  V3Position,
} from "../../../../../domains/character/types";
import { useTextColors } from "../../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { smallIconButtonStyle } from "../CharacterV3Dialog";

export const SheetHeader: React.FC<{
  label: string;
  currentPageIndex: number;
  sectionLocation: IPageSectionPosition;
  pages: Array<IPage> | undefined;
  advanced: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onLabelChange?: (newLabel: string) => void;
  onRemove(): void;
  onMoveUp(): void;
  onMoveDown(): void;
  onReposition(position: V3Position): void;
  onDuplicateSection(): void;
  onMoveToPage: (pageIndex: number) => void;
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
    clipPath: "polygon(2% 0%, 100% 0, 100% 70%, 98% 100%, 0 100%, 0% 30%)",
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
                  <VisibilityIcon htmlColor={headerColor} />
                ) : (
                  <VisibilityOffIcon htmlColor={headerColor} />
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
                <ControlCameraIcon htmlColor={headerColor} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {props.advanced && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.duplicate")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.duplicate`}
                size="small"
                className={smallIconButtonStyle}
                onClick={props.onDuplicateSection}
              >
                <FileCopyIcon htmlColor={headerColor} />
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
                <DeleteIcon htmlColor={headerColor} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          disabled={!props.canMoveUp}
          data-cy={`character-dialog.${props.label}.move-up`}
          onClick={() => {
            handleClose();
            props.onMoveUp();
          }}
        >
          <ListItemIcon>
            <ArrowUpwardIcon />
          </ListItemIcon>
          {t("character-dialog.control.move-up")}
        </MenuItem>
        <MenuItem
          disabled={!props.canMoveDown}
          data-cy={`character-dialog.${props.label}.move-down`}
          onClick={() => {
            handleClose();
            props.onMoveDown();
          }}
        >
          <ListItemIcon>
            <ArrowDownwardIcon />
          </ListItemIcon>
          {t("character-dialog.control.move-down")}
        </MenuItem>
        <MenuItem
          data-cy={`character-dialog.${props.label}.switch-side`}
          onClick={() => {
            handleClose();
            const newPosition =
              props.sectionLocation === "left"
                ? V3Position.Right
                : V3Position.Left;
            props.onReposition(newPosition);
          }}
        >
          <ListItemIcon>
            <ArrowForwardIcon
              className={css({
                transform:
                  props.sectionLocation === "left"
                    ? undefined
                    : "rotate(180deg)",
              })}
            />
          </ListItemIcon>
          {props.sectionLocation === "left"
            ? t("character-dialog.control.move-right")
            : t("character-dialog.control.move-left")}
        </MenuItem>
        {props.pages?.map((page, pageIndex) => {
          if (pageIndex === props.currentPageIndex) {
            return null;
          }
          return (
            <MenuItem
              key={page.id}
              onClick={() => {
                handleClose();
                props.onMoveToPage(pageIndex);
              }}
            >
              <ListItemIcon>
                <FlipToBackIcon />
              </ListItemIcon>
              {`Move To Page: ${previewContentEditable({ value: page.label })}`}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
SheetHeader.displayName = "SheetHeader";
