import { css } from "@emotion/css";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
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
import CloseIcon from "@material-ui/icons/Close";
import React, { useContext, useEffect, useState } from "react";
import { useZIndex } from "../../constants/zIndex";
import {
  DiceContext,
  IDiceManager,
} from "../../contexts/DiceContext/DiceContext";
import {
  d20DiceCommandGroups,
  Dice,
  FateDiceCommandGroups,
  IDiceCommandGroup,
  IDiceRollResult,
  MiscDiceCommandGroups,
} from "../../domains/dice/Dice";
import { Icons } from "../../domains/Icons/Icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IDicePool } from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { DiceBox } from "../DiceBox/DiceBox";

export enum DiceFabMode {
  Roll,
  RollAndPool,
}

type IRollProps = {
  type: DiceFabMode.Roll;
  onSelect(result: IDiceRollResult): void;

  rollsForDiceBox?: Array<IDiceRollResult>;
};

type IPoolProps = {
  type: DiceFabMode.RollAndPool;
  onSelect(result: IDiceRollResult): void;

  rollsForDiceBox?: Array<IDiceRollResult>;

  pool: IDicePool;
  onClearPool(): void;
  onRollPool(): void;
};

type IProps = IRollProps | IPoolProps;

const buttonSize = "4rem";

const SlideDurationForRollButton = 1000;

export const DiceFab: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const zIndex = useZIndex();
  const diceManager = useContext(DiceContext);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslate();

  const [dirty, setDirty] = useState(false);
  const [fabCommands, setFabCommands] = useState<Array<IDiceCommandGroup>>([]);

  const ButtonIcon = getButtonIcon(fabCommands, diceManager);

  function handleMenuOpen(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    setFabCommands([]);
  }

  function handleClear() {
    setFabCommands([]);
  }

  function handleFabClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    e.stopPropagation();
    if (!open) {
      handleMenuOpen(e);
    } else {
      handleMenuClose();
    }
  }

  function handleReRoll() {
    const result = diceManager.actions.reroll();
    props.onSelect?.(result);
    handleMenuClose();
  }

  function handleRoll() {
    const newCommands = fabCommands.flatMap((o) => o.value);
    const result = diceManager.actions.rollByCommandNames(newCommands, {
      listResults: false,
    });

    props.onSelect?.(result);
    setDirty(true);
    handleMenuClose();
  }

  const hasSelectedNewCommands = fabCommands.length > 0;
  const isRollButtonVisible = hasSelectedNewCommands || dirty;

  const hasPool =
    props.type === DiceFabMode.RollAndPool &&
    !!props.pool &&
    props.pool.length > 0;

  return (
    <>
      <ClickAwayListener onClickAway={handleMenuClose}>
        <Box>
          {!hasPool && (
            <DiceFabButton
              key="rolls"
              showClearButton={open}
              isRollButtonVisible={isRollButtonVisible}
              icon={ButtonIcon}
              label={
                <>
                  {hasSelectedNewCommands ||
                  (!hasSelectedNewCommands && !isRollButtonVisible)
                    ? t("dice-fab.roll")
                    : t("dice-fab-reroll")}
                </>
              }
              onFabClick={handleFabClick}
              onCtaClick={() => {
                if (open) {
                  handleRoll();
                } else {
                  handleReRoll();
                }
              }}
            />
          )}

          {hasPool && props.type === DiceFabMode.RollAndPool && (
            <DiceFabButton
              key="pool"
              showClearButton={true}
              isRollButtonVisible={true}
              icon={ButtonIcon}
              label={
                <>
                  {props.pool.length === 1
                    ? t("dice-fab.roll")
                    : t("dice-fab.roll-pool")}
                </>
              }
              onFabClick={() => {
                props.onClearPool();
              }}
              onCtaClick={() => {
                props.onRollPool();
              }}
            />
          )}

          <DiceMenu
            open={open}
            anchorEl={anchorEl}
            commands={fabCommands}
            onClear={handleClear}
            onDiceCommandChange={setFabCommands}
          />
        </Box>
      </ClickAwayListener>
      {props.rollsForDiceBox && renderDiceBox()}
    </>
  );

  function renderDiceBox() {
    return (
      <DiceBox
        className={css({
          position: "fixed",
          left: "1.25rem",
          bottom: "7rem",
          zIndex: zIndex.diceFabDie,
        })}
        reduceOpacityWithoutHover
        rolls={props.rollsForDiceBox ?? []}
        tooltipPlacement="right-end"
        size="3.5rem"
        fontSize="2rem"
        borderSize=".2rem"
        onClick={() => {
          handleReRoll();
        }}
      />
    );
  }

  function getButtonIcon(
    selectedOptions: IDiceCommandGroup[],
    diceManager: IDiceManager
  ) {
    const commandsToCheckForDynamicFabIcon =
      selectedOptions.length > 0
        ? selectedOptions.flatMap((o) => o.value)
        : diceManager.state.latestCommandsNames;
    const selectedOption = Dice.findMatchingCommandGroupWithDiceTypes(
      commandsToCheckForDynamicFabIcon
    );
    const [firstCommand] = commandsToCheckForDynamicFabIcon;
    const firstCommandMatch = Dice.findMatchingCommandGroupWithDiceTypes([
      firstCommand,
    ]);

    const ButtonIcon =
      selectedOption?.icon ?? firstCommandMatch?.icon ?? Icons.ThrowDice;
    return ButtonIcon;
  }
};

