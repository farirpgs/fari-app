import { css, cx } from "@emotion/css";
import Button, { ButtonProps } from "@material-ui/core/Button";
import MaterialUILink, {
  LinkProps as MUILinkProps,
} from "@material-ui/core/Link";
import { useTheme } from "@material-ui/core/styles";
import React from "react";
import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";

type IProps = {
  to?: string;
  onClick?(): void;
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

  const link = isInternal ? (
    <MaterialUILink
      to={to}
      component={ReactRouterLink}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      className={className}
      rel={props.target === "_blank" ? "noreferrer" : undefined}
      {...rest}
    >
      {props.children}
    </MaterialUILink>
  ) : (
    <MaterialUILink
      href={to as string}
      component={"a"}
      className={className}
      rel={props.target === "_blank" ? "noreferrer" : undefined}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      {...rest}
    >
      {props.children}
    </MaterialUILink>
  );

  return link;
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
