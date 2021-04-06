import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import PersonIcon from "@material-ui/icons/Person";
import React from "react";
import { useLogger } from "../../../../../contexts/InjectionsContext/hooks/useLogger";
import {
  BlockType,
  IBlock,
  ICharacter,
  IDicePoolBlock,
  INumericBlock,
  IPointCounterBlock,
  ISection,
  ISkillBlock,
  ISlotTrackerBlock,
  ITextBlock,
} from "../../../../../domains/character/types";
import { useTextColors } from "../../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import {
  BlockDicePool,
  IDicePool,
  IDicePoolElement,
} from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { BlockNumeric } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockNumeric";
import { BlockPointCounter } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockPointCounter";
import { BlockSlotTracker } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockSlotTracker";
import { BlockText } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockText";
import { Block } from "../../../../../routes/Character/components/CharacterDialog/domains/Block/Block";
import { previewContentEditable } from "../../../../ContentEditable/ContentEditable";
import { FateLabel } from "../../../../FateLabel/FateLabel";
import { paperStyle } from "../../../Scene";

export const CharacterCard: React.FC<{
  characterSheet: ICharacter | undefined;
  playerName: string | undefined;
  readonly: boolean;
  width?: string;
  pool: IDicePool;
  onCharacterDialogOpen?(): void;
  onPoolClick(element: IDicePoolElement): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();

  const width = props.width ?? "100%";

  const sections = props.characterSheet?.pages.flatMap((p) => p.sections);
  const visibleSections = sections?.filter((s) => s.visibleOnCard);

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
    marginTop: "1rem",
  });

  if (!props.characterSheet) {
    return null;
  }

  const renderBlockByBlockType: Record<
    keyof typeof BlockType,
    (section: ISection, block: any, blockIndex: number) => JSX.Element
  > = {
    Text: renderBlockText,
    Numeric: renderBlockNumeric,
    Skill: renderBlockSkill,
    DicePool: renderDicePool,
    PointCounter: renderBlockPointCounter,
    SlotTracker: renderBlockSlotTracker,
  };

  return (
    <Box
      data-cy="character-card"
      className={cx(
        css({
          width: width,
          padding: "0 .5rem 1.5rem .5rem",
        })
      )}
    >
      <Paper className={paperStyle}>
        <Box>
          <Box
            py=".5rem"
            px="1rem"
            className={css({
              fontSize: "1.5rem",
              width: "100%",
              borderBottom: "1px solid #f0a4a4",
            })}
          >
            <Box>
              <Grid container alignItems="baseline" spacing={2} wrap="nowrap">
                <Grid item xs zeroMinWidth>
                  <FateLabel noWrap>{props.characterSheet?.name}</FateLabel>
                </Grid>
                {props.onCharacterDialogOpen && (
                  <Grid item>
                    <Tooltip title={t("player-row.open-character-sheet")}>
                      <span>
                        <IconButton
                          size="small"
                          data-cy="character-card.open-character-sheet"
                          onClick={(e) => {
                            props.onCharacterDialogOpen?.();
                            logger.info("CharacterCard:onCharacterDialogOpen");
                          }}
                        >
                          <PersonIcon
                            className={css({
                              width: "1.5rem",
                              height: "1.5rem",
                            })}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
              {props.playerName && (
                <InputLabel shrink>{`(${props.playerName})`}</InputLabel>
              )}
            </Box>
          </Box>
          <Box px="1rem" pb="1rem">
            {visibleSections?.map((section, sectionIndex) => {
              return (
                <Box key={section.id} className={css({ clear: "both" })}>
                  <Box className={sheetHeaderClassName}>
                    <FateLabel noWrap>
                      {previewContentEditable({ value: section.label })}
                    </FateLabel>
                  </Box>
                  <Box px=".2rem">
                    <Grid container>
                      {section.blocks.map((block, blockIndex) => {
                        return (
                          <React.Fragment key={block.id}>
                            {renderBlockByBlockType[block.type](
                              section,
                              block,
                              blockIndex
                            )}
                          </React.Fragment>
                        );
                      })}
                    </Grid>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );

  function renderBlockText(
    section: ISection,
    block: IBlock & ITextBlock,
    blockIndex: number
  ) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockText
          advanced={false}
          readonly={true}
          pageIndex={0}
          sectionIndex={0}
          section={section}
          block={block}
          blockIndex={blockIndex}
          onLabelChange={(value) => {}}
          onValueChange={(value) => {}}
          onMetaChange={(meta) => {}}
        />
      </Grid>
    );
  }

  function renderBlockNumeric(
    section: ISection,
    block: IBlock & INumericBlock,
    blockIndex: number
  ) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockNumeric
          advanced={false}
          readonly={true}
          pageIndex={0}
          sectionIndex={0}
          section={section}
          block={block}
          blockIndex={blockIndex}
          onLabelChange={(value) => {}}
          onValueChange={(value) => {}}
          onMetaChange={(meta) => {}}
        />
      </Grid>
    );
  }

  function renderBlockSkill(
    section: ISection,
    block: IBlock & ISkillBlock,
    blockIndex: number
  ) {
    const isSelected = props.pool.some((p) => p.blockId === block.id);
    const blockValue = block.value || "0";
    return (
      <Grid
        item
        className={css({
          flex: "0 1 auto",
          marginTop: ".5rem",

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        })}
      >
        <Link
          className={css([
            {
              paddingRight: ".5rem",
              fontSize: ".8rem",
              cursor: props.readonly ? "inherit" : "pointer",
              textTransform: "uppercase",
              fontWeight: isSelected
                ? theme.typography.fontWeightBold
                : undefined,
              color:
                blockValue === "0" ? theme.palette.secondary.main : undefined,
            },
            props.readonly && {
              "color": theme.palette.text.primary,
              "&:hover": {
                textDecoration: "none",
              },
            },
          ])}
          data-cy={`character-card.section.${section.label}.block.${block.label}`}
          onClick={() => {
            if (props.readonly) {
              return;
            }
            const commandOptionList = Block.getCommandOptionList(block);
            props.onPoolClick({
              blockId: block.id,
              blockType: block.type,
              label: block.label,
              commandOptionList: commandOptionList,
            });
          }}
        >
          {previewContentEditable({ value: block.label })} ({blockValue})
        </Link>
      </Grid>
    );
  }

  function renderDicePool(
    section: ISection,
    block: IBlock & IDicePoolBlock,
    blockIndex: number
  ) {
    return (
      <Grid item xs={12}>
        <BlockDicePool
          advanced={false}
          readonly={props.readonly}
          pageIndex={0}
          sectionIndex={0}
          section={section}
          block={block}
          blockIndex={0}
          onLabelChange={(value) => {}}
          onValueChange={(value) => {}}
          onMetaChange={(meta) => {}}
          pool={props.pool}
          onPoolClick={props.onPoolClick}
        />
      </Grid>
    );
  }
  function renderBlockPointCounter(
    section: ISection,
    block: IBlock & IPointCounterBlock,
    blockIndex: number
  ) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockPointCounter
          advanced={false}
          readonly={true}
          pageIndex={0}
          sectionIndex={0}
          section={section}
          block={block}
          blockIndex={blockIndex}
          onLabelChange={(value) => {}}
          onValueChange={(value) => {}}
          onMetaChange={(meta) => {}}
        />
      </Grid>
    );
  }
  function renderBlockSlotTracker(
    section: ISection,
    block: IBlock & ISlotTrackerBlock,
    blockIndex: number
  ) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockSlotTracker
          advanced={false}
          readonly={true}
          pageIndex={0}
          sectionIndex={0}
          section={section}
          block={block}
          blockIndex={blockIndex}
          onLabelChange={(value) => {}}
          onValueChange={(value) => {}}
          onMetaChange={(meta) => {}}
          onAddBox={() => {}}
          onRemoveBox={() => {}}
          onToggleBox={(boxIndex) => {}}
          onBoxLabelChange={(boxIndex, value) => {}}
        />
      </Grid>
    );
  }
};
