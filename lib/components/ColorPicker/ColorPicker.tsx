import { css, cx } from "@emotion/css";
import { useTheme } from "@mui/material/styles";
import React from "react";
import TwitterPicker from "react-color/lib/components/twitter/Twitter";
import { pickerColors } from "../DrawArea/domains/pickerColors";

export const ColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
  hideCustom?: boolean;
  colors?: Array<string>;
}> = (props) => {
  const theme = useTheme();
  return (
    <TwitterPicker
      width="10.5rem"
      triangle="hide"
      styles={{
        default: {
          card: {
            background: theme.palette.background.paper,
          },
          swatch: {
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1],
          },
          hash: {
            clear: "both",
            display: props.hideCustom ? "none" : undefined,
          },
          input: { display: props.hideCustom ? "none" : undefined },
        },
      }}
      color={props.value}
      colors={props.colors || pickerColors}
      className={cx(
        "data-cy-color-picker",
        css({
          boxShadow: "none",
        })
      )}
      onChange={(color) => props.onChange(color.hex)}
    />
  );
};
ColorPicker.displayName = "ColorPicker";
