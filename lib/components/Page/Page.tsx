import AppBar from "@material-ui/core/AppBar";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuIcon from "@material-ui/icons/Menu";
import { css } from "emotion";
import React, { useState } from "react";
import { useDelayedIsLoading } from "../../hooks/useDelayedIsLoading";
import { AppProgress } from "../AppProgress/AppProgress";
import { MenuDrawer } from "./MenuDrawer";

const headerHeightREM = 4.25;

export const Page: React.FC<{
  isLoading?: boolean;
  h1?: JSX.Element | string;
  notFound?: JSX.Element;
  appBarActions?: JSX.Element;
  banner?: JSX.Element;
  backFunction?: () => void;
}> = (props) => {
  const {
    isLoading,
    h1,
    children,
    appBarActions,
    backFunction,
    notFound,
  } = props;

  const isReallyLoading = useDelayedIsLoading(isLoading);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  return (
    <>
      {renderHeader()}
      {!isLoading && renderContent()}
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
        style={{
          textAlign: "center",
          background: "#3f50b5",
          color: "#fff",
          padding: "1.5rem",
        }}
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
            paddingTop: "4.25rem " /* Top Nav size 4.25 + 2*/,
            paddingBottom: "56px " /* Bottom Nav Size */,
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
          {!!notFound ? (
            notFound
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
              {children}
            </div>
          )}
        </div>
      </Fade>
    );
  }

  function renderHeader() {
    return (
      <>
        <AppBar position="fixed">
          <Toolbar
            style={{
              margin: "0 auto",
              maxWidth: "1440px",
              width: "100%",
              padding: "1rem",
              height: `${headerHeightREM}rem`,
            }}
          >
            {!!backFunction ? (
              <IconButton edge="start" color="inherit" onClick={backFunction}>
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  setIsDrawerOpened(!isDrawerOpened);
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component="h1"
              style={{
                flex: "1 1 auto",
              }}
            >
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "25rem",
                }}
              >
                {h1}
              </div>
            </Typography>

            {appBarActions}
          </Toolbar>
        </AppBar>
        {isReallyLoading && (
          <Fade in>
            <div>
              <AppProgress />
            </div>
          </Fade>
        )}
      </>
    );
  }
};
