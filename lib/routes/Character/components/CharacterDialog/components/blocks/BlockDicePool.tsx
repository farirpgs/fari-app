import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { IDicePoolBlock } from "../../../../../../domains/character/types";
import { IDiceCommandNames } from "../../../../../../domains/dice/Dice";
import { CommandGroups } from "../../domains/CommandGroups/CommandGroups";
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
  const canRoll = !props.advanced && !props.readonly && hasCommands;
  const isSelected = props.pool.some((p) => p.blockId === props.block.id);

  const blockCommandGroups = CommandGroups.getCommandGroupFromBlock(
    props.block
  );
  const blockCommandNames = CommandGroups.getCommandNamesFromBlock(props.block);

  return (
    <>
      <Box>
        <Box>
          <Grid container spacing={1} justify="space-between" wrap="nowrap">
            <Grid item xs>
              <FateLabel display="inline">
                <ContentEditable
                  readonly={!props.advanced}
                  border={props.advanced}
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
                borderRadius="8px"
                selected={isSelected}
                clickable={canRoll}
                borderStyle={hasCommands ? "solid" : "dashed"}
                onClick={() => {
                  if (!canRoll) {
                    return;
                  }

                  props.onPoolClick({
                    blockId: props.block.id,
                    label: previewContentEditable({ value: props.block.label }),
                    commands: blockCommandNames,
                  });
                }}
              >
                <Grid container spacing={1} alignItems="center">
                  {!hasCommands && (
                    <Grid item>
                      <Box width="2rem" height="2rem" />
                    </Grid>
                  )}
                  {blockCommandGroups.map((commandGroup, index) => {
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
              </CharacterCircleBox>
              <Grid item>
                <Box display="flex" justifyContent="flex-start">
                  {/* TODO: Text */}
                  <FormHelperText>{"Dice Pool"}</FormHelperText>
                </Box>
              </Grid>
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
