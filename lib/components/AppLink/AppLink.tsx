import { css, cx } from "@emotion/css";
import Button, { ButtonProps } from "@mui/material/Button";
import MaterialUILink, { LinkProps as MUILinkProps } from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import React from "react";
import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";

type IProps = {
  to?: string;
  onClick?(event: React.MouseEvent<HTMLAnchorElement>): void;
};

export const AppLink: React.FC<
  Omit<ReactRouterLinkProps, "to"> & Omit<MUILinkProps, "to"> & IProps
> = (props) => {
  const { to = "", onClick, className: classNameFromProps, ...rest } = props;
  const isInternal = to.startsWith("/");
  const theme = useTheme();
  const className = cx(
    css({
      "label": "AppLink",
      "fontWeight": theme.typography.fontWeightMedium,
      "display": "inline-flex",
      "flexDirection": "row",
      "alignItems": "center",
      ":hover": {
        textDecoration: "none",
        color: theme.palette.primary.main,
      },
    }),
    classNameFromProps
  );

  if (isInternal) {
    return (
      <MaterialUILink
        to={to}
        component={ReactRouterLink}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          if (onClick) {
            event.preventDefault();
            onClick(event);
          }
        }}
        className={className}
        rel={props.target === "_blank" ? "noreferrer" : undefined}
        {...rest}
        underline="hover"
      >
        {props.children}
      </MaterialUILink>
    );
  }

  return (
    <MaterialUILink
      href={to as string}
      component={"a"}
      className={className}
      rel={props.target === "_blank" ? "noreferrer" : undefined}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
          event.preventDefault();
          onClick(event);
        }
      }}
      {...rest}
      underline="hover"
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
