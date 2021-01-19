import Button, { ButtonProps } from "@material-ui/core/Button";
import MaterialUILink, {
  LinkProps as MUILinkProps,
} from "@material-ui/core/Link";
import React from "react";
import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";

export const AppLink: React.FC<ReactRouterLinkProps & MUILinkProps> = (
  props
) => {
  const { to, ...rest } = props;
  const isInternal = (props.to as string).startsWith("/");

  if (isInternal) {
    return (
      <MaterialUILink
        to={to}
        component={ReactRouterLink}
        underline={"none"}
        rel={props.target === "_blank" ? "noreferrer" : undefined}
        {...rest}
      >
        {props.children}
      </MaterialUILink>
    );
  }

  return (
    <MaterialUILink
      href={to as string}
      component={"a"}
      rel={props.target === "_blank" ? "noreferrer" : undefined}
      {...rest}
    >
      {props.children}
    </MaterialUILink>
  );
};

export const AppButtonLink: React.FC<ReactRouterLinkProps & ButtonProps> = (
  props
) => {
  const { to, ...rest } = props;
  const isInternal = (props.to as string).startsWith("/");

  if (isInternal) {
    return (
      <Button
        to={to}
        component={ReactRouterLink}
        rel={props.target === "_blank" ? "noreferrer" : undefined}
        {...rest}
      >
        {props.children}
      </Button>
    );
  }

  return (
    <Button
      href={to as string}
      component={"a"}
      rel={props.target === "_blank" ? "noreferrer" : undefined}
      {...rest}
    >
      {props.children}
    </Button>
  );
};

export const MUILink = MaterialUILink;
export const RouterLink = ReactRouterLink;
