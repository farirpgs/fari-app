import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FateLabel } from "../FateLabel/FateLabel";

export const Heading: React.FC<{
  title?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  icon?: React.ElementType;
}> = (props) => {
  const Icon = props.icon;
  return (
    <Box
      mt="1rem"
      mb="2rem"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {Icon && (
        <Box mb=".5rem">
          <Icon className={css({ fontSize: "3rem" })} color="primary" />
        </Box>
      )}
      <FateLabel variant="h4" as="h1" align="center" color="primary">
        {props.title}
      </FateLabel>
      {props.subtitle && (
        <Typography
          variant="h6"
          variantMapping={{ h6: "h2" }}
          align="center"
          color="secondary"
        >
          {props.subtitle}
        </Typography>
      )}
    </Box>
  );
};
