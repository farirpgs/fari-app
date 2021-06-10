import { css } from "@emotion/css";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Drawer from "@material-ui/core/Drawer";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import Select from "@material-ui/core/Select";
import { ThemeProvider } from "@material-ui/core/styles";
import useTheme from "@material-ui/core/styles/useTheme";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import BookIcon from "@material-ui/icons/Book";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import BugReportIcon from "@material-ui/icons/BugReport";
import ChatIcon from "@material-ui/icons/Chat";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import ForumIcon from "@material-ui/icons/Forum";
import GitHubIcon from "@material-ui/icons/GitHub";
import InfoIcon from "@material-ui/icons/Info";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import MenuIcon from "@material-ui/icons/Menu";
import SignalWifi0BarIcon from "@material-ui/icons/SignalWifi0Bar";
import SignalWifi4BarLockIcon from "@material-ui/icons/SignalWifi4BarLock";
import StorageIcon from "@material-ui/icons/Storage";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import TranslateIcon from "@material-ui/icons/Translate";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { env } from "../../constants/env";
import { Images } from "../../constants/Images";
import { useZIndex } from "../../constants/zIndex";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { Icons } from "../../domains/Icons/Icons";
import { useHighlight } from "../../hooks/useHighlight/useHighlight";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { ITranslationKeys } from "../../locale";
import { AppButtonLink, AppLink } from "../AppLink/AppLink";
import { CannyChangelog } from "../CannyChangelog/CannyChangelog";
import { CookieConsent } from "../CookieConsent/CookieConsent";
import { FateLabel } from "../FateLabel/FateLabel";
import { Kofi } from "../Kofi/Kofi";
import { Patreon } from "../Patreon/Patreon";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";

let gameIdSingleton: string | undefined = undefined;

export const FariMaxWidth = "1920px";
export const FariToolbarMaxWidth = "1280px";

export enum LiveMode {
  Connecting,
  Live,
}

