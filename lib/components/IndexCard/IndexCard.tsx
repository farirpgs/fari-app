import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import DeleteIcon from "@material-ui/icons/Delete";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";
import EditAttributesOutlinedIcon from "@material-ui/icons/EditAttributesOutlined";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import PaletteIcon from "@material-ui/icons/Palette";
import PaletteOutlinedIcon from "@material-ui/icons/PaletteOutlined";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { ThemeProvider } from "@material-ui/styles";
import produce from "immer";
import { default as React, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import { BlockType, IBlock } from "../../domains/character/types";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { useLazyState } from "../../hooks/useLazyState/useLazyState";
import { useResponsiveNumberOfColumns } from "../../hooks/useResponsiveNumberOfColumns/useResponsiveNumberOfColumns";
import { IIndexCard, IIndexCardType } from "../../hooks/useScene/IScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useThemeFromColor } from "../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { BetterDnd } from "../../routes/Character/components/BetterDnD/BetterDnd";
import { AddBlock } from "../../routes/Character/components/CharacterDialog/components/AddBlock";
import { BlockByType } from "../../routes/Character/components/CharacterDialog/components/BlockByType";
import {
  IDicePool,
  IDicePoolElement,
} from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { IndexCardSkills } from "./domains/IndexCardSkills";

export function useIndexCard(props: {
  indexCard: IIndexCard;
  onChange(indexCard: IIndexCard): void;
}) {
  const [indexCard, setIndexCard] = useLazyState({
    value: props.indexCard,
    onChange: (newIndexCard) => {
      props.onChange(newIndexCard);
    },
    delay: 0,
  });

  function setColor(newColor: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.color = newColor;
      })
    );
  }

  function togglePinned() {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.pinned = !draft.pinned;
      })
    );
  }

  function setTitle(newTitle: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.title = newTitle;
      })
    );
  }
  function setHeader(newHeader: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.header = newHeader;
      })
    );
  }

  function setContent(newContent: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.content = newContent;
      })
    );
  }

  function toggleInitiative() {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.playedDuringTurn = !draft.playedDuringTurn;
      })
    );
  }

  function reset() {
    setIndexCard(
      produce((draft: IIndexCard) => {
        const oldId = draft.id;
        const oldSub = draft.sub;
        const newIndexCard: IIndexCard = {
          ...SceneFactory.makeIndexCard(),
          id: oldId,
          sub: oldSub,
        };
        return newIndexCard;
      })
    );
  }

  function setBlock(newBlock: IBlock) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.blocks = draft.blocks.map((block) => {
          if (block.id === newBlock.id) {
            return newBlock;
          }
          return block;
        });
      })
    );
  }

  function addBlock(blockType: BlockType) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.blocks.push(CharacterFactory.makeBlock(blockType));
      })
    );
  }

  function addSubCard() {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.subCards.push(SceneFactory.makeSubIndexCard());
      })
    );
  }

  function duplicateBlock(blockToDuplicate: IBlock) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        const duplicatedBlock = CharacterFactory.duplicateBlock(
          blockToDuplicate
        );
        const index = draft.blocks.findIndex(
          (block) => block.id === blockToDuplicate.id
        );
        draft.blocks.push();
        draft.blocks.splice(index + 1, 0, duplicatedBlock);
      })
    );
  }

  function removeBlock(blockToRemove: IBlock) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.blocks = draft.blocks.filter((block) => {
          return block.id !== blockToRemove.id;
        });
      })
    );
  }

  function removeIndexCard(indexCardId: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.subCards = draft.subCards.filter(
          (indexCard) => indexCard.id !== indexCardId
        );
      })
    );
  }

  function duplicateIndexCard(indexCard: IIndexCard) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        const indexOf = draft.subCards.findIndex((i) => i.id === indexCard.id);
        const copy = SceneFactory.duplicateIndexCard(indexCard);
        draft.subCards.splice(indexOf, 0, copy);
      })
    );
  }

  function updateIndexCard(newIndexCard: IIndexCard) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.subCards = draft.subCards.map((indexCard) => {
          if (indexCard.id === newIndexCard.id) {
            return newIndexCard;
          }
          return indexCard;
        });
      })
    );
  }

  function moveIndexCard(dragIndex: number, hoverIndex: number) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        if (dragIndex === undefined || hoverIndex === undefined) {
          return;
        }

        const dragItem = draft.subCards[dragIndex];
        draft.subCards.splice(dragIndex, 1);
        draft.subCards.splice(hoverIndex, 0, dragItem);
      })
    );
  }

  return {
    state: { indexCard },
    actions: {
      addBlock,
      addSubCard,
      duplicateBlock,
      removeBlock,
      removeIndexCard,
      reset,
      setBlock,
      setColor,
      setContent,
      setHeader,
      setTitle,
      toggleInitiative,
      togglePinned,
      duplicateIndexCard,
      moveIndexCard,
      updateIndexCard,
    },
  };
}

