import { makeStyles, Theme } from "@material-ui/core/styles";
import { darken, lighten } from "@material-ui/core/styles/colorManipulator";
import clsx from "clsx";
import React from "react";
import { scrollMarginTop } from "../Doc/hooks/useMarkdownFile";

const anchorSvgMaterialUI = `<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></svg>`;

function getAnchorSvg(color: string) {
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' focusable='false' fill='${color}' viewBox='0 0 24 24' aria-hidden='true'%3E%3Cpath d='M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'%3E%3C/path%3E%3C/svg%3E");`;
}

const styles = (theme: Theme) => {
  const lightBackground =
    theme.palette.type === "light"
      ? lighten(theme.palette.secondary.light, 0.85)
      : darken(theme.palette.secondary.light, 0.75);

  return {
    root: {
      ...theme.typography.body1,
      "color": theme.palette.text.primary,
      "wordBreak": "break-word",
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
        scrollMarginTop: `${scrollMarginTop}px`,
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        textTransform: "uppercase",
        fontWeight: 800,
        marginTop: "1rem",
        marginBottom: "2rem",
      },
      "& h2": {
        ...theme.typography.h4,
        scrollMarginTop: `${scrollMarginTop}px`,
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        textTransform: "uppercase",
        fontWeight: 800,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& h3": {
        ...theme.typography.h5,
        scrollMarginTop: `${scrollMarginTop}px`,
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        textTransform: "uppercase",
        fontWeight: 800,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& h4": {
        ...theme.typography.h6,
        scrollMarginTop: `${scrollMarginTop}px`,
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        textTransform: "uppercase",
        fontWeight: 800,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& h5": {
        ...theme.typography.subtitle1,
        scrollMarginTop: `${scrollMarginTop}px`,
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        textTransform: "uppercase",
        fontWeight: 800,
        marginTop: "2rem",
        marginBottom: "1rem",
      },
      "& h6": {
        ...theme.typography.subtitle2,
        scrollMarginTop: `${scrollMarginTop}px`,
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        textTransform: "uppercase",
        fontWeight: 800,
        marginTop: "2rem",
        marginBottom: "1rem",
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
      "& thead tr": {
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      },
      "& tbody tr": {
        "&:nth-child(even)": { background: "transparent" },
        "&:nth-child(odd)": { background: lightBackground },
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
        textAlign: "left",
        lineHeight: theme.typography.pxToRem(24),
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary,
        whiteSpace: "pre",
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: ".5rem",
      },
      "& blockquote": {
        "borderLeft": `5px solid ${theme.palette.primary.main}`,
        "boxShadow": theme.shadows[1],
        "backgroundColor": lightBackground,
        "padding": ".5rem 2rem",
        "margin": "1.5rem 0",
        "& p": {
          marginTop: "16px",
        },
        "& h1,h2,h3,h4,h5,h6": {
          marginTop: "1rem",
          fontStyle: "normal",
          fontFamily: `'Work Sans', sans-serif`,
        },
        "& *:not(fate)": {
          fontFamily: `'Work Sans', sans-serif`,
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
        display: "block",
        margin: "0 auto",
        width: "50%",
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
        backgroundImage: getAnchorSvg(
          theme.palette.type === "dark" ? "white" : "black"
        ),
        transform: "rotate(45deg)",
        marginLeft: ".5rem",
        display: "inline-block",
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
