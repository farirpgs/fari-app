import { css } from "@emotion/css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import ButtonGroup, { ButtonGroupProps } from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import React, { useEffect } from "react";
import { zIndex } from "../../constants/zIndex";

export type IOption = {
  label: string;
  onClick: () => void;
  endIcon?: JSX.Element;
};

type IProps = {
  "data-cy"?: string;
  "instant"?: boolean;
  "options": Array<IOption>;
} & ButtonGroupProps;

export const SplitButton: React.FC<IProps> = (props) => {
  const { options, instant, ...buttonProps } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [options.length]);

  function handleClick() {
    options[selectedIndex].onClick();
  }

  function handleMenuItemClick(index: number) {
    setSelectedIndex(index);
    setOpen(false);
    if (instant) {
      props.options[index].onClick();
    }
  }

  function handleToggle() {
    setOpen((prevOpen) => !prevOpen);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup {...buttonProps} ref={anchorRef}>
          <Button
            data-cy={`${props["data-cy"]}.button`}
            onClick={handleClick}
            endIcon={options[selectedIndex]?.endIcon}
          >
            {options[selectedIndex]?.label}
          </Button>
          <Button
            onClick={handleToggle}
            data-cy={`${props["data-cy"]}.select`}
            className={css({
              padding: 0,
            })}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          className={css({ zIndex: zIndex.splitButton })}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>
                    {options.map((option, index) => (
                      <MenuItem
                        data-cy={`${props["data-cy"]}.select.${option.label}`}
                        key={option.label}
                        selected={index === selectedIndex}
                        onClick={() => handleMenuItemClick(index)}
                      >
                        {option.endIcon && (
                          <ListItemIcon>{option.endIcon}</ListItemIcon>
                        )}
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
};

SplitButton.displayName = "SplitButton";
