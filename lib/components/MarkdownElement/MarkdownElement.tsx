import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const anchorSvg =
  "url(data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJsaW5rIiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtbGluayBmYS13LTE2IiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDUxMiA1MTIiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTMyNi42MTIgMTg1LjM5MWM1OS43NDcgNTkuODA5IDU4LjkyNyAxNTUuNjk4LjM2IDIxNC41OS0uMTEuMTItLjI0LjI1LS4zNi4zN2wtNjcuMiA2Ny4yYy01OS4yNyA1OS4yNy0xNTUuNjk5IDU5LjI2Mi0yMTQuOTYgMC01OS4yNy01OS4yNi01OS4yNy0xNTUuNyAwLTIxNC45NmwzNy4xMDYtMzcuMTA2YzkuODQtOS44NCAyNi43ODYtMy4zIDI3LjI5NCAxMC42MDYuNjQ4IDE3LjcyMiAzLjgyNiAzNS41MjcgOS42OSA1Mi43MjEgMS45ODYgNS44MjIuNTY3IDEyLjI2Mi0zLjc4MyAxNi42MTJsLTEzLjA4NyAxMy4wODdjLTI4LjAyNiAyOC4wMjYtMjguOTA1IDczLjY2LTEuMTU1IDEwMS45NiAyOC4wMjQgMjguNTc5IDc0LjA4NiAyOC43NDkgMTAyLjMyNS41MWw2Ny4yLTY3LjE5YzI4LjE5MS0yOC4xOTEgMjguMDczLTczLjc1NyAwLTEwMS44My0zLjcwMS0zLjY5NC03LjQyOS02LjU2NC0xMC4zNDEtOC41NjlhMTYuMDM3IDE2LjAzNyAwIDAgMS02Ljk0Ny0xMi42MDZjLS4zOTYtMTAuNTY3IDMuMzQ4LTIxLjQ1NiAxMS42OTgtMjkuODA2bDIxLjA1NC0yMS4wNTVjNS41MjEtNS41MjEgMTQuMTgyLTYuMTk5IDIwLjU4NC0xLjczMWExNTIuNDgyIDE1Mi40ODIgMCAwIDEgMjAuNTIyIDE3LjE5N3pNNDY3LjU0NyA0NC40NDljLTU5LjI2MS01OS4yNjItMTU1LjY5LTU5LjI3LTIxNC45NiAwbC02Ny4yIDY3LjJjLS4xMi4xMi0uMjUuMjUtLjM2LjM3LTU4LjU2NiA1OC44OTItNTkuMzg3IDE1NC43ODEuMzYgMjE0LjU5YTE1Mi40NTQgMTUyLjQ1NCAwIDAgMCAyMC41MjEgMTcuMTk2YzYuNDAyIDQuNDY4IDE1LjA2NCAzLjc4OSAyMC41ODQtMS43MzFsMjEuMDU0LTIxLjA1NWM4LjM1LTguMzUgMTIuMDk0LTE5LjIzOSAxMS42OTgtMjkuODA2YTE2LjAzNyAxNi4wMzcgMCAwIDAtNi45NDctMTIuNjA2Yy0yLjkxMi0yLjAwNS02LjY0LTQuODc1LTEwLjM0MS04LjU2OS0yOC4wNzMtMjguMDczLTI4LjE5MS03My42MzkgMC0xMDEuODNsNjcuMi02Ny4xOWMyOC4yMzktMjguMjM5IDc0LjMtMjguMDY5IDEwMi4zMjUuNTEgMjcuNzUgMjguMyAyNi44NzIgNzMuOTM0LTEuMTU1IDEwMS45NmwtMTMuMDg3IDEzLjA4N2MtNC4zNSA0LjM1LTUuNzY5IDEwLjc5LTMuNzgzIDE2LjYxMiA1Ljg2NCAxNy4xOTQgOS4wNDIgMzQuOTk5IDkuNjkgNTIuNzIxLjUwOSAxMy45MDYgMTcuNDU0IDIwLjQ0NiAyNy4yOTQgMTAuNjA2bDM3LjEwNi0zNy4xMDZjNTkuMjcxLTU5LjI1OSA1OS4yNzEtMTU1LjY5OS4wMDEtMjE0Ljk1OXoiPjwvcGF0aD48L3N2Zz4=)";

