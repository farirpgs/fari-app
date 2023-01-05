import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { ThemeProvider } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import { DiceMenu } from "../../../../../components/DiceFab/DiceMenu";
import { SettingsContext } from "../../../../../contexts/SettingsContext/SettingsContext";
import { IDiceCommandId } from "../../../../../domains/dice/Dice";
import { AppDarkTheme, AppLightTheme } from "../../../../../theme";

type RenderProps = {
  open: boolean;
  openMenu(event: React.MouseEvent<any, MouseEvent>): void;
  closeMenu(): void;
};

export function DiceMenuForCharacterSheet(props: {
  commandSetIds: Array<IDiceCommandId>;
  onChange(newCommandIds: Array<IDiceCommandId>): void;
  render(renderProps: RenderProps): JSX.Element;
}) {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [commandSetIds, setCommandSetIds] = useState<Array<IDiceCommandId>>([]);

  function handleOnMenuOpen(event: React.MouseEvent<any, MouseEvent>) {
    setAnchorEl(event.currentTarget);
  }

  function handleOnNewCommandSelect() {
    setAnchorEl(null);
    props.onChange(commandSetIds);
  }

  function handleOnClear() {
    setCommandSetIds([]);
  }

  function handleOnMenuClose() {
    setAnchorEl(null);
    setCommandSetIds(props.commandSetIds);
  }

  useEffect(
    function syncPropsWithState() {
      setCommandSetIds(props.commandSetIds);
    },
    [props.commandSetIds]
  );

  const settingsManager = useContext(SettingsContext);

  return (
    <>
      <Box>
        <ClickAwayListener onClickAway={handleOnMenuClose}>
          <Box>
            {props.render({
              open: open,
              openMenu: handleOnMenuOpen,
              closeMenu: handleOnMenuClose,
            })}
            <ThemeProvider
              theme={
                settingsManager.state.themeMode === "dark"
                  ? AppDarkTheme
                  : AppLightTheme
              }
            >
              <DiceMenu
                open={open}
                anchorEl={anchorEl}
                pool={commandSetIds}
                sx={{
                  marginBottom: "1rem",
                }}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "left",
                }}
                onDiceCommandChange={setCommandSetIds}
                ctaLabel="Select"
                onClear={handleOnClear}
                onClose={handleOnMenuClose}
                onCtaClick={handleOnNewCommandSelect}
              />
            </ThemeProvider>
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  );
}
DiceMenuForCharacterSheet.displayName = "DiceMenuForCharacterSheet";
