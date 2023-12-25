import { Grid, Link, useTheme } from "@mui/material";
import React from "react";
import { Delays } from "../../../../../../constants/Delays";
import {
  BlockType,
  ISkillBlock,
} from "../../../../../../domains/character/types";
import {
  IDiceCommandId,
  IDicePoolResult,
} from "../../../../../../domains/dice/Dice";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { IBlockHandlers } from "../../types/IBlockComponentProps";
import { CircleTextField } from "../CircleTextField";
import { BlockDicePool } from "./BlockDicePool";

export const BlockSkill = React.memo(
  (
    props: {
      label: string | undefined;
      value: string | undefined;
      blockId: string;
      checked: boolean | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      blockType: BlockType;
      commands: Array<IDiceCommandId> | undefined;
      hideModifier: boolean | undefined;
      dataCy?: string;
      onRoll(diceRollResult: IDicePoolResult): void;
    } & IBlockHandlers<ISkillBlock>,
  ) => {
    const [state, setState] = useLazyState({
      value: props.value,
      onChange: props.onValueChange,
      delay: Delays.field,
    });

    return (
      <BlockDicePool
        advanced={props.advanced}
        value={props.value}
        label={props.label}
        checked={props.checked}
        blockId={props.blockId}
        blockType={props.blockType}
        hideModifier={props.hideModifier}
        commands={props.commands}
        dataCy={props.dataCy}
        onLabelChange={props.onLabelChange}
        onValueChange={props.onValueChange}
        onMetaChange={props.onMetaChange}
        onRoll={props.onRoll}
        readonly={props.readonly}
        mid={
          <>
            {!props.hideModifier && (
              <CircleTextField
                dataCy={`${props.dataCy}.value`}
                value={state}
                readonly={props.readonly}
                onChange={setState}
              />
            )}
          </>
        }
      />
    );
  },
);
BlockSkill.displayName = "BlockSkill";

export const BlockSkillActions = React.memo(
  (
    props: {
      value: string | undefined;
      label: string | undefined;
      checked: boolean | undefined;
      hideModifier: boolean | undefined;
    } & IBlockHandlers<ISkillBlock>,
  ) => {
    const theme = useTheme();
    const { t } = useTranslate();

    return (
      <>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            sx={{
              color: theme.palette.primary.main,
            }}
            onClick={() => {
              props.onMetaChange((prev) => ({
                ...prev,
                hideModifier: !prev.hideModifier,
              }));
            }}
            underline="hover"
          >
            {!props.hideModifier
              ? t("character-dialog.control.hide-modifer")
              : t("character-dialog.control.show-modifier")}
          </Link>
        </Grid>

        <Grid item>
          <Link
            component="button"
            variant="caption"
            sx={{
              color: theme.palette.primary.main,
            }}
            onClick={() => {
              props.onMetaChange((prev) => ({
                ...prev,
                checked: prev.checked === undefined ? false : undefined,
              }));
            }}
            underline="hover"
          >
            {props.checked === undefined
              ? t("character-dialog.control.add-toggle")
              : t("character-dialog.control.remove-toggle")}
          </Link>
        </Grid>
      </>
    );
  },
);

BlockSkillActions.displayName = "BlockSkillActions";
