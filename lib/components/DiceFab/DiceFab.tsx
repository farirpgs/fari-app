import { css } from "@emotion/css";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Fab from "@material-ui/core/Fab";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { useTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import CloseIcon from "@material-ui/icons/Close";
import React, { useContext, useEffect, useState } from "react";
import { useZIndex } from "../../constants/zIndex";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import {
  AllDiceCommandGroups,
  IDiceCommandGroup,
  IDiceCommandOption,
  IDiceRollResult,
  RollType,
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

const SlideDurationForRollButton = 500;

export const DiceFab: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const zIndex = useZIndex();
  const diceManager = useContext(DiceContext);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslate();

  const [dirty, setDirty] = useState(false);

  const ButtonIcon = getButtonIcon(diceManager.state.commandGroups);

  function handleMenuOpen(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleClear() {
    diceManager.actions.setCommandGroups([]);
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
    const commandOptions: Array<IDiceCommandOption> = diceManager.state.commandGroups.map(
      (commandGroup) => {
        return {
          type: RollType.DiceCommand,
          commandGroupId: commandGroup.id,
        };
      }
    );
    const result = diceManager.actions.roll(commandOptions);

    props.onSelect?.(result);
    setDirty(true);
    handleMenuClose();
  }

  const hasSelectedCommands = diceManager.state.commandGroups.length > 0;

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
              isRollButtonVisible={hasSelectedCommands}
              icon={ButtonIcon}
              label={<>{t("dice-fab.roll")}</>}
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
            commands={diceManager.state.commandGroups}
            showPoolToggle
            onClear={handleClear}
            onDiceCommandChange={diceManager.actions.setCommandGroups}
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

  function getButtonIcon(commandGroups: IDiceCommandGroup[]) {
    const [firstCommandGroup] = commandGroups;

    const ButtonIcon = firstCommandGroup?.icon ?? Icons.ThrowDice;
    return ButtonIcon;
  }
};

export const DiceMenu: React.FC<{
  anchorEl: any;
  open: boolean;
  ctaLabel?: string;
  commands: Array<IDiceCommandGroup>;
  showPoolToggle: boolean;
  onCtaClick?(): void;
  onClose?(): void;
  onClear?(): void;
  onDiceCommandChange: React.Dispatch<
    React.SetStateAction<IDiceCommandGroup[]>
  >;
}> = (props) => {
  const theme = useTheme();
  const zIndex = useZIndex();
  const { t } = useTranslate();
  const diceManager = useContext(DiceContext);

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
                    {renderOptions([
                      AllDiceCommandGroups["4dF"],
                      AllDiceCommandGroups["1dF"],
                    ])}
                    {renderCommandGroupHeader("D20s")}
                    {renderOptions([
                      AllDiceCommandGroups["1d4"],
                      AllDiceCommandGroups["1d6"],
                      AllDiceCommandGroups["1d8"],
                      AllDiceCommandGroups["1d10"],
                      AllDiceCommandGroups["1d12"],
                      AllDiceCommandGroups["1d20"],
                      AllDiceCommandGroups["1d100"],
                    ])}
                    {renderCommandGroupHeader("Misc")}
                    {renderOptions([
                      AllDiceCommandGroups["coin"],
                      AllDiceCommandGroups["2d6"],
                    ])}

                    {(props.onClear || props.onCtaClick) && (
                      <Box mt="1.5rem">
                        <Grid container justify="center" spacing={2}>
                          {props.showPoolToggle && (
                            <Grid item>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      diceManager.state.options.listResults
                                    }
                                    onChange={() => {
                                      diceManager.actions.setOptions({
                                        listResults: !diceManager.state.options
                                          .listResults,
                                      });
                                    }}
                                    color="primary"
                                  />
                                }
                                label={t("dice-fab.pool")}
                              />
                            </Grid>
                          )}
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
            duration: 1000,
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
