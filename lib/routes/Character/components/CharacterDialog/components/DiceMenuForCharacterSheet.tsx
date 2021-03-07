import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Link from "@material-ui/core/Link";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useEffect, useState } from "react";
import { DiceMenu } from "../../../../../components/DiceFab/DiceFab";
import {
  AllDiceCommandGroups,
  IDiceCommandGroup,
} from "../../../../../domains/dice/Dice";

export const DiceMenuForCharacterSheet: React.FC<{
  commandIds: Array<string>;
  onChange(newCommandIds: Array<string>): void;
}> = (props) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [commandGroups, setCommandGroups] = useState<Array<IDiceCommandGroup>>(
    []
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnNewCommandSelect = () => {
    setAnchorEl(null);
    props.onChange(commandGroups.map((c) => c.id));
  };

  const handleOnMenuClose = () => {
    setAnchorEl(null);
    setCommandsGroupsFromIds(props.commandIds);
  };

  function setCommandsGroupsFromIds(commandIds: Array<string>) {
    const newCommands = commandIds.map((commandId) => {
      return AllDiceCommandGroups.find(
        (c) => c.id === commandId
      ) as IDiceCommandGroup;
    });
    setCommandGroups(newCommands);
  }

  useEffect(
    function syncPropsWithState() {
      setCommandsGroupsFromIds(props.commandIds);
    },
    [props.commandIds]
  );

  return (
    <>
      <ClickAwayListener onClickAway={handleOnMenuClose}>
        <Box>
          <Tooltip title={props.commandIds.join(" + ")}>
            <Link
              component="button"
              variant="caption"
              className={css({
                color: theme.palette.primary.main,
              })}
              onClick={(e: any) => {
                handleMenuOpen(e);
              }}
            >
              {!props.commandIds?.length
                ? "Add Dice Commands"
                : "Change Dice Commands"}
            </Link>
          </Tooltip>
          <DiceMenu
            open={open}
            anchorEl={anchorEl}
            commands={commandGroups}
            onDiceCommandChange={setCommandGroups}
            ctaLabel="Select"
            onCtaClick={handleOnNewCommandSelect}
            onClose={handleOnMenuClose}
          />
        </Box>
      </ClickAwayListener>
    </>
  );
};
DiceMenuForCharacterSheet.displayName = "DiceMenuForCharacterSheet";
