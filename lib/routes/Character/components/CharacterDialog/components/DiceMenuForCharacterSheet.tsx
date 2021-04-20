import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import React, { useEffect, useState } from "react";
import { DiceMenu } from "../../../../../components/DiceFab/DiceFab";
import {
  AllDiceCommandGroups,
  IDiceCommandGroup,
  IDiceCommandGroupId,
} from "../../../../../domains/dice/Dice";

type RenderProps = {
  open: boolean;
  openMenu(event: React.MouseEvent<any, MouseEvent>): void;
  closeMenu(): void;
};

export function DiceMenuForCharacterSheet(props: {
  commandGroupIds: Array<IDiceCommandGroupId>;
  onChange(newCommandIds: Array<IDiceCommandGroupId>): void;
  render(renderProps: RenderProps): JSX.Element;
}) {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [commandGroups, setCommandGroups] = useState<Array<IDiceCommandGroup>>(
    []
  );

  function handleOnMenuOpen(event: React.MouseEvent<any, MouseEvent>) {
    setAnchorEl(event.currentTarget);
  }

  function handleOnNewCommandSelect() {
    setAnchorEl(null);
    props.onChange(commandGroups.map((c) => c.id));
  }

  function handleOnClear() {
    setCommandsGroupsFromIds([]);
  }

  function handleOnMenuClose() {
    setAnchorEl(null);
    setCommandsGroupsFromIds(props.commandGroupIds);
  }

  function setCommandsGroupsFromIds(commandIds: Array<IDiceCommandGroupId>) {
    const newCommands = commandIds.map((commandId) => {
      return AllDiceCommandGroups[commandId];
    });
    setCommandGroups(newCommands);
  }

  useEffect(
    function syncPropsWithState() {
      setCommandsGroupsFromIds(props.commandGroupIds);
    },
    [props.commandGroupIds]
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
              commands={commandGroups}
              showPoolToggle={false}
              onDiceCommandChange={setCommandGroups}
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
