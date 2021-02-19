import { css } from "@emotion/css";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import React, { useContext, useState } from "react";
import { useZIndex } from "../../constants/zIndex";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import {
  d20DiceCommandGroups,
  FateDiceCommandGroups,
  findMatchingCommandGroupWithDiceTypes,
  IDiceCommandGroup,
  IDiceRollResult,
  MiscDiceCommandGroups,
  rollComplexDiceTypes,
} from "../../domains/dice/Dice";
import { Icons } from "../../domains/Icons/Icons";
type IProps = {
  onSelect?(result: IDiceRollResult): void;
};

export const DiceFab: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const zIndex = useZIndex();
  const diceManager = useContext(DiceContext);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [selectedOptions, setSelectedOptions] = useState<
    Array<IDiceCommandGroup>
  >([]);

  const commandsToCheckForDynamicFabIcon =
    selectedOptions.length > 0
      ? selectedOptions.flatMap((o) => o.value)
      : diceManager.state.diceTypes;

  const optionMatch = findMatchingCommandGroupWithDiceTypes(
    commandsToCheckForDynamicFabIcon
  );

  const ButtonIcon = optionMatch?.icon ?? Icons.ThrowDice;

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOptions([]);
  };

  const handleRoll = () => {
    const newTypes = selectedOptions.flatMap((o) => o.value);
    const result = rollComplexDiceTypes(newTypes);
    diceManager.actions.setDiceTypes(newTypes);
    props.onSelect?.(result);
  };
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const canRoll = selectedOptions.length > 0;
  return (
    <>
      <ClickAwayListener
        onClickAway={() => {
          handleMenuClose();
        }}
      >
        <Box>
          <Zoom
            in={!canRoll}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${!canRoll ? transitionDuration.exit : 0}ms`,
            }}
            unmountOnExit
          >
            <Fab
              variant={"round"}
              color="primary"
              onClick={(e) => {
                if (!open) {
                  handleMenuOpen(e);
                } else {
                  if (selectedOptions.length > 0) {
                    handleRoll();
                    handleMenuClose();
                  } else {
                    handleMenuClose();
                  }
                }
              }}
              className={css({
                right: "2rem",
                bottom: "2rem",
                position: "fixed",
              })}
              classes={{
                root: css({
                  transition: theme.transitions.create("all"),
                  height: "4rem",
                }),
              }}
            >
              <ButtonIcon
                className={css({
                  width: "4rem",
                  height: "4rem",
                  padding: ".3rem",
                })}
              />
            </Fab>
          </Zoom>
          <Zoom
            in={canRoll}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${canRoll ? transitionDuration.exit : 0}ms`,
            }}
            unmountOnExit
          >
            <Fab
              variant={"extended"}
              color="primary"
              onClick={(e) => {
                if (!open) {
                  handleMenuOpen(e);
                } else {
                  if (selectedOptions.length > 0) {
                    handleRoll();
                    handleMenuClose();
                  } else {
                    handleMenuClose();
                  }
                }
              }}
              className={css({
                right: "2rem",
                bottom: "2rem",
                position: "fixed",
              })}
              classes={{
                root: css({
                  transition: theme.transitions.create("all"),
                  height: "4rem",
                }),
              }}
            >
              <ButtonIcon
                className={css({
                  width: "4rem",
                  height: "4rem",
                  padding: ".3rem",
                })}
              />

              <Typography
                className={css({
                  fontWeight: theme.typography.fontWeightBold,
                })}
              >
                {"Roll"}
              </Typography>
            </Fab>
          </Zoom>

          <Popper
            open={open}
            anchorEl={anchorEl}
            transition
            placement="top"
            className={css({
              zIndex: zIndex.diceModal,
            })}
            modifiers={{
              flip: {
                enabled: true,
              },
              preventOverflow: {
                enabled: true,
                boundariesElement: "scrollParent",
              },
            }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <Box pb="1rem" px="1rem">
                  <Paper>
                    <Box p="1rem">
                      {renderHeader("Fate")}
                      {renderOptions(FateDiceCommandGroups)}
                      {renderHeader("D20s")}
                      {renderOptions(d20DiceCommandGroups)}
                      {renderHeader("Misc")}
                      {renderOptions(MiscDiceCommandGroups)}
                    </Box>
                  </Paper>
                </Box>
              </Grow>
            )}
          </Popper>
        </Box>
      </ClickAwayListener>
    </>
  );

  function renderHeader(header: string) {
    return (
      <Box>
        <Typography
          variant="h6"
          className={css({
            color: theme.palette.text.primary,
            textAlign: "center",
            fontWeight: theme.typography.fontWeightBold,
          })}
        >
          {header}
        </Typography>
      </Box>
    );
  }

  function renderOptions(options: Array<IDiceCommandGroup>) {
    return (
      <>
        <Box pb=".5rem">
          <Grid container spacing={1} justify="center">
            {options.map((o) => {
              const badgeContent = selectedOptions.reduce((acc, curr) => {
                if (o.label === curr.label) {
                  return acc + 1;
                }
                return acc;
              }, 0);
              return (
                <Grid item key={o.label}>
                  <Grid container justify="center" direction="column">
                    <Grid container item justify="center">
                      <IconButton
                        onClick={() => {
                          setSelectedOptions((t) => {
                            return [...t, o];
                          });
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setSelectedOptions((draft) => {
                            const indexToRemove = draft.findIndex(
                              (selectedOption) =>
                                selectedOption.label === o.label
                            );
                            if (indexToRemove !== -1) {
                              draft.splice(indexToRemove, 1);
                            }
                            return [...draft];
                          });
                        }}
                        className={css({
                          background:
                            badgeContent > 0
                              ? theme.palette.action.hover
                              : "inherit",
                        })}
                      >
                        <Badge badgeContent={badgeContent} color="primary">
                          <o.icon
                            className={css({
                              fontSize: "3rem",
                              color:
                                badgeContent > 0
                                  ? theme.palette.primary.main
                                  : theme.palette.text.secondary,
                            })}
                          />
                        </Badge>
                      </IconButton>
                    </Grid>
                    <Grid container item justify="center">
                      <Typography
                        className={css({
                          fontWeight:
                            badgeContent > 0
                              ? theme.typography.fontWeightBold
                              : "inherit",
                          color:
                            badgeContent > 0
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          textAlign: "center",
                        })}
                      >
                        {o.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </>
    );
  }
};
