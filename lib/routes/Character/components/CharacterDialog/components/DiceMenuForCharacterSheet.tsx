import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { ThemeProvider } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import { DiceMenu } from "../../../../../components/DiceFab/DiceMenu";
import { SettingsContext } from "../../../../../contexts/SettingsContext/SettingsContext";
import {
  CommmandSetOptions,
  IDiceCommandSetId,
  IDiceCommandSetOption,
  IRollDiceOptions,
} from "../../../../../domains/dice/Dice";
import { AppDarkTheme, AppLightTheme } from "../../../../../theme";

type RenderProps = {
  open: boolean;
  openMenu(event: React.MouseEvent<any, MouseEvent>): void;
  closeMenu(): void;
};

export function DiceMenuForCharacterSheet(props: {
  commandSetIds: Array<IDiceCommandSetId>;
  options: IRollDiceOptions;
  onChange(
    newCommandIds: Array<IDiceCommandSetId>,
    options: IRollDiceOptions | undefined
  ): void;
  render(renderProps: RenderProps): JSX.Element;
}) {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [commandSetIds, setCommandSetIds] = useState<
    Array<IDiceCommandSetOption>
  >([]);
  const [options, setOptions] = useState<IRollDiceOptions>();

  function handleOnMenuOpen(event: React.MouseEvent<any, MouseEvent>) {
    setAnchorEl(event.currentTarget);
  }

  function handleOnNewCommandSelect() {
    setAnchorEl(null);
    props.onChange(
      commandSetIds.map((c) => c.id),
      options
    );
  }

  function handleOnClear() {
    setCommandsGroupsFromIds([]);
  }

  function handleOnMenuClose() {
    setAnchorEl(null);
    setCommandsGroupsFromIds(props.commandSetIds);
  }

  function setCommandsGroupsFromIds(commandIds: Array<IDiceCommandSetId>) {
    const newCommands = commandIds.map((commandId) => {
      return CommmandSetOptions[commandId];
    });
    setCommandSetIds(newCommands);
  }

  useEffect(() => {
    setCommandsGroupsFromIds(props.commandSetIds);
  }, [props.commandSetIds]);
  useEffect(() => {
    setOptions(props.options);
  }, [props.options]);

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
                commands={commandSetIds}
                showPoolToggle={false}
                onDispatchDiceCommandChange={setCommandSetIds}
                onDispatchOptionsChange={setOptions}
                options={options}
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
