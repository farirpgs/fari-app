import { css } from "@emotion/css";
import { Collapse, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import DeleteIcon from "@material-ui/icons/Delete";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PaletteIcon from "@material-ui/icons/Palette";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import produce from "immer";
import { default as React, useRef, useState } from "react";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";
import { useLazyState } from "../../hooks/useLazyState/useLazyState";
import { AspectType } from "../../hooks/useScene/AspectType";
import { IIndexCard } from "../../hooks/useScene/IScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { BetterDnd } from "../../routes/Character/components/BetterDnD/BetterDnd";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { IndexCardSkills } from "./domains/IndexCardSkills";
import { IndexCardColor, IndexCardColorTypes } from "./IndexCardColor";

export const IndexCard: React.FC<
  {
    readonly: boolean;
    className?: string;
    id?: string;
    index: number;
    indexCard: IIndexCard;
    showClickableSkills: boolean;
    onChange(IIndexCard);
    onRoll(modifierLabel: string, modifierValue: number): void;
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
  const indexCardSkills = IndexCardSkills.getSkills(props.indexCard.content);

  const shouldRenderPlayedDuringTurnIcon =
    props.indexCard.type === AspectType.NPC ||
    props.indexCard.type === AspectType.BadGuy;

  const [indexCard, setIndexCard] = useLazyState({
    value: props.indexCard,
    onChange: (newIndexCard) => {
      props.onChange(newIndexCard);
    },
    delay: 750,
  });

  const isDark = theme.palette.type === "dark";
  const paperBackground = isDark
    ? IndexCardColor[props.indexCard.color].dark
    : IndexCardColor[props.indexCard.color].light;
  const paperColor = useTextColors(paperBackground);
  const playedDuringTurnColor = props.indexCard.playedDuringTurn
    ? theme.palette.primary.main
    : paperColor.disabled;

  return (
    <Paper
      elevation={props.indexCard.pinned ? 8 : 1}
      className={props.className}
    >
      <Box
        bgcolor={paperBackground}
        color={paperColor.primary}
        position="relative"
      >
        <BetterDnd
          key={props.indexCard.id}
          index={props.index}
          type={"index-cards"}
          readonly={false}
          dragIndicatorClassName={css({
            position: "absolute",
            marginTop: "1rem",
            marginLeft: ".5rem",
            display: props.readonly ? "none" : "blockl",
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

          {renderSkills()}
          {!props.readonly && (
            <Box py=".5rem" px="1rem">
              <Grid container wrap="nowrap" justify="flex-end" spacing={1}>
                <Grid item>
                  <Tooltip
                    title={
                      props.indexCard.isPrivate
                        ? t("index-card.show")
                        : t("index-card.hide")
                    }
                  >
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.menu.visibility`}
                      onClick={() => {
                        setIndexCard(
                          produce((draft: IIndexCard) => {
                            draft.isPrivate = !draft.isPrivate;
                          })
                        );
                      }}
                    >
                      {props.indexCard.isPrivate ? (
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
                        IndexCardColor[
                          props.indexCard.color as IndexCardColorTypes
                        ].chip
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
                      const modifier = parseInt(skill.modifier) || 0;
                      props.onRoll(skill.label, modifier);
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
      <Box ml={props.readonly ? "0" : "1rem"}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item className={css({ flex: "1 0 auto" })}>
            <Typography
              variant="overline"
              className={css({
                fontWeight: props.indexCard.pinned ? "bold" : "inherit",
                transition: theme.transitions.create("font-weight"),
              })}
            >
              {props.indexCard.type === AspectType.Aspect && (
                <>{t("index-card.aspect")}</>
              )}
              {props.indexCard.type === AspectType.Boost && (
                <>{t("index-card.boost")}</>
              )}
              {props.indexCard.type === AspectType.NPC && (
                <>{t("index-card.npc")}</>
              )}
              {props.indexCard.type === AspectType.BadGuy && (
                <>{t("index-card.bad-guy")}</>
              )}
            </Typography>
          </Grid>
          {!props.readonly && (
            <>
              <Grid item>
                <Tooltip
                  title={
                    // TODO: INSPECT
                    props.indexCard.pinned
                      ? t("index-card.unpin")
                      : t("index-card.pin")
                  }
                >
                  <IconButton
                    ref={$menu}
                    size="small"
                    data-cy={`${props["data-cy"]}.pin`}
                    onClick={() => {
                      setIndexCard(
                        produce((draft: IIndexCard) => {
                          draft.pinned = !draft.pinned;
                        })
                      );
                    }}
                  >
                    {props.indexCard.pinned ? (
                      <BookmarkIcon />
                    ) : (
                      <BookmarkBorderIcon />
                    )}
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
            value={props.indexCard.title}
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
            <Tooltip
              title={
                props.indexCard.playedDuringTurn
                  ? t("player-row.played")
                  : t("player-row.not-played")
              }
            >
              <span>
                <IconButton
                  data-cy={`${props["data-cy"]}.initiative`}
                  onClick={() => {
                    props.sceneManager.actions.updateAspectPlayerDuringTurn(
                      props.aspectId,
                      !props.indexCard.playedDuringTurn
                    );
                  }}
                  disabled={props.readonly}
                  size="small"
                >
                  {props.indexCard.playedDuringTurn ? (
                    <DirectionsRunIcon htmlColor={playedDuringTurnColor} />
                  ) : (
                    <EmojiPeopleIcon htmlColor={playedDuringTurnColor} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
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
                  {colorName === props.indexCard.color ? (
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
            {props.indexCard.type === AspectType.NPC ||
            props.indexCard.type === AspectType.BadGuy ? (
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
            value={props.indexCard.content}
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
};
