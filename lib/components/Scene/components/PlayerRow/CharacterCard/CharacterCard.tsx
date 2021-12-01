import { css, cx } from "@emotion/css";
import FaceIcon from "@mui/icons-material/Face";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React, { useContext } from "react";
import { DiceContext } from "../../../../../contexts/DiceContext/DiceContext";
import { useLogger } from "../../../../../contexts/InjectionsContext/hooks/useLogger";
import {
  BlockType,
  IBlock,
  ICharacter,
  IDicePoolBlock,
  IImageBlock,
  ILinkBlock,
  INumericBlock,
  IPointCounterBlock,
  ISection,
  ISeparatorBlock,
  ISkillBlock,
  ISlotTrackerBlock,
  ITextBlock,
} from "../../../../../domains/character/types";
import { IDiceRollResult } from "../../../../../domains/dice/Dice";
import { useTextColors } from "../../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { BlockDicePool } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { BlockImage } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockImage";
import { BlockLink } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockLink";
import { BlockNumeric } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockNumeric";
import { BlockPointCounter } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockPointCounter";
import { BlockSeparator } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockSeparator";
import { BlockSlotTracker } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockSlotTracker";
import { BlockText } from "../../../../../routes/Character/components/CharacterDialog/components/blocks/BlockText";
import { BlockSelectors } from "../../../../../routes/Character/components/CharacterDialog/domains/BlockSelectors/BlockSelectors";
import { previewContentEditable } from "../../../../ContentEditable/ContentEditable";
import { FateLabel } from "../../../../FateLabel/FateLabel";
import { paperStyle } from "../../../Scene";

