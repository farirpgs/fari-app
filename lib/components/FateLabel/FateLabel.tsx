import { css, cx } from "@emotion/css";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import React from "react";

export const FateLabel: React.FC<
  {
    className?: string;
    underline?: boolean;
    textColor?: string;
    fontSize?: string | number;
  } & TypographyProps
> = (props) => {
  const { className, underline, textColor, ...rest } = props;
  const color = textColor ?? undefined;
  return (
    <Typography
      {...rest}
      className={cx(
        props.className,
        css({
          textTransform: "uppercase",
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
