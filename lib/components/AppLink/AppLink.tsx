import Button, { ButtonProps } from "@material-ui/core/Button";
import Link, { LinkProps as MUILinkProps } from "@material-ui/core/Link";
import React from "react";
import {
  Link as RouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";

export const AppLink: React.FC<ReactRouterLinkProps & MUILinkProps> = (
  props
) => {
  return (
    <Link
      component={RouterLink}
      style={{
        textDecoration: "none",
      }}
      {...props}
    >
      {props.children}
    </Link>
  );
};

export const AppButtonLink: React.FC<ReactRouterLinkProps & ButtonProps> = (
  props
) => {
  return (
    <Button component={RouterLink} {...props}>
      {props.children}
    </Button>
  );
};
