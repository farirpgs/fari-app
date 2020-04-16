import {
  AppBar,
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { css } from "emotion";
import React, { useState } from "react";
import { useHistory } from "react-router";
import appIcon from "../../../images/app-icon.png";
import { useDelayedIsLoading } from "../../hooks/useDelayedIsLoading/useDelayedIsLoading";
import { AppProgress } from "../AppProgress/AppProgress";
import { MenuDrawer } from "./MenuDrawer";

export const Page: React.FC<{
  isLoading?: boolean;
  h1?: JSX.Element | string;
  notFound?: JSX.Element;
  appBarActions?: JSX.Element;
  banner?: JSX.Element;
  backFunction?: () => void;
}> = (props) => {
  const isReallyLoading = useDelayedIsLoading(props.isLoading);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const history = useHistory();

  return (
    <>
      {renderHeader()}
      {!props.isLoading && renderContent()}
      <MenuDrawer
        open={isDrawerOpened}
        onOpen={() => {
          setIsDrawerOpened(true);
        }}
        onClose={() => {
          setIsDrawerOpened(false);
        }}
      />
    </>
  );

  function renderBanner() {
    if (!props.banner) {
      return null;
    }
    return (
      <div
        className={css({
          textAlign: "center",
          background: "#3f50b5",
          color: "#fff",
          padding: "1.5rem",
        })}
      >
        {props.banner}
      </div>
    );
  }

  function renderContent() {
    return (
      <Fade in timeout={250}>
        <div
          className={css({
            height: "100%",
            paddingBottom: "4rem",
            minHeight: "calc(100vh - 56px)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          })}
          onClick={() => {
            setIsDrawerOpened(false);
          }}
        >
          {renderBanner()}
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
      </Fade>
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
            {!!props.backFunction ? (
              <IconButton
                edge="start"
                color="inherit"
                onClick={props.backFunction}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : null}

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

            <Grid container spacing={2}>
              <Grid item>
                <Button
                  color="inherit"
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  Start Game
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="inherit"
                  onClick={() => {
                    history.push("/dice");
                  }}
                >
                  Dice
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="inherit"
                  onClick={() => {
                    window.open("https://ko-fi.com/rpdeshaies");
                  }}
                >
                  Support Fari
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="inherit"
                  onClick={() => {
                    history.push("/about");
                  }}
                >
                  About
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="inherit"
                  onClick={() => {
                    window.open("https://twitter.com/rpdeshaies");
                  }}
                >
                  Help
                </Button>
              </Grid>
            </Grid>

            <Typography
              className={css({
                flex: "1 1 auto",
              })}
            ></Typography>

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
};
