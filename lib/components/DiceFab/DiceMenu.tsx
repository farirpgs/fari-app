import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Popover, { PopoverOrigin } from "@mui/material/Popover";
import React from "react";
import { useZIndex } from "../../constants/zIndex";
import { IDiceCommandId } from "../../domains/dice/Dice";
import { useEvent } from "../../hooks/useEvent/useEvent";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { DiceButtons } from "../../routes/DiceRoute/components/DiceButtons";

export function DiceMenu(props: {
  anchorEl: any;
  open: boolean;
  ctaLabel?: string;
  pool: Array<IDiceCommandId>;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
  sx?: React.CSSProperties;
  onCtaClick?(): void;
  onClose?(): void;
  onClear?(): void;
  onDiceCommandChange: React.Dispatch<React.SetStateAction<IDiceCommandId[]>>;
}) {
  const zIndex = useZIndex();
  const { t } = useTranslate();

  const handleDiceClick = useEvent((newCommand: IDiceCommandId) => {
    props.onDiceCommandChange((prevCommands) => {
      return [...prevCommands, newCommand];
    });
  });
  const handleRightClick = useEvent((newCommand: IDiceCommandId) => {
    props.onDiceCommandChange((prevCommands) => {
      const indexToRemove = prevCommands.findIndex(
        (command) => command === newCommand
      );
      if (indexToRemove !== -1) {
        prevCommands.splice(indexToRemove, 1);
      }
      return [...prevCommands];
    });
  });

  return <>{renderPopover()}</>;

  function renderPopover() {
    const propSx = props.sx || {};
    return (
      <Popover
        open={props.open}
        anchorEl={props.anchorEl}
        disableScrollLock
        disableEnforceFocus
        sx={{
          ...propSx,
          "pointerEvents": "none",
          "zIndex": zIndex.diceFab,
          "& .MuiPaper-root": {
            pointerEvents: "initial",
          },
        }}
        onClose={() => {
          props.onClose?.();
        }}
        anchorOrigin={props.anchorOrigin}
        transformOrigin={props.transformOrigin}
      >
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
          <Box maxHeight="70vh" overflow="auto">
            <Box p="1rem">
              <DiceButtons
                onClick={handleDiceClick}
                onRightClick={handleRightClick}
                pool={props.pool}
                commands={[
                  "1d4",
                  "1d6",
                  "1d8",
                  "1d10",
                  "1d12",
                  "1d20",
                  "1d100",
                  "4dF",
                ]}
              />
              {(props.onClear || props.onCtaClick) && (
                <Box mt="1.5rem">
                  <Grid container justifyContent="center" spacing={2}>
                    {props.onClear && (
                      <Grid item>
                        <Button
                          color="secondary"
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
                          color="secondary"
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
        </Box>
      </Popover>
    );
  }
}
