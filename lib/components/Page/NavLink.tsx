import { css } from "@emotion/css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import { ReactRouterLink } from "../ReactRouterLink/ReactRouterLink";

export function NavLink(props: {
  to?: string | { pathname: string };
  target?: "_blank";
  tooltip?: string;
  onClick?: () => void;
  ["data-cy"]?: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();

  if (props.to) {
    return (
      <Tooltip title={props.tooltip ?? ""}>
        <Button
          color="inherit"
          component={ReactRouterLink}
          to={props.to}
          onClick={props.onClick}
          target={props.target}
          data-cy={props["data-cy"]}
          className={css({
            "textTransform": "none",
            "&:hover": {
              background: theme.palette.primary.light,
            },
          })}
        >
          {props.children}
        </Button>
      </Tooltip>
    );
  }
  return (
    <Tooltip title={props.tooltip ?? ""}>
      <Button
        color="inherit"
        onClick={props.onClick}
        data-cy={props["data-cy"]}
        className={css({
          "textTransform": "none",
          "&:hover": {
            background: theme.palette.primary.light,
          },
        })}
      >
        {props.children}
      </Button>
    </Tooltip>
  );
}
export function NavLinkCategory(props: {
  label: React.ReactNode;
  tooltip?: string;
  ["data-cy"]?: string;
  subNav?: Array<{
    label: React.ReactNode;
    links: Array<{
      "label": React.ReactNode;
      "to": string | { pathname: string };
      "target"?: "_blank";
      "tooltip"?: string;
      "icon"?: JSX.Element;
      "data-cy"?: string;
    }>;
  }>;
  onAnyLinkClick?: () => void;
  children?: JSX.Element;
}) {
  const theme = useTheme();
  const shouldRenderMobileMenu = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);

  function handleOpenSubNav(event: React.MouseEvent<HTMLButtonElement>) {
    if (!open) {
      setAnchorEl(event.currentTarget);
    } else {
      handleCloseSubNav();
    }
  }

  function handleCloseSubNav() {
    setAnchorEl(null);
  }

  return (
    <>
      <div>
        <Tooltip title={props.tooltip ?? ""}>
          <Button
            onClick={handleOpenSubNav}
            color="inherit"
            data-cy={props["data-cy"]}
            className={css({
              "textTransform": "none",
              "&:hover": {
                background: theme.palette.primary.light,
              },
            })}
            endIcon={<ExpandMoreIcon />}
          >
            <span>{props.label}</span>
          </Button>
        </Tooltip>
      </div>

      {shouldRenderMobileMenu ? (
        <Collapse in={open}>
          <Box mt=".5rem">
            <Paper elevation={2}>
              <Box p="1rem">
                <Box>{renderSubNav()}</Box>
              </Box>
            </Paper>
          </Box>
        </Collapse>
      ) : (
        <Popover
          open={open}
          onClose={handleCloseSubNav}
          anchorEl={anchorEl}
          TransitionProps={{ timeout: theme.transitions.duration.shortest }}
          className={css({
            marginTop: "1rem",
          })}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box px="1.5rem" py=".5rem" minWidth="200px">
            <Box>
              <Box>{renderSubNav()}</Box>
              <Box>{props.children}</Box>
            </Box>
          </Box>
        </Popover>
      )}
    </>
  );

  function renderSubNav() {
    return (
      <>
        {props.subNav?.map((category, categoryIndex) => {
          return (
            <Box key={categoryIndex} mt=".5rem" mb="1.5rem">
              <Box display="flex">
                <Typography
                  fontWeight="bold"
                  color="textSecondary"
                  className={css({
                    fontSize: ".8rem",
                    textTransform: "uppercase",
                  })}
                  variant="caption"
                >
                  {category.label}
                </Typography>
              </Box>
              {category.links.map((link, linkIndex) => {
                return (
                  <Box key={linkIndex} my=".5rem">
                    <Grid
                      container
                      wrap="nowrap"
                      spacing={1}
                      alignItems="center"
                    >
                      {link.icon && (
                        <Grid item>
                          <Box
                            display="flex"
                            className={css({
                              "& *": {
                                color: theme.palette.secondary.main,
                              },
                            })}
                          >
                            {link.icon}
                          </Box>
                        </Grid>
                      )}
                      <Grid item>
                        <Tooltip title={link.tooltip ?? ""}>
                          <div
                            className={css({
                              textAlign: "left",
                            })}
                          >
                            <ReactRouterLink
                              to={link.to}
                              target={link.target}
                              onClick={props.onAnyLinkClick}
                              data-cy={link["data-cy"]}
                              className={css({
                                "color": theme.palette.secondary.main,
                                "fontWeight": theme.typography.fontWeightBold,
                                "fontSize": "1rem",
                                "textDecoration": "none",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              })}
                            >
                              {link.label}
                            </ReactRouterLink>
                          </div>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </>
    );
  }
}
