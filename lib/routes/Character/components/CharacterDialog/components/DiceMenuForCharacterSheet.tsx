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
  const [commands, setCommands] = useState<Array<IDiceCommandGroup>>([]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChooseClose = () => {
    setAnchorEl(null);
    props.onChange(commands.map((c) => c.id));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(
    function syncPropsWithState() {
      const newCommands = props.commandIds.map((commandId) => {
        return AllDiceCommandGroups.find(
          (c) => c.id === commandId
        ) as IDiceCommandGroup;
      });
      setCommands(newCommands);
    },
    [props.commandIds]
  );

  return (
    <>
      <ClickAwayListener onClickAway={handleMenuClose}>
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
            commands={commands}
            onDiceCommandChange={setCommands}
            ctaLabel="Choose"
            onCtaClick={handleChooseClose}
          />
        </Box>
      </ClickAwayListener>
    </>
  );
};
DiceMenuForCharacterSheet.displayName = "DiceMenuForCharacterSheet";
