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
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockSlotTracker(
  props: IBlockComponentProps<ISlotTrackerBlock>
) {
  const { t } = useTranslate();

  const [blockValue, setBlockValue] = useLazyState({
    value: props.block.value,
    delay: 750,
    onChange: (newValue) => {
      props.onValueChange(newValue);
    },
  });

  function handleAddBox() {
    setBlockValue((draft) => {
      const lastIndex = draft.length - 1;
      const lastLabel = draft[lastIndex]?.label;
      const parsedLabel = parseInt(lastLabel);
      const nextLabel = Number.isInteger(parsedLabel)
        ? (draft.length + 1).toString()
        : "";

      return [
        ...draft,
        {
          label: nextLabel,
          checked: false,
        },
      ];
    });
  }

  function handleRemoveBox() {
    setBlockValue((draft) => {
      return draft.filter((box, boxIndex, boxes) => {
        return boxIndex !== boxes.length - 1;
      });
    });
  }

  function handleToggleBox(boxIndexToToggle: number) {
    setBlockValue((draft) => {
      return draft.map((box, boxIndex) => {
        if (boxIndex === boxIndexToToggle) {
          return {
            ...box,
            checked: !box.checked,
          };
        }
        return box;
      });
    });
  }

  function handleSetBoxLabel(boxIndexToRename: number, label: string) {
    setBlockValue((draft) => {
      return draft.map((box, boxIndex) => {
        if (boxIndex === boxIndexToRename) {
          return {
            ...box,
            label: label,
          };
        }
        return box;
      });
    });
  }

  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  return (
    <>
      <Box>
        {!props.readonly && isLabelVisible && (
          <Box>
            <Grid container justify={"center"} wrap="nowrap" spacing={1}>
              {!props.readonly && (
                <>
                  <Grid item>
                    <Tooltip title={t("character-dialog.control.remove-box")}>
                      <IconButton
                        size="small"
                        data-cy={`${props.dataCy}.remove-box`}
                        onClick={() => {
                          handleRemoveBox();
                        }}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </>
              )}
              {isLabelVisible && (
                <Grid item className={css({ minWidth: "4rem" })}>
                  <FateLabel
                    display="inline"
                    align={props.readonly ? "inherit" : "center"}
                  >
                    <ContentEditable
                      data-cy={`${props.dataCy}.label`}
                      readonly={props.readonly}
                      border={props.advanced}
                      value={props.block.label}
                      onChange={(value) => {
                        props.onLabelChange(value);
                      }}
                    />
                  </FateLabel>
                </Grid>
              )}
              {!props.readonly && (
                <>
                  <Grid item>
                    <Tooltip title={t("character-dialog.control.add-box")}>
                      <IconButton
                        data-cy={`${props.dataCy}.add-box`}
                        size="small"
                        onClick={() => {
                          handleAddBox();
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
          {blockValue.map((box, boxIndex) => {
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
                    data-cy={`${props.dataCy}.box.${boxIndex}.value`}
                    color="primary"
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    className={css({ padding: "0" })}
                    checked={box.checked}
                    disabled={props.readonly}
                    onChange={(event) => {
                      handleToggleBox(boxIndex);
                    }}
                  />
                </Box>
                {isBoxLabelVisible && (
                  <Box>
                    <FateLabel className={css({ textAlign: "center" })}>
                      <ContentEditable
                        data-cy={`${props.dataCy}.box.${boxIndex}.label`}
                        readonly={props.readonly}
                        border={!props.readonly}
                        value={box.label}
                        // because of useLazyState above
                        noDelay
                        onChange={(value) => {
                          handleSetBoxLabel(boxIndex, value);
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
