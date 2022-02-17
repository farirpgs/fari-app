import { css } from "@emotion/css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import EditAttributesOutlinedIcon from "@mui/icons-material/EditAttributesOutlined";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PaletteIcon from "@mui/icons-material/Palette";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import { darken, lighten, ThemeProvider, useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { default as React, useContext, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { Delays } from "../../constants/Delays";
import { FontFamily } from "../../constants/FontFamily";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";
import { IDiceRollResult, IRollGroup } from "../../domains/dice/Dice";
import { DragAndDropTypes } from "../../domains/drag-and-drop/DragAndDropTypes";
import { useLazyState } from "../../hooks/useLazyState/useLazyState";
import { useResponsiveValue } from "../../hooks/useResponsiveValue/useResponsiveValue";
import { IIndexCard, IIndexCardType } from "../../hooks/useScene/IScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useThemeFromColor } from "../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { BetterDnd } from "../../routes/Character/components/BetterDnD/BetterDnd";
import { AddBlock } from "../../routes/Character/components/CharacterDialog/components/AddBlock";
import { BlockByType } from "../../routes/Character/components/CharacterDialog/components/BlockByType";
import { IDicePoolElement } from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { ConditionalWrapper } from "../ConditionalWrapper/ConditionalWrapper";
import {
  ContentEditable,
  previewContentEditable,
} from "../ContentEditable/ContentEditable";
import { IndexCardSkills } from "./domains/IndexCardSkills";
import { useIndexCard } from "./hooks/useIndexCard";
import { IndexCardColor, IndexCardColorTypes } from "./IndexCardColor";

function FariPopper(props: {
  renderAnchor: (renderProps: {
    open: boolean;
    anchorEl: any;
    handleOnOpen(event: any): void;
    handleOnClose(): void;
  }) => JSX.Element;
  renderPopper: (renderProps: {
    open: boolean;
    anchorEl: any;
    handleOnOpen(event: any): void;
    handleOnClose(): void;
  }) => JSX.Element;
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleOnOpen(event: any) {
    setAnchorEl(event.currentTarget);
  }

  function handleOnClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);

  return (
    <>
      {props.renderAnchor({
        open: open,
        anchorEl: anchorEl,
        handleOnOpen: handleOnOpen,
        handleOnClose: handleOnClose,
      })}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleOnClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {props.renderPopper({
          open: open,
          anchorEl: anchorEl,
          handleOnOpen: handleOnOpen,
          handleOnClose: handleOnClose,
        })}
      </Popover>
    </>
  );
}

export const IndexCard: React.FC<
  {
    // readonly?: boolean;
    className?: string;
    id: string;
    type?: IIndexCardType;
    indexCard: IIndexCard;
    parentIndexCard?: IIndexCard;
    allCards: Array<IIndexCard>;
    reactDndIndex: number;
    reactDndType: string;
    canMove: boolean;
    isGM: boolean;
    indexCardHiddenRecord?: Record<string, boolean>;
    onPoolClick(element: IDicePoolElement): void;
    onChange(newIndexCard: IIndexCard): void;
    onMoveTo?(idOfIndexCardToMove: string, idOfIndexCardToMoveTo: string): void;
    onRoll(diceRollResult: IDiceRollResult): void;
    onMove(dragIndex: number, hoverIndex: number): void;
    onRemove(): void;
    onDuplicate(): void;
    onTogglePrivate?(): void;
    onToggleVisibility?(indexCard: IIndexCard): void;
  } & IDataCyProps
> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const $paletteButton = useRef<HTMLButtonElement | null>(null);
  const $menu = useRef(null);
  const indexCardManager = useIndexCard({
    indexCard: props.indexCard,
    onChange: props.onChange,
  });
  const hasSubCards = indexCardManager.state.indexCard.subCards.length > 0;
  const isSubCard = indexCardManager.state.indexCard.sub;

  const indexCardSkills = IndexCardSkills.getSkills(
    indexCardManager.state.indexCard.content
  );
  const diceManager = useContext(DiceContext);
  const [advanced, setAdvanced] = useState(false);
  const open = !props.indexCardHiddenRecord?.[props.indexCard.id];
  const numberOfColumnsForSubCards = useResponsiveValue({
    xl: 3,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1,
  });

  const paper = useTextColors(
    theme.palette.mode === "light"
      ? indexCardManager.state.indexCard.color
      : darken(indexCardManager.state.indexCard.color, 0.5)
  );

  const defaultButtonTheme = useThemeFromColor(paper.primary);

  return (
    <Paper
      elevation={indexCardManager.state.indexCard.pinned ? 4 : 2}
      className={props.className}
    >
      <Box
        pb={!props.isGM ? "1rem" : "0"}
        bgcolor={paper.bgColor}
        color={paper.primary}
        onClick={() => {
          setHover(true);
        }}
        onPointerEnter={() => {
          setHover(true);
        }}
        onPointerLeave={() => {
          setHover(false);
        }}
        position="relative"
      >
        <ConditionalWrapper
          condition={props.canMove}
          wrapper={(children) => {
            return (
              <BetterDnd
                direction="horizontal"
                key={indexCardManager.state.indexCard.id}
                index={props.reactDndIndex}
                type={props.reactDndType}
                onMove={(dragIndex, hoverIndex) => {
                  props.onMove(dragIndex, hoverIndex);
                }}
                render={(dndRenderProps) => {
                  return (
                    <>
                      <div ref={dndRenderProps.drag}>
                        <Tooltip title={t("character-dialog.control.move")}>
                          <IconButton
                            size="small"
                            className={css({
                              position: "absolute",
                              marginTop: ".5rem",
                              marginLeft: ".25rem",
                              cursor: "drag",
                              display:
                                !props.canMove || !props.isGM
                                  ? "none"
                                  : "block",
                            })}
                          >
                            <DragIndicatorIcon
                              className={css({
                                transition: theme.transitions.create("color"),
                              })}
                              htmlColor={
                                dndRenderProps.isOver
                                  ? paper.primary
                                  : paper.secondary
                              }
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                      {children}
                    </>
                  );
                }}
              />
            );
          }}
        >
          <Box>
            <Grid container>
              <Grid item xs={12} lg={hasSubCards ? 3 : 12}>
                <Box display="flex" height="100%" flexDirection="column">
                  <ThemeProvider theme={defaultButtonTheme}>
                    <Box
                      className={css({
                        fontSize: "1.5rem",
                        width: "100%",
                        padding: "0.5rem 0",
                        borderBottom: `1px solid ${
                          indexCardManager.state.indexCard.color === "#fff"
                            ? "#f0a4a4"
                            : paper.primary
                        }`,
                      })}
                    >
                      <Box px="1rem">
                        {renderHeader()}
                        {renderTitle()}
                      </Box>
                    </Box>
                    <Collapse in={open}>
                      <Box>
                        <Box>{renderContent()}</Box>
                        <Box>{renderBlocks()}</Box>
                      </Box>
                    </Collapse>
                    {renderSkills()}
                    {renderGMActions()}
                  </ThemeProvider>
                </Box>
              </Grid>
              {hasSubCards && (
                <Grid
                  item
                  xs={12}
                  lg={9}
                  className={css({
                    background:
                      paper.type === "light"
                        ? darken(paper.bgColor, 0.1)
                        : lighten(paper.bgColor, 0.2),
                  })}
                >
                  {renderSubCards()}
                </Grid>
              )}
            </Grid>
          </Box>
        </ConditionalWrapper>
      </Box>
    </Paper>
  );

  function renderGMActions() {
    return (
      <Fade in={hover}>
        <Box
          py=".5rem"
          px="1rem"
          display="flex"
          alignItems="flex-end"
          flex="1 0 auto"
        >
          <Grid
            container
            wrap="nowrap"
            justifyContent="space-between"
            spacing={1}
          >
            <Grid item container justifyContent="flex-start" spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  ref={$paletteButton}
                  data-cy={`${props["data-cy"]}.palette`}
                  onClick={() => {
                    setColorPickerOpen((prev) => !prev);
                  }}
                >
                  {colorPickerOpen ? (
                    <PaletteIcon htmlColor={paper.secondary} />
                  ) : (
                    <PaletteOutlinedIcon htmlColor={paper.secondary} />
                  )}
                </IconButton>
                <Popover
                  open={colorPickerOpen}
                  anchorEl={$paletteButton.current}
                  onClose={() => {
                    setColorPickerOpen(false);
                  }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <IndexCardColorPicker
                    color={indexCardManager.state.indexCard.color}
                    onChange={(color) =>
                      indexCardManager.actions.setColor(color)
                    }
                  />
                </Popover>
              </Grid>
              {!isSubCard && (
                <Grid item>
                  <Tooltip title={t("character-dialog.control.add-sub-card")}>
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.menu.add-sub-card`}
                      onClick={() => {
                        indexCardManager.actions.addSubCard();
                      }}
                    >
                      <PostAddIcon htmlColor={paper.primary} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
              <Grid item>
                <Tooltip title={t("character-dialog.control.advanced-mode")}>
                  <IconButton
                    size="small"
                    data-cy={`${props["data-cy"]}.menu.advanced`}
                    onClick={() => {
                      setAdvanced((prev) => !prev);
                    }}
                  >
                    {advanced ? (
                      <EditAttributesIcon htmlColor={paper.primary} />
                    ) : (
                      <EditAttributesOutlinedIcon htmlColor={paper.primary} />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item container justifyContent="center" spacing={1}>
              <Grid item>
                <Tooltip title={t("index-card.add-block")}>
                  <span>
                    <AddBlock
                      variant="icon"
                      onAddBlock={(blockType) => {
                        indexCardManager.actions.addBlock(blockType);

                        if (!open) {
                          props.onToggleVisibility?.(
                            indexCardManager.state.indexCard
                          );
                        }

                        setAdvanced(true);
                      }}
                    />
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item container justifyContent="flex-end" spacing={1}>
              {props.isGM && (
                <Grid item>
                  <Tooltip title={t("index-card.duplicate")}>
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.duplicate`}
                      onClick={() => {
                        props.onDuplicate();
                      }}
                    >
                      <FileCopyIcon htmlColor={paper.primary} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
              {props.isGM && props.onMoveTo && (
                <Grid item>
                  <FariPopper
                    renderPopper={(renderProps) => {
                      const cardsForSelect = props.allCards.filter((c) => {
                        const isCurrent =
                          c.id !== indexCardManager.state.indexCard.id;
                        const isParent = c.id !== props.parentIndexCard?.id;
                        return isCurrent && isParent;
                      });
                      return (
                        <Box p="1rem" minWidth="200px">
                          <FormControl fullWidth variant="standard">
                            <InputLabel>{t("index-card.move-to")}</InputLabel>

                            <Select
                              fullWidth
                              native
                              inputProps={{
                                ["data-cy"]: "app.languages",
                              }}
                              onChange={(e) => {
                                renderProps.handleOnClose();
                                if (e.target.value) {
                                  props.onMoveTo?.(
                                    indexCardManager.state.indexCard.id,
                                    e.target.value as string
                                  );
                                }
                              }}
                              variant="standard"
                            >
                              <option value="" />
                              {cardsForSelect.map((card) => {
                                const value = previewContentEditable({
                                  value: card.title,
                                });
                                return (
                                  <option key={card.id} value={card.id}>
                                    {value}
                                  </option>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Box>
                      );
                    }}
                    renderAnchor={(renderProps) => {
                      return (
                        <Tooltip title={t("index-card.move-to")}>
                          <span>
                            <IconButton
                              disabled={hasSubCards}
                              size="small"
                              data-cy={`${props["data-cy"]}.move`}
                              onClick={(event) => {
                                renderProps.handleOnOpen(event);
                              }}
                            >
                              <ControlCameraIcon
                                htmlColor={
                                  hasSubCards ? paper.disabled : paper.primary
                                }
                              />
                            </IconButton>
                          </span>
                        </Tooltip>
                      );
                    }}
                  />
                </Grid>
              )}

              {props.isGM && (
                <Grid item>
                  <Tooltip title={t("index-card.remove")}>
                    <IconButton
                      size="small"
                      data-cy={`${props["data-cy"]}.remove`}
                      onClick={() => {
                        const confirmed = confirm(
                          t("index-card.remove-confirmation")
                        );
                        if (confirmed) {
                          props.onRemove();
                        }
                      }}
                    >
                      <DeleteIcon htmlColor={paper.primary} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </Fade>
    );
  }

  function renderSubCards() {
    return (
      <Box px="1rem" py="1rem">
        <ImageList
          variant={"standard"}
          cols={numberOfColumnsForSubCards}
          gap={16}
          className={css({
            // padding: "1rem 1rem", // for boxShadow padding
            // margin: "-1rem -1rem", // for boxShadow padding
          })}
        >
          {indexCardManager.state.indexCard.subCards?.map(
            (subCard, subCardIndex) => {
              return (
                <ImageListItem
                  key={subCard.id}
                  cols={1}
                  className={css({
                    width: "100%",
                    paddingTop: ".25rem",
                    paddingBottom: ".25rem",
                  })}
                >
                  <IndexCard
                    indexCard={subCard}
                    isGM={props.isGM}
                    parentIndexCard={indexCardManager.state.indexCard}
                    allCards={props.allCards}
                    id={`index-card-${subCard.id}`}
                    reactDndType={`${DragAndDropTypes.SceneIndexCardsSubCards}.${indexCardManager.state.indexCard.id}`}
                    canMove={true}
                    reactDndIndex={subCardIndex}
                    onPoolClick={props.onPoolClick}
                    onRoll={props.onRoll}
                    indexCardHiddenRecord={props.indexCardHiddenRecord}
                    onToggleVisibility={props.onToggleVisibility}
                    onMoveTo={(idOfIndexCardToMove, idOfIndexCardToMoveTo) => {
                      props.onMoveTo?.(
                        idOfIndexCardToMove,
                        idOfIndexCardToMoveTo
                      );
                    }}
                    onMove={(dragIndex, hoverIndex) => {
                      indexCardManager.actions.moveIndexCard(
                        dragIndex,
                        hoverIndex
                      );
                    }}
                    onChange={(newIndexCard) => {
                      indexCardManager.actions.updateIndexCard(newIndexCard);
                    }}
                    onDuplicate={() => {
                      indexCardManager.actions.duplicateIndexCard(subCard);
                    }}
                    onRemove={() => {
                      indexCardManager.actions.removeIndexCard(subCard.id);
                    }}
                  />
                </ImageListItem>
              );
            }
          )}
        </ImageList>
      </Box>
    );
  }

  function renderBlocks() {
    if (indexCardManager.state.indexCard.blocks.length === 0) {
      return null;
    }

    return (
      <Box px="1rem" py=".5rem">
        {indexCardManager.state.indexCard.blocks.map((block, blockIndex) => {
          return (
            <Box key={block.id} mb=".5rem">
              <BetterDnd
                direction="vertical"
                index={blockIndex}
                type={`${DragAndDropTypes.SceneIndexCardsBlocks}.${indexCardManager.state.indexCard.id}`}
                onMove={(dragIndex, hoverIndex) => {
                  indexCardManager.actions.moveIndexCardBlock(
                    dragIndex,
                    hoverIndex
                  );
                }}
                render={(dndRenderProps) => {
                  return (
                    <Box>
                      <Grid container wrap="nowrap" spacing={1}>
                        {advanced && (
                          <Grid item>
                            <div ref={dndRenderProps.drag}>
                              <Tooltip
                                title={t("character-dialog.control.move")}
                              >
                                <IconButton
                                  size="small"
                                  className={css({
                                    cursor: "drag",
                                    display: "block",
                                  })}
                                >
                                  <DragIndicatorIcon
                                    className={css({
                                      transition:
                                        theme.transitions.create("color"),
                                    })}
                                    htmlColor={
                                      dndRenderProps.isOver
                                        ? paper.primary
                                        : paper.secondary
                                    }
                                  />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </Grid>
                        )}
                        <Grid item xs>
                          <BlockByType
                            advanced={advanced}
                            hideHelp
                            readonly={false}
                            dataCy={`index-card.${block.label}`}
                            block={block}
                            onChange={(newBlock) => {
                              indexCardManager.actions.setBlock(newBlock);
                            }}
                            onRoll={(diceRollResult) => {
                              props.onRoll(diceRollResult);
                            }}
                            otherActions={
                              <>
                                <Grid item>
                                  <Link
                                    component="button"
                                    variant="caption"
                                    color="inherit"
                                    data-cy={`index-card.${block.label}.duplicate`}
                                    className={css({
                                      label: "CharacterDialog-duplicate",
                                    })}
                                    onClick={() => {
                                      indexCardManager.actions.duplicateBlock(
                                        block
                                      );
                                    }}
                                    underline="hover"
                                  >
                                    {t("character-dialog.control.duplicate")}
                                  </Link>
                                </Grid>
                                <Grid item>
                                  <Link
                                    component="button"
                                    variant="caption"
                                    color="inherit"
                                    data-cy={`index-card.${block.label}.remove`}
                                    className={css({
                                      label: "CharacterDialog-remove",
                                    })}
                                    onClick={() => {
                                      indexCardManager.actions.removeBlock(
                                        block
                                      );
                                    }}
                                    underline="hover"
                                  >
                                    {t("character-dialog.control.remove-block")}
                                  </Link>
                                </Grid>
                              </>
                            }
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                }}
              />
            </Box>
          );
        })}
      </Box>
    );
  }

  function renderSkills() {
    const hasSkills = indexCardSkills.length > 0;

    return (
      <Collapse in={hasSkills && props.isGM}>
        <Box px="1rem" py=".5rem">
          <Grid container spacing={1} alignItems="center">
            {indexCardSkills.map((skill, skillIndex) => {
              return (
                <Grid item key={skillIndex}>
                  <Link
                    className={css([
                      {
                        cursor: !props.isGM ? "inherit" : "pointer",
                      },
                      !props.isGM && {
                        "color": theme.palette.text.primary,
                        "&:hover": {
                          textDecoration: "none",
                        },
                      },
                    ])}
                    data-cy={`index-card.skill.${skill.label}`}
                    onClick={() => {
                      if (!props.isGM) {
                        return;
                      }
                      const modifier = parseInt(skill.modifier) || 0;
                      const commandOptionList: Array<IRollGroup> = [
                        {
                          label: skill.label,
                          modifier: modifier,
                          commandSets: [{ id: "4dF" }],
                        },
                      ];

                      const result =
                        diceManager.actions.roll(commandOptionList);
                      props.onRoll(result);
                    }}
                    underline="hover"
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
    const dragIconMargin = "1.5rem";
    return (
      <Box ml={!props.isGM ? "0" : dragIconMargin}>
        <Grid container alignItems="flex-start" spacing={1} wrap="nowrap">
          <Grid item xs>
            <Typography
              noWrap
              variant="overline"
              className={css({
                display: "flex",
                width: "100%",
                fontWeight: indexCardManager.state.indexCard.pinned
                  ? "bold"
                  : "inherit",
                transition: theme.transitions.create("font-weight"),
              })}
            >
              <ContentEditable
                data-cy={`${props["data-cy"]}.title-label`}
                value={indexCardManager.state.indexCard.titleLabel}
                onChange={(newLabel) => {
                  indexCardManager.actions.setTitleLabel(newLabel);
                }}
              />
            </Typography>
          </Grid>

          <Fade in={hover}>
            <Grid item>
              <Grid container spacing={1} justifyContent="flex-end">
                {!isSubCard && props.isGM && props.onTogglePrivate && (
                  <Grid item>
                    <Tooltip
                      title={
                        props.type === "public"
                          ? t("index-card.mark-private")
                          : t("index-card.mark-public")
                      }
                    >
                      <IconButton
                        size="small"
                        data-cy={`${props["data-cy"]}.menu.visibility`}
                        onClick={() => {
                          props.onTogglePrivate?.();
                        }}
                      >
                        {props.type === "public" ? (
                          <VisibilityOffIcon htmlColor={paper.primary} />
                        ) : (
                          <VisibilityIcon htmlColor={paper.primary} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
                {props.isGM && (
                  <Grid item>
                    <Tooltip
                      title={
                        indexCardManager.state.indexCard.pinned
                          ? t("index-card.unpin")
                          : t("index-card.pin")
                      }
                    >
                      <IconButton
                        ref={$menu}
                        size="small"
                        data-cy={`${props["data-cy"]}.pin`}
                        onClick={() => {
                          indexCardManager.actions.togglePinned();
                        }}
                      >
                        {indexCardManager.state.indexCard.pinned ? (
                          <PushPinIcon htmlColor={paper.primary} />
                        ) : (
                          <PushPinOutlinedIcon htmlColor={paper.primary} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
                <Grid item>
                  <Tooltip
                    title={
                      indexCardManager.state.indexCard.playedDuringTurn
                        ? t("player-row.played")
                        : t("player-row.not-played")
                    }
                  >
                    <span>
                      <IconButton
                        data-cy={`${props["data-cy"]}.initiative`}
                        onClick={() => {
                          indexCardManager.actions.toggleInitiative();
                        }}
                        size="small"
                      >
                        {indexCardManager.state.indexCard.playedDuringTurn ? (
                          <DirectionsRunIcon htmlColor={paper.primary} />
                        ) : (
                          <EmojiPeopleIcon htmlColor={paper.primary} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>

                {props.onToggleVisibility && (
                  <Grid item>
                    <Tooltip
                      title={
                        open ? t("index-card.collapse") : t("index-card.expand")
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          data-cy={`${props["data-cy"]}.collapse`}
                          onClick={() => {
                            props.onToggleVisibility?.(
                              indexCardManager.state.indexCard
                            );
                          }}
                        >
                          <ArrowForwardIosIcon
                            htmlColor={paper.primary}
                            className={css({
                              transform: open
                                ? "rotate(270deg)"
                                : "rotate(90deg)",
                              transition: theme.transitions.create("transform"),
                            })}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Fade>
        </Grid>
      </Box>
    );
  }

  function renderTitle() {
    return (
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs>
          <ContentEditable
            id={props.id}
            data-cy={`${props["data-cy"]}.title`}
            value={indexCardManager.state.indexCard.title}
            className={css({
              fontSize: "1.8rem",
              fontFamily: FontFamily.HandWriting,
              lineHeight: "normal",
              // letterSpacing: "-.5px",
            })}
            onChange={(newTitle) => {
              indexCardManager.actions.setTitle(newTitle);
            }}
          />
        </Grid>
      </Grid>
    );
  }

  function renderContent() {
    return (
      <Box
        className={css({
          fontSize: "1.1rem",
          lineHeight: "1.7rem",
          padding: "0.5rem 0",
          width: "100%",
        })}
      >
        <Box px="1rem">
          <Typography variant="overline">
            <ContentEditable
              data-cy={`${props["data-cy"]}.content-label`}
              value={indexCardManager.state.indexCard.contentLabel}
              onChange={(newLabel) => {
                indexCardManager.actions.setContentLabel(newLabel);
              }}
            />
          </Typography>
        </Box>

        <Box p="0 1rem">
          <ContentEditable
            data-cy={`${props["data-cy"]}.content`}
            border
            placeholder="..."
            value={indexCardManager.state.indexCard.content}
            onChange={(newContent) => {
              indexCardManager.actions.setContent(newContent);
            }}
          />
        </Box>
      </Box>
    );
  }
};

function IndexCardColorPicker(props: {
  color: string;
  onChange(newColor: string): void;
}) {
  const [color, setColor] = useLazyState({
    value: props.color,
    onChange: props.onChange,
    delay: Delays.colorPicker,
  });

  return (
    <>
      <ChromePicker
        color={color}
        disableAlpha
        onChange={(color) => {
          return setColor(color.hex);
        }}
        styles={{
          default: {
            picker: {
              boxShadow: "none",
            },
          },
        }}
      />
      <Box pb=".5rem" bgcolor="white" width="225px">
        <Grid container justifyContent="center" spacing={1}>
          {Object.keys(IndexCardColor).map((colorName) => {
            const color = IndexCardColor[colorName as IndexCardColorTypes];
            return (
              <Grid item key={color}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setColor(color);
                    props.onChange(color);
                  }}
                >
                  <Box
                    className={css({
                      width: "1.5rem",
                      height: "1.5rem",
                      background: color,
                      borderRadius: "50%",
                      border: "1px solid #e0e0e0",
                    })}
                  />
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
