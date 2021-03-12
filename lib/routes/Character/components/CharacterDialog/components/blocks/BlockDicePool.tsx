import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { IDicePoolBlock } from "../../../../../../domains/character/types";
import {
  AllDiceCommandGroups,
  IDiceCommandGroup,
  IDiceCommandNames,
} from "../../../../../../domains/dice/Dice";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { CharacterCircleBox } from "../CharacterCircleBox";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";

export type IDicePoolElement = {
  blockId: string;
  label: string;
  commands: IDiceCommandNames[];
};

export type IDicePool = Array<IDicePoolElement>;

export function BlockDicePool(
  props: IBlockComponentProps<IDicePoolBlock> & {
    pool: IDicePool;
    onPoolClick(element: IDicePoolElement): void;
  }
) {
  const theme = useTheme();
  const hasCommands = !!props.block.meta.commands?.length;
  const canRoll = !props.editing && hasCommands;
  const isSelected = props.pool.some((p) => p.blockId === props.block.id);

  const commandGroupsMatch =
    props.block.meta?.commands?.map((commandId) => {
      return AllDiceCommandGroups.find(
        (c) => c.id === commandId
      ) as IDiceCommandGroup;
    }) ?? [];

  const commandGroupValues =
    props.block.meta.commands?.flatMap((c) => {
      const group = AllDiceCommandGroups.find((g) => {
        return g.id === c;
      }) as IDiceCommandGroup;
      return group?.value;
    }) ?? [];

  return (
    <>
      <Box>
        <Box>
          <Grid container spacing={1} justify="space-between" wrap="nowrap">
            <Grid item xs>
              <FateLabel display="inline">
                <ContentEditable
                  readonly={!props.editing}
                  border={props.editing}
                  data-cy={`character-dialog.${props.section.label}.${props.block.label}.label`}
                  value={props.block.label}
                  onChange={(value) => {
                    props.onLabelChange(value);
                  }}
                />
              </FateLabel>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          <Grid item>
            <Box>
              <CharacterCircleBox
                fontSize="1.2rem"
                selected={isSelected}
                clickable={canRoll}
                onClick={() => {
                  if (!canRoll) {
                    return;
                  }

                  props.onPoolClick({
                    blockId: props.block.id,
                    label: previewContentEditable({ value: props.block.label }),
                    commands: commandGroupValues,
                  });
                }}
              >
                <Grid container spacing={1} alignItems="center">
                  {!hasCommands && (
                    <Grid item>
                      <HelpOutlineIcon
                        className={css({
                          display: "flex",
                          width: "1.5rem",
                          height: "1.5rem",
                        })}
                      />
                    </Grid>
                  )}
                  {commandGroupsMatch.map((commandGroup, index) => {
                    return (
                      <Grid item key={index}>
                        <Tooltip title={commandGroup.label}>
                          <commandGroup.icon
                            className={css({
                              display: "flex",
                              width: "1.5rem",
                              height: "1.5rem",
                            })}
                          />
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </CharacterCircleBox>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
BlockDicePool.displayName = "BlockDicePool";

export function BlockDicePoolActions(
  props: IBlockActionComponentProps<IDicePoolBlock>
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
    </>
  );
}

BlockDicePoolActions.displayName = "BlockDicePoolActions";
