import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import HelpIcon from "@material-ui/icons/Help";
import React from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { ISkillBlock } from "../../../../../../domains/character/types";
import {
  AllDiceCommandGroups,
  IDiceCommandGroup,
  IDiceCommandNames,
  IRollDiceOptions,
} from "../../../../../../domains/dice/Dice";
import { FateSkillsDescriptions } from "../../../domains/FateSkillsDescriptions";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { CharacterCircleBox } from "../CharacterCircleBox";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";

export function BlockSkill(
  props: IBlockComponentProps<ISkillBlock> & {
    onSkillClick(
      options: IRollDiceOptions,
      commands: Array<IDiceCommandNames> | undefined
    ): void;
  }
) {
  const theme = useTheme();
  const isSlotTrackerVisible = props.block.meta.checked !== undefined;
  const skillDescription =
    FateSkillsDescriptions[props.block.label.toLowerCase()] ?? "";

  const skillLabel = (
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
  );

  return (
    <>
      <Box>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          <Grid item xs={2}>
            <CharacterCircleBox
              fontSize="1.2rem"
              clickable={!props.advanced}
              onClick={() => {
                if (props.advanced) {
                  return;
                }
                const bonus = parseInt(props.block.value) || 0;
                props.onSkillClick?.(
                  { bonus, bonusLabel: props.block.label },
                  props.block.meta.commands?.flatMap((c) => {
                    const group = AllDiceCommandGroups.find((g) => {
                      return g.id === c;
                    }) as IDiceCommandGroup;

                    return group?.value;
                  })
                );
              }}
            >
              <ContentEditable
                data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
                border={props.advanced}
                readonly={!props.advanced}
                className={css({
                  cursor: props.advanced ? "inherit" : "pointer",
                })}
                value={props.block.value}
                onChange={(value) => {
                  props.onValueChange(value);
                }}
              />
            </CharacterCircleBox>
          </Grid>
          <Grid item className={css({ flex: "1 0 auto" })}>
            {skillLabel}
            {!props.advanced && (
              <>
                {skillDescription && (
                  <>
                    <Tooltip
                      placement="right-start"
                      classes={{
                        tooltip: css({
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          boxShadow: theme.shadows[1],
                          fontSize: "1rem",
                        }),
                      }}
                      title={
                        <>
                          <Typography
                            className={css({
                              fontWeight: "bold",
                              marginBottom: ".5rem",
                            })}
                          >
                            {skillDescription.quick}
                          </Typography>
                          <Typography>{skillDescription.long}</Typography>
                        </>
                      }
                    >
                      <HelpIcon
                        className={css({
                          marginLeft: ".5rem",
                          fontSize: "1rem",
                        })}
                      />
                    </Tooltip>
                  </>
                )}
              </>
            )}
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
  return (
    <>
      <Grid item>
        <DiceMenuForCharacterSheet
          commandIds={props.block.meta.commands || []}
          onChange={(newCommandIds) => {
            props.onMetaChange({
              ...props.block.meta,
              commands: newCommandIds,
            });
          }}
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
            ? "Add Toggle"
            : "Remove Toggle"}
        </Link>
      </Grid>
    </>
  );
}

BlockSkillActions.displayName = "BlockSkillActions";
