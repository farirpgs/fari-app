import { BoxProps } from "@mui/material/Box";
import Typography, { TypographyProps } from "@mui/material/Typography";
import React from "react";

export const FateLabel: React.FC<
  {
    sx?: BoxProps["sx"];
    underline?: boolean;
    textColor?: string;
    fontSize?: string | number;
    as?: string;
    uppercase?: boolean;
  } & TypographyProps
> = (props) => {
  const { sx, underline, textColor, as, uppercase = true, ...rest } = props;
  const color = textColor ?? undefined;
  return (
    <Typography
      {...rest}
      variantMapping={{ [props.variant as string]: as }}
      sx={{
        textTransform: uppercase ? "uppercase" : undefined,
        fontWeight: 800,
        fontSize: props.fontSize,
        color: color,
        textDecoration: underline ? "underline" : undefined,
        ...sx,
      }}
    >
      {props.children}
    </Typography>
  );
};
FateLabel.displayName = "FateLabel";