export const Page: React.FC<{
  notFound?: JSX.Element;
  gameId?: string;
  live?: LiveMode;
  liveLabel?: string;
  drawerWidth?: string;
  maxWidth?: string;
  pb?: string;
  debug?: Record<string, string>;
  hideHeaderLogo?: boolean;
  disableAutomaticScrollTop?: boolean;
}> = (props) => {
  const history = useHistory();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameId, setGameId] = useState(gameIdSingleton);
  const shouldDisplayRejoinButton = gameId && !props.gameId;
  const { t, i18n, currentLanguage } = useTranslate();

  const myBinderManager = useContext(MyBinderContext);
  const settingsManager = useContext(SettingsContext);
  const logger = useLogger();
  const zIndex = useZIndex();

  const isLive = props.live !== undefined;
  const highlight = useHighlight();

  useEffect(() => {
    if (props.gameId) {
      setGameId(props.gameId);
      gameIdSingleton = props.gameId;
    }
  }, [props.gameId]);

  return (
    <>
      {!props.disableAutomaticScrollTop && <ScrollToTop />}

      {renderHeader()}
      {renderContent()}
    </>
  );

  function renderContent() {
    return (
      <Fade in timeout={250}>
        <div>
          <div
            className={css({
              height: "100%",
              paddingBottom: "4rem",
              minHeight: "calc(100vh - 56px)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            })}
          >
            {!!props.notFound ? (
              props.notFound
            ) : (
              <div
                className={css({
                  maxWidth: props.drawerWidth
                    ? undefined
                    : props.maxWidth ?? FariMaxWidth,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "2rem",
                  width: "100%",
                  flex: "1 0 auto",
                })}
              >
                {props.children}
              </div>
            )}
          </div>

          {renderFooter()}
        </div>
      </Fade>
    );
  }

  function renderFooter() {
    return (
      <Box
        // TODO: https://github.com/fariapp/fari/issues/212
        pb={props.pb ?? "0"}
        displayPrint="none"
        className={css({
          paddingTop: "1rem",
          marginLeft: props.drawerWidth ?? undefined,
          borderTop: "1px solid #e0e0e0",
        })}
      >
        <CookieConsent />

        <Container>
          {env.isDev && props.debug && (
            <pre
              className={css({
                whiteSpace: "break-spaces",
              })}
            >
              {Object.keys(props.debug).map((label) => {
                return (
                  <Box key={label}>
                    {label}: {props.debug?.[label]}
                  </Box>
                );
              })}
            </pre>
          )}
          <Box py="1rem">
            <Grid
              container
              justify="space-between"
              alignItems="center"
              spacing={4}
            >
              <Grid item xs={isSmall ? 12 : undefined}>
                <AppButtonLink
                  to="https://discord.gg/vMAJFjUraA"
                  target="_blank"
                  color="primary"
                  startIcon={<ChatIcon />}
                >
                  {t("home-route.sections.join-community.cta")}
                </AppButtonLink>
              </Grid>
            </Grid>
          </Box>
          <Box py="1rem">
            <Grid
              container
              justify="space-between"
              spacing={4}
              alignItems="center"
            >
              <Grid item xs={isSmall ? 12 : undefined}>
                <Typography>
                  <Link
                    href="https://www.netlify.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    This site is powered by Netlify
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={isSmall ? 12 : undefined}>
                <Typography>
                  <AppLink
                    to="/changelog"
                    underline="always"
                  >{`v${env.version}`}</AppLink>
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box py="1rem">
            <Grid
              container
              justify="space-between"
              spacing={4}
              alignItems="center"
            >
              <Grid item xs={isSmall ? 12 : undefined}>
                <Kofi />
              </Grid>

              <Grid item>
                <Patreon />
              </Grid>
            </Grid>
          </Box>

          <Grid container justify="center">
            <Grid item xs>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  This site is not affiliated with Evil Hat Productions, LLC.
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  This work is based on Fate Core System and Fate Accelerated
                  Edition (found at http://www.faterpg.com/), products of Evil
                  Hat Productions, LLC, developed, authored, and edited by
                  Leonard Balsera, Brian Engard, Jeremy Keller, Ryan Macklin,
                  Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and
                  Rob Donoghue, and licensed for our use under the Creative
                  Commons Attribution 3.0 Unported license
                  (http://creativecommons.org/licenses/by/3.0/).
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  This work is based on Fate Condensed (found at
                  http://www.faterpg.com/), a product of Evil Hat Productions,
                  LLC, developed, authored, and edited by PK Sullivan, Lara
                  Turner, Leonard Balsera, Fred Hicks, Richard Bellingham,
                  Robert Hanz, Ryan Macklin, and Sophie Lagacé, and licensed for
                  our use under the Creative Commons Attribution 3.0 Unported
                  license (http://creativecommons.org/licenses/by/3.0/).
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  The Fate Core font is © Evil Hat Productions, LLC and is used
                  with permission. The Four Actions icons were designed by
                  Jeremy Keller.
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  Fari uses icons available at{" "}
                  <Link
                    href="http://game-icons.net"
                    target="_blank"
                    rel="noreferrer"
                  >
                    http://game-icons.net
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="https://icons8.com/icon/569/dice"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Icons8
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item>
              <Box my=".5rem">
                <Link
                  href="https://www.iubenda.com/privacy-policy/97549620"
                  target="_blank"
                  rel="noreferrer"
                  data-cy="page.privacy-policy"
                >
                  {t("page.privacy-policy")}
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  function renderHeader() {
    const background = highlight.linearBackground;
    const color = highlight.color;
    return (
      <Box
        displayPrint="none"
        className={css({
          color: color,
          background: background,
          transition: theme.transitions.create(["color", "background"]),
        })}
      >
        <AppBar
          position="relative"
          className={css({
            color: "inherit",
            background: "inherit",
            boxShadow: "none",
            zIndex: zIndex.navBar,
          })}
        >
          <Box className={css({ padding: ".5rem 2.5rem" })}>
            <Toolbar
              className={css({
                margin: "0 auto",
                maxWidth: FariToolbarMaxWidth,
                minHeight: "72px",
                width: "100%",
                padding: "0",
                position: "relative",
                zIndex: zIndex.navBar,
              })}
            >
              <RouterLink
                to="/"
                data-cy="page.menu.home"
                className={css({
                  textDecoration: "none",
                })}
              >
                <img
                  alt="Fari"
                  className={css({
                    height: "2.5rem",
                    marginRight: "1rem",
                    cursor: "pointer",
                    display: props.hideHeaderLogo ? "none" : "inherit",
                  })}
                  src={Images.app}
                />
              </RouterLink>
              {isLive && (
                <Box>
                  <Grid container alignItems="center" spacing={3} wrap="nowrap">
                    <Grid item>
                      {props.live === LiveMode.Connecting && (
                        <SignalWifi0BarIcon />
                      )}
                      {props.live === LiveMode.Live && (
                        <SignalWifi4BarLockIcon />
                      )}
                    </Grid>
                    <Grid item>
                      <Box maxWidth="150px">
                        <Typography variant="subtitle1" noWrap>
                          {/*  */}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
              <Hidden smDown>{renderMenu(false)}</Hidden>
              <Hidden mdUp>
                {!isLive && (
                  <IconButton
                    color="inherit"
                    className={css({ padding: "0" })}
                    onClick={() => {
                      setMenuOpen(true);
                    }}
                  >
                    <MenuIcon color="inherit" />
                  </IconButton>
                )}
              </Hidden>
              <Drawer
                anchor="bottom"
                classes={{
                  paper: css({
                    maxHeight: "80vh",
                  }),
                }}
                open={menuOpen}
                onClose={() => {
                  setMenuOpen(false);
                }}
              >
                <Box
                  p="1.5rem"
                  color={theme.palette.primary.main}
                  bgcolor={theme.palette.background.default}
                >
                  {renderMenu(true)}
                </Box>
              </Drawer>
              <Typography
                className={css({
                  flex: "1 1 auto",
                })}
              />
              <Hidden smDown>
                {!shouldDisplayRejoinButton && (
                  <Box width="250px">
                    <Patreon />
                  </Box>
                )}
              </Hidden>
              {shouldDisplayRejoinButton && (
                <ThemeProvider theme={highlight.highlightTheme}>
                  <Button
                    color="primary"
                    onClick={() => {
                      history.push(`/play/${gameId}`);
                    }}
                    variant={"outlined"}
                    className={css({
                      minWidth: "10rem",
                    })}
                  >
                    <Typography variant="button" noWrap>
                      Rejoin&nbsp;Game
                    </Typography>
                  </Button>
                </ThemeProvider>
              )}
            </Toolbar>
          </Box>
        </AppBar>
      </Box>
    );
  }

  function renderMenu(mobile: boolean) {
    const itemClass = mobile
      ? css({ textAlign: "center" })
      : css({ flex: "0 1 auto" });

    const smSize = 8;
    const xsSize = 12;

    return (
      <Grid
        container
        spacing={3}
        justify={mobile ? "center" : undefined}
        alignItems="center"
      >
        {!isLive && (
          <>
            <Grid item xs={xsSize} sm={smSize} className={itemClass}>
              <PageNavLink
                label={t("menu.my-binder")}
                data-cy="page.menu.my-binder"
                onClick={() => {
                  myBinderManager.actions.open();
                }}
              />
            </Grid>
            <Grid item xs={xsSize} sm={smSize} className={itemClass}>
              <PageNavLink
                label={t("menu.tools")}
                data-cy="page.menu.tools"
                subNav={[
                  {
                    label: t("menu.tools"),
                    links: [
                      {
                        to: "/data",
                        label: t("menu.data"),
                        icon: <StorageIcon />,
                      },
                      {
                        to: "/dice",
                        label: t("menu.dice"),
                        icon: <Icons.FateDice />,
                        ["data-cy"]: "page.menu.tools.dice",
                      },
                      {
                        to: "/dice-pool",
                        label: t("menu.dice-pool"),
                        icon: <Icons.ThrowDice />,
                      },
                      {
                        to: "/character-generator",
                        label: "Character Generator",
                        icon: <LocalLibraryIcon />,
                      },
                      {
                        to: "/oracle",
                        label: t("menu.oracle"),
                        icon: <Icons.EyeIcon />,
                      },
                    ],
                  },
                ]}
              />
            </Grid>
            <Grid item xs={xsSize} sm={smSize} className={itemClass}>
              <PageNavLink
                label={t("menu.resources")}
                subNav={[
                  {
                    label: "Fari",
                    links: [
                      {
                        to: "https://fari.canny.io/changelog",
                        label: t("menu.whats-new"),
                        icon: <FiberNewIcon />,
                        target: "_blank",
                      },
                      {
                        to: "/feature-requests",
                        label: t("menu.feature-requests"),
                        icon: <EmojiObjectsIcon />,
                      },
                      {
                        to: "/bugs",
                        label: t("menu.report-a-bug"),
                        icon: <BugReportIcon />,
                      },
                      {
                        to: "/discord",
                        label: t("menu.discord"),
                        icon: <ForumIcon />,
                        target: "_blank",
                      },
                    ],
                  },
                  {
                    label: "Documents",
                    links: [
                      {
                        to: "/fari-wiki",
                        label: t("menu.fari-wiki"),
                        icon: <InfoIcon />,
                      },
                      {
                        to: "/srds",
                        label: t("menu.srds"),
                        icon: <LibraryBooksIcon />,
                      },
                      {
                        to: "/success-with-style",
                        label: t("menu.success-with-style-blog"),
                        icon: <DoneOutlineIcon />,
                      },
                      {
                        to: "/seeliesquire",
                        label: t("menu.seelie-squire"),
                        icon: <LocalLibraryIcon />,
                      },
                      {
                        to: "/blog",
                        label: t("menu.blog"),
                        icon: <BookIcon />,
                      },
                    ],
                  },
                  {
                    label: "Support",
                    links: [
                      {
                        to: "https://www.patreon.com/bePatron?u=43408921",
                        label: t("menu.patreon"),
                        icon: <ThumbUpIcon />,
                        target: "_blank",
                      },
                      {
                        to: "https://ko-fi.com/rpdeshaies",
                        label: t("menu.ko-fi"),
                        icon: <LocalCafeIcon />,
                        target: "_blank",
                      },
                      {
                        to: "https://github.com/fariapp/fari",
                        label: t("menu.github"),
                        icon: <GitHubIcon />,
                        target: "_blank",
                      },
                    ],
                  },
                ]}
              />
            </Grid>
          </>
        )}

        <Grid item xs={xsSize} sm={smSize} className={itemClass}>
          <PageNavLink
            data-cy="page.menu.languages"
            tooltip={t("menu.languages")}
            label={<TranslateIcon />}
          >
            <Box>
              <Select
                fullWidth
                native
                value={currentLanguage}
                inputProps={{
                  ["data-cy"]: "app.languages",
                }}
                onChange={(e) => {
                  const newLanguage = e.target.value as string;
                  i18n.changeLanguage(newLanguage);
                  logger.setTag("language", newLanguage);
                }}
              >
                {Object.keys(i18n.options.resources!).map((language) => {
                  const shouldRenderDev = language === "dev" && env.isDev;
                  if (language !== "dev" || shouldRenderDev) {
                    return (
                      <option key={language} value={language}>
                        {t(`common.language.${language}` as ITranslationKeys)}
                      </option>
                    );
                  }
                })}
              </Select>
            </Box>
          </PageNavLink>
        </Grid>

        <Grid item xs={xsSize} sm={smSize} className={itemClass}>
          <PageNavLink
            data-cy="page.toggle-dark-mode"
            tooltip={t("menu.toggle-theme")}
            onClick={() => {
              settingsManager.actions.toggleThemeMode();
            }}
            label={
              <>
                {settingsManager.state.themeMode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </>
            }
          />
        </Grid>
        <Grid item xs={xsSize} sm={smSize} className={itemClass}>
          <PageNavLink
            tooltip={t("menu.whats-new")}
            onClick={() => {
              // ignore
            }}
            label={
              <>
                <CannyChangelog mobile={mobile} />
              </>
            }
          />
        </Grid>
      </Grid>
    );
  }
};

type IPageNavLink = {
  label: JSX.Element | string;
  target?: "_blank";
  ["data-cy"]?: string;
  to?: string;
  tooltip?: string;
  onClick?(event: React.MouseEvent<HTMLAnchorElement>): void;
};

function PageNavLink(
  props: IPageNavLink & {
    subNav?: Array<{
      label: JSX.Element | string;
      links: Array<IPageNavLink & { icon?: JSX.Element }>;
    }>;
    children?: JSX.Element;
  }
) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const highlight = useHighlight();
  const subNav = props.subNav ?? [];
  const hasSubNav = subNav.length > 0;
  const hasPopperContent = hasSubNav || !!props.children;
  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null);

  const open = Boolean(anchorEl);

  function handleOpenSubNav(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    if (hasPopperContent) {
      if (!open) {
        setAnchorEl(event.currentTarget);
      } else {
        handleCloseSubNav();
      }
    }
  }

  function handleCloseSubNav() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip title={props.tooltip ?? ""}>
        <div>
          <AppLink
            data-cy={props["data-cy"]}
            target={props.target}
            className={css({
              "label": "PageNavLink",
              "display": "flex",
              "alignItems": "center",
              "color": "inherit",
              "fontWeight": theme.typography.fontWeightMedium,
              "fontSize": "1.1rem",
              "&:hover": {
                color: isSmall ? "inherit" : highlight.hover,
                textDecoration: "underline",
              },
            })}
            to={props.to}
            onClick={props.onClick ?? handleOpenSubNav}
          >
            {props.label}
            {hasPopperContent && <ExpandMoreIcon />}
          </AppLink>
        </div>
      </Tooltip>

      <Hidden smDown>
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
      </Hidden>

      <Hidden mdUp>
        <Collapse in={open}>
          <Box mt=".5rem">
            <Paper elevation={2}>
              <Box p="1rem">
                <Box>{renderSubNav()}</Box>
                <Box>{props.children}</Box>
              </Box>
            </Paper>
          </Box>
        </Collapse>
      </Hidden>
    </>
  );

  function renderSubNav() {
    return (
      <>
        {props.subNav?.map((category, categoryIndex) => {
          return (
            <Box key={categoryIndex} mt=".5rem" mb="1.5rem">
              <Box display="flex">
                <FateLabel color="textSecondary" fontSize=".8rem">
                  {category.label}
                </FateLabel>
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
                                color: theme.palette.primary.main,
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
                            <AppLink
                              to={link.to}
                              target={link.target}
                              data-cy={link["data-cy"]}
                              onClick={link.onClick}
                              className={css({
                                "color": theme.palette.primary.main,
                                "fontWeight": theme.typography.fontWeightMedium,

                                "fontSize": "1rem",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              })}
                            >
                              {link.label}
                            </AppLink>
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
