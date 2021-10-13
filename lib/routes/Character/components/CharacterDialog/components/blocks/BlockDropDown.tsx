import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React, { ReactNode } from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { IDropDownBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockDropDown(
  props: IBlockComponentProps<IDropDownBlock> & {}
) {
  const { t } = useTranslate();

  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  return (
    <>
      <Box>
        <Grid container spacing={1} justify="space-between" wrap="nowrap">
          {isLabelVisible && renderLabel(props)}
          <Grid item>
            {!props.advanced && renderDropDown(props)}
            {props.advanced && renderConfigurationPanel(t, props)}
          </Grid>
        </Grid>
      </Box>
    </>
  );

  function renderLabel(
    props: IBlockComponentProps<IDropDownBlock>
  ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
    return (
      <Grid item>
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
      </Grid>
    );
  }

  function renderDropDown(
    props: IBlockComponentProps<IDropDownBlock>
  ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
    return (
      <Box>
        <Typography>
          <Select
            data-cy={`${props.dataCy}.value`}
            value={props.block.value}
            onChange={(event, node: ReactNode) => {
              if (node && node.props) {
                props.onValueChange(node.props.value);
              }
            }}
          >
            {!!props.block.meta?.possibleValues &&
              props.block.meta?.possibleValues.map((possibleValue, index) => {
                return (
                  <MenuItem key={index} value={possibleValue}>
                    {possibleValue}
                  </MenuItem>
                );
              })}
          </Select>
        </Typography>
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
                  justify={"center"}
                  wrap="nowrap"
                  spacing={1}
                  key={index}
                >
                  <Grid item>
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
                  <Grid item xs>
                    {renderRemoveButton(t, index, props)}
                  </Grid>
                </Grid>
              );
            })}
          {renderAddButton(t, props)}
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

function renderRemoveButton(
  t: any,
  index: number,
  props: IBlockComponentProps<IDropDownBlock>
) {
  return (
    <Tooltip title={t("character-dialog.control.remove-dropdown-item")}>
      <IconButton
        size="small"
        data-cy={`${props.dataCy}.remove-dropdown-item`}
        onClick={() => {
          handleRemoveDropDownItem(props);
        }}
      >
        <RemoveCircleOutlineIcon />
      </IconButton>
    </Tooltip>
  );

  function handleRemoveDropDownItem(
    props: IBlockComponentProps<IDropDownBlock>
  ) {
    if (props.block.meta) {
      const copy = [...props.block.meta.possibleValues];
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
