import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Fade,
  Grid,
  Hidden,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { css } from "emotion";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import appIcon from "../../../images/app-icon.png";
import { useDelayedIsLoading } from "../../hooks/useDelayedIsLoading/useDelayedIsLoading";
import { AppProgress } from "../AppProgress/AppProgress";

let gameIdSingleton: string = undefined;

export const Page: React.FC<{
  isLoading?: boolean;
  notFound?: JSX.Element;
  appBarActions?: JSX.Element;
  gameId?: string;
}> = (props) => {
  const isReallyLoading = useDelayedIsLoading(props.isLoading);
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameId, setGameId] = useState(gameIdSingleton);
  const shouldDisplayRejoinButton = gameId && !props.gameId;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (props.gameId) {
      setGameId(props.gameId);
      gameIdSingleton = props.gameId;
    }
  }, [props.gameId]);

  return (
    <>
      {renderHeader()}
      {!props.isLoading && renderContent()}`
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
                  maxWidth: "1440px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "2rem",
                  width: "100%",
                  padding: "0 1rem",
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
        className={css({
          paddingTop: "1rem",
          borderTop: "1px solid #e0e0e0",
        })}
      >
        <Container>
          <Grid container justify="flex-end">
            <Grid item>
              <Select
                value={i18n.language}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value as string);
                }}
              >
                {Object.keys(i18n.options.resources).map((language) => {
                  return (
                    <MenuItem key={language} value={language}>
                      {t(`common.language.${language}`)}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  function renderHeader() {
    return (
      <Box bgcolor="#fff">
        <AppBar color="inherit" position="relative">
          <Toolbar
            className={css({
              margin: "0 auto",
              maxWidth: "1440px",
              width: "100%",
              padding: "1rem",
            })}
          >
            <img
              className={css({
                height: "2rem",
                paddingRight: "1rem",
                cursor: "pointer",
              })}
              onClick={() => {
                history.push("/");
              }}
              src={appIcon}
            />

            <Typography
              variant="h6"
              component="h1"
              className={css({
                paddingRight: "1rem",
                cursor: "pointer",
                userSelect: "none",
              })}
              onClick={() => {
                history.push("/");
              }}
            >
              <div
                className={css({
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "25rem",
                })}
              >
                Fari
              </div>
            </Typography>
            <Hidden smDown>{renderMenu(false)}</Hidden>

            <Hidden mdUp>
              <IconButton
                onClick={() => {
                  setMenuOpen(true);
                }}
              >
                <MenuIcon></MenuIcon>
              </IconButton>
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
            {props.appBarActions}
          </Toolbar>
        </AppBar>
        {isReallyLoading && (
          <Fade in>
            <div>
              <AppProgress />
            </div>
          </Fade>
        )}
      </Box>
    );
  }

  function renderMenu(mobile: boolean) {
    const itemClass = mobile
      ? css({ textAlign: "center" })
      : css({ flex: "0 1 auto" });
    return (
      <Grid container spacing={1} justify={mobile ? "center" : undefined}>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              history.push("/");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            Play
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              history.push("/dice");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            Dice
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              window.open("https://ko-fi.com/rpdeshaies");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            Support Fari
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              history.push("/about");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            About
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              window.open("https://twitter.com/rpdeshaies");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            Help
          </Button>
        </Grid>
      </Grid>
    );
  }
};
