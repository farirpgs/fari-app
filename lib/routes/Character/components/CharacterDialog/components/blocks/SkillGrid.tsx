import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Grid, { GridSize } from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { ISkillGrid } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
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

enum SkillGridConnectorDirection {
  RIGHT,
  BOTTOM,
}

export function SkillGrid(props: IBlockComponentProps<ISkillGrid>) {
  const theme = useTheme();

  const items = [
    {
      display: true,
      checked: false,
      name: "Cloister",
      description: "+1 scale for your Adept cohorts",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Vice den",
      description: "(Tier roll) - Heat = coin in downtime",
      connectors: [SkillGridConnectorDirection.RIGHT],
    },
    {
      display: true,
      checked: false,
      name: "Offertory",
      description: "+2 coin for occult operations",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Ancient obelisk",
      description: "-1 stress cost for all arcane powers and ritual",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Ancient tower",
      description: "+1d to Consort w/ arcane entities on site",
      connectors: [SkillGridConnectorDirection.BOTTOM],
    },
    {
      display: true,
      checked: false,
      name: "Turf",
      description: "",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Turf",
      description: "",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: true,
      name: "Lair",
      description: "",
      connectors: [SkillGridConnectorDirection.BOTTOM],
    },
    {
      display: true,
      checked: false,
      name: "Turf",
      description: "",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Turf",
      description: "",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Spirit well",
      description: "+1d to Attune on site",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Ancient gate",
      description: "Safe passage in the Deathlands",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Sanctuary",
      description: "+1d to Command and Sway on site",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Sacred nexus",
      description: "+1d to healing rolls",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
    {
      display: true,
      checked: false,
      name: "Ancient altar",
      description: "+1d engagement for occult plans",
      connectors: [
        SkillGridConnectorDirection.RIGHT,
        SkillGridConnectorDirection.BOTTOM,
      ],
    },
  ];

  // configuration
  const columnCount = props.block.meta.columnCount;
  const boxHeight = props.block.meta.boxHeight;

  //end configuration

  const boxHeightInPixels = `${boxHeight}px`;
  const rightConnectorHeight = `${boxHeight / 10}px`;
  const itemHorizontalWidth = Math.floor(12 / columnCount);
  const itemHorizontalGridSize: GridSize = itemHorizontalWidth as any;

  const useStyles = makeStyles({
    bottomConnectorContainer: {
      position: "relative",
      height: "20px",
    },
    bottomConnector: {
      background: "lightgray",
      width: rightConnectorHeight,
      height: "20px",
      margin: 0,
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    },
    rightConnectorContainer: {
      position: "relative",
    },
    rightConnector: {
      background: "lightgray",
      margin: 0,
      height: rightConnectorHeight,
      width: "20px",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    },
    box: {
      background: "lightgray",
      height: boxHeightInPixels,
      overflow: "hidden",
      position: "relative",
    },
    checkBox: {
      position: "absolute",
      left: 0,
      top: 0,
      padding: 0,
    },
  });

  const classes = useStyles();

  function shouldDisplayConnector(
    direction: SkillGridConnectorDirection,
    item: ISkillGridItem,
    index: number
  ) {
    return (
      isConnectorPossible(direction, item, index) &&
      item.connectors.some((connector) => connector === direction)
    );
  }

  function isConnectorPossible(
    direction: SkillGridConnectorDirection,
    item: ISkillGridItem,
    index: number
  ) {
    if (!item.display) {
      return false;
    }

    if (direction === SkillGridConnectorDirection.BOTTOM) {
      const itemBelow = items[index + columnCount];
      return itemBelow && itemBelow.display;
    }

    if (direction === SkillGridConnectorDirection.RIGHT) {
      const isCurrentItemLastInRow = (index + 1) % columnCount === 0;
      if (isCurrentItemLastInRow) return false;

      const itemOnTheRight = items[index + 1];
      return itemOnTheRight && itemOnTheRight.display;
    }
  }

  return (
    <>
      <Box>
        <Grid container justify="space-between">
          {items.map((item, index) => (
            <Grid item xs={itemHorizontalGridSize} key={index}>
              <Grid container>
                <Grid item xs={11}>
                  {item.display && (
                    <Box className={classes.box}>
                      {/* TODO: wire the check to the metadata */}
                      <Checkbox
                        className={classes.checkBox}
                        checked={item.checked}
                      />
                      <Box style={{ margin: ".5em" }}>
                        <Typography
                          align="center"
                          style={{
                            fontSize: "1em",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2" align="center">
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>
                {shouldDisplayConnector(
                  SkillGridConnectorDirection.RIGHT,
                  item,
                  index
                ) && (
                  <Grid item xs={1} className={classes.rightConnectorContainer}>
                    <Box className={classes.rightConnector} />
                  </Grid>
                )}

                {shouldDisplayConnector(
                  SkillGridConnectorDirection.BOTTOM,
                  item,
                  index
                ) && (
                  <>
                    <Grid
                      item
                      xs={11}
                      justify="center"
                      className={classes.bottomConnectorContainer}
                    >
                      <Box className={classes.bottomConnector} />
                    </Grid>
                    <Grid item xs={11} />
                  </>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
SkillGrid.displayName = "SkillGrid";

export function SkillGridActions(
  props: IBlockActionComponentProps<ISkillGrid>
) {
  const theme = useTheme();
  const { t } = useTranslate();

  return <></>;
}
SkillGridActions.displayName = "SkillGridActions";
