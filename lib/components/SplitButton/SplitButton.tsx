import { css } from "@emotion/css";
import Button from "@material-ui/core/Button";
import ButtonGroup, { ButtonGroupProps } from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React, { useEffect } from "react";
import { zIndex } from "../../constants/zIndex";

export type IOption = {
  label: string;
  onClick: () => void;
  endIcon?: JSX.Element;
};

type IProps = {
  instant?: boolean;
  options: Array<IOption>;
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
            onClick={handleClick}
            endIcon={options[selectedIndex]?.endIcon}
          >
            {options[selectedIndex]?.label}
          </Button>
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
