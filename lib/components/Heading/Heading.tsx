import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FateLabel } from "../FateLabel/FateLabel";

export const Heading: React.FC<{
  subtitle?: string;
  icon?: React.ElementType;
}> = (props) => {
  const Icon = props.icon;
  return (
    <Box
      pt="1rem"
      pb="2rem"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {Icon && (
        <Box pb=".5rem">
          <Icon className={css({ fontSize: "3rem" })} color="primary" />
        </Box>
      )}
      <FateLabel variant="h4" align="center" color="primary">
        {props.children}
      </FateLabel>
      {props.subtitle && (
        <Typography variant="h6" align="center" color="secondary">
          {props.subtitle}
        </Typography>
      )}
    </Box>
  );
};
