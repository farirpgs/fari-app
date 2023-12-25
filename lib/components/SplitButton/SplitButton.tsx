import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ClickAwayListener,
  Grid,
  Grow,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import React, { useEffect } from "react";
import { zIndex } from "../../constants/zIndex";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";

export type IOption = {
  label: string;
  onClick: () => void;
  endIcon?: JSX.Element;
};

type IProps = {
  instant?: boolean;
  options: Array<IOption>;
} & IDataCyProps &
  ButtonGroupProps;

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
            data-cy={`${props.dataCy}.button`}
            onClick={handleClick}
            endIcon={options[selectedIndex]?.endIcon}
          >
            {options[selectedIndex]?.label}
          </Button>
          <Button
            onClick={handleToggle}
            data-cy={`${props.dataCy}.select`}
            sx={{
              padding: 0,
            }}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          sx={{ zIndex: zIndex.splitButton }}
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
                        data-cy={`${props.dataCy}.select.${option.label}`}
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
