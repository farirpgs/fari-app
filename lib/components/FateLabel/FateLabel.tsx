import { css, cx } from "@emotion/css";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import React from "react";

export const FateLabel: React.FC<
  {
    className?: string;
    underline?: boolean;
  } & TypographyProps
> = (props) => {
  const { className, underline, ...rest } = props;
  return (
    <Typography
      {...rest}
      className={cx(
        props.className,
        css({
          textTransform: "uppercase",
          fontWeight: 800,
          textDecoration: underline ? "underline" : undefined,
        })
      )}
    >
      {props.children}
    </Typography>
  );
};
FateLabel.displayName = "FateLabel";