export const IndexCard: React.FC<
  {
    readonly: boolean;
    className?: string;
    id: string;
    type?: IIndexCardType;
    indexCard: IIndexCard;
    reactDndIndex: number;
    reactDndType: string;
    showClickableSkills: boolean;
    pool: IDicePool;
    onPoolClick(element: IDicePoolElement): void;
    onChange(newIndexCard: IIndexCard): void;
    onRoll(modifierLabel: string, modifierValue: number): void;
    onMove(dragIndex: number, hoverIndex: number): void;
    onRemove(): void;
    onDuplicate(): void;
    onTogglePrivate?(): void;
  } & IDataCyProps
> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
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
  const [advanced, setAdvanced] = useState(false);

  const numberOfColumnsForSubCards = useResponsiveNumberOfColumns({
    xl: 3,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1,
  });
  const paperBackground = indexCardManager.state.indexCard.color;
  const paperColor = useTextColors(paperBackground);

  const defaultButtonTheme = useThemeFromColor(paperColor.primary);

  return (
    <Paper
      elevation={indexCardManager.state.indexCard.pinned ? 8 : 1}
      className={props.className}
    >
      <Box
        bgcolor={paperBackground}
        color={paperColor.primary}
        position="relative"
        className={css({
          filter: theme.palette.type === "dark" ? "brightness(90%)" : undefined,
        })}
      >
        <BetterDnd
          key={indexCardManager.state.indexCard.id}
          index={props.reactDndIndex}
          type={props.reactDndType}
          readonly={false}
          dragIndicatorClassName={css({
            position: "absolute",
            marginTop: "1rem",
            marginLeft: ".5rem",
            display: props.readonly ? "none" : "block",
          })}
          onMove={(dragIndex, hoverIndex) => {
            props.onMove(dragIndex, hoverIndex);
          }}
        >
          <Grid container>
            <Grid item xs={12} md={hasSubCards ? 3 : 12}>
              <Box display="flex" height="100%" flexDirection="column">
                <Box
                  className={css({
                    fontSize: "1.5rem",
                    width: "100%",
                    padding: "0.5rem 0",
                    borderBottom: `1px solid ${
                      indexCardManager.state.indexCard.color === "#fff"
                        ? "#f0a4a4"
                        : paperColor.primary
                    }`,
                  })}
                >
                  <Box px="1rem">
                    {renderHeader()}
                    {renderTitle()}
                  </Box>
                </Box>
                <Box>{renderContent()}</Box>

                <ThemeProvider theme={defaultButtonTheme}>
                  {renderBlocks()}
                  <Collapse in={advanced}>
                    <AddBlock
                      onAddBlock={(blockType) => {
                        indexCardManager.actions.addBlock(blockType);
                      }}
                    />
                  </Collapse>
                </ThemeProvider>
                {renderSkills()}
                {renderGMActions()}
              </Box>
            </Grid>
            {hasSubCards && (
              <Grid item xs={12} md={9}>
                {renderSubCards()}
              </Grid>
            )}
          </Grid>
        </BetterDnd>
      </Box>
    </Paper>
  );

  function renderGMActions() {
    if (props.readonly) {
      return null;
    }
    return (
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
                  <PaletteIcon htmlColor={paperColor.secondary} />
                ) : (
                  <PaletteOutlinedIcon htmlColor={paperColor.secondary} />
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
                  onChange={(color) => indexCardManager.actions.setColor(color)}
                />
              </Popover>
            </Grid>
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
                    <EditAttributesIcon htmlColor={paperColor.primary} />
                  ) : (
                    <EditAttributesOutlinedIcon
                      htmlColor={paperColor.primary}
                    />
                  )}
                </IconButton>
              </Tooltip>
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
                    <AddCircleOutlineIcon htmlColor={paperColor.primary} />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            {!isSubCard && (
              <Grid item>
                <Tooltip
                  title={
                    props.type === "public"
                      ? t("index-card.mark-public")
                      : t("index-card.mark-private")
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
                      <VisibilityIcon htmlColor={paperColor.primary} />
                    ) : (
                      <VisibilityOffIcon htmlColor={paperColor.primary} />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
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
                  <FileCopyIcon htmlColor={paperColor.primary} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={t("index-card.reset")}>
                <IconButton
                  size="small"
                  data-cy={`${props["data-cy"]}.reset`}
                  onClick={() => {
                    indexCardManager.actions.reset();
                  }}
                >
                  <RotateLeftIcon htmlColor={paperColor.primary} />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title={t("index-card.remove")}>
                <IconButton
                  size="small"
                  data-cy={`${props["data-cy"]}.remove`}
                  onClick={() => {
                    props.onRemove();
                  }}
                >
                  <DeleteIcon htmlColor={paperColor.primary} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderSubCards() {
    return (
      <>
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
                    indexCard={subCard}
                    id={`index-card-${subCard.id}`}
                    reactDndType={`index-card.sub-cards.${indexCardManager.state.indexCard.id}`}
                    reactDndIndex={subCardIndex}
                    readonly={props.readonly}
                    showClickableSkills={props.showClickableSkills}
                    pool={props.pool}
                    onPoolClick={props.onPoolClick}
                    onRoll={props.onRoll}
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
                </Box>
              );
            }
          )}
        </Box>
      </>
    );
  }

  function renderBlocks() {
    if (indexCardManager.state.indexCard.blocks.length === 0) {
      return null;
    }

    return (
      <Box px="1rem" py=".5rem">
        {indexCardManager.state.indexCard.blocks.map((block) => {
          return (
            <Box key={block.id} mb=".5rem">
              <BlockByType
                advanced={advanced}
                readonly={props.readonly}
                dataCy={`index-card.${block.label}`}
                block={block}
                onDuplicate={() => {
                  indexCardManager.actions.duplicateBlock(block);
                }}
                onRemove={() => {
                  indexCardManager.actions.removeBlock(block);
                }}
                onChange={(newBlock) => {
                  indexCardManager.actions.setBlock(newBlock);
                }}
                pool={props.pool}
                onPoolClick={(element) => {
                  props.onPoolClick(element);
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
                fontWeight: indexCardManager.state.indexCard.pinned
                  ? "bold"
                  : "inherit",
                transition: theme.transitions.create("font-weight"),
              })}
            >
              <ContentEditable
                data-cy={`${props["data-cy"]}.header`}
                value={indexCardManager.state.indexCard.header}
                readonly={props.readonly}
                onChange={(newHeader) => {
                  indexCardManager.actions.setHeader(newHeader);
                }}
              />
            </Typography>
          </Grid>
          {!props.readonly && (
            <>
              <Grid item>
                <Tooltip
                  title={
                    // TODO: INSPECT
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
                      <BookmarkIcon htmlColor={paperColor.primary} />
                    ) : (
                      <BookmarkBorderIcon htmlColor={paperColor.primary} />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
            </>
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
                    <DirectionsRunIcon htmlColor={paperColor.primary} />
                  ) : (
                    <EmojiPeopleIcon htmlColor={paperColor.primary} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
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
          borderBottom: `1px solid ${paperColor}`,
        })}
      >
        <Box px="1rem">
          <Typography variant="overline">{t("index-card.notes")}</Typography>
        </Box>

        <Box p="0 1rem">
          <ContentEditable
            data-cy={`${props["data-cy"]}.content`}
            readonly={props.readonly}
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
    <ChromePicker
      color={color}
      disableAlpha
      onChange={(color) => {
        return setColor(color.hex);
      }}
    />
  );
}
