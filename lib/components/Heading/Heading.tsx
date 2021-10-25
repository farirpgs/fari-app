import { css } from "@emotion/css";
import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { FateLabel } from "../FateLabel/FateLabel";

export const Heading: React.FC<
  {
    title?: string | JSX.Element;
    subtitle?: string | JSX.Element;
    icon?: React.ElementType;
    children?: string | JSX.Element;
  } & BoxProps
> = (props) => {
  const { title, subtitle, icon, ...boxProps } = props;
  const Icon = icon;
  return (
    <Box
      mt="1rem"
      mb="2rem"
      display="flex"
      flexDirection="column"
      alignItems="center"
      {...boxProps}
    >
      {Icon && (
        <Box mb=".5rem">
          <Icon className={css({ fontSize: "3rem" })} color="primary" />
        </Box>
      )}
      <FateLabel variant="h4" as="h1" align="center" color="primary">
        {title}
      </FateLabel>
      {subtitle && (
        <Typography
          variant="h6"
          variantMapping={{ h6: "h2" }}
          align="center"
          color="primary"
        >
          {subtitle}
        </Typography>
      )}
      {props.children}
    </Box>
  );
};
