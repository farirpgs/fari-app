import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { css } from "emotion";
import React from "react";
import { zIndex } from "../../constants/zIndex";

export type IOption = {
  label: string;
  onClick: () => void;
};

type IProps = {
  options: Array<IOption>;
} & ButtonGroupProps;

export const SplitButton: React.FC<IProps> = (props) => {
  const { options, ...buttonProps } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  function handleClick() {
    options[selectedIndex].onClick();
  }

  function handleMenuItemClick(index: number) {
    setSelectedIndex(index);
    setOpen(false);
  }

  function handleToggle() {
    setOpen((prevOpen) => !prevOpen);
  }

  function handleClose(event: React.MouseEvent<Document, MouseEvent>) {
    setOpen(false);
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup {...buttonProps} ref={anchorRef}>
          <Button onClick={handleClick}>{options[selectedIndex].label}</Button>
          <Button
            onClick={handleToggle}
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
                        key={option.label}
                        disabled={index === 2}
                        selected={index === selectedIndex}
                        onClick={() => handleMenuItemClick(index)}
                      >
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
