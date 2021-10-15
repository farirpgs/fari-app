import { css } from "@emotion/css";
import { TextField } from "@material-ui/core";
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
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

const smallerIcon = css({
  fontSize: "1rem",
});
const smallerButton = css({
  padding: "0rem",
});

export function BlockDropDown(
  props: IBlockComponentProps<IDropDownBlock> & {}
) {
  const { t } = useTranslate();

  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  return (
    <>
      {!props.advanced && (
        <Box>
          <Grid container justify="space-between">
            <Grid item>{isLabelVisible && renderLabel(props)}</Grid>
            <Grid item>{renderDropDown(props)}</Grid>
          </Grid>
        </Box>
      )}

      {props.advanced && (
        <Box>
          {isLabelVisible && renderLabel(props)}
          <div style={{ marginTop: "1em" }}>
            {renderConfigurationPanel(t, props)}
          </div>
        </Box>
      )}
    </>
  );

  function renderLabel(
    props: IBlockComponentProps<IDropDownBlock>
  ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
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

  function renderDropDown(
    props: IBlockComponentProps<IDropDownBlock>
  ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
    return (
      <Box>
        <Autocomplete
          multiple
          size="small"
          options={props.block.meta?.possibleValues}
          getOptionLabel={(option) => option}
          defaultValue={[props.block.meta?.possibleValues[0]]}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="" placeholder="" />
          )}
          value={props.block.value}
          onChange={(event, newValue) => {
            if (newValue) {
              props.onValueChange(newValue);
            }
          }}
        />

        <Autocomplete
          size="small"
          options={props.block.meta?.possibleValues}
          getOptionLabel={(option) => option}
          defaultValue={props.block.meta?.possibleValues[0]}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="" placeholder="" />
          )}
          value={props.block.value[0]}
          onChange={(event, newValue) => {
            if (newValue) {
              props.onValueChange([newValue]);
            }
          }}
        />

        {/* {!!props.block.meta?.possibleValues &&
            props.block.meta?.possibleValues.map((possibleValue, index) => {
              return (
                <MenuItem key={index} value={possibleValue}>
                  {possibleValue}
                </MenuItem>
              );
            })} */}
      </Box>
    );
  }

  function renderConfigurationPanel(
    t: any,
    props: IBlockComponentProps<IDropDownBlock>
  ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
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
                        handleDropDownItemChange(index, newValue, props);
                      }}
                    />
                  </Grid>
                  <Grid item>{renderGoUpButton(t, index, props)}</Grid>
                  <Grid item>{renderGoDownButton(t, index, props)}</Grid>
                  <Grid item>{renderRemoveButton(t, index, props)}</Grid>
                </Grid>
              );
            })}
          <div style={{ marginTop: "1em" }}>{renderAddButton(t, props)}</div>
        </Typography>
      </Box>
    );
  }
}

function handleDropDownItemChange(
  index: number,
  newValue: string,
  props: IBlockComponentProps<IDropDownBlock>
) {
  if (props.block.meta) {
    const copy = [...props.block.meta.possibleValues];
    const currentValue = copy[index];

    copy[index] = newValue;

    if (props.block.value === currentValue) {
      props.onValueChange(newValue);
    }

    props.onMetaChange({
      ...props.block.meta,
      possibleValues: [...copy],
    });
  }
}

function renderGoUpButton(
  t: any,
  index: number,
  props: IBlockComponentProps<IDropDownBlock>
) {
  return (
    <Tooltip
      title={t("character-dialog.control.remove-dropdown-item")}
      className={css({})}
    >
      <IconButton
        size="small"
        data-cy={`${props.dataCy}.remove-dropdown-item`}
        onClick={() => {
          handleMoveDropDownItem(Direction.Up, index, props);
        }}
      >
        <ArrowUpwardRounded className={smallerIcon} />
      </IconButton>
    </Tooltip>
  );
}

function renderGoDownButton(
  t: any,
  index: number,
  props: IBlockComponentProps<IDropDownBlock>
) {
  return (
    <Tooltip title={t("character-dialog.control.remove-dropdown-item")}>
      <IconButton
        size="small"
        className={smallerButton}
        data-cy={`${props.dataCy}.remove-dropdown-item`}
        onClick={() => {
          handleMoveDropDownItem(Direction.Down, index, props);
        }}
      >
        <ArrowDownwardRounded className={smallerIcon} />
      </IconButton>
    </Tooltip>
  );
}

enum Direction {
  Up,
  Down,
}

function handleMoveDropDownItem(
  direction: Direction,
  index: number,
  props: IBlockComponentProps<IDropDownBlock>
) {
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

function renderRemoveButton(
  t: any,
  index: number,
  props: IBlockComponentProps<IDropDownBlock>
) {
  return (
    <Tooltip title={t("character-dialog.control.remove-dropdown-item")}>
      <IconButton
        size="small"
        className={smallerButton}
        data-cy={`${props.dataCy}.remove-dropdown-item`}
        onClick={() => {
          handleRemoveDropDownItem(props);
        }}
      >
        <RemoveCircleOutlineIcon className={smallerIcon} />
      </IconButton>
    </Tooltip>
  );

  function handleRemoveDropDownItem(
    props: IBlockComponentProps<IDropDownBlock>
  ) {
    if (props.block.meta) {
      const copy = [...props.block.meta.possibleValues];

      if (props.block.value === copy[index]) {
        props.onValueChange(props.block.meta.possibleValues[0]);
      }

      copy.splice(index, 1);

      props.onMetaChange({
        ...props.block.meta,
        possibleValues: [...copy],
      });
    }
  }
}

function renderAddButton(t: any, props: IBlockComponentProps<IDropDownBlock>) {
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

  function handleAddDropDownItem(props: IBlockComponentProps<IDropDownBlock>) {
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

BlockDropDown.displayName = "BlockDropDown";
