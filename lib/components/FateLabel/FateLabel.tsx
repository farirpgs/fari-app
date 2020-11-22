import { css, cx } from "@emotion/css";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import React from "react";

export const FateLabel: React.FC<
  {
    className?: string;
  } & TypographyProps
> = (props) => {
  return (
    <Typography
      {...props}
      className={cx(
        props.className,
        css({
          textTransform: "uppercase",
          fontWeight: 900,
        })
      )}
    >
      {props.children}
    </Typography>
  );
};
FateLabel.displayName = "FateLabel";
