import { css } from "@emotion/css";
import CloseIcon from "@mui/icons-material/Close";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import React, { useContext, useEffect, useState } from "react";
import { useZIndex } from "../../constants/zIndex";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import {
  IDiceCommandSetOption,
  IDiceRollResult,
} from "../../domains/dice/Dice";
import { Icons } from "../../domains/Icons/Icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { DiceBox } from "../DiceBox/DiceBox";
import { DiceMenu } from "./DiceMenu";

type IProps = {
  onRoll(result: IDiceRollResult): void;
  onRollPool(result: IDiceRollResult, playerId: string | undefined): void;
  rollsForDiceBox?: Array<IDiceRollResult>;
};

const buttonSize = "4rem";

export const DiceFab: React.FC<IProps> = (props) => {
  const zIndex = useZIndex();
  const diceManager = useContext(DiceContext);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslate();

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
    diceManager.actions.clear();
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

  function handleRoll() {
    const result = diceManager.actions.rollCommandGroups();

    props.onRoll?.(result);
    handleMenuClose();
  }

  function handleRollPool() {
    const { result, playerId } = diceManager.actions.getPoolResult();

    props.onRollPool(result, playerId);
    handleMenuClose();
  }

  const hasSelectedCommands = diceManager.computed.hasSelectedCommands;
  const hasPool = diceManager.computed.hasPool;

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        {props.rollsForDiceBox && <Grid item>{renderDiceBox()}</Grid>}

        <Grid item>
          <ClickAwayListener onClickAway={handleMenuClose}>
            <Box>
              <DiceFabButton
                key="rolls"
                showCloseButton={open}
                isRollButtonVisible={hasPool ? true : hasSelectedCommands}
                icon={ButtonIcon}
                label={<>{t("dice-fab.roll")}</>}
                onFabClick={handleFabClick}
                onCtaClick={() => {
                  if (hasPool) {
                    handleRollPool();
                  } else {
                    handleRoll();
                  }
                }}
              />

              <DiceMenu
                open={open}
                anchorEl={anchorEl}
                commands={diceManager.state.commandGroups}
                showPoolToggle
                onClear={handleClear}
                onDiceCommandChange={diceManager.actions.setCommandSets}
              />
            </Box>
          </ClickAwayListener>
        </Grid>
      </Grid>
    </>
  );

  function renderDiceBox() {
    return (
      <DiceBox
        className={css({
          zIndex: zIndex.diceFabDie,
        })}
        rolls={props.rollsForDiceBox ?? []}
        tooltipPlacement="top"
        size="3.5rem"
        fontSize="2rem"
        borderSize=".2rem"
        onClick={() => {
          handleRoll();
        }}
      />
    );
  }

  function getButtonIcon(commandGroups: IDiceCommandSetOption[]) {
    const [firstCommandGroup] = commandGroups;

    const ButtonIcon = firstCommandGroup?.icon ?? Icons.ThrowDice;
    return ButtonIcon;
  }
};

export function DiceFabButton(props: {
  showCloseButton: boolean;
  isRollButtonVisible: boolean;
  onFabClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onCtaClick(): void;
  icon: React.ElementType;
  label: JSX.Element;
}) {
  const zIndex = useZIndex();
  const theme = useTheme();

  const [delayedIsRollButtonVisible, setDelayedisRollButtonVisible] =
    useState(false);
  const diceManager = useContext(DiceContext);

  useEffect(
    function () {
      setDelayedisRollButtonVisible(props.isRollButtonVisible);
    },
    [props.isRollButtonVisible]
  );

  return (
    <Box
      className={css({
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
            variant="circular"
            color={props.showCloseButton ? "secondary" : "primary"}
            onClick={props.onFabClick}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            className={css({
              width: buttonSize,
              height: buttonSize,
              marginRight: "6.3rem",
              zIndex: zIndex.diceFab,
            })}
          >
            {props.showCloseButton ? (
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
    const numberOfPoolElements = diceManager.state.pool.length;
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
          background: diceManager.computed.hasPool
            ? theme.palette.primary.dark
            : theme.palette.primary.main,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          height: buttonSize,
          borderTopRightRadius: "25px",
          borderBottomRightRadius: "25px",
          boxShadow: theme.shadows[2],
          border: `4px solid ${
            diceManager.computed.hasPool
              ? theme.palette.primary.light
              : theme.palette.primary.main
          }`,
          overflow: "hidden",
          transition: theme.transitions.create(
            ["max-width", "background", "border"],
            {
              duration: theme.transitions.duration.complex,
            }
          ),
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
          <Box ml=".5rem" mr=".25rem">
            <Badge badgeContent={numberOfPoolElements} color="secondary">
              <Typography
                className={css({
                  label: "DiceFabButton-label",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  fontWeight: theme.typography.fontWeightBold,
                  paddingRight: ".5rem",
                })}
              >
                {props.label}
              </Typography>
            </Badge>
          </Box>
        </ButtonBase>
      </Box>
    );
  }
}
