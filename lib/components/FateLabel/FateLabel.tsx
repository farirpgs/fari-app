import { css, cx } from "@emotion/css";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import React from "react";

export const FateLabel: React.FC<
  {
    className?: string;
    underline?: boolean;
    textColor?: string;
    fontSize?: string | number;
    as?: string;
    uppercase?: boolean;
  } & TypographyProps
> = (props) => {
  const {
    className,
    underline,
    textColor,
    as,
    uppercase = true,
    ...rest
  } = props;
  const color = textColor ?? undefined;
  return (
    <Typography
      {...rest}
      variantMapping={{ [props.variant as string]: as }}
      className={cx(
        props.className,
        css({
          textTransform: uppercase ? "uppercase" : undefined,
          fontWeight: 800,
          fontSize: props.fontSize,
          color: color,
          textDecoration: underline ? "underline" : undefined,
        })
      )}
    >
      {props.children}
    </Typography>
  );
};
FateLabel.displayName = "FateLabel";
