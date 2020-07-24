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
import { IAspect } from "../../hooks/useScene/IScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { FateLabel } from "../FateLabel/FateLabel";
import { IndexCardColor, IndexCardColorTypes } from "./IndexCardColor";

export const IndexCard: React.FC<{
  aspect: IAspect;
  readonly: boolean;
  className?: string;
  id?: string;
  onTitleChange(value: string): void;
  onContentChange(value: string): void;

  onAddAspectTrack(name: string): void;
  onRemoveAspectTrack(id: string): void;
  onSetAspectTrackName(index: number, newStressTrackName: string): void;
  onAddAspectTrackBox(index: number): void;
  onRemoveAspectTrackBox(index: number): void;
  onToggleAspectTrackBox(index: number, boxIndex: number): void;
  onSetStressBoxLabel(index: number, boxIndex: number, label: string): void;

  onConsequenceChange(index: number, value: string): void;
  onAddConsequence(): void;
  onUpdateAspectColor(color: IndexCardColorTypes): void;
  onPlayedInTurnOrderChange(playedDuringTurn: boolean): void;
  onRemove(): void;
  onReset(): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [menuOpen, setMenuOpen] = useState(false);
  const $menu = useRef(null);
  const colorPickerBackground = theme.palette.primary.dark;
  const shouldRenderCheckboxesOrConsequences =
    props.aspect.tracks.length > 0 || props.aspect.consequences.length > 0;

  const shouldRenderAspectMenuItems = props.aspect.type !== AspectType.Boost;
  const shouldRenderContent = props.aspect.type !== AspectType.Boost;
  const shouldRenderPlayedDuringTurnIcon =
    props.aspect.type === AspectType.NPC ||
    props.aspect.type === AspectType.BadGuy;

  const isDark = theme.palette.type === "dark";

  const paperBackground = isDark
    ? IndexCardColor[props.aspect.color].dark
    : IndexCardColor[props.aspect.color].light;
  const paperColor = useTextColors(paperBackground);
  const playedDuringTurnColor = props.aspect.playedDuringTurn
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
            {props.aspect.type === AspectType.Aspect && (
              <>{t("index-card.aspect")}</>
            )}
            {props.aspect.type === AspectType.Boost && (
              <>{t("index-card.boost")}</>
            )}
            {props.aspect.type === AspectType.NPC && <>{t("index-card.npc")}</>}
            {props.aspect.type === AspectType.BadGuy && (
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
            value={props.aspect.title}
            readonly={props.readonly}
            onChange={props.onTitleChange}
          />
        </Grid>
        <Grid item>
          {shouldRenderPlayedDuringTurnIcon && (
            <IconButton
              onClick={() => {
                props.onPlayedInTurnOrderChange(!props.aspect.playedDuringTurn);
              }}
              disabled={props.readonly}
              size="small"
            >
              {props.aspect.playedDuringTurn ? (
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
          props.onAddAspectTrack("Free Invokes");
        }}
      >
        {t("index-card.add-free-invokes-track")}
      </MenuItem>,
      <MenuItem
        key="onAddAspectPhysicalStress"
        onClick={() => {
          props.onAddAspectTrack("Physical Stress");
        }}
      >
        {t("index-card.add-physical-stress-track")}
      </MenuItem>,
      <MenuItem
        key="onAddAspectMentalStress"
        onClick={() => {
          props.onAddAspectTrack("Mental Stress");
        }}
      >
        {t("index-card.add-mental-stress-track")}
      </MenuItem>,
      <MenuItem
        key="onAddConsequence"
        onClick={() => {
          props.onAddConsequence();
        }}
      >
        {t("index-card.add-1-consequence")}
      </MenuItem>,
      <MenuItem
        key="onAddCountdown"
        onClick={() => {
          props.onAddAspectTrack("Track");
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
                    props.onUpdateAspectColor(colorName);
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  size="small"
                >
                  {colorName === props.aspect.color ? (
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
            value={props.aspect.content}
            onChange={props.onContentChange}
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
          {/* {props.aspect.tracks.map((track, trackIndex) => {
            return (
              <Box key={trackIndex}>
                {track.value.length > 0 && (
                  <InputLabel shrink>
                    <ContentEditable
                      value={track.name}
                      readonly={props.readonly}
                      onChange={(newTrackName) => {
                        props.onSetAspectTrackName(trackIndex, newTrackName);
                      }}
                    />
                  </InputLabel>
                )}
                <Grid container justify="flex-start">
                  {track.value.map((value, boxIndex) => {
                    return (
                      <Grid item key={boxIndex} xs={2}>
                        <Checkbox
                          checked={value.checked}
                          onChange={(event) => {
                            if (props.readonly) {
                              return;
                            }
                            props.onToggleAspectTrackBox(trackIndex, boxIndex);
                          }}
                          color="default"
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            );
          })} */}
          <Box>
            <Grid container justify="center">
              {props.aspect.consequences.map((value, index) => {
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

  function renderTracks() {
    return (
      <Box>
        {props.aspect.tracks.map((stressTrack, trackIndex) => {
          return (
            <Box pb=".5rem" key={trackIndex}>
              <Grid container justify="space-between" wrap="nowrap" spacing={2}>
                <Grid item className={css({ flex: "1 0 auto" })}>
                  <FateLabel display="inline">
                    <ContentEditable
                      value={stressTrack.name}
                      readonly={props.readonly}
                      onChange={(newTrackName) => {
                        props.onSetAspectTrackName(trackIndex, newTrackName);
                      }}
                    />
                  </FateLabel>
                </Grid>
                {!props.readonly && (
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={() => {
                        props.onRemoveAspectTrackBox(trackIndex);
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
                        props.onAddAspectTrackBox(trackIndex);
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
                        props.onRemoveAspectTrack(trackIndex);
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
                            props.onToggleAspectTrackBox(trackIndex, boxIndex);
                          }}
                        />
                      </Box>
                      <Box>
                        <FateLabel className={css({ textAlign: "center" })}>
                          <ContentEditable
                            readonly={props.readonly}
                            value={stressBox.label}
                            onChange={(value) => {
                              props.onSetStressBoxLabel(
                                trackIndex,
                                boxIndex,
                                value
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
