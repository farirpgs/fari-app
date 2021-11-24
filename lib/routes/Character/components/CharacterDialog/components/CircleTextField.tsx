import { css } from "@emotion/css";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { ConditionalWrapper } from "../../../../../components/ConditionalWrapper/ConditionalWrapper";
import { Delays } from "../../../../../constants/Delays";
import { useLazyState } from "../../../../../hooks/useLazyState/useLazyState";

export function CircleTextField(props: {
  "data-cy"?: string;
  "value": string | undefined;
  "readonly"?: boolean;
  "highlight"?: boolean;
  "button"?: boolean;
  onChange?(value: string): void;
  onIncrement?(): void;
  onDecrement?(): void;
  onClick?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
  onContextMenu?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
}) {
  const theme = useTheme();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useLazyState({
    value: props.value ?? "",
    delay: Delays.field,
    onChange: (newValue) => {
      props.onChange?.(newValue);
    },
  });

  const cursor = props.button ? "pointer !important" : "inherit";
  const areCounterButtonsVisible = hover || focus;

  return (
    <Box
      className={css({
        position: "relative",
        padding: ".2rem",
        cursor: cursor,
      })}
      onClick={(e) => {
        if (props.button) {
          props.onClick?.(e);
        }
        setHover(true);
      }}
      onContextMenu={(e) => {
        if (props.button) {
          props.onContextMenu?.(e);
        }
      }}
      onPointerEnter={() => {
        setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
      }}
    >
      <ConditionalWrapper
        condition={props.button}
        wrapper={(children) => {
          return (
            <ButtonBase className={css({ borderRadius: "50%" })}>
              {children}
            </ButtonBase>
          );
        }}
      >
        <TextField
          type="number"
          data-cy={props["data-cy"]}
          value={value}
          variant="outlined"
          className={css({
            textAlign: "center",
            cursor: cursor,
          })}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          disabled={props.readonly || props.button}
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
              "cursor": cursor,
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
              "transition": theme.transitions.create(["color", "background"], {
                duration: theme.transitions.duration.shortest,
              }),
              "boxShadow": theme.shadows[1],
              "& fieldset": {
                borderColor: "currentColor",
              },
            }),
          }}
          inputProps={{
            className: css({
              "cursor": cursor,
              "fontWeight": theme.typography.fontWeightBold,
              "textAlign": "center",
              // this disables the up/down browser arrows
              "padding": "0",
              "&.Mui-disabled": {
                WebkitTextFillColor: "unset",
              },
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
      </ConditionalWrapper>

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
