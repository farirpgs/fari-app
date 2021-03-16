import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { ISlotTrackerBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockSlotTracker(
  props: IBlockComponentProps<ISlotTrackerBlock> & {
    onToggleBox(boxIndex: number): void;
    onBoxLabelChange(boxIndex: number, label: string): void;
    onAddBox(): void;
    onRemoveBox(): void;
  }
) {
  const { t } = useTranslate();
  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;
  return (
    <>
      <Box>
        {isLabelVisible && (
          <Box>
            <Grid container justify={"space-between"} wrap="nowrap" spacing={1}>
              <Grid item className={css({ flex: "1 1 auto" })}>
                <FateLabel
                  display="inline"
                  align={props.advanced ? "inherit" : "center"}
                >
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
              {props.advanced && (
                <>
                  <Grid item>
                    <Tooltip title={t("character-dialog.control.remove-box")}>
                      <IconButton
                        size="small"
                        data-cy={`character-dialog.${props.section.label}.${props.block.label}.remove-box`}
                        onClick={() => {
                          props.onRemoveBox();
                        }}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title={t("character-dialog.control.add-box")}>
                      <IconButton
                        data-cy={`character-dialog.${props.section.label}.${props.block.label}.add-box`}
                        size="small"
                        onClick={() => {
                          props.onAddBox();
                        }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}

        <Grid container justify="center" spacing={1}>
          {props.block.value.map((box, boxIndex) => {
            const isBoxLabelVisible =
              !!previewContentEditable({ value: box.label }) || props.advanced;

            return (
              <Grid item key={boxIndex}>
                <Box
                  className={css({
                    display: "flex",
                    justifyContent: "center",
                  })}
                >
                  <Checkbox
                    data-cy={`character-dialog.${props.section.label}.${props.block.label}.box.${boxIndex}.value`}
                    color="primary"
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    className={css({ padding: "0" })}
                    checked={box.checked}
                    onChange={(event) => {
                      if (props.readonly) {
                        return;
                      }
                      props.onToggleBox(boxIndex);
                    }}
                  />
                </Box>
                {isBoxLabelVisible && (
                  <Box>
                    <FateLabel className={css({ textAlign: "center" })}>
                      <ContentEditable
                        data-cy={`character-dialog.${props.section.label}.${props.block.label}.box.${boxIndex}.label`}
                        readonly={!props.advanced}
                        border={props.advanced}
                        value={box.label}
                        onChange={(value) => {
                          props.onBoxLabelChange(boxIndex, value);
                        }}
                      />
                    </FateLabel>
                  </Box>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
BlockSlotTracker.displayName = "BlockSlotTracker";
