import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { css } from "emotion";
import { default as React, useRef, useState } from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { IndexCardColor, IndexCardColorBright } from "./IndexCardColor";

export const IndexCard: React.FC<{
  title: string;
  content: string;
  readonly: boolean;
  freeInvokes: Array<boolean>;
  physicalStress: Array<boolean>;
  mentalStress: Array<boolean>;
  consequences: Array<string>;
  color: string;
  isBoost: boolean;
  className?: string;

  onTitleChange(value: string): void;
  onContentChange(value: string): void;
  onFreeInvokeChange(index: number, value: boolean): void;
  onPhysicalStressChange(index: number, value: boolean): void;
  onMentalStressChange(index: number, value: boolean): void;
  onConsequenceChange(index: number, value: string): void;
  onAddAspectFreeInvoke(): void;
  onAddAspectPhysicalStress(): void;
  onAddAspectMentalStress(): void;
  onAddConsequence(): void;
  onUpdateAspectColor(color: string): void;
  onRemove(): void;
  onReset(): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [menuOpen, setMenuOpen] = useState(false);
  const $menu = useRef(undefined);
  const colorPickerBackground = theme.palette.primary.main;
  const shouldRenderCheckboxesOrConsequences =
    props.freeInvokes.length > 0 ||
    props.physicalStress.length > 0 ||
    props.mentalStress.length > 0 ||
    props.consequences.length > 0;

  return (
    <Paper elevation={undefined} className={props.className}>
      <Box bgcolor={props.color}>
        <Box
          className={css({
            fontSize: "1.5rem",
            width: "100%",
            padding: "0.5rem 0",
            borderBottom: "1px solid #f0a4a4",
          })}
        >
          <Box p={props.isBoost ? "0 1rem 1rem 1rem" : "1rem"}>
            {props.isBoost && (
              <Grid item>
                <Typography variant="overline">
                  {t("index-card.boost")}
                </Typography>
              </Grid>
            )}
            <Grid container justify="space-between">
              <Grid item xs>
                <ContentEditable
                  value={props.title}
                  readonly={props.readonly}
                  autoFocus
                  onChange={props.onTitleChange}
                ></ContentEditable>
              </Grid>
              {!props.readonly && (
                <Grid item>
                  <IconButton
                    ref={$menu}
                    size="small"
                    onClick={() => {
                      setMenuOpen(true);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    classes={{
                      list: css({
                        paddingBottom: 0,
                      }),
                    }}
                    anchorEl={$menu.current}
                    keepMounted
                    open={menuOpen}
                    onClose={() => {
                      setMenuOpen(false);
                    }}
                  >
                    {!props.isBoost && renderAspectMenuItems()}
                    {renderGlobalMenuItems()}
                  </Menu>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
        {!props.isBoost && renderContent()}
        {shouldRenderCheckboxesOrConsequences &&
          renderCheckboxesAndConsequences()}
      </Box>
    </Paper>
  );

  function renderAspectMenuItems() {
    return [
      <MenuItem
        key="onAddAspectFreeInvoke"
        onClick={() => {
          props.onAddAspectFreeInvoke();
        }}
      >
        {t("index-card.add-1-free-invoke")}
      </MenuItem>,
      <MenuItem
        key="onAddAspectPhysicalStress"
        onClick={() => {
          props.onAddAspectPhysicalStress();
        }}
      >
        {t("index-card.add-1-physical-stress-box")}
      </MenuItem>,
      <MenuItem
        key="onAddAspectMentalStress"
        onClick={() => {
          props.onAddAspectMentalStress();
        }}
      >
        {t("index-card.add-1-mental-stress-box")}
      </MenuItem>,
      <MenuItem
        key="onAddConsequence"
        onClick={() => {
          props.onAddConsequence();
        }}
      >
        {t("index-card.add-1-consequence")}
      </MenuItem>,
      <Divider key="renderAspectMenuItemsDivider"></Divider>,
    ];
  }

  function renderGlobalMenuItems() {
    return [
      <MenuItem
        key="onRemove"
        onClick={() => {
          setMenuOpen(false);
          props.onRemove();
        }}
      >
        {t("index-card.remove")}
      </MenuItem>,
      <MenuItem
        key="onReset"
        onClick={() => {
          setMenuOpen(false);
          props.onReset();
        }}
      >
        {t("index-card.reset")}
      </MenuItem>,
      <Divider key="renderGlobalMenuItemsDivider" light></Divider>,
      <MenuItem
        key="onUpdateAspectColor"
        className={css({
          "backgroundColor": colorPickerBackground,
          "cursor": "inherit",
          "&:hover": {
            backgroundColor: colorPickerBackground,
          },
        })}
        disableRipple
        disableTouchRipple
      >
        <Grid container justify="center">
          {Object.keys(IndexCardColorBright).map(
            (colorName: IndexCardColorBright) => {
              return (
                <Grid item key={colorName}>
                  <IconButton
                    onClick={(e) => {
                      props.onUpdateAspectColor(IndexCardColor[colorName]);
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    size="small"
                  >
                    <FiberManualRecordIcon
                      htmlColor={IndexCardColorBright[colorName]}
                    ></FiberManualRecordIcon>
                  </IconButton>
                </Grid>
              );
            }
          )}
        </Grid>
      </MenuItem>,
    ];
  }

  function renderContent() {
    return (
      <Box
        className={css({
          fontSize: "1.1rem",
          lineHeight: "1.7rem",
          padding: "0.5rem 0",
          width: "100%",
          borderBottom: "1px solid #ddd",
        })}
      >
        <Box p="0 1rem">
          <ContentEditable
            value={props.content}
            readonly={props.readonly}
            onChange={props.onContentChange}
          ></ContentEditable>
        </Box>
      </Box>
    );
  }

  function renderCheckboxesAndConsequences() {
    return (
      <Box
        className={css({
          padding: "0.5rem 0",
          width: "100%",
          borderBottom: "1px solid #ddd",
        })}
      >
        <Box p=".5rem 1rem">
          <Box>
            {props.freeInvokes.length > 0 && (
              <InputLabel shrink>{t("index-card.free-invokes")}</InputLabel>
            )}
            <Grid container justify="flex-start">
              {props.freeInvokes.map((value, index) => {
                return (
                  <Grid item key={index} xs={2}>
                    <Checkbox
                      checked={value}
                      onChange={(event) => {
                        if (props.readonly) {
                          return;
                        }
                        props.onFreeInvokeChange(index, event.target.checked);
                      }}
                      color="default"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Box>
            {props.physicalStress.length > 0 && (
              <InputLabel shrink>{t("index-card.physical-stress")}</InputLabel>
            )}
            <Grid container justify="flex-start">
              {props.physicalStress.map((value, index) => {
                return (
                  <Grid item key={index} xs={2}>
                    <Checkbox
                      checked={value}
                      onChange={(event) => {
                        if (props.readonly) {
                          return;
                        }
                        props.onPhysicalStressChange(
                          index,
                          event.target.checked
                        );
                      }}
                      className={css({
                        color: theme.palette.primary.main,
                      })}
                      color="primary"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Box>
            {props.mentalStress.length > 0 && (
              <InputLabel shrink>{t("index-card.mental-stress")}</InputLabel>
            )}
            <Grid container justify="flex-start">
              {props.mentalStress.map((value, index) => {
                return (
                  <Grid item key={index} xs={2}>
                    <Checkbox
                      checked={value}
                      onChange={(event) => {
                        if (props.readonly) {
                          return;
                        }
                        props.onMentalStressChange(index, event.target.checked);
                      }}
                      className={css({
                        color: theme.palette.secondary.main,
                      })}
                      color="secondary"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Box>
            <Grid container justify="center">
              {props.consequences.map((value, index) => {
                return (
                  <Grid key={index} item xs={12}>
                    <Box py=".5rem">
                      <InputLabel shrink>
                        {t("index-card.consequence")} ({(index + 1) * 2})
                      </InputLabel>
                      <TextField
                        fullWidth
                        value={value}
                        onChange={(event) => {
                          if (props.readonly) {
                            return;
                          }
                          props.onConsequenceChange(index, event.target.value);
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
};
IndexCard.displayName = "IndexCard";
