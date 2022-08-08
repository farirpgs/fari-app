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
import { Dice, IDiceCommandId, IDicePoolResult } from "../../domains/dice/Dice";
import { Icons } from "../../domains/Icons/Icons";
import { useEvent } from "../../hooks/useEvent/useEvent";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { DiceMenu } from "./DiceMenu";

type IProps = {
  onRoll(result: Array<IDicePoolResult>): void;
  onOpen?: () => void;
  onClose?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
};

const buttonSize = "4rem";

export const DiceFab: React.FC<IProps> = (props) => {
  const zIndex = useZIndex();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslate();
  const diceManager = useContext(DiceContext);
  const [pool, setPool] = useState<Array<IDiceCommandId>>([]);
  const poolToDisplay = [...diceManager.state.selectedCommandIds, ...pool];

  const hasPool = poolToDisplay.length > 0;
  const handleMenuOpen = useEvent(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      props.onOpen?.();
      setAnchorEl(event.currentTarget);
    }
  );

  const handleMenuClose = useEvent(() => {
    props.onClose?.();
    setAnchorEl(null);
    setPool([]);
    diceManager.actions.clearPool();
  });

  const handleClear = useEvent(() => {
    setPool([]);
  });

  const handleFabClick = useEvent(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      if (!open) {
        handleMenuOpen(e);
      } else {
        handleMenuClose();
      }
    }
  );

  function handleRoll() {
    const results = Dice.rollPools([...diceManager.state.pools]);

    handleMenuClose();
    props.onRoll?.(results);
  }

  // const hasSelectedCommands = diceManager.computed.hasSelectedCommands;
  // const hasPool = diceManager.computed.hasPool;

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <ClickAwayListener onClickAway={handleMenuClose}>
            <Box>
              <DiceFabButton
                key="rolls"
                open={open}
                hasPool={hasPool}
                pool={poolToDisplay}
                icon={Icons.ThrowDice}
                label={<>{t("dice-fab.roll")}</>}
                onHover={props.onHover}
                onLeave={props.onLeave}
                onFabClick={handleFabClick}
                onCtaClick={() => {
                  handleRoll();
                }}
              />

              <DiceMenu
                open={open}
                anchorEl={anchorEl}
                pool={poolToDisplay}
                onClose={handleMenuClose}
                onClear={handleClear}
                onDiceCommandChange={setPool}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                sx={{
                  marginTop: "-1rem",
                }}
              />
            </Box>
          </ClickAwayListener>
        </Grid>
      </Grid>
    </>
  );
};

export function DiceFabButton(props: {
  open: boolean;
  hasPool: boolean;
  pool: Array<IDiceCommandId>;
  onFabClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onCtaClick(): void;
  onHover?(): void;
  onLeave?(): void;
  icon: React.ElementType;
  label: JSX.Element;
}) {
  const zIndex = useZIndex();
  const theme = useTheme();

  const [hasPool, setHasPool] = useState(false);

  useEffect(
    function () {
      setHasPool(props.hasPool);
    },
    [props.hasPool]
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
            color={props.open ? "secondary" : "primary"}
            onClick={props.onFabClick}
            onPointerEnter={props.onHover}
            onPointerLeave={props.onLeave}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            className={css({
              backgroundColor: props.open
                ? theme.palette.primary.light
                : theme.palette.primary.main,
              width: buttonSize,
              height: buttonSize,
              marginRight: "6.3rem",
              zIndex: zIndex.diceFab,
            })}
          >
            {props.open ? (
              <CloseIcon
                className={css({
                  width: "90%",
                  height: "auto",
                  padding: ".5rem",
                })}
              />
            ) : (
              <Icons.FateDice
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
    const numberOfPoolElements = props.pool.length;

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
          background: hasPool
            ? theme.palette.primary.main
            : theme.palette.primary.light,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          height: buttonSize,
          borderTopRightRadius: "25px",
          borderBottomRightRadius: "25px",
          boxShadow: theme.shadows[2],

          overflow: "hidden",
          transition: theme.transitions.create(
            ["max-width", "background", "border"],
            {
              duration: theme.transitions.duration.complex,
            }
          ),
          maxWidth: hasPool ? "100vw" : "0",
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
            <Badge
              badgeContent={numberOfPoolElements}
              sx={{
                "& .MuiBadge-badge": {
                  marginRight: "-.1rem",
                  background: theme.palette.background.paper,
                  color: theme.palette.getContrastText(
                    theme.palette.background.paper
                  ),
                },
              }}
            >
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
