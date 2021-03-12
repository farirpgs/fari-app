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
import { useTextColors } from "../../../../../../hooks/useTextColors/useTextColors";
import { FateSkillsDescriptions } from "../../../domains/FateSkillsDescriptions";
import { CommandGroups } from "../../domains/CommandGroups/CommandGroups";
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
  const tooltipBackground = "#182026";
  const tooltipColor = useTextColors(tooltipBackground);
  const commandGroupsMatch =
    props.block.meta?.commands?.map((commandId) => {
      return AllDiceCommandGroups.find(
        (c) => c.id === commandId
      ) as IDiceCommandGroup;
    }) ?? [];

  const isSlotTrackerVisible = props.block.meta.checked !== undefined;
  const skillDescription =
    FateSkillsDescriptions[props.block.label.toLowerCase()] ?? "";

  const canRoll = !props.editing;

  const skillLabel = (
    <FateLabel className={css({ display: "inline-block" })}>
      <ContentEditable
        data-cy={`character-dialog.${props.section.label}.${props.block.label}.label`}
        readonly={!props.editing}
        border={props.editing}
        value={props.block.label}
        onChange={(value) => {
          props.onLabelChange(value);
        }}
      />
    </FateLabel>
  );
  const hasCommands = !!props.block.meta.commands?.length;

  const blockCommandNames = CommandGroups.getCommandNamesFromBlock(props.block);

  return (
    <>
      <Box>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          <Grid item xs={2}>
            <Box>
              <CharacterCircleBox
                fontSize="1.2rem"
                clickable={canRoll}
                onClick={() => {
                  if (!canRoll) {
                    return;
                  }
                  const bonus = parseInt(props.block.value) || 0;

                  if (hasCommands) {
                    props.onSkillClick?.(
                      {
                        pool: false,
                        bonus,
                        bonusLabel: props.block.label,
                      },
                      blockCommandNames
                    );
                  } else {
                    props.onSkillClick?.(
                      {
                        pool: false,
                        bonus,
                        bonusLabel: props.block.label,
                      },
                      undefined
                    );
                  }
                }}
              >
                <ContentEditable
                  data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
                  border={props.editing}
                  readonly={!props.editing}
                  className={css({
                    cursor: !canRoll ? "inherit" : "pointer",
                  })}
                  value={props.block.value}
                  onChange={(value) => {
                    props.onValueChange(value);
                  }}
                />
              </CharacterCircleBox>
            </Box>
          </Grid>
          <Grid item className={css({ flex: "1 0 auto" })}>
            {skillLabel}
            {!props.editing && (
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
                {commandGroupsMatch.length > 1 && (
                  <Box>
                    <Grid container spacing={1} alignItems="center">
                      {commandGroupsMatch.map((commandGroup, index) => {
                        return (
                          <Grid item key={index}>
                            <Tooltip title={commandGroup.label}>
                              <commandGroup.icon
                                className={css({
                                  display: "flex",
                                  width: "2rem",
                                  height: "2rem",
                                })}
                              />
                            </Tooltip>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
              </>
            )}
          </Grid>
          {commandGroupsMatch.length === 1 && (
            <Grid item>
              {commandGroupsMatch.map((commandGroup, index) => {
                return (
                  <Grid item key={index}>
                    <Tooltip title={commandGroup.label}>
                      <commandGroup.icon
                        className={css({
                          display: "flex",
                          width: "2rem",
                          height: "2rem",
                        })}
                      />
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          )}

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
          commandGroupIds={props.block.meta.commands || []}
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
          {/* TODO: text */}
          {props.block.meta.checked === undefined
            ? "Add Toggle"
            : "Remove Toggle"}
        </Link>
      </Grid>
    </>
  );
}

BlockSkillActions.displayName = "BlockSkillActions";
