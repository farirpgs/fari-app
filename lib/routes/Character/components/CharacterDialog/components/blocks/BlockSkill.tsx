import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React, { useContext } from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { Delays } from "../../../../../../constants/Delays";
import { DiceContext } from "../../../../../../contexts/DiceContext/DiceContext";
import { ISkillBlock } from "../../../../../../domains/character/types";
import { CommmandSetOptions } from "../../../../../../domains/dice/Dice";
import { Icons } from "../../../../../../domains/Icons/Icons";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { BlockSelectors } from "../../domains/BlockSelectors/BlockSelectors";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { CircleTextField } from "../CircleTextField";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";
import { Pool } from "./BlockDicePool";

export function BlockSkill(props: IBlockComponentProps<ISkillBlock>) {
  const { t } = useTranslate();
  const theme = useTheme();

  const diceManager = useContext(DiceContext);
  const [state, setState] = useLazyState({
    value: props.block.value,
    onChange: props.onValueChange,
    delay: Delays.field,
  });

  const isToggleVisible =
    props.block.meta?.checked === true || props.block.meta?.checked === false;

  const isSelected = diceManager.state.pool.some(
    (p) => p.blockId === props.block.id
  );
  const numberOfCommands = props.block.meta?.commands?.length ?? 0;
  const hasCommands = numberOfCommands > 0;
  const [firstCommandSet] =
    props.block.meta?.commands?.map((commandId) => {
      return CommmandSetOptions[commandId];
    }) ?? [];
  const rollGroup = BlockSelectors.getRollGroupFromBlock(props.block);
  const shouldDisplayNoCommandsWarning = hasCommands || !props.advanced;
  const RollIcon = firstCommandSet?.icon ?? Icons.ThrowDice;

  return (
    <>
      <Box>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          <Grid item>
            {props.readonly ? (
              <RollIcon className={css({ fontSize: "2rem" })} />
            ) : (
              <Pool
                tooltipTitle={
                  shouldDisplayNoCommandsWarning
                    ? t("character-dialog.skill-block.roll")
                    : t("character-dialog.skill-block.missing-dice-commands")
                }
                fontSize="1.2rem"
                borderRadius="8px"
                selected={isSelected}
                clickable={!props.readonly}
                borderStyle={"solid"}
                className={css({
                  borderColor: shouldDisplayNoCommandsWarning
                    ? "inherit"
                    : theme.palette.warning.light,
                })}
                onContextMenu={(event) => {
                  event.preventDefault();

                  diceManager.actions.setOptions({ listResults: false });
                  diceManager.actions.addOrRemovePoolElement({
                    blockId: props.block.id,
                    blockType: props.block.type,
                    label: props.block.label,
                    rollGroup: rollGroup,
                  });
                }}
                onClick={() => {
                  if (!hasCommands) {
                    return;
                  }
                  const diceRollResult = diceManager.actions.roll([rollGroup], {
                    listResults: false,
                  });
                  props.onRoll(diceRollResult);
                }}
              >
                <RollIcon
                  className={css({
                    fontSize: "2.3rem",
                  })}
                />
              </Pool>
            )}
          </Grid>
          {!props.block.meta.hideModifier && (
            <Grid item>
              <CircleTextField
                data-cy={`${props.dataCy}.value`}
                value={state}
                readonly={props.readonly}
                onChange={(newState) => {
                  setState(newState);
                }}
              />
            </Grid>
          )}
          <Grid item xs>
            <FateLabel
              className={css({ display: "inline-block", width: "100%" })}
            >
              <ContentEditable
                data-cy={`${props.dataCy}.label`}
                readonly={props.readonly || !props.advanced}
                border={props.advanced}
                value={props.block.label}
                onChange={(value) => {
                  props.onLabelChange(value);
                }}
              />
            </FateLabel>
          </Grid>

          {isToggleVisible && (
            <Grid item>
              <BlockToggleMeta
                readonly={props.readonly}
                dataCy={props.dataCy}
                block={props.block}
                onMetaChange={props.onMetaChange}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
BlockSkill.displayName = "BlockSkill";

export function BlockSkillActions(
  props: IBlockActionComponentProps<ISkillBlock>
) {
  const theme = useTheme();
  const { t } = useTranslate();

  const commands = props.block.meta.commands || [];

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
            props.onMetaChange({
              ...props.block.meta,
              hideModifier: !props.block.meta.hideModifier,
            });
          }}
          underline="hover"
        >
          {!props.block.meta.hideModifier
            ? t("character-dialog.control.hide-modifer")
            : t("character-dialog.control.show-modifier")}
        </Link>
      </Grid>
      <Grid item>
        <DiceMenuForCharacterSheet
          commandSetIds={commands}
          onChange={(newCommandIds) => {
            props.onMetaChange({
              ...props.block.meta,
              commands: newCommandIds,
            });
          }}
          render={(diceMenuProps) => (
            <Tooltip title={commands.join(" + ")}>
              <Link
                component="button"
                variant="caption"
                className={css({
                  color: theme.palette.primary.main,
                })}
                onClick={(e: any) => {
                  if (!diceMenuProps.open) {
                    diceMenuProps.openMenu(e);
                  } else {
                    diceMenuProps.closeMenu();
                  }
                }}
                underline="hover"
              >
                {t("character-dialog.control.set-dice")}
              </Link>
            </Tooltip>
          )}
        />
      </Grid>
      <Grid item>
        <Link
          component="button"
          variant="caption"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            props.onMetaChange({
              ...props.block.meta,
              checked:
                props.block.meta.checked === undefined ? false : undefined,
            });
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
