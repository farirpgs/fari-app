import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import useTheme from "@material-ui/core/styles/useTheme";
import TextField from "@material-ui/core/TextField";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import React, { useState } from "react";
import { useLazyState } from "../../../../../hooks/useLazyState/useLazyState";

export function CircleTextField(props: {
  "data-cy"?: string;
  "value": string | undefined;
  "readonly"?: boolean;
  "highlight"?: boolean;
  onChange?(value: string): void;
  onIncrement?(): void;
  onDecrement?(): void;
}) {
  const theme = useTheme();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useLazyState({
    value: props.value ?? "",
    delay: 750,
    onChange: (newValue) => {
      props.onChange?.(newValue);
    },
  });

  const areCounterButtonsVisible = hover || focus;

  return (
    <Box
      className={css({
        position: "relative",
        padding: ".2rem",
      })}
      onPointerEnter={() => {
        setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
      }}
    >
      <TextField
        type="number"
        data-cy={props["data-cy"]}
        value={value}
        variant="outlined"
        className={css({
          textAlign: "center",
        })}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        disabled={props.readonly}
        onChange={(e) => {
          if (!props.onChange) {
            return;
          }
          if (!e.target.value) {
            setValue("");
          } else {
            const parsed = parseInt(e.target.value);
            if (parsed > 999) {
              setValue("999");
            } else {
              setValue(parsed.toString());
            }
          }
        }}
        InputProps={{
          className: css({
            "width": "3rem",
            "height": "3rem",
            "borderRadius": "50%",
            "background": props.highlight
              ? theme.palette.primary.main
              : "inherit",
            "&&": {
              color: props.highlight
                ? theme.palette.getContrastText(theme.palette.primary.main)
                : "inherit",
            },
            "transition": theme.transitions.create(["color", "background"]),
            "boxShadow": theme.shadows[1],
          }),
        }}
        inputProps={{
          className: css({
            "fontWeight": theme.typography.fontWeightBold,
            "textAlign": "center",
            // this disables the up/down browser arrows
            "padding": "0",
            "&[type=number]": {
              MozAppearance: "textfield",
            },
            "&::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "&::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          }),
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      {!props.readonly && props.onDecrement && (
        <Fade in={areCounterButtonsVisible}>
          <IconButton
            size="small"
            data-cy={`${props["data-cy"]}.decrement`}
            className={css({
              "position": "absolute",
              "background": theme.palette.background.paper,
              "padding": "0",
              "left": "0",
              "bottom": "0",
              "&:hover": { background: theme.palette.background.default },
            })}
            onClick={() => {
              props.onDecrement?.();
            }}
          >
            <RemoveCircleOutlineOutlinedIcon
              className={css({ width: "1.1rem", height: "1.1rem" })}
            />
          </IconButton>
        </Fade>
      )}
      {!props.readonly && props.onIncrement && (
        <Fade in={areCounterButtonsVisible}>
          <IconButton
            size="small"
            data-cy={`${props["data-cy"]}.increment`}
            className={css({
              "position": "absolute",
              "background": theme.palette.background.paper,
              "padding": "0",
              "right": "0",
              "bottom": "0",
              "&:hover": { background: theme.palette.background.default },
            })}
            onClick={() => {
              props.onIncrement?.();
            }}
          >
            <AddCircleOutlineOutlinedIcon
              className={css({ width: "1.1rem", height: "1.1rem" })}
            />
          </IconButton>
        </Fade>
      )}
    </Box>
  );
}
