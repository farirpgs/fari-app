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
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RemoveIcon from "@material-ui/icons/Remove";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { css } from "emotion";
import { default as React, useRef, useState } from "react";
import { AspectType } from "../../hooks/useScene/AspectType";
import { useScene } from "../../hooks/useScene/useScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { FateLabel } from "../FateLabel/FateLabel";
import { IndexCardColor, IndexCardColorTypes } from "./IndexCardColor";

export const IndexCard: React.FC<{
  readonly: boolean;
  className?: string;
  id?: string;
  aspectId: string;
  sceneManager: ReturnType<typeof useScene>;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [menuOpen, setMenuOpen] = useState(false);
  const $menu = useRef(null);
  const colorPickerBackground = theme.palette.primary.dark;
  const aspect = props.sceneManager.state.scene.aspects[props.aspectId];
  const shouldRenderCheckboxesOrConsequences =
    aspect.tracks.length > 0 || aspect.consequences.length > 0;

  const shouldRenderAspectMenuItems = aspect.type !== AspectType.Boost;
  const shouldRenderContent = aspect.type !== AspectType.Boost;
  const shouldRenderPlayedDuringTurnIcon =
    aspect.type === AspectType.NPC || aspect.type === AspectType.BadGuy;

  const isDark = theme.palette.type === "dark";

  const paperBackground = isDark
    ? IndexCardColor[aspect.color].dark
    : IndexCardColor[aspect.color].light;
  const paperColor = useTextColors(paperBackground);
  const playedDuringTurnColor = aspect.playedDuringTurn
    ? theme.palette.primary.main
    : paperColor.disabled;

  return (
    <Paper elevation={undefined} className={props.className}>
      <Box bgcolor={paperBackground} color={paperColor.primary}>
        <Box
          className={css({
            fontSize: "1.5rem",
            width: "100%",
            padding: "0.5rem 0",
            borderBottom: "1px solid #f0a4a4",
          })}
        >
          <Box p={"0 1rem 1rem 1rem"}>
            {renderHeader()}
            {renderTitle()}
          </Box>
        </Box>
        {shouldRenderContent && renderContent()}
        {shouldRenderCheckboxesOrConsequences &&
          renderCheckboxesAndConsequences()}
      </Box>
    </Paper>
  );

  function renderHeader() {
    return (
      <Grid container justify="space-between" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="overline">
            {aspect.type === AspectType.Aspect && <>{t("index-card.aspect")}</>}
            {aspect.type === AspectType.Boost && <>{t("index-card.boost")}</>}
            {aspect.type === AspectType.NPC && <>{t("index-card.npc")}</>}
            {aspect.type === AspectType.BadGuy && (
              <>{t("index-card.bad-guy")}</>
            )}
          </Typography>
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
              {shouldRenderAspectMenuItems && renderAspectMenuItems()}
              {renderGlobalMenuItems()}
            </Menu>
          </Grid>
        )}
      </Grid>
    );
  }

  function renderTitle() {
    return (
      <Grid container justify="space-between" alignItems="center" spacing={2}>
        <Grid item xs>
          <ContentEditable
            id={props.id}
            value={aspect.title}
            readonly={props.readonly}
            onChange={(newTitle) => {
              props.sceneManager.actions.updateAspectTitle(
                props.aspectId,
                newTitle
              );
            }}
          />
        </Grid>
        <Grid item>
          {shouldRenderPlayedDuringTurnIcon && (
            <IconButton
              onClick={() => {
                props.sceneManager.actions.updateAspectPlayerDuringTurn(
                  props.aspectId,
                  !aspect.playedDuringTurn
                );
              }}
              disabled={props.readonly}
              size="small"
            >
              {aspect.playedDuringTurn ? (
                <DirectionsRunIcon htmlColor={playedDuringTurnColor} />
              ) : (
                <EmojiPeopleIcon htmlColor={playedDuringTurnColor} />
              )}
            </IconButton>
          )}
        </Grid>
      </Grid>
    );
  }

  function renderAspectMenuItems() {
    return [
      <MenuItem
        key="onAddAspectFreeInvoke"
        onClick={() => {
          props.sceneManager.actions.addAspectTrack(
            props.aspectId,
            "Free Invokes"
          );
        }}
      >
        {t("index-card.add-free-invokes-track")}
      </MenuItem>,
      <MenuItem
        key="onAddAspectPhysicalStress"
        onClick={() => {
          props.sceneManager.actions.addAspectTrack(
            props.aspectId,
            "Physical Stress"
          );
        }}
      >
        {t("index-card.add-physical-stress-track")}
      </MenuItem>,
      <MenuItem
        key="onAddAspectMentalStress"
        onClick={() => {
          props.sceneManager.actions.addAspectTrack(
            props.aspectId,
            "Mental Stress"
          );
        }}
      >
        {t("index-card.add-mental-stress-track")}
      </MenuItem>,
      <MenuItem
        key="onAddConsequence"
        onClick={() => {
          props.sceneManager.actions.addAspectConsequence(props.aspectId);
        }}
      >
        {t("index-card.add-1-consequence")}
      </MenuItem>,
      <MenuItem
        key="onAddCountdown"
        onClick={() => {
          props.sceneManager.actions.addAspectTrack(props.aspectId, "...");
        }}
      >
        {t("index-card.add-track")}
      </MenuItem>,
      <Divider key="renderAspectMenuItemsDivider" />,
    ];
  }

  function renderGlobalMenuItems() {
    return [
      <MenuItem
        key="onRemove"
        onClick={() => {
          setMenuOpen(false);
          props.sceneManager.actions.removeAspect(props.aspectId);
        }}
      >
        {t("index-card.remove")}
      </MenuItem>,
      <MenuItem
        key="onReset"
        onClick={() => {
          setMenuOpen(false);
          props.sceneManager.actions.resetAspect(props.aspectId);
        }}
      >
        {t("index-card.reset")}
      </MenuItem>,
      <Divider key="renderGlobalMenuItemsDivider" light />,
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
          {Object.keys(IndexCardColor).map((c: string) => {
            const colorName = c as IndexCardColorTypes;
            return (
              <Grid item key={colorName}>
                <IconButton
                  onClick={(e) => {
                    props.sceneManager.actions.updateAspectColor(
                      props.aspectId,
                      colorName
                    );
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  size="small"
                >
                  {colorName === aspect.color ? (
                    <RadioButtonCheckedIcon
                      htmlColor={IndexCardColor[colorName].chip}
                    />
                  ) : (
                    <RadioButtonUncheckedIcon
                      htmlColor={IndexCardColor[colorName].chip}
                    />
                  )}

                  {/* <FiberManualRecordIcon
                  
                  ></FiberManualRecordIcon> */}
                </IconButton>
              </Grid>
            );
          })}
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
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Box p="0 1rem">
          <ContentEditable
            readonly={props.readonly}
            value={aspect.content}
            onChange={(newContent) => {
              props.sceneManager.actions.updateAspectContent(
                props.aspectId,
                newContent
              );
            }}
          />
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
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Box p=".5rem 1rem">
          {renderTracks()}

          <Box>
            <Grid container justify="center">
              {aspect.consequences.map((value, consequenceIndex) => {
                return (
                  <Grid key={consequenceIndex} item xs={12}>
                    <Box py=".5rem">
                      <InputLabel shrink>
                        {t("index-card.consequence")} (
                        {(consequenceIndex + 1) * 2})
                      </InputLabel>
                      <TextField
                        fullWidth
                        value={value}
                        onChange={(event) => {
                          if (props.readonly) {
                            return;
                          }
                          props.sceneManager.actions.updateAspectConsequence(
                            props.aspectId,
                            consequenceIndex,
                            event.target.value
                          );
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

  function renderTracks() {
    return (
      <Box>
        {aspect.tracks.map((stressTrack, trackIndex) => {
          return (
            <Box pb=".5rem" key={trackIndex}>
              <Grid container justify="space-between" wrap="nowrap" spacing={1}>
                <Grid item className={css({ flex: "1 1 auto" })}>
                  <FateLabel display="inline">
                    <ContentEditable
                      value={stressTrack.name}
                      readonly={props.readonly}
                      onChange={(newTrackName) => {
                        props.sceneManager.actions.updateAspectTrackName(
                          props.aspectId,
                          trackIndex,
                          newTrackName
                        );
                      }}
                    />
                  </FateLabel>
                </Grid>
                {!props.readonly && (
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={() => {
                        props.sceneManager.actions.removeAspectTrackBox(
                          props.aspectId,
                          trackIndex
                        );
                      }}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                )}
                {!props.readonly && (
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={() => {
                        props.sceneManager.actions.addAspectTrackBox(
                          props.aspectId,
                          trackIndex
                        );
                      }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                )}
                {!props.readonly && (
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={() => {
                        props.sceneManager.actions.removeAspectTrack(
                          props.aspectId,
                          trackIndex
                        );
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>

              <Grid container justify="flex-start" spacing={2}>
                {stressTrack.value.map((stressBox, boxIndex) => {
                  return (
                    <Grid item key={boxIndex}>
                      <Box
                        className={css({
                          display: "flex",
                          justifyContent: "center",
                        })}
                      >
                        <Checkbox
                          color="default"
                          size="small"
                          checked={stressBox.checked}
                          onChange={(event) => {
                            if (props.readonly) {
                              return;
                            }
                            props.sceneManager.actions.toggleAspectTrackBox(
                              props.aspectId,
                              trackIndex,
                              boxIndex
                            );
                          }}
                        />
                      </Box>
                      <Box>
                        <FateLabel className={css({ textAlign: "center" })}>
                          <ContentEditable
                            readonly={props.readonly}
                            value={stressBox.label}
                            onChange={(newBoxLabel) => {
                              props.sceneManager.actions.updateStressBoxLabel(
                                props.aspectId,
                                trackIndex,
                                boxIndex,
                                newBoxLabel
                              );
                            }}
                          />
                        </FateLabel>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}
      </Box>
    );
  }
};