export const DiceMenu: React.FC<{
  anchorEl: any;
  open: boolean;
  ctaLabel?: string;
  commands: Array<IDiceCommandGroup>;
  onCtaClick?(): void;
  onClose?(): void;
  onClear?(): void;
  onDiceCommandChange: React.Dispatch<
    React.SetStateAction<IDiceCommandGroup[]>
  >;
}> = (props) => {
  const theme = useTheme();
  const zIndex = useZIndex();

  return <>{renderPopper()}</>;

  function renderPopper() {
    return (
      <Popper
        open={props.open}
        anchorEl={props.anchorEl}
        transition
        placement="top"
        style={{ zIndex: zIndex.diceFab }}
        modifiers={{
          flip: {
            enabled: false,
          },
          offset: {
            offset: "0, 8px",
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: "viewport",
          },
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Box
              className={css({
                padding: "0 1rem",
                maxWidth: "90vw",
                zIndex: zIndex.diceFab,
              })}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Paper elevation={6}>
                <Box maxHeight="70vh" overflow="auto">
                  <Box p="1rem">
                    {renderCommandGroupHeader("Fate")}
                    {renderOptions(FateDiceCommandGroups)}
                    {renderCommandGroupHeader("D20s")}
                    {renderOptions(d20DiceCommandGroups)}
                    {renderCommandGroupHeader("Misc")}
                    {renderOptions(MiscDiceCommandGroups)}

                    {(props.onClear || props.onCtaClick) && (
                      <Box mt="1.5rem">
                        <Grid container justify="center" spacing={2}>
                          {props.onClear && (
                            <Grid item>
                              <Button
                                color="default"
                                variant="text"
                                onClick={props.onClear}
                              >
                                {"Reset"}
                              </Button>
                            </Grid>
                          )}

                          {props.onCtaClick && (
                            <Grid item>
                              <Button
                                color="primary"
                                variant="contained"
                                onClick={props.onCtaClick}
                              >
                                {props.ctaLabel}
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    )}
                  </Box>
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
              const badgeContent = props.commands.reduce((acc, curr) => {
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
                          props.onDiceCommandChange((t) => {
                            return [...t, o];
                          });
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          props.onDiceCommandChange((draft) => {
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

export function DiceFabButton(props: {
  showClearButton: boolean;
  isRollButtonVisible: boolean;
  onFabClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onCtaClick(): void;
  icon: React.ElementType;
  label: JSX.Element;
}) {
  const zIndex = useZIndex();
  const theme = useTheme();

  const [delayedIsRollButtonVisible, setDelayedisRollButtonVisible] = useState(
    false
  );

  useEffect(
    function () {
      setDelayedisRollButtonVisible(props.isRollButtonVisible);
    },
    [props.isRollButtonVisible]
  );

  return (
    <Box
      className={css({
        left: "1rem",
        bottom: "2rem",
        position: "fixed",
        zIndex: zIndex.diceFab,
      })}
    >
      <Zoom in>
        <Box
          className={css({
            position: "relative",
          })}
        >
          <Fab
            variant="round"
            color={props.showClearButton ? "secondary" : "primary"}
            onClick={props.onFabClick}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            className={css({
              width: buttonSize,
              height: buttonSize,
              zIndex: zIndex.diceFab,
            })}
          >
            {props.showClearButton ? (
              <CloseIcon
                className={css({
                  width: "90%",
                  height: "auto",
                  padding: ".5rem",
                })}
              />
            ) : (
              <props.icon
                className={css({
                  width: "100%",
                  height: "auto",
                  padding: ".5rem",
                })}
              />
            )}
          </Fab>

          {renderRollButton()}
        </Box>
      </Zoom>
    </Box>
  );

  function renderRollButton() {
    return (
      <Box
        className={css({
          label: "DiceFabButton-fab",
          position: "absolute",
          bottom: "0",
          left: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: theme.palette.primary.main,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          height: buttonSize,
          borderTopRightRadius: "25px",
          borderBottomRightRadius: "25px",
          overflow: "hidden",
          transition: theme.transitions.create("max-width", {
            duration: SlideDurationForRollButton,
          }),
          maxWidth: delayedIsRollButtonVisible ? "100vw" : "0",
        })}
      >
        <ButtonBase
          className={css({
            height: "100%",
            width: "100%",
            paddingLeft: "3rem",
            paddingRight: "1rem",
          })}
          onClick={props.onCtaClick}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <Typography
            className={css({
              label: "DiceFabButton-label",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
              fontWeight: theme.typography.fontWeightBold,
            })}
          >
            {props.label}
          </Typography>
        </ButtonBase>
      </Box>
    );
  }
}
