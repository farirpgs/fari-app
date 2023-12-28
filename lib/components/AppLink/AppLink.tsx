import {
  Button,
  ButtonProps,
  LinkProps as MUILinkProps,
  Link as MaterialUILink,
  useTheme,
} from "@mui/material";
import NextJSLink, { LinkProps as NextJSLinkProps } from "next/link";
import React from "react";

export const AppLink: React.FC<MUILinkProps & NextJSLinkProps> = (props) => {
  const { href = "", onClick, sx, ...rest } = props;
  const isInternal = href?.startsWith("/");
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
        href={href}
        component={NextJSLink}
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
      href={href}
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
  ButtonProps<"a"> & NextJSLinkProps
>((props, ref) => {
  const isInternal = (props.href as string)?.startsWith("/");

  if (isInternal) {
    return (
      <Button
        {...props}
        href={props.href}
        LinkComponent={NextJSLink}
        ref={ref}
        rel={props.rel}
      >
        {props.children}
      </Button>
    );
  }

  return (
    <Button
      {...props}
      href={props.href as string}
      LinkComponent={"a"}
      ref={ref}
      rel={props.rel}
    >
      {props.children}
    </Button>
  );
});
AppButtonLink.displayName = "AppButtonLink";

export const MUILink = MaterialUILink;
export const RouterLink = NextJSLink;
