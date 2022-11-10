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
  const { to = "", onClick, sx, ...rest } = props;
  const isInternal = to.startsWith("/");
  const theme = useTheme();

  const style = {
    "label": "AppLink",
    "fontWeight": theme.typography.fontWeightMedium,
    "display": "inline-flex",
    "flexDirection": "row",
    "alignItems": "center",
    ":hover": {
      textDecoration: "none",
      color: theme.palette.primary.main,
    },
    ...sx,
  };
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
        sx={style}
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
      sx={style}
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

export const AppButtonLink = React.forwardRef<
  any,
  ReactRouterLinkProps & ButtonProps
>((props, ref) => {
  const isInternal = (props.to as string).startsWith("/");

  if (isInternal) {
    return (
      <Button
        to={props.to}
        component={ReactRouterLink}
        ref={ref}
        rel={props.target === "_blank" ? "noreferrer" : undefined}
      >
        {props.children}
      </Button>
    );
  }

  return (
    <Button
      href={props.to as string}
      component={"a"}
      ref={ref}
      rel={props.target === "_blank" ? "noreferrer" : undefined}
    >
      {props.children}
    </Button>
  );
});

export const MUILink = MaterialUILink;
export const RouterLink = ReactRouterLink;
