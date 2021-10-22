import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import RefreshIcon from "@material-ui/icons/Refresh";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { ISkillGrid } from "../../../../../../domains/character/types";
import { BetterDnd } from "../../../BetterDnD/BetterDnd";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";

export interface ISkillGridItem {
  display: boolean;
  checked: boolean;
  name: string;
  description: string;
  connectors: Array<SkillGridConnectorDirection>;
}

export enum SkillGridConnectorDirection {
  RIGHT,
  BOTTOM,
}

export function SkillGrid(props: IBlockComponentProps<ISkillGrid>) {
  const theme = useTheme();
  const columnCount = props.block.meta.columnCount;

  ensureGridIsFilled();

  function ensureGridIsFilled() {
    const rowCount = resolveRowCount();
    const cellCountDelta = resolveCellDelta(columnCount, rowCount);

    if (cellCountDelta !== 0) {
      handleCellDelta(cellCountDelta);
    }
  }

  function resolveCellDelta(columnCount: number, rowCount: number) {
    const allItemsCount = props.block.meta.items.length;
    const gridCellCount = columnCount * rowCount;
    const cellCountDelta = gridCellCount - allItemsCount;

    return cellCountDelta;
  }

  function handleCellDelta(cellCountDelta: number) {
    const missingItemsCount = cellCountDelta > 0 ? cellCountDelta : 0;
    const surplusItemsCount = cellCountDelta < 0 ? -cellCountDelta : 0;

    if (missingItemsCount > 0) {
      const emptyItemsToAppend = buildEmptyItems(cellCountDelta);

      props.onMetaChange({
        ...props.block.meta,
        items: [...props.block.meta.items, ...emptyItemsToAppend],
      });
    } else if (surplusItemsCount > 0) {
      const trimmedItems = [...props.block.meta.items];
      trimmedItems.splice(trimmedItems.length - 1, surplusItemsCount);

      props.onMetaChange({
        ...props.block.meta,
        items: trimmedItems,
      });
    }
  }

  function resolveRowCount() {
    const realItems = getRealItems(props.block.meta.items);

    const realItemsCount = realItems.length;
    const rowCount = Math.ceil(realItemsCount / columnCount);
    return rowCount;
  }

  function buildEmptyItems(numberOfItemsToBuild: number) {
    const items = new Array<ISkillGridItem>();

    for (let i = 0; i < numberOfItemsToBuild; i++) {
      items.push({
        display: false,
        checked: false,
        name: "",
        description: "",
        connectors: new Array<SkillGridConnectorDirection>(),
      });
    }

    return items;
  }

  function getRealItems(allItems: ISkillGridItem[]) {
    const realItems = [...allItems];

    // we specifically need to only take the empty items that are at the end of the array: having empty items in the middle of the grid could be legit
    for (let index = allItems.length - 1; index >= 0; index--) {
      const item = allItems[index];

      const isEmptyItem = !item.display && !item.name && !item.description;
      if (isEmptyItem) {
        realItems.splice(index, 1);
      } else {
        return realItems;
      }
    }

    return realItems;
  }

  function getIsPositionValid(
    direction: SkillGridConnectorDirection,
    item: ISkillGridItem,
    index: number
  ) {
    if (!item.display) {
      return false;
    }

    if (direction === SkillGridConnectorDirection.BOTTOM) {
      const itemBelow = props.block.meta.items[index + columnCount];
      return itemBelow && itemBelow.display;
    }

    if (direction === SkillGridConnectorDirection.RIGHT) {
      const isCurrentItemLastInRow = (index + 1) % columnCount === 0;
      if (isCurrentItemLastInRow) return false;

      const itemOnTheRight = props.block.meta.items[index + 1];
      return itemOnTheRight && itemOnTheRight.display;
    }
  }

  function shouldDisplayConnector(
    direction: SkillGridConnectorDirection,
    item: ISkillGridItem,
    index: number
  ) {
    const isPositionValid = getIsPositionValid(direction, item, index);
    const isConnectorVisible = item.connectors.some(
      (connector) => connector === direction
    );

    const returnValue = {
      isPositionValid: isPositionValid,
      isConnectorVisible: isConnectorVisible,
    };

    return returnValue;
  }

  function handleConnectorClick(
    item: ISkillGridItem,
    index: number,
    connectorDirection: SkillGridConnectorDirection
  ) {
    const bottomConnectorIndex = item.connectors.findIndex(
      (connector) => connector === connectorDirection
    );
    const newConnectors = [...item.connectors];
    if (bottomConnectorIndex >= 0) {
      newConnectors.splice(bottomConnectorIndex, 1);
    } else {
      newConnectors.push(connectorDirection);
    }
    const newItem = {
      ...item,
      connectors: newConnectors,
    };
    const newItems = [...props.block.meta.items];
    newItems[index] = newItem;

    props.onMetaChange({
      ...props.block.meta,
      items: newItems,
    });
  }

  const columnSize = 300;
  const paddingRem = 1;

  return (
    <>
      <Box p="1rem" width="200px">
        {renderColumnCountEditor()}
      </Box>
      <Box
        className={css({
          width: "100%",
          height: "auto",
          overflowX: "auto",
          background: theme.palette.background.default,
        })}
      >
        <Box
          className={css({
            display: "flex",
            flexWrap: "wrap",
            width: `${columnSize * columnCount}px`,
            alignItems: "stretch",
          })}
        >
          {props.block.meta.items.map((item, index) => {
            return (
              <BetterDnd
                key={index}
                direction="horizontal"
                index={index}
                className={css({
                  display: "flex",
                  width: `${columnSize}px`,
                  padding: `${paddingRem}rem`,
                  position: "relative",
                })}
                type={`ZONEMAPBLOCK-${props.block.id}`}
                onMove={(dragIndex, hoverIndex) => {
                  console.log(dragIndex, hoverIndex);
                }}
                render={(dndRenderProps) => {
                  return (
                    <Box
                      className={css({
                        padding: ".5rem",
                        background: item.display
                          ? theme.palette.background.paper
                          : theme.palette.background.default,
                        boxShadow:
                          item.display || props.advanced
                            ? theme.shadows[1]
                            : undefined,
                        width: "100%",
                      })}
                    >
                      <Box display="flex" flexDirection="column" height="100%">
                        <Box flex="1" py="2rem">
                          <Button ref={dndRenderProps.drag}>DRAG</Button>

                          {(item.display || props.advanced) &&
                            renderItem(item, index)}
                        </Box>
                        {renderActions(item, index)}
                      </Box>

                      {renderRightConnector(item, index)}
                      {renderBottomConnector(item, index)}
                    </Box>
                  );
                }}
              />
            );
          })}
        </Box>
      </Box>
      {props.advanced && renderAddItemButton()}
    </>
  );

  function renderAddItemButton() {
    return (
      <Box py="1rem">
        <Button
          onClick={() => {
            const newItem = {
              display: true,
              checked: false,
              name: "name",
              description: "description",
              connectors: new Array<SkillGridConnectorDirection>(),
            };

            props.onMetaChange({
              ...props.block.meta,
              items: [...getRealItems(props.block.meta.items), newItem],
            });
          }}
          color={"default"}
          variant="outlined"
        >
          {"Add Item"}
        </Button>
      </Box>
    );
  }

  function renderRightConnector(item: ISkillGridItem, index: number) {
    const { isPositionValid, isConnectorVisible } = shouldDisplayConnector(
      SkillGridConnectorDirection.RIGHT,
      item,
      index
    );

    return (
      <>
        {isPositionValid && (props.advanced || isConnectorVisible) && (
          <ButtonBase
            disabled={!props.advanced}
            className={css({
              background: isConnectorVisible
                ? theme.palette.background.paper
                : theme.palette.background.default,
              borderTop: `${isConnectorVisible ? "1px" : "2px"} ${
                isConnectorVisible ? "solid" : "dashed"
              } ${theme.palette.divider}`,
              borderBottom: `${isConnectorVisible ? "1px" : "2px"} ${
                isConnectorVisible ? "solid" : "dashed"
              } ${theme.palette.divider}`,
              width: `${paddingRem * 2}rem`,
              height: `${paddingRem * 2}rem`,
              position: "absolute",
              right: `${-paddingRem}rem`,
              zIndex: 1,
              top: "50%",
              transform: "translate(0, -50%)",
            })}
            onClick={() => {
              handleConnectorClick(
                item,
                index,
                SkillGridConnectorDirection.RIGHT
              );
            }}
          />
        )}
      </>
    );
  }

  function renderActions(item: ISkillGridItem, index: number) {
    const isHiddenAndAdvanced = !item.display && props.advanced;

    if (!item.display && !props.advanced) {
      return null;
    }
    return (
      <Box>
        <Grid container justify="flex-end" alignItems="baseline">
          {isHiddenAndAdvanced && (
            <Grid item>
              <IconButton
                size="small"
                onClick={() => {
                  const newItems = [...props.block.meta.items];
                  newItems.splice(index, 1);

                  props.onMetaChange({
                    ...props.block.meta,
                    items: newItems,
                  });
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Grid>
          )}

          {isHiddenAndAdvanced && (
            <Grid item>
              <IconButton
                size="small"
                onClick={() => {
                  const newItem = {
                    ...item,
                    display: false,
                    description: "description",
                    name: "name",
                  };
                  const newItems = [...props.block.meta.items];
                  newItems[index] = newItem;

                  props.onMetaChange({
                    ...props.block.meta,
                    items: newItems,
                  });
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Grid>
          )}

          {props.advanced && (
            <Grid item>
              <IconButton
                size="small"
                onClick={() => {
                  const newItem = { ...item, display: !item.display };
                  const newItems = [...props.block.meta.items];
                  newItems[index] = newItem;

                  props.onMetaChange({
                    ...props.block.meta,
                    items: newItems,
                  });
                }}
              >
                {item.display ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Grid>
          )}

          <Grid item>
            <IconButton
              size="small"
              onClick={() => {
                const newItem = { ...item, checked: !item.checked };
                const newItems = [...props.block.meta.items];
                newItems[index] = newItem;

                props.onMetaChange({
                  ...props.block.meta,
                  items: newItems,
                });
              }}
            >
              {item.checked ? <CheckBoxOutlineBlankIcon /> : <CheckBoxIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    );
  }
  function renderBottomConnector(item: ISkillGridItem, index: number) {
    const { isPositionValid, isConnectorVisible } = shouldDisplayConnector(
      SkillGridConnectorDirection.BOTTOM,
      item,
      index
    );

    return (
      <>
        {isPositionValid && (props.advanced || isConnectorVisible) && (
          <ButtonBase
            disabled={!props.advanced}
            className={css({
              background: isConnectorVisible
                ? theme.palette.background.paper
                : theme.palette.background.default,
              borderLeft: `${isConnectorVisible ? "1px" : "2px"} ${
                isConnectorVisible ? "solid" : "dashed"
              } ${theme.palette.divider}`,
              borderRight: `${isConnectorVisible ? "1px" : "2px"} ${
                isConnectorVisible ? "solid" : "dashed"
              } ${theme.palette.divider}`,
              width: `${paddingRem * 2}rem`,
              height: `${paddingRem * 2}rem`,
              position: "absolute",
              bottom: `${-paddingRem}rem`,
              zIndex: 1,
              left: "50%",
              transform: "translate(-50%, 0)",
            })}
            onClick={() => {
              handleConnectorClick(
                item,
                index,
                SkillGridConnectorDirection.BOTTOM
              );
            }}
          />
        )}
      </>
    );
  }

  function renderColumnCountEditor() {
    return (
      <>
        <TextField
          label="Number of columns:"
          type="number"
          fullWidth
          InputProps={{ inputProps: { min: 2, max: 6 } }}
          value={props.block.meta.columnCount}
          onChange={(e) => {
            let columnCount = 3;
            if (e.target.value) {
              const parsed = parseInt(e.target.value);
              if (parsed > 6) {
                columnCount = 6;
              } else {
                columnCount = parsed;
              }
            }

            props.onMetaChange({
              ...props.block.meta,
              columnCount: columnCount,
            });
          }}
        />
      </>
    );
  }

  function renderItem(item: ISkillGridItem, index: number) {
    return (
      <>
        <Box>
          {renderGridItemTitle(item, index)}
          {renderGridItemDescription(item, index)}
        </Box>
      </>
    );
  }

  function renderGridItemDescription(
    item: ISkillGridItem,
    index: number
  ): React.ReactNode {
    const isVisible =
      !!previewContentEditable({ value: item.description }) || props.advanced;

    if (!isVisible) {
      return null;
    }
    return (
      <Typography
        variant="body2"
        align="center"
        className={css({
          color: item.display
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
        })}
      >
        <ContentEditable
          value={item.description}
          readonly={!props.advanced}
          border={props.advanced}
          onChange={(newDescription) => {
            const newItem = { ...item, description: newDescription };
            const newItems = [...props.block.meta.items];
            newItems[index] = newItem;

            props.onMetaChange({
              ...props.block.meta,
              items: newItems,
            });
          }}
        />
      </Typography>
    );
  }

  function renderGridItemTitle(item: ISkillGridItem, index: number) {
    const isVisible =
      !!previewContentEditable({ value: item.name }) || props.advanced;

    if (!isVisible) {
      return null;
    }
    return (
      <Box pb=".5rem">
        <Typography
          align="center"
          className={css({
            fontSize: "1em",
            fontWeight: "bold",
            textTransform: "uppercase",
            color: item.display
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
          })}
        >
          <ContentEditable
            value={item.name}
            readonly={!props.advanced}
            border={props.advanced}
            onChange={(newName) => {
              const newItem = { ...item, name: newName };
              const newItems = [...props.block.meta.items];
              newItems[index] = newItem;

              props.onMetaChange({
                ...props.block.meta,
                items: newItems,
              });
            }}
          />
        </Typography>
      </Box>
    );
  }
}
SkillGrid.displayName = "SkillGrid";

export function SkillGridActions(
  props: IBlockActionComponentProps<ISkillGrid>
) {
  return <></>;
}
SkillGridActions.displayName = "SkillGridActions";
