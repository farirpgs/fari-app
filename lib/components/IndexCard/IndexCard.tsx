import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import { darken, lighten } from "@material-ui/core/styles";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import DeleteIcon from "@material-ui/icons/Delete";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";
import EditAttributesOutlinedIcon from "@material-ui/icons/EditAttributesOutlined";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import PaletteIcon from "@material-ui/icons/Palette";
import PaletteOutlinedIcon from "@material-ui/icons/PaletteOutlined";
import PostAddIcon from "@material-ui/icons/PostAdd";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { ThemeProvider } from "@material-ui/styles";
import { default as React, useContext, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { FontFamily } from "../../constants/FontFamily";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";
import {
  IDiceCommandOption,
  IDiceRollResult,
  RollType,
} from "../../domains/dice/Dice";
import { DragAndDropTypes } from "../../domains/drag-and-drop/DragAndDropTypes";
import { useLazyState } from "../../hooks/useLazyState/useLazyState";
import { useResponsiveValue } from "../../hooks/useResponsiveValue/useResponsiveValue";
import { IIndexCard, IIndexCardType } from "../../hooks/useScene/IScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useThemeFromColor } from "../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { AddBlock } from "../../routes/Character/components/CharacterDialog/components/AddBlock";
import { BlockByType } from "../../routes/Character/components/CharacterDialog/components/BlockByType";
import { IDicePoolElement } from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { DndItem } from "../../routes/Character/components/Dnd/DndItem";
import { DndProvider } from "../../routes/Character/components/Dnd/DndProvider";
import { ConditionalWrapper } from "../ConditionalWrapper/ConditionalWrapper";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { IndexCardSkills } from "./domains/IndexCardSkills";
import { useIndexCard } from "./hooks/useIndexCard";
import { IndexCardColor, IndexCardColorTypes } from "./IndexCardColor";

export const IndexCard: React.FC<
  {
    readonly: boolean;
    className?: string;
    id: string;
    type?: IIndexCardType;
    indexCard: IIndexCard;
    reactDndIndex: number;
    reactDndType: string;
    canMove: boolean;
    indexCardHiddenRecord: Record<string, boolean>;
    onPoolClick(element: IDicePoolElement): void;
    onChange(newIndexCard: IIndexCard): void;
    onRoll(diceRollResult: IDiceRollResult): void;
    onMove(dragIndex: number, hoverIndex: number): void;
    onRemove(): void;
    onDuplicate(): void;
    onTogglePrivate?(): void;
    onToggleVisibility(indexCard: IIndexCard): void;
    dndRenderedProps: any;
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
  const open = !props.indexCardHiddenRecord[props.indexCard.id];
  const numberOfColumnsForSubCards = useResponsiveValue({
    xl: 3,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1,
  });

  const paper = useTextColors(
    theme.palette.type === "light"
      ? indexCardManager.state.indexCard.color
      : darken(indexCardManager.state.indexCard.color, 0.5)
  );

  const defaultButtonTheme = useThemeFromColor(paper.primary);

  return (
    <Paper
      elevation={indexCardManager.state.indexCard.pinned ? 8 : 2}
      className={props.className}
    >
      <Box
        pb={props.readonly ? "1rem" : "0"}
        bgcolor={paper.bgColor}
        color={paper.primary}
        onPointerEnter={() => {
          setHover(true);
        }}
        onPointerLeave={() => {
          setHover(false);
        }}
        position="relative"
        className={css({
          filter: theme.palette.type === "dark" ? "brightness(90%)" : undefined,
        })}
      >
        <ConditionalWrapper
          condition={props.canMove}
          wrapper={(children) => {
            return (
              <>
                <div>
                  <Tooltip title={t("character-dialog.control.move")}>
                    <IconButton
                      size="small"
                      className={css({
                        position: "absolute",
                        marginTop: "1rem",
                        marginLeft: ".5rem",
                        cursor: "drag",
                        display:
                          props.readonly || !props.canMove ? "none" : "block",
                      })}
                      {...props.dndRenderedProps.listeners}
                      {...props.dndRenderedProps.attributes}
                    >
                      <DragIndicatorIcon
                        className={css({
                          transition: theme.transitions.create("color"),
                        })}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                {children}
              </>
            );
          }}
        >
          <Box>
            <Grid container>
              <Grid item xs={12} md={hasSubCards ? 3 : 12}>
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
                        <Box>
                          {renderBlocks()}
                          {!props.readonly && (
                            <Fade in={hover}>
                              <Box>
                                <AddBlock
                                  variant="icon"
                                  onAddBlock={(blockType) => {
                                    indexCardManager.actions.addBlock(
                                      blockType
                                    );
                                    setAdvanced(true);
                                  }}
                                />
                              </Box>
                            </Fade>
                          )}
                        </Box>
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
                  md={9}
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
    if (props.readonly) {
      return null;
    }
    return (
      <Fade in={hover}>
        <Box
          py=".5rem"
          px="1rem"
          display="flex"
          alignItems="flex-end"
          flex="1 0 auto"
        >
          <Grid container wrap="nowrap" justify="space-between" spacing={1}>
            <Grid item container justify="flex-start" spacing={1}>
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
            <Grid item container justify="flex-end" spacing={1}>
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
              <Grid item>
                <Tooltip title={t("index-card.reset")}>
                  <IconButton
                    size="small"
                    data-cy={`${props["data-cy"]}.reset`}
                    onClick={() => {
                      const confirmed = confirm(
                        t("index-card.reset-confirmation")
                      );
                      if (confirmed) {
                        indexCardManager.actions.reset();
                      }
                    }}
                  >
                    <RotateLeftIcon htmlColor={paper.primary} />
                  </IconButton>
                </Tooltip>
              </Grid>

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
            </Grid>
          </Grid>
        </Box>
      </Fade>
    );
  }

  function renderSubCards() {
    return (
      <>
        <DndProvider
          items={indexCardManager.state.indexCard.subCards}
          onMove={(oldIndex, newIndex) => {
            indexCardManager.actions.moveIndexCard(oldIndex, newIndex);
          }}
        >
          <Box
            py="1rem"
            px="1rem"
            // mb="1rem"
            className={css({
              label: "IndexCard-masonry-content",
              columnCount: numberOfColumnsForSubCards,
              columnWidth: "auto",
              columnGap: "1rem",
            })}
          >
            {indexCardManager.state.indexCard.subCards?.map(
              (subCard, subCardIndex) => {
                return (
                  <DndItem
                    key={subCard.id}
                    dndId={subCardIndex.toString()}
                    render={(dndRenderProps) => {
                      return (
                        <>
                          <Box
                            key={subCard.id}
                            className={css({
                              label: "IndexCard-masonry-card",
                              width: "100%",
                              display: "inline-block",

                              marginBottom: "1rem",
                              /**
                               * Disables bottom being cut-off
                               */
                              breakInside: "avoid",
                            })}
                          >
                            <IndexCard
                              dndRenderedProps={dndRenderProps}
                              indexCard={subCard}
                              id={`index-card-${subCard.id}`}
                              reactDndType={`${DragAndDropTypes.SceneIndexCardsSubCards}.${indexCardManager.state.indexCard.id}`}
                              canMove={true}
                              reactDndIndex={subCardIndex}
                              readonly={props.readonly}
                              onPoolClick={props.onPoolClick}
                              onRoll={props.onRoll}
                              indexCardHiddenRecord={
                                props.indexCardHiddenRecord
                              }
                              onToggleVisibility={props.onToggleVisibility}
                              onMove={(dragIndex, hoverIndex) => {
                                indexCardManager.actions.moveIndexCard(
                                  dragIndex,
                                  hoverIndex
                                );
                              }}
                              onChange={(newIndexCard) => {
                                indexCardManager.actions.updateIndexCard(
                                  newIndexCard
                                );
                              }}
                              onDuplicate={() => {
                                indexCardManager.actions.duplicateIndexCard(
                                  subCard
                                );
                              }}
                              onRemove={() => {
                                indexCardManager.actions.removeIndexCard(
                                  subCard.id
                                );
                              }}
                            />
                          </Box>
                        </>
                      );
                    }}
                  />
                );
              }
            )}
          </Box>
        </DndProvider>
      </>
    );
  }

  function renderBlocks() {
    if (indexCardManager.state.indexCard.blocks.length === 0) {
      return null;
    }

    return (
      <Box px="1rem" py=".5rem">
        <DndProvider
          items={indexCardManager.state.indexCard.blocks}
          onMove={(dragIndex, hoverIndex) => {
            indexCardManager.actions.moveIndexCardBlock(dragIndex, hoverIndex);
          }}
        >
          {indexCardManager.state.indexCard.blocks.map((block, blockIndex) => {
            return (
              <Box key={block.id} mb=".5rem">
                <DndItem
                  dndId={blockIndex.toString()}
                  render={(dndRenderProps) => {
                    return (
                      <Box>
                        <Grid container wrap="nowrap" spacing={1}>
                          {advanced && (
                            <Grid item>
                              <div>
                                <Tooltip
                                  title={t("character-dialog.control.move")}
                                >
                                  <IconButton
                                    size="small"
                                    className={css({
                                      cursor: "drag",
                                      display: "block",
                                    })}
                                    {...dndRenderProps.attributes}
                                    {...dndRenderProps.listeners}
                                  >
                                    <DragIndicatorIcon
                                      className={css({
                                        transition: theme.transitions.create(
                                          "color"
                                        ),
                                      })}
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
                              readonly={props.readonly}
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
                                      data-cy={`index-card.${block.label}.duplicate`}
                                      className={css({
                                        label: "CharacterDialog-duplicate",
                                      })}
                                      onClick={() => {
                                        indexCardManager.actions.duplicateBlock(
                                          block
                                        );
                                      }}
                                    >
                                      {t("character-dialog.control.duplicate")}
                                    </Link>
                                  </Grid>
                                  <Grid item>
                                    <Link
                                      component="button"
                                      variant="caption"
                                      data-cy={`index-card.${block.label}.remove`}
                                      className={css({
                                        label: "CharacterDialog-remove",
                                      })}
                                      onClick={() => {
                                        indexCardManager.actions.removeBlock(
                                          block
                                        );
                                      }}
                                    >
                                      {t(
                                        "character-dialog.control.remove-block"
                                      )}
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
        </DndProvider>
      </Box>
    );
  }

  function renderSkills() {
    const hasSkills = indexCardSkills.length > 0;

    return (
      <Collapse in={hasSkills && !props.readonly}>
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
                      const commandOptionList: Array<IDiceCommandOption> = [
                        {
                          type: RollType.DiceCommand,
                          commandGroupId: "4dF",
                        },
                        {
                          type: RollType.Modifier,
                          label: skill.label,
                          modifier: modifier,
                        },
                      ];

                      const result = diceManager.actions.roll(
                        commandOptionList
                      );
                      props.onRoll(result);
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
    const dragIconMargin = "1.5rem";
    return (
      <Box ml={props.readonly ? "0" : dragIconMargin}>
        <Grid container alignItems="center" spacing={1} wrap="nowrap">
          <Grid item className={css({ flex: "1 0 auto" })}>
            <Typography
              variant="overline"
              className={css({
                fontWeight: indexCardManager.state.indexCard.pinned
                  ? "bold"
                  : "inherit",
                transition: theme.transitions.create("font-weight"),
              })}
            >
              <ContentEditable
                data-cy={`${props["data-cy"]}.title-label`}
                value={indexCardManager.state.indexCard.titleLabel}
                readonly={props.readonly}
                onChange={(newLabel) => {
                  indexCardManager.actions.setTitleLabel(newLabel);
                }}
              />
            </Typography>
          </Grid>

          <Fade in={hover}>
            <Grid item container justify="flex-end">
              {!isSubCard && !props.readonly && (
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
              {!props.readonly && (
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
                        <BookmarkIcon htmlColor={paper.primary} />
                      ) : (
                        <BookmarkBorderIcon htmlColor={paper.primary} />
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
                      disabled={props.readonly}
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
                        props.onToggleVisibility(
                          indexCardManager.state.indexCard
                        );
                      }}
                    >
                      <ArrowForwardIosIcon
                        className={css({
                          transform: open ? "rotate(270deg)" : "rotate(90deg)",
                          transition: theme.transitions.create("transform"),
                        })}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Fade>
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
            value={indexCardManager.state.indexCard.title}
            className={css({
              fontFamily: FontFamily.HandWriting,
              fontSize: "1.5rem",
            })}
            readonly={props.readonly}
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
              readonly={props.readonly}
              onChange={(newLabel) => {
                indexCardManager.actions.setContentLabel(newLabel);
              }}
            />
          </Typography>
        </Box>

        <Box p="0 1rem">
          <ContentEditable
            data-cy={`${props["data-cy"]}.content`}
            readonly={props.readonly}
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
    delay: 75,
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
        <Grid container justify="center" spacing={1}>
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
