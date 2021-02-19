import { css } from "@emotion/css";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Slide from "@material-ui/core/Slide";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Zoom from "@material-ui/core/Zoom";
import CloseIcon from "@material-ui/icons/Close";
import React, { useContext, useState } from "react";
import { useZIndex } from "../../constants/zIndex";
import {
  DiceContext,
  IDiceManager,
} from "../../contexts/DiceContext/DiceContext";
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
const buttonSize = "4rem";

export const DiceFab: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const zIndex = useZIndex();
  const diceManager = useContext(DiceContext);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [dirty, setDirty] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Array<IDiceCommandGroup>
  >([]);

  const ButtonIcon = getButtonIcon(selectedOptions, diceManager);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOptions([]);
  };

  const handleFabClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    if (!open) {
      handleMenuOpen(e);
    } else {
      handleMenuClose();
    }
  };

  const handleReRoll = () => {
    const result = rollComplexDiceTypes(diceManager.state.diceTypes);
    props.onSelect?.(result);
  };

  const handleRoll = () => {
    const newTypes = selectedOptions.flatMap((o) => o.value);
    const result = rollComplexDiceTypes(newTypes);
    diceManager.actions.setDiceTypes(newTypes);
    props.onSelect?.(result);
    setDirty(true);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.shortest,
    exit: theme.transitions.duration.shortest,
  };

  const hasSelectedNewCommands = selectedOptions.length > 0;
  const isRollButtonVisible = hasSelectedNewCommands || dirty;

  return (
    <>
      <Box
        className={css({
          left: "4rem",
          bottom: "2rem",
          height: buttonSize,
          position: "fixed",
          overflow: "hidden",
        })}
      >
        <Slide
          direction="right"
          in={isRollButtonVisible}
          timeout={theme.transitions.duration.shortest}
        >
          {renderSlideButton()}
        </Slide>

        <ClickAwayListener
          onClickAway={() => {
            handleMenuClose();
          }}
        >
          <Box>
            <Zoom
              in
              timeout={transitionDuration}
              style={{
                transitionDelay: `${
                  !hasSelectedNewCommands ? transitionDuration.exit : 0
                }ms`,
              }}
            >
              {renderFab()}
            </Zoom>
            {renderPopper()}
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  );

  function renderFab() {
    return (
      <Fab
        variant="round"
        color="primary"
        onClick={handleFabClick}
        className={css({
          left: "2rem",
          bottom: "2rem",
          width: buttonSize,
          height: buttonSize,
          position: "fixed",
        })}
      >
        {open ? (
          <CloseIcon
            className={css({
              width: "90%",
              height: "auto",
              padding: ".5rem",
            })}
          />
        ) : (
          <ButtonIcon
            className={css({
              width: "100%",
              height: "auto",
              padding: ".5rem",
            })}
          />
        )}
      </Fab>
    );
  }

  function renderSlideButton() {
    return (
      <Box
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: theme.palette.primary.main,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          height: buttonSize,
          borderTopRightRadius: "25px",
          borderBottomRightRadius: "25px",
        })}
      >
        <ButtonBase
          className={css({
            height: "100%",
            width: "100%",
            paddingLeft: "3rem",
            paddingRight: "1rem",
          })}
          onClick={() => {
            if (open) {
              handleRoll();
            } else {
              handleReRoll();
            }
          }}
        >
          {isRollButtonVisible && (
            <Typography
              className={css({
                textTransform: "uppercase",
                fontWeight: theme.typography.fontWeightBold,
              })}
            >
              {hasSelectedNewCommands ? "Roll" : "Reroll"}
            </Typography>
          )}
        </ButtonBase>
      </Box>
    );
  }

  function renderPopper() {
    return (
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
            <Box
              px={isExtraSmall ? "0" : "2rem"}
              pb="1rem"
              onContextMenu={(e) => {
                e.preventDefault();
              }}
            >
              <Paper>
                <Box p="1rem">
                  {renderCommandGroupHeader("Fate")}
                  {renderOptions(FateDiceCommandGroups)}
                  {renderCommandGroupHeader("D20s")}
                  {renderOptions(d20DiceCommandGroups)}
                  {renderCommandGroupHeader("Misc")}
                  {renderOptions(MiscDiceCommandGroups)}
                </Box>
              </Paper>
            </Box>
          </Grow>
        )}
      </Popper>
    );
  }

  function renderCommandGroupHeader(header: string) {
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

function getButtonIcon(
  selectedOptions: IDiceCommandGroup[],
  diceManager: IDiceManager
) {
  const commandsToCheckForDynamicFabIcon =
    selectedOptions.length > 0
      ? selectedOptions.flatMap((o) => o.value)
      : diceManager.state.diceTypes;
  const selectedOption = findMatchingCommandGroupWithDiceTypes(
    commandsToCheckForDynamicFabIcon
  );
  const [firstCommand] = commandsToCheckForDynamicFabIcon;
  const firstCommandMatch = findMatchingCommandGroupWithDiceTypes([
    firstCommand,
  ]);

  const ButtonIcon =
    selectedOption?.icon ?? firstCommandMatch?.icon ?? Icons.ThrowDice;
  return ButtonIcon;
}
