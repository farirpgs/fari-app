import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useContext } from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { DiceContext } from "../../../../../../contexts/DiceContext/DiceContext";
import { ISkillBlock } from "../../../../../../domains/character/types";
import { AllDiceCommandGroups } from "../../../../../../domains/dice/Dice";
import { Icons } from "../../../../../../domains/Icons/Icons";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { FateSkillsDescriptions } from "../../../domains/FateSkillsDescriptions";
import { Block } from "../../domains/Block/Block";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { CircleTextField } from "../CircleTextField";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";
import { IDicePool, IDicePoolElement, Pool } from "./BlockDicePool";
export function BlockSkill(
  props: IBlockComponentProps<ISkillBlock> & {
    pool: IDicePool;
    onPoolClick(element: IDicePoolElement): void;
  }
) {
  const theme = useTheme();
  const { t } = useTranslate();
  const [state, setState] = useLazyState({
    value: props.block.value,
    onChange: props.onValueChange,
    delay: 750,
  });

  const isSlotTrackerVisible =
    props.block.meta?.checked === true || props.block.meta?.checked === false;
  const skillDescription =
    FateSkillsDescriptions[props.block.label.toLowerCase()] ?? "";

  const isSelected = props.pool.some((p) => p.blockId === props.block.id);
  const diceManager = useContext(DiceContext);
  const [firstCommandGroup] =
    props.block.meta?.commands?.map((commandId) => {
      return AllDiceCommandGroups[commandId];
    }) ?? [];
  const commandOptionList = Block.getCommandOptionList(props.block);

  const RollIcon = firstCommandGroup?.icon ?? Icons.ThrowDice;

  return (
    <>
      <Box>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          <Grid item>
            <Pool
              tooltipTitle={t("character-dialog.skill-block.roll")}
              fontSize="1.2rem"
              borderRadius="8px"
              selected={isSelected}
              clickable={!props.readonly}
              borderStyle={"solid"}
              onClick={() => {
                diceManager.actions.setOptions({ listResults: false });
                props.onPoolClick({
                  blockId: props.block.id,
                  blockType: props.block.type,
                  label: props.block.label,
                  commandOptionList: commandOptionList,
                });
              }}
            >
              <RollIcon className={css({ fontSize: "2.3rem" })} />
            </Pool>
          </Grid>
          {!props.block.meta.hideModifier && (
            <Grid item>
              <CircleTextField
                data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
                value={state}
                readonly={props.readonly}
                onChange={(newState) => {
                  setState(newState);
                }}
              />
            </Grid>
          )}
          <Grid item xs>
            <FateLabel className={css({ display: "inline-block" })}>
              <ContentEditable
                data-cy={`character-dialog.${props.section.label}.${props.block.label}.label`}
                readonly={!props.advanced}
                border={props.advanced}
                value={props.block.label}
                onChange={(value) => {
                  props.onLabelChange(value);
                }}
              />
            </FateLabel>
          </Grid>

          {isSlotTrackerVisible && (
            <Grid item>
              <BlockToggleMeta
                readonly={props.readonly}
                pageIndex={props.pageIndex}
                sectionIndex={props.sectionIndex}
                section={props.section}
                block={props.block}
                blockIndex={props.blockIndex}
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
        >
          {!props.block.meta.hideModifier
            ? t("character-dialog.control.hide-modifer")
            : t("character-dialog.control.show-modifier")}
        </Link>
      </Grid>
      <Grid item>
        <DiceMenuForCharacterSheet
          commandGroupIds={commands}
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
