import { css } from "@emotion/css";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { Delays } from "../../../../../../constants/Delays";
import { ISkillBlock } from "../../../../../../domains/character/types";
import { IDiceRollResult } from "../../../../../../domains/dice/Dice";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockHandlers,
} from "../../types/IBlockComponentProps";
import { CircleTextField } from "../CircleTextField";
import { BlockDicePool } from "./BlockDicePool";

export const BlockSkill = React.memo(
  (
    props: {
      label: string | undefined;
      value: string | undefined;
      checked: boolean | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      dataCy?: string;
      onRoll(diceRollResult: IDiceRollResult): void;
    } & IBlockHandlers<ISkillBlock>
  ) => {
    const [state, setState] = useLazyState({
      value: props.block.value,
      onChange: props.onValueChange,
      delay: Delays.field,
    });

    return (
      <BlockDicePool
        advanced={props.advanced}
        block={props.block}
        dataCy={props.dataCy}
        onLabelChange={props.onLabelChange}
        onValueChange={props.onValueChange}
        onMetaChange={props.onMetaChange}
        onRoll={props.onRoll}
        readonly={props.readonly}
        mid={
          <>
            {!props.block.meta.hideModifier && (
              <CircleTextField
                data-cy={`${props.dataCy}.value`}
                value={state}
                readonly={props.readonly}
                onChange={(newState) => {
                  setState(newState);
                }}
              />
            )}
          </>
        }
        listResults={false}
      />
    );
  }
);
BlockSkill.displayName = "BlockSkill";

export function BlockSkillActions(
  props: IBlockActionComponentProps<ISkillBlock>
) {
  const theme = useTheme();
  const { t } = useTranslate();

  return (
    <>
      <Grid item>
        <Link
          component="button"
          variant="caption"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            props.onMetaChange((prev) => ({
              ...prev,
              hideModifier: !prev.hideModifier,
            }));
          }}
          underline="hover"
        >
          {!props.block.meta.hideModifier
            ? t("character-dialog.control.hide-modifer")
            : t("character-dialog.control.show-modifier")}
        </Link>
      </Grid>

      <Grid item>
        <Link
          component="button"
          variant="caption"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            props.onMetaChange((prev) => ({
              ...prev,
              checked: prev.checked === undefined ? false : undefined,
            }));
          }}
          underline="hover"
        >
          {props.block.meta.checked === undefined
            ? t("character-dialog.control.add-toggle")
            : t("character-dialog.control.remove-toggle")}
        </Link>
      </Grid>
    </>
  );
}

BlockSkillActions.displayName = "BlockSkillActions";
