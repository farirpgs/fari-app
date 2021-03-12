import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import useTheme from "@material-ui/core/styles/useTheme";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import DeleteIcon from "@material-ui/icons/Delete";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PaletteIcon from "@material-ui/icons/Palette";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RemoveIcon from "@material-ui/icons/Remove";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { default as React, useRef, useState } from "react";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";
import { IRollDiceOptions } from "../../domains/dice/Dice";
import { AspectType } from "../../hooks/useScene/AspectType";
import { useScene } from "../../hooks/useScene/useScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { BetterDnd } from "../../routes/Character/components/BetterDnD/BetterDnd";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { DrawArea } from "../DrawArea/DrawArea";
import { FateLabel } from "../FateLabel/FateLabel";
import { IndexCardSkills } from "./domains/IndexCardSkills";
import { IndexCardColor, IndexCardColorTypes } from "./IndexCardColor";

export const IndexCard: React.FC<
  {
    readonly: boolean;
    className?: string;
    id?: string;
    index: number;
    aspectId: string;
    sceneManager: ReturnType<typeof useScene>;
    showClickableSkills: boolean;
    onRoll(options: IRollDiceOptions): void;
    onMove(dragIndex: number, hoverIndex: number): void;
  } & IDataCyProps
> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const $paletteButton = useRef<HTMLButtonElement | null>(null);
  const $menu = useRef(null);
  const colorPickerBackground = theme.palette.primary.dark;
  const aspect = props.sceneManager.state.scene.aspects[props.aspectId];
  const indexCardSkills = IndexCardSkills.getSkills(aspect.content);

  const shouldRenderCheckboxesOrConsequences =
    aspect.tracks.length > 0 || aspect.consequences.length > 0;

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
    <Paper elevation={aspect.pinned ? 8 : 1} className={props.className}>
      <Box
        bgcolor={paperBackground}
        color={paperColor.primary}
        position="relative"
      >
        <BetterDnd
          key={props.aspectId}
          index={props.index}
          type={"scene-aspects"}
          readonly={false}
          dragIndicatorClassName={css({
            position: "absolute",
            marginTop: "1rem",
            marginLeft: ".5rem",
          })}
          onMove={(dragIndex, hoverIndex) => {
            props.onMove(dragIndex, hoverIndex);
          }}
        >
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
          {renderContent()}
          {shouldRenderCheckboxesOrConsequences &&
            renderCheckboxesAndConsequences()}
          {renderSkills()}
          <Collapse in={aspect.hasDrawArea}>
            <Box>
              <DrawArea
                objects={aspect!.drawAreaObjects}
                onChange={(objects) => {
                  if (!aspect.hasDrawArea) {
                    return;
                  }
                  props.sceneManager.actions.setAspectDrawAreaObjects(
                    props.aspectId,
                    objects
                  );
                }}
                readonly={props.readonly}
              />
            </Box>
          </Collapse>
          {!props.readonly && (
            <Box py=".5rem" px="1rem">
              <Grid container wrap="nowrap" justify="flex-end" spacing={1}>
                <Grid item>
                  <Tooltip
                    title={
                      aspect.isPrivate
                        ? t("index-card.show")
                        : t("index-card.hide")
                    }
                  >
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.menu.visibility`}
                      onClick={() => {
                        props.sceneManager.actions.setAspectIsPrivate(
                          props.aspectId,
                          !aspect.isPrivate
                        );
                      }}
                    >
                      {aspect.isPrivate ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title={t("index-card.reset")}>
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.reset`}
                      onClick={() => {
                        props.sceneManager.actions.resetAspect(props.aspectId);
                      }}
                    >
                      <RotateLeftIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  {/* <Tooltip title={t("index-card.reset")}> */}
                  <IconButton
                    size="small"
                    ref={$paletteButton}
                    data-cy={`${props["data-cy"]}.palette`}
                    onClick={() => {
                      setColorPickerOpen(true);
                    }}
                  >
                    <PaletteIcon />
                  </IconButton>
                  <Popover
                    open={colorPickerOpen}
                    anchorEl={$paletteButton.current}
                    onClose={() => {
                      setColorPickerOpen(false);
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <ColorPicker
                      value={
                        IndexCardColor[aspect.color as IndexCardColorTypes].chip
                      }
                      colors={Object.keys(IndexCardColor).map((colorName) => {
                        const colorInfo =
                          IndexCardColor[colorName as IndexCardColorTypes];
                        return colorInfo.chip;
                      })}
                      hideCustom
                      onChange={(color) => {
                        const newColor = Object.keys(IndexCardColor).find(
                          (colorName) => {
                            const colorInfo =
                              IndexCardColor[colorName as IndexCardColorTypes];

                            return colorInfo.chip === color;
                          }
                        ) as IndexCardColorTypes;

                        props.sceneManager.actions.updateAspectColor(
                          props.aspectId,
                          newColor
                        );
                        setColorPickerOpen(false);
                      }}
                    />
                  </Popover>
                  {/* </Tooltip> */}
                </Grid>
                <Grid item>
                  <Tooltip title={t("index-card.remove")}>
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.remove`}
                      onClick={() => {
                        props.sceneManager.actions.removeAspect(props.aspectId);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          )}
        </BetterDnd>
      </Box>
    </Paper>
  );

  function renderSkills() {
    const hasSkills = indexCardSkills.length > 0;
    return (
      <Collapse in={hasSkills && !props.readonly && props.showClickableSkills}>
        <Box px="1rem" py=".5rem">
          <Grid container spacing={1} alignItems="center">
            {indexCardSkills.map((skill, skillIndex) => {
              return (
                <Grid item key={skillIndex}>
                  <Link
                    className={css([
                      {
                        cursor: props.readonly ? "inherit" : "pointer",
                      },
                      props.readonly && {
                        "color": theme.palette.text.primary,
                        "&:hover": {
                          textDecoration: "none",
                        },
                      },
                    ])}
                    data-cy={`index-card.skill.${skill.label}`}
                    onClick={() => {
                      if (props.readonly) {
                        return;
                      }
                      const bonus = parseInt(skill.modifier) || 0;
                      props.onRoll({
                        bonusLabel: skill.label,
                        bonus: bonus,
                        pool: false,
                      });
                    }}
                  >
                    {skill.label} ({skill.modifier})
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Collapse>
    );
  }

  function renderHeader() {
    return (
      <Box ml="1rem">
        <Grid container alignItems="center" spacing={1}>
          <Grid item className={css({ flex: "1 0 auto" })}>
            <Typography
              variant="overline"
              className={css({
                fontWeight: aspect.pinned ? "bold" : "inherit",
                transition: theme.transitions.create("font-weight"),
              })}
            >
              {aspect.type === AspectType.Aspect && (
                <>{t("index-card.aspect")}</>
              )}
              {aspect.type === AspectType.Boost && <>{t("index-card.boost")}</>}
              {aspect.type === AspectType.NPC && <>{t("index-card.npc")}</>}
              {aspect.type === AspectType.BadGuy && (
                <>{t("index-card.bad-guy")}</>
              )}
            </Typography>
          </Grid>
          {!props.readonly && (
            <>
              <Grid item>
                <Tooltip
                  title={
                    aspect.pinned ? t("index-card.unpin") : t("index-card.pin")
                  }
                >
                  <IconButton
                    ref={$menu}
                    size="small"
                    data-cy={`${props["data-cy"]}.pin`}
                    onClick={() => {
                      props.sceneManager.actions.toggleAspectPinned(
                        props.aspectId
                      );
                    }}
                  >
                    {aspect.pinned ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <IconButton
                  ref={$menu}
                  size="small"
                  data-cy={`${props["data-cy"]}.menu`}
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
                  {renderAspectMenuItems()}
                </Menu>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    );
  }

  function renderTitle() {
    return (
      <Grid container justify="space-between" alignItems="center" spacing={2}>
        <Grid item xs>
          <ContentEditable
            id={props.id}
            data-cy={`${props["data-cy"]}.title`}
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
              data-cy={`${props["data-cy"]}.initiative`}
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
        data-cy={`${props["data-cy"]}.menu.free-invokes`}
        onClick={() => {
          props.sceneManager.actions.addAspectTrack(
            props.aspectId,
            t("index-card.free-invokes")
          );
        }}
      >
        {t("index-card.add-free-invokes-track")}
      </MenuItem>,
      <MenuItem
        key="onAddAspectPhysicalStress"
        data-cy={`${props["data-cy"]}.menu.physical-stress`}
        onClick={() => {
          props.sceneManager.actions.addAspectTrack(
            props.aspectId,
            t("index-card.physical-stress")
          );
        }}
      >
        {t("index-card.add-physical-stress-track")}
      </MenuItem>,
      <MenuItem
        key="onAddAspectMentalStress"
        data-cy={`${props["data-cy"]}.menu.mental-stress`}
        onClick={() => {
          props.sceneManager.actions.addAspectTrack(
            props.aspectId,
            t("index-card.mental-stress")
          );
        }}
      >
        {t("index-card.add-mental-stress-track")}
      </MenuItem>,
      <MenuItem
        key="onAddConsequence"
        data-cy={`${props["data-cy"]}.menu.consequence`}
        onClick={() => {
          props.sceneManager.actions.addAspectConsequence(props.aspectId);
        }}
      >
        {t("index-card.add-1-consequence")}
      </MenuItem>,
      <MenuItem
        key="onAddCountdown"
        data-cy={`${props["data-cy"]}.menu.track`}
        onClick={() => {
          props.sceneManager.actions.addAspectTrack(props.aspectId, "Track");
        }}
      >
        {t("index-card.add-track")}
      </MenuItem>,
      // <MenuItem
      //   key="addAspectDrawArea"
      //   onClick={() => {
      //     props.sceneManager.actions.addAspectDrawArea(props.aspectId);
      //   }}
      // >
      //   {t("index-card.add-draw-area")}
      // </MenuItem>,
    ];
  }

  function renderGlobalMenuItems() {
    return [
      // <Divider key="renderGlobalMenuItemsDivider" light />,
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
                  data-cy={`${props["data-cy"]}.menu.color.${colorName}`}
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
        <Box px="1rem">
          <Typography variant="overline">
            {aspect.type === AspectType.NPC ||
            aspect.type === AspectType.BadGuy ? (
              <>
                {t("index-card.aspects")} {" & "}
                {t("index-card.notes")}
              </>
            ) : (
              <>{t("index-card.notes")}</>
            )}
          </Typography>
        </Box>

        <Box p="0 1rem">
          <ContentEditable
            data-cy={`${props["data-cy"]}.content`}
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
          {renderConsequences()}
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
                  <FateLabel display="inline" variant="caption">
                    <ContentEditable
                      data-cy={`${props["data-cy"]}.stressTrack.${stressTrack.name}.name`}
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
                      data-cy={`${props["data-cy"]}.stressTrack.${stressTrack.name}.remove-box`}
                      onClick={() => {
                        props.sceneManager.actions.removeAspectTrackBox(
                          props.aspectId,
                          trackIndex
                        );
                      }}
                    >
                      <RemoveCircleOutlineIcon
                        className={css({
                          width: "1rem",
                          height: "1rem",
                        })}
                      />
                    </IconButton>
                  </Grid>
                )}
                {!props.readonly && (
                  <Grid item>
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.stressTrack.${stressTrack.name}.add-box`}
                      onClick={() => {
                        props.sceneManager.actions.addAspectTrackBox(
                          props.aspectId,
                          trackIndex
                        );
                      }}
                    >
                      <AddCircleOutlineIcon
                        className={css({
                          width: "1rem",
                          height: "1rem",
                        })}
                      />
                    </IconButton>
                  </Grid>
                )}
                {!props.readonly && (
                  <Grid item>
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.stressTrack.${stressTrack.name}.remove`}
                      onClick={() => {
                        props.sceneManager.actions.removeAspectTrack(
                          props.aspectId,
                          trackIndex
                        );
                      }}
                    >
                      <RemoveIcon
                        className={css({
                          width: "1rem",
                          height: "1rem",
                        })}
                      />
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
                          data-cy={`${props["data-cy"]}.stressTrack.${stressTrack.name}.box.${boxIndex}`}
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
                        <FateLabel
                          variant="caption"
                          className={css({ textAlign: "center" })}
                        >
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

  function renderConsequences() {
    return (
      <Box>
        <Grid container justify="center">
          {aspect.consequences.map((consequence, consequenceIndex) => {
            const name =
              consequence.name ||
              `${t("index-card.consequence")}  (${(consequenceIndex + 1) * 2})`;
            const value = consequence.value;

            return (
              <Grid key={consequenceIndex} item xs={12}>
                <Box py=".5rem">
                  <Grid container>
                    <Grid item className={css({ flex: "1 1 auto" })}>
                      <FateLabel variant="caption">
                        <ContentEditable
                          data-cy={`${props["data-cy"]}.consequence.${name}.name`}
                          value={name}
                          readonly={props.readonly}
                          onChange={(newName) => {
                            props.sceneManager.actions.updateAspectConsequenceName(
                              props.aspectId,
                              consequenceIndex,
                              newName
                            );
                          }}
                        />
                      </FateLabel>
                    </Grid>
                    <Grid item>
                      <IconButton
                        size="small"
                        data-cy={`${props["data-cy"]}.consequence.${name}.remove`}
                        onClick={() => {
                          props.sceneManager.actions.removeAspectConsequence(
                            props.aspectId,
                            consequenceIndex
                          );
                        }}
                      >
                        <RemoveIcon
                          className={css({
                            width: "1rem",
                            height: "1rem",
                          })}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    value={value}
                    onChange={(event) => {
                      if (props.readonly) {
                        return;
                      }
                      props.sceneManager.actions.updateAspectConsequenceValue(
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
    );
  }
};
