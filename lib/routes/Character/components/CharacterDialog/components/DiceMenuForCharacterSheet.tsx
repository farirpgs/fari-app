import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import React, { useEffect, useState } from "react";
import { DiceMenu } from "../../../../../components/DiceFab/DiceMenu";
import {
  CommmandSetOptions,
  IDiceCommandSetId,
  IDiceCommandSetOption,
} from "../../../../../domains/dice/Dice";

type RenderProps = {
  open: boolean;
  openMenu(event: React.MouseEvent<any, MouseEvent>): void;
  closeMenu(): void;
};

export function DiceMenuForCharacterSheet(props: {
  commandSetIds: Array<IDiceCommandSetId>;
  onChange(newCommandIds: Array<IDiceCommandSetId>): void;
  render(renderProps: RenderProps): JSX.Element;
}) {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [commandSetIds, setCommandSetIds] = useState<
    Array<IDiceCommandSetOption>
  >([]);

  function handleOnMenuOpen(event: React.MouseEvent<any, MouseEvent>) {
    setAnchorEl(event.currentTarget);
  }

  function handleOnNewCommandSelect() {
    setAnchorEl(null);
    props.onChange(commandSetIds.map((c) => c.id));
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

  useEffect(
    function syncPropsWithState() {
      setCommandsGroupsFromIds(props.commandSetIds);
    },
    [props.commandSetIds]
  );

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

            <DiceMenu
              open={open}
              anchorEl={anchorEl}
              commands={commandSetIds}
              showPoolToggle={false}
              onDiceCommandChange={setCommandSetIds}
              ctaLabel="Select"
              onClear={handleOnClear}
              onClose={handleOnMenuClose}
              onCtaClick={handleOnNewCommandSelect}
            />
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  );
}
DiceMenuForCharacterSheet.displayName = "DiceMenuForCharacterSheet";
