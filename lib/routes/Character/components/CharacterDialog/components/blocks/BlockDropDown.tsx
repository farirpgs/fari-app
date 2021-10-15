import { css } from "@emotion/css";
import { Link, TextField, useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ArrowDownwardRounded from "@material-ui/icons/ArrowDownwardRounded";
import ArrowUpwardRounded from "@material-ui/icons/ArrowUpwardRounded";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { IDropDownBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";

const smallerIcon = css({
  fontSize: "1rem",
});
const smallerButton = css({
  padding: "0rem",
});
const defaultValue = " ";

export function BlockDropDown(
  props: IBlockComponentProps<IDropDownBlock> & {}
) {
  const { t } = useTranslate();

  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  function handleDropDownItemChange(index: number, newValue: string) {
    if (props.block.meta) {
      const copy = [...props.block.meta.possibleValues];
      const currentValue = copy[index];

      copy[index] = newValue;

      if (props.block.value === currentValue) {
        props.onValueChange([newValue]);
      }

      props.onMetaChange({
        ...props.block.meta,
        possibleValues: [...copy],
      });
    }
  }

  function handleMoveDropDownItem(direction: Direction, index: number) {
    if (props.block.meta) {
      const copy = [...props.block.meta.possibleValues];

      const targetIndex = direction === Direction.Down ? index + 1 : index - 1;

      const targetValue = copy[targetIndex];
      if (!targetValue) return;

      copy[targetIndex] = copy[index];
      copy[index] = targetValue;

      props.onMetaChange({
        ...props.block.meta,
        possibleValues: [...copy],
      });
    }
  }

  return (
    <>
      {!props.advanced && (
        <Box>
          <Grid container justify="space-between">
            <Grid item>{isLabelVisible && renderLabel()}</Grid>
            <Grid item>{renderDropDown()}</Grid>
          </Grid>
        </Box>
      )}

      {props.advanced && (
        <Box>
          {isLabelVisible && renderLabel()}
          <div style={{ marginTop: "1em" }}>{renderConfigurationPanel(t)}</div>
        </Box>
      )}
    </>
  );

  function renderLabel() {
    return (
      <Box>
        <FateLabel display="inline">
          <ContentEditable
            readonly={props.readonly}
            border={props.advanced}
            data-cy={`${props.dataCy}.label`}
            value={props.block.label}
            onChange={(value) => {
              props.onLabelChange(value);
            }}
          />
        </FateLabel>
      </Box>
    );
  }

  function renderDropDown() {
    return (
      <Box>
        {props.block.meta.asMultiple && (
          <Autocomplete
            multiple
            size="small"
            options={[defaultValue, ...props.block.meta?.possibleValues]}
            getOptionLabel={(option) => option}
            defaultValue={[props.block.meta?.possibleValues[0]]}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label=""
                placeholder=""
              />
            )}
            value={props.block.value}
            onChange={(event, newValue) => {
              if (newValue && newValue.length > 0) {
                props.onValueChange(newValue);
              } else {
                props.onValueChange([defaultValue]);
              }
            }}
          />
        )}

        {!props.block.meta.asMultiple && (
          <Autocomplete
            size="small"
            options={[defaultValue, ...props.block.meta?.possibleValues]}
            getOptionLabel={(option) => option}
            defaultValue={props.block.meta?.possibleValues[0]}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label=""
                placeholder=""
              />
            )}
            value={props.block.value[0]}
            onChange={(event, newValue) => {
              if (newValue) {
                props.onValueChange([newValue]);
              } else {
                props.onValueChange([defaultValue]);
              }
            }}
          />
        )}
      </Box>
    );
  }

  function renderConfigurationPanel(t: any) {
    return (
      <Box>
        <Typography>
          {!!props.block.meta?.possibleValues &&
            props.block.meta.possibleValues.map((value, index) => {
              return (
                <Grid
                  container
                  justify={"flex-end"}
                  wrap="nowrap"
                  spacing={1}
                  key={index}
                >
                  <Grid item xs={10}>
                    <ContentEditable
                      readonly={false}
                      border={true}
                      data-cy={`${props.dataCy}.dropdown.item`}
                      value={value}
                      onChange={(newValue) => {
                        handleDropDownItemChange(index, newValue);
                      }}
                    />
                  </Grid>
                  <Grid item>{renderGoUpButton(t, index)}</Grid>
                  <Grid item>{renderGoDownButton(t, index)}</Grid>
                  <Grid item>{renderRemoveButton(t, index)}</Grid>
                </Grid>
              );
            })}
          <div style={{ marginTop: "1em" }}>{renderAddButton(t)}</div>
        </Typography>
      </Box>
    );
  }

  function renderGoUpButton(t: any, index: number) {
    return (
      <Tooltip
        title={t("character-dialog.control.remove-dropdown-item")}
        className={css({})}
      >
        <IconButton
          size="small"
          data-cy={`${props.dataCy}.remove-dropdown-item`}
          onClick={() => {
            handleMoveDropDownItem(Direction.Up, index);
          }}
        >
          <ArrowUpwardRounded className={smallerIcon} />
        </IconButton>
      </Tooltip>
    );
  }

  function renderGoDownButton(t: any, index: number) {
    return (
      <Tooltip title={t("character-dialog.control.remove-dropdown-item")}>
        <IconButton
          size="small"
          className={smallerButton}
          data-cy={`${props.dataCy}.remove-dropdown-item`}
          onClick={() => {
            handleMoveDropDownItem(Direction.Down, index);
          }}
        >
          <ArrowDownwardRounded className={smallerIcon} />
        </IconButton>
      </Tooltip>
    );
  }

  function renderRemoveButton(t: any, index: number) {
    return (
      <Tooltip title={t("character-dialog.control.remove-dropdown-item")}>
        <IconButton
          size="small"
          className={smallerButton}
          data-cy={`${props.dataCy}.remove-dropdown-item`}
          onClick={() => {
            handleRemoveDropDownItem();
          }}
        >
          <RemoveCircleOutlineIcon className={smallerIcon} />
        </IconButton>
      </Tooltip>
    );

    function handleRemoveDropDownItem() {
      if (props.block.meta) {
        const copy = [...props.block.meta.possibleValues];

        if (props.block.value === copy[index]) {
          props.onValueChange([props.block.meta.possibleValues[0]]);
        }

        copy.splice(index, 1);

        props.onMetaChange({
          ...props.block.meta,
          possibleValues: [...copy],
        });
      }
    }
  }

  function renderAddButton(t: any) {
    return (
      <Tooltip title={t("character-dialog.control.add-dropdown-item")}>
        <IconButton
          size="small"
          className={smallerButton}
          data-cy={`${props.dataCy}.remove-dropdown-item`}
          onClick={() => {
            handleAddDropDownItem(props);
          }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip>
    );

    function handleAddDropDownItem(
      props: IBlockComponentProps<IDropDownBlock>
    ) {
      if (props.block.meta) {
        const copy = [...props.block.meta.possibleValues];

        copy.push("new value");

        props.onMetaChange({
          ...props.block.meta,
          possibleValues: [...copy],
        });
      }
    }
  }
}

enum Direction {
  Up,
  Down,
}

BlockDropDown.displayName = "BlockDropDown";

export function BlockDropDownActions(
  props: IBlockActionComponentProps<IDropDownBlock>
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
            props.onMetaChange({
              ...props.block.meta,
              asMultiple: !props.block.meta.asMultiple,
            });
          }}
        >
          {props.block.meta.asMultiple
            ? t("character-dialog.control.as-single")
            : t("character-dialog.control.as-multiple")}
        </Link>
      </Grid>
    </>
  );
}
