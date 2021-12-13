import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import produce from "immer";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../components/ContentEditable/ContentEditable";
import { BlockType, IBlock } from "../../../../../domains/character/types";
import { IDiceRollResult } from "../../../../../domains/dice/Dice";
import { useLazyState } from "../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { IBlockComponentProps } from "../types/IBlockComponentProps";
import { BlockDicePool, BlockDicePoolActions } from "./blocks/BlockDicePool";
import { BlockImage } from "./blocks/BlockImage";
import { BlockLink, BlockLinkActions } from "./blocks/BlockLink";
import { BlockNumeric, BlockNumericActions } from "./blocks/BlockNumeric";
import {
  BlockPointCounter,
  BlockPointCounterActions,
} from "./blocks/BlockPointCounter";
import { BlockSeparator, BlockSeparatorActions } from "./blocks/BlockSeparator";
import { BlockSkill, BlockSkillActions } from "./blocks/BlockSkill";
import {
  BlockSlotTracker,
  BlockSlotTrackerActions,
} from "./blocks/BlockSlotTracker";
import { BlockText, BlockTextActions } from "./blocks/BlockText";

export function BlockByType(
  props: Omit<
    IBlockComponentProps<any>,
    "onLabelChange" | "onValueChange" | "onMetaChange"
  > & {
    hideHelp?: boolean;
    otherActions?: JSX.Element;
    onChange(newBlock: IBlock): void;
    onToggleSplit?(): void;
    onMainPointCounterChange?(): void;
    onRoll(diceRollResult: IDiceRollResult): void;
  }
) {
  const theme = useTheme();
  const { t } = useTranslate();
  const [block, setBlock] = useLazyState({
    value: props.block,
    delay: 0,
    onChange(newBlock) {
      props.onChange(newBlock);
    },
  });
  const isSeparatorBlock = props.block.type === BlockType.Separator;

  function handleOnLabelChange(label: any) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        draft.label = label;
      })
    );
  }

  function handleOnValueChange(value: any) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        draft.value = value;
      })
    );
  }

  function handleOnMetaChange(meta: any) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }

        draft.meta = meta;
      })
    );
  }
  function handleOnHelperTextChange(helperText: string) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }

        draft.meta.helperText = helperText;
      })
    );
  }

  return (
    <Box my={isSeparatorBlock ? ".5rem" : "0"}>
      {props.block.type === BlockType.Text && (
        <BlockText
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}
      {props.block.type === BlockType.Numeric && (
        <BlockNumeric
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}
      {props.block.type === BlockType.Image && (
        <BlockImage
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}
      {props.block.type === BlockType.Skill && (
        <BlockSkill
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}
      {props.block.type === BlockType.DicePool && (
        <BlockDicePool
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}
      {props.block.type === BlockType.PointCounter && (
        <BlockPointCounter
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}

      {props.block.type === BlockType.SlotTracker && (
        <BlockSlotTracker
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}

      {props.block.type === BlockType.Link && (
        <BlockLink
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}

      {props.block.type === BlockType.Separator && (
        <BlockSeparator
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleOnLabelChange}
          onValueChange={handleOnValueChange}
          onMetaChange={handleOnMetaChange}
          onRoll={props.onRoll}
        />
      )}

      {renderBlockHelpText()}
      {props.advanced && renderBlockAdvancedOptions()}
    </Box>
  );

  function renderBlockAdvancedOptions() {
    return (
      <Grid container justifyContent="flex-end" spacing={1}>
        {block.type === BlockType.PointCounter && (
          <BlockPointCounterActions
            block={block}
            onMetaChange={handleOnMetaChange}
            onMainPointCounterChange={props.onMainPointCounterChange}
          />
        )}
        {block.type === BlockType.Text && (
          <BlockTextActions block={block} onMetaChange={handleOnMetaChange} />
        )}
        {block.type === BlockType.Numeric && (
          <BlockNumericActions
            block={block}
            onMetaChange={handleOnMetaChange}
          />
        )}
        {block.type === BlockType.SlotTracker && (
          <BlockSlotTrackerActions
            block={block}
            onMetaChange={handleOnMetaChange}
          />
        )}

        {block.type === BlockType.Skill && (
          <BlockSkillActions block={block} onMetaChange={handleOnMetaChange} />
        )}
        {block.type === BlockType.DicePool && (
          <BlockDicePoolActions
            block={block}
            onMetaChange={handleOnMetaChange}
          />
        )}
        {block.type === BlockType.Link && (
          <BlockLinkActions block={block} onMetaChange={handleOnMetaChange} />
        )}
        {block.type === BlockType.Separator && (
          <BlockSeparatorActions
            block={block}
            onMetaChange={handleOnMetaChange}
          />
        )}

        {props.onToggleSplit && block.type !== BlockType.Separator && (
          <Grid item>
            <Link
              component="button"
              variant="caption"
              className={css({
                label: "CharacterDialog-width",
                color: theme.palette.primary.main,
              })}
              onClick={() => {
                props.onToggleSplit?.();
              }}
              underline="hover"
            >
              {t("character-dialog.control.width")}
              {": "}
              {(block.meta.width || 1) * 100}
              {"%"}
            </Link>
          </Grid>
        )}
        {props.otherActions && props.otherActions}
      </Grid>
    );
  }

  function renderBlockHelpText() {
    const hasHelperText = previewContentEditable({
      value: block.meta.helperText,
    });

    if (props.hideHelp || (!props.advanced && !hasHelperText)) {
      return null;
    }

    return (
      <Box>
        <Grid container alignItems="flex-start" wrap="nowrap">
          {props.advanced && (
            <Grid item>
              <FormHelperText className={css({ paddingRight: ".2rem" })}>
                {t("character-dialog.helper-text.help")}
              </FormHelperText>
            </Grid>
          )}

          <Grid item xs>
            <FormHelperText>
              <ContentEditable
                readonly={!props.advanced}
                border={props.advanced}
                data-cy={`${props.dataCy}.helper-text`}
                value={block.meta.helperText ?? ""}
                onChange={(newHelpText) => {
                  handleOnHelperTextChange(newHelpText);
                }}
              />
            </FormHelperText>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
