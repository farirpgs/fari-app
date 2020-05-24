import { Typography } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import { css, cx } from "emotion";
import React from "react";

export const FateLabel: React.FC<{
  className?: string;
  variant?: Variant;
  display?: "initial" | "block" | "inline";
}> = (props) => {
  return (
    <Typography
      variant={props.variant}
      className={cx(
        css({
          textTransform: "uppercase",
          fontWeight: 900,
        }),
        props.className
      )}
      display={props.display}
    >
      {props.children}
    </Typography>
  );
};
FateLabel.displayName = "FateLabel";
