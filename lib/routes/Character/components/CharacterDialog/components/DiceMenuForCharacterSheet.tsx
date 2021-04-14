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
  IDiceCommandGroupId,
} from "../../../../../domains/dice/Dice";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";

export const DiceMenuForCharacterSheet: React.FC<{
  commandGroupIds: Array<IDiceCommandGroupId>;
  onChange(newCommandIds: Array<IDiceCommandGroupId>): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [commandGroups, setCommandGroups] = useState<Array<IDiceCommandGroup>>(
    []
  );

  function handleOnMenuOpen(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
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
            <Tooltip title={props.commandGroupIds.join(" + ")}>
              <Link
                component="button"
                variant="caption"
                className={css({
                  color: theme.palette.primary.main,
                })}
                onClick={(e: any) => {
                  if (!open) {
                    handleOnMenuOpen(e);
                  } else {
                    handleOnMenuClose();
                  }
                }}
              >
                {t("character-dialog.control.set-dice")}
              </Link>
            </Tooltip>
            <Box>
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
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  );
};
DiceMenuForCharacterSheet.displayName = "DiceMenuForCharacterSheet";