const styles = (theme: Theme) => {
  return {
    root: {
      ...theme.typography.body1,
      "color": theme.palette.text.primary,
      "wordBreak": "break-word",
      "& .anchor-link": {
        marginTop: -96,
        position: "absolute",
      },
      "& pre": {
        margin: theme.spacing(3, "auto"),
        padding: theme.spacing(2),
        backgroundColor: "#272c34",
        direction: "ltr",
        borderRadius: theme.shape.borderRadius,
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        maxWidth: "calc(100vw - 32px)",
        [theme.breakpoints.up("md")]: {
          maxWidth: "calc(100vw - 32px - 16px)",
        },
      },
      "& code": {
        lineHeight: 1.4,
        display: "inline-block",
        fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
        WebkitFontSmoothing: "subpixel-antialiased",
        padding: "0 3px",
        color: theme.palette.text.primary,
        backgroundColor:
          theme.palette.type === "light"
            ? "rgba(255, 229, 100, 0.2)"
            : "rgba(255, 229, 100, 0.2)",
        fontSize: 14,
        borderRadius: 2,
      },
      '& code[class*="language-"]': {
        backgroundColor: "#272c34",
        color: "#fff",
        // Avoid layout jump after hydration (style injected by prism)
        lineHeight: 1.5,
      },
      "& p code, & ul code, & pre code": {
        fontSize: 14,
      },
      "& .token.operator": {
        background: "transparent",
      },
      "& .description": {
        ...theme.typography.h5,
        margin: "0 0 40px",
      },
      "& h1": {
        ...theme.typography.h3,
        marginTop: "1rem",
        marginBottom: "2rem",
      },
      "& h2": {
        ...theme.typography.h4,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& h3": {
        ...theme.typography.h5,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& h4": {
        ...theme.typography.h6,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& h5": {
        ...theme.typography.h6,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& h6": {
        ...theme.typography.h6,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& p, & ul, & ol": {
        marginTop: 0,
        marginBottom: 16,
      },
      "& ul": {
        paddingLeft: 30,
      },
      "& h1, & h2, & h3, & h4": {
        "& code": {
          fontSize: "inherit",
          lineHeight: "inherit",
          // Remove scroll on small screens.
          wordBreak: "break-all",
        },
        "& .anchor-link-style": {
          // To prevent the link to get the focus.
          display: "none",
        },
        "&:hover .anchor-link-style": {
          "display": "inline-block",
          "padding": "0 8px",
          "color": theme.palette.text.secondary,
          "&:hover": {
            color: theme.palette.text.primary,
          },
          "& svg": {
            width: "0.7em",
            height: "0.7em",
            fill: "currentColor",
          },
        },
      },
      "& table": {
        // Trade display table for scroll overflow
        "display": "block",
        "wordBreak": "normal",
        "width": "100%",
        "overflowX": "auto",
        "WebkitOverflowScrolling": "touch",
        "borderCollapse": "collapse",
        "marginBottom": "16px",
        "borderSpacing": 0,
        "overflow": "hidden",
        "& .prop-name": {
          fontSize: 13,
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
        },
        "& .required": {
          color: theme.palette.type === "light" ? "#006500" : "#a5ffa5",
        },
        "& .prop-type": {
          fontSize: 13,
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
          color: theme.palette.type === "light" ? "#932981" : "#ffb6ec",
        },
        "& .prop-default": {
          fontSize: 13,
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
          borderBottom: `1px dotted ${theme.palette.divider}`,
        },
      },
      "& td": {
        ...theme.typography.body2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: ".5rem",
        color: theme.palette.text.primary,
      },
      "& td p": {
        ...theme.typography.body2,
        margin: "0",
      },
      "& td code": {
        fontSize: 13,
        lineHeight: 1.6,
      },
      "& th": {
        fontSize: 14,
        lineHeight: theme.typography.pxToRem(24),
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.palette.text.primary,
        whiteSpace: "pre",
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: 16,
      },
      "& blockquote": {
        "borderLeft": "5px solid #ffe564",
        "backgroundColor": "rgba(255,229,100,0.2)",
        "padding": "4px 24px",
        "margin": "24px 0",
        "& p": {
          marginTop: "16px",
        },
      },
      "& a, & a code": {
        // Style taken from the Link component
        "color": theme.palette.primary.main,
        "textDecoration": "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
      "& img, video": {
        maxWidth: "100%",
      },
      "& img": {
        // Avoid layout jump
        display: "inline-block",
      },
      "& hr": {
        height: 1,
        margin: theme.spacing(6, 0),
        border: "none",
        flexShrink: 0,
        backgroundColor: theme.palette.divider,
      },
      "& kbd": {
        // Style taken from GitHub
        padding: "2px 5px",
        font: "11px Consolas,Liberation Mono,Menlo,monospace",
        lineHeight: "10px",
        color: "#444d56",
        verticalAlign: "middle",
        backgroundColor: "#fafbfc",
        border: "1px solid #d1d5da",
        borderRadius: 3,
        boxShadow: "inset 0 -1px 0 #d1d5da",
      },
      "& .anchor": {
        backgroundImage: anchorSvg,
        marginLeft: ".5rem",
        display: "inline-block",
        opacity: ".3",
        backgroundRepeat: "no-repeat",
        cursor: "pointer",
      },
      "& h1 .anchor": {
        width: theme.typography.h4.fontSize,
        height: theme.typography.h4.fontSize,
      },
      "& h2 .anchor": {
        width: theme.typography.h5.fontSize,
        height: theme.typography.h5.fontSize,
      },
      "& h3 .anchor": {
        width: theme.typography.h6.fontSize,
        height: theme.typography.h6.fontSize,
      },
      "& h4 .anchor": {
        width: theme.typography.h6.fontSize,
        height: theme.typography.h6.fontSize,
      },
      "& h5 .anchor": {
        width: theme.typography.h6.fontSize,
        height: theme.typography.h6.fontSize,
      },
      "& h6 .anchor": {
        width: theme.typography.h6.fontSize,
        height: theme.typography.h6.fontSize,
      },
    },
  };
};
const useStyles = makeStyles<Theme>(styles as any, {
  name: "MarkdownElement",
  flip: false,
});

/**
 * Adapted from: https://github.com/mui-org/material-ui/blob/master/docs/src/modules/components/MarkdownElement.js
 */
const MarkdownElement = React.forwardRef<
  any,
  { renderedMarkdown: string; className?: string }
>(function MarkdownElement(props, ref) {
  const { className, renderedMarkdown, ...other } = props;
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.root, "markdown-body", className)}
      dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
      ref={ref}
    />
  );
});

export default MarkdownElement;
