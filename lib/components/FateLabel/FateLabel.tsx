import { css, cx } from "@emotion/css";
import { Typography } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import React from "react";

export const FateLabel: React.FC<{
  className?: string;
  variant?: Variant;
  display?: "initial" | "block" | "inline";
  /**
   * @default "medium"
   */
  size?: "medium" | "small";
}> = (props) => {
  return (
    <Typography
      variant={props.variant}
      className={cx(
        css({
          textTransform: "uppercase",
          fontWeight: 900,
          fontSize: props.size === "small" ? ".8rem" : "1rem",
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