export const CharacterCard: React.FC<{
  characterSheet: ICharacter | undefined;
  playerName: string | undefined;
  readonly: boolean;
  width?: string;
  onCharacterDialogOpen?(): void;
  onRoll(newRollResult: IDiceRollResult): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();

  const width = props.width ?? "100%";
  const diceManager = useContext(DiceContext);
  const sections = props.characterSheet?.pages.flatMap((p) => [
    ...p.sections.left,
    ...p.sections.right,
  ]);
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
  const numberOfSections = visibleSections?.length ?? 0;
  const hasSections = numberOfSections > 0;

  const renderBlockByBlockType: Record<
    keyof typeof BlockType,
    (section: ISection, block: any) => JSX.Element
  > = {
    Text: renderBlockText,
    Numeric: renderBlockNumeric,
    Image: renderBlockImage,
    Skill: renderBlockSkill,
    DicePool: renderDicePool,
    PointCounter: renderBlockPointCounter,
    SlotTracker: renderBlockSlotTracker,
    Link: renderBlockLink,
    Separator: renderSeparatorBlock,
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
              borderBottom: hasSections ? "1px solid #f0a4a4" : undefined,
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
                          onClick={() => {
                            props.onCharacterDialogOpen?.();
                            logger.track(
                              "session.open_character_sheet_from_card"
                            );
                          }}
                        >
                          <FaceIcon
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
          {hasSections && (
            <Box px="1rem" pb="1rem">
              {visibleSections?.map((section) => {
                return (
                  <Box key={section.id} className={css({ clear: "both" })}>
                    <Box className={sheetHeaderClassName}>
                      <FateLabel noWrap>
                        {previewContentEditable({ value: section.label })}
                      </FateLabel>
                    </Box>
                    <Box px=".2rem">
                      <Grid container>
                        {section.blocks.map((block) => {
                          return (
                            <React.Fragment key={block.id}>
                              {renderBlockByBlockType[block.type](
                                section,
                                block
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
          )}
        </Box>
      </Paper>
    </Box>
  );

  function renderBlockText(section: ISection, block: IBlock & ITextBlock) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockText
          advanced={false}
          readonly={true}
          dataCy={`character-card.${section.label}.${block.label}`}
          block={block}
          onLabelChange={() => {}}
          onValueChange={() => {}}
          onMetaChange={() => {}}
          onRoll={() => {}}
        />
      </Grid>
    );
  }

  function renderBlockNumeric(
    section: ISection,
    block: IBlock & INumericBlock
  ) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockNumeric
          advanced={false}
          readonly={true}
          dataCy={`character-card.${section.label}.${block.label}`}
          block={block}
          onLabelChange={() => {}}
          onValueChange={() => {}}
          onMetaChange={() => {}}
          onRoll={() => {}}
        />
      </Grid>
    );
  }

  function renderBlockImage(section: ISection, block: IBlock & IImageBlock) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockImage
          advanced={false}
          readonly={true}
          dataCy={`character-card.${section.label}.${block.label}`}
          block={block}
          onLabelChange={() => {}}
          onValueChange={() => {}}
          onMetaChange={() => {}}
          onRoll={() => {}}
        />
      </Grid>
    );
  }

  function renderBlockSkill(section: ISection, block: IBlock & ISkillBlock) {
    const isSelected = diceManager.state.pool.some(
      (p) => p.blockId === block.id
    );
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
          onContextMenu={(event: any) => {
            event.preventDefault();
            if (props.readonly) {
              return;
            }

            const rollGroup = BlockSelectors.getRollGroupFromBlock(block);
            diceManager.actions.setOptions({ listResults: true });
            diceManager.actions.addOrRemovePoolElement({
              blockId: block.id,
              blockType: block.type,
              label: block.label,
              rollGroup: rollGroup,
            });
          }}
          onClick={() => {
            if (props.readonly) {
              return;
            }

            const rollGroup = BlockSelectors.getRollGroupFromBlock(block);

            const diceRollResult = diceManager.actions.roll([rollGroup], {
              listResults: false,
            });
            props.onRoll(diceRollResult);
          }}
          underline="hover"
        >
          {previewContentEditable({ value: block.label })} ({blockValue})
        </Link>
      </Grid>
    );
  }

  function renderDicePool(section: ISection, block: IBlock & IDicePoolBlock) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockDicePool
          advanced={false}
          readonly={props.readonly}
          dataCy={`character-card.${section.label}.${block.label}`}
          block={block}
          onLabelChange={() => {}}
          onValueChange={() => {}}
          onMetaChange={() => {}}
          onRoll={props.onRoll}
        />
      </Grid>
    );
  }
  function renderBlockPointCounter(
    section: ISection,
    block: IBlock & IPointCounterBlock
  ) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockPointCounter
          advanced={false}
          readonly={true}
          dataCy={`character-card.${section.label}.${block.label}`}
          block={block}
          onLabelChange={() => {}}
          onValueChange={() => {}}
          onMetaChange={() => {}}
          onRoll={() => {}}
        />
      </Grid>
    );
  }
  function renderBlockSlotTracker(
    section: ISection,
    block: IBlock & ISlotTrackerBlock
  ) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockSlotTracker
          advanced={false}
          readonly={true}
          dataCy={`character-card.${section.label}.${block.label}`}
          block={block}
          onLabelChange={() => {}}
          onValueChange={() => {}}
          onMetaChange={() => {}}
          onRoll={() => {}}
        />
      </Grid>
    );
  }
  function renderBlockLink(section: ISection, block: IBlock & ILinkBlock) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockLink
          advanced={false}
          readonly={true}
          dataCy={`character-card.${section.label}.${block.label}`}
          block={block}
          onLabelChange={() => {}}
          onValueChange={() => {}}
          onMetaChange={() => {}}
          onRoll={() => {}}
        />
      </Grid>
    );
  }
  function renderSeparatorBlock(
    section: ISection,
    block: IBlock & ISeparatorBlock
  ) {
    return (
      <Grid item xs={12} className={css({ marginTop: ".5rem" })}>
        <BlockSeparator
          advanced={false}
          readonly={true}
          dataCy={`character-card.${section.label}.${block.label}`}
          block={block}
          onLabelChange={() => {}}
          onValueChange={() => {}}
          onMetaChange={() => {}}
          onRoll={() => {}}
        />
      </Grid>
    );
  }
};
