import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import produce from "immer";
import React, { useContext } from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../components/ContentEditable/ContentEditable";
import { BlockType, IBlock } from "../../../../../domains/character/types";
import { IDicePoolResult } from "../../../../../domains/dice/Dice";
import { useEvent } from "../../../../../hooks/useEvent/useEvent";
import { useLazyState } from "../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";
import { MiniThemeContext } from "../MiniThemeContext";
import { BlockDicePool, BlockDicePoolActions } from "./blocks/BlockDicePool";
import { BlockImage } from "./blocks/BlockImage";
import { BlockInfoText } from "./blocks/BlockInfoText";
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

export function BlockByType(props: {
  dataCy: string;
  advanced: boolean;
  readonly: boolean | undefined;
  block: IBlock;
  hideHelp?: boolean;
  otherActions?: JSX.Element;
  onChange(newBlock: IBlock): void;
  onToggleSplit?(): void;
  onMainPointCounterChange?(): void;
  onRoll(diceRollResult: IDicePoolResult): void;
}) {
  const miniTheme = useContext(MiniThemeContext);
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

  const handleLabelChange = useEvent((label: any) => {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        draft.label = label;
      })
    );
  });

  const handleValueChange = useEvent((value: any) => {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        draft.value = value;
      })
    );
  });

  const handleMetaChange = useEvent((producer: (prev: any) => any) => {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }

        draft.meta = produce(draft.meta, producer);
      })
    );
  });

  const handleOnHelperTextChange = useEvent((helperText: string) => {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }

        draft.meta.helperText = helperText;
      })
    );
  });

  return (
    <Box my={isSeparatorBlock ? ".5rem" : "0"}>
      {block.type === BlockType.Text && (
        <BlockText
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          label={block.label}
          value={block.value}
          checked={block.meta.checked}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
        />
      )}
      {block.type === BlockType.InfoText && (
        <BlockInfoText
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          value={block.value}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
        />
      )}
      {block.type === BlockType.Numeric && (
        <BlockNumeric
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          label={block.label}
          value={block.value}
          checked={block.meta.checked}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
        />
      )}
      {block.type === BlockType.Image && (
        <BlockImage
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          label={block.label}
          value={block.value}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
        />
      )}
      {block.type === BlockType.Skill && (
        <BlockSkill
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          label={block.label}
          value={block.value}
          commands={block.meta.commands}
          blockId={block.id}
          blockType={block.type}
          checked={block.meta.checked}
          hideModifier={block.meta.hideModifier}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
          onRoll={props.onRoll}
        />
      )}
      {block.type === BlockType.DicePool && (
        <BlockDicePool
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          label={block.label}
          value={block.value}
          commands={block.meta.commands}
          hideModifier={true}
          blockId={block.id}
          blockType={block.type}
          checked={block.meta.checked}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
          onRoll={props.onRoll}
        />
      )}
      {block.type === BlockType.PointCounter && (
        <BlockPointCounter
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          label={block.label}
          value={block.value}
          max={block.meta.max}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
        />
      )}

      {block.type === BlockType.SlotTracker && (
        <BlockSlotTracker
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          block={block}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
          onRoll={props.onRoll}
        />
      )}

      {block.type === BlockType.Link && (
        <BlockLink
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          label={block.label}
          value={block.value}
          hasDisplayName={block.meta.hasDisplayName}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
        />
      )}

      {block.type === BlockType.Separator && (
        <BlockSeparator
          advanced={props.advanced}
          dataCy={props.dataCy}
          readonly={props.readonly}
          label={block.label}
          hasLabel={block.meta.hasLabel}
          hideDivider={block.meta.hideDivider}
          onLabelChange={handleLabelChange}
          onValueChange={handleValueChange}
          onMetaChange={handleMetaChange}
        />
      )}

      {block.type !== BlockType.InfoText && renderBlockHelpText()}
      {props.advanced && renderBlockAdvancedOptions()}
    </Box>
  );

  function renderBlockAdvancedOptions() {
    return (
      <Grid container justifyContent="flex-end" spacing={1}>
        {block.type === BlockType.PointCounter && (
          <BlockPointCounterActions
            block={block}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onMetaChange={handleMetaChange}
            onMainPointCounterChange={props.onMainPointCounterChange}
          />
        )}
        {block.type === BlockType.Text && (
          <BlockTextActions
            label={block.label}
            value={block.value}
            checked={block.meta.checked}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onMetaChange={handleMetaChange}
          />
        )}
        {block.type === BlockType.Numeric && (
          <BlockNumericActions
            label={block.label}
            value={block.value}
            checked={block.meta.checked}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onMetaChange={handleMetaChange}
          />
        )}
        {block.type === BlockType.SlotTracker && (
          <BlockSlotTrackerActions
            block={block}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onMetaChange={handleMetaChange}
          />
        )}

        {block.type === BlockType.Skill && (
          <BlockSkillActions
            label={block.label}
            value={block.value}
            checked={block.meta.checked}
            hideModifier={block.meta.hideModifier}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onMetaChange={handleMetaChange}
          />
        )}
        {block.type === BlockType.DicePool && (
          <BlockDicePoolActions
            label={block.label}
            value={block.value}
            checked={block.meta.checked}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onMetaChange={handleMetaChange}
          />
        )}
        {block.type === BlockType.Link && (
          <BlockLinkActions
            hasDisplayName={block.meta.hasDisplayName}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onMetaChange={handleMetaChange}
          />
        )}
        {block.type === BlockType.Separator && (
          <BlockSeparatorActions
            advanced={props.advanced}
            hasLabel={block.meta.hasLabel}
            hideDivider={block.meta.hideDivider}
            readonly={props.readonly}
            dataCy={props.dataCy}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onMetaChange={handleMetaChange}
          />
        )}

        {props.onToggleSplit && (
          <Grid item>
            <Link
              component="button"
              variant="caption"
              sx={{
                label: "CharacterDialog-width",
                color: theme.palette.primary.main,
              }}
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
              <FormHelperText sx={{ paddingRight: ".2rem" }}>
                {t("character-dialog.helper-text.help")}
              </FormHelperText>
            </Grid>
          )}

          <Grid item xs>
            <FormHelperText
              sx={{
                fontFamily: miniTheme.helperTextFontFamily,
                fontSize: `${miniTheme.helperTextFontSize}rem`,
                fontWeight: miniTheme.helperTextFontWeight,
              }}
            >
              <ContentEditable
                readonly={!props.advanced}
                border={props.advanced}
                dataCy={`${props.dataCy}.helper-text`}
                value={block.meta.helperText ?? ""}
                onChange={handleOnHelperTextChange}
              />
            </FormHelperText>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
