import { css } from "@emotion/css";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Drawer from "@material-ui/core/Drawer";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import useTheme from "@material-ui/core/styles/useTheme";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import ChatIcon from "@material-ui/icons/Chat";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuIcon from "@material-ui/icons/Menu";
import SignalWifi0BarIcon from "@material-ui/icons/SignalWifi0Bar";
import SignalWifi4BarLockIcon from "@material-ui/icons/SignalWifi4BarLock";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import appIcon from "../../../images/blue/app.png";
import { env } from "../../constants/env";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { DarkModeContext } from "../../contexts/DarkModeContext/DarkModeContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPossibleTranslationKeys } from "../../services/internationalization/IPossibleTranslationKeys";
import { AppButtonLink, AppLink } from "../AppLink/AppLink";
import { sanitizeContentEditable } from "../ContentEditable/ContentEditable";
import { CookieConsent } from "../CookieConsent/CookieConsent";
import { Kofi } from "../Kofi/Kofi";
import { ManagerMode } from "../Manager/Manager";
import { Patreon } from "../Patreon/Patreon";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";

let gameIdSingleton: string | undefined = undefined;
const FariMaxWidth = "1920px";

export enum LiveMode {
  Connecting,
  Live,
}

export const Page: React.FC<{
  notFound?: JSX.Element;
  gameId?: string;
  displayDonation?: boolean;
  live?: LiveMode;
  liveLabel?: string;
  drawerWidth?: string;
  pb?: string;
  debug?: Record<string, string>;
  disableAutomaticScrollTop?: boolean;
}> = (props) => {
  const history = useHistory();
  const { displayDonation = true } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameId, setGameId] = useState(gameIdSingleton);
  const shouldDisplayRejoinButton = gameId && !props.gameId;
  const { t, i18n, currentLanguage } = useTranslate();
  const darkModeManager = useContext(DarkModeContext);
  const scenesManager = useContext(ScenesContext);
  const charactersManager = useContext(CharactersContext);
  const theme = useTheme();
  const logger = useLogger();

  const isLive = props.live !== undefined;
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
                  maxWidth: props.drawerWidth ? undefined : FariMaxWidth,
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
          {env.isLocalHost && props.debug && (
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
              <Grid item>
                <AppButtonLink
                  to="https://discord.gg/vMAJFjUraA"
                  target="_blank"
                  color="primary"
                  startIcon={<ChatIcon />}
                >
                  {"Come chat on Discord"}
                </AppButtonLink>
              </Grid>
              <Grid item>
                <Select
                  data-cy="page.languages"
                  value={currentLanguage}
                  onChange={(e) => {
                    i18n.changeLanguage(e.target.value as string);
                  }}
                >
                  {Object.keys(i18n.options.resources!).map((language) => {
                    const shouldRenderDev =
                      language === "dev" && env.context === "localhost";
                    if (language !== "dev" || shouldRenderDev) {
                      return (
                        <MenuItem key={language} value={language}>
                          {t(
                            `common.language.${language}` as IPossibleTranslationKeys
                          )}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
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
              <Grid item>
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
              <Grid item>
                <Typography>
                  <AppLink
                    to="/changelog"
                    underline="always"
                  >{`v${env.version}`}</AppLink>
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {displayDonation && (
            <Box py="1rem">
              <Grid
                container
                justify="space-between"
                spacing={4}
                alignItems="center"
              >
                <Grid item sm>
                  <Kofi />
                </Grid>

                <Grid item>
                  <Patreon />
                </Grid>
              </Grid>
            </Box>
          )}

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
    const background = isLive
      ? theme.palette.primary.main
      : theme.palette.background.paper;
    const color = theme.palette.getContrastText(background);
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
            zIndex: theme.zIndex.drawer + 1,
          })}
        >
          <Toolbar
            className={css({
              margin: "0 auto",
              maxWidth: FariMaxWidth,
              minHeight: "72px",
              width: "100%",
              padding: "1rem",
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
                })}
                src={appIcon}
              />
            </RouterLink>

            <Typography
              variant="h6"
              component="span"
              className={css({
                paddingRight: "1rem",
                cursor: "pointer",
                userSelect: "none",
              })}
            >
              <div
                className={css({
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "25rem",
                })}
              >
                <RouterLink
                  to="/"
                  className={css({
                    color: "inherit",
                    textDecoration: "none",
                  })}
                >
                  Fari
                </RouterLink>
              </div>
            </Typography>
            {isLive && (
              <Box px=".25rem">
                <Grid container alignItems="center" spacing={1} wrap="nowrap">
                  <Grid item>
                    {props.live === LiveMode.Connecting && (
                      <SignalWifi0BarIcon />
                    )}
                    {props.live === LiveMode.Live && (
                      <SignalWifi4BarLockIcon
                        className={css({
                          // color: theme.palette.primary,
                        })}
                      />
                    )}
                  </Grid>
                  <Grid item>
                    <Box maxWidth="150px">
                      <Typography variant="subtitle1" noWrap>
                        {sanitizeContentEditable(props.liveLabel)}
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
              open={menuOpen}
              onClose={() => {
                setMenuOpen(false);
              }}
            >
              <Box p="2rem">{renderMenu(true)}</Box>
            </Drawer>
            <Typography
              className={css({
                flex: "1 1 auto",
              })}
            />
            <Hidden smDown>
              {displayDonation && !shouldDisplayRejoinButton && (
                <Box width="250px">
                  <Patreon />
                </Box>
              )}
            </Hidden>
            {shouldDisplayRejoinButton && (
              <Button
                color="secondary"
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
            )}
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  function renderMenu(mobile: boolean) {
    const itemClass = mobile
      ? css({ textAlign: "center" })
      : css({ flex: "0 1 auto" });

    return (
      <Grid container spacing={1} justify={mobile ? "center" : undefined}>
        {!isLive && (
          <>
            <Grid item xs={8} sm={8} className={itemClass}>
              <Button
                color="inherit"
                to="/"
                data-cy="page.menu.play"
                component={RouterLink}
                variant={mobile ? "outlined" : undefined}
                fullWidth={mobile}
              >
                {t("menu.play")}
              </Button>
            </Grid>
            <Grid item xs={8} sm={8} className={itemClass}>
              <Button
                color="inherit"
                data-cy="page.menu.scenes"
                onClick={() => {
                  scenesManager.actions.openManager(ManagerMode.Manage);
                }}
                variant={mobile ? "outlined" : undefined}
                fullWidth={mobile}
              >
                {t("menu.scenes")}
              </Button>
            </Grid>
            <Grid item xs={8} sm={8} className={itemClass}>
              <Button
                color="inherit"
                data-cy="page.menu.characters"
                onClick={() => {
                  charactersManager.actions.openManager(ManagerMode.Manage);
                }}
                variant={mobile ? "outlined" : undefined}
                fullWidth={mobile}
              >
                {t("menu.characters")}
              </Button>
            </Grid>
            <Grid item xs={8} sm={8} className={itemClass}>
              <Button
                color="inherit"
                to="/srds"
                component={RouterLink}
                variant={mobile ? "outlined" : undefined}
                fullWidth={mobile}
              >
                {"SRDs"}
              </Button>
            </Grid>
            <Grid item xs={8} sm={8} className={itemClass}>
              <Button
                color="inherit"
                to="/dice"
                data-cy="page.menu.dice"
                component={RouterLink}
                variant={mobile ? "outlined" : undefined}
                fullWidth={mobile}
              >
                {t("menu.dice")}
              </Button>
            </Grid>
            <Grid item xs={8} sm={8} className={itemClass}>
              <Button
                color="inherit"
                to="/about"
                component={RouterLink}
                variant={mobile ? "outlined" : undefined}
                fullWidth={mobile}
              >
                {t("menu.about")}
              </Button>
            </Grid>
          </>
        )}

        <Grid item xs={8} sm={8} className={itemClass}>
          <IconButton
            color="inherit"
            href="https://github.com/fariapp/fari"
            target="_blank"
            rel="noreferrer"
            size="small"
            className={css({
              padding: "6px 8px",
            })}
          >
            <GitHubIcon />
          </IconButton>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <IconButton
            data-cy="page.toggle-dark-mode"
            color="inherit"
            size="small"
            className={css({
              padding: "6px 8px",
            })}
            onClick={() => {
              darkModeManager.actions.setDarkMode(
                !darkModeManager.state.darkMode
              );
              if (darkModeManager.state.darkMode) {
                logger.info("Page.toggleLightMode");
              } else {
                logger.info("Page.toggleDarkMode");
              }
            }}
          >
            {darkModeManager.state.darkMode ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Grid>
      </Grid>
    );
  }
};
