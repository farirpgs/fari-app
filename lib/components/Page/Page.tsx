import AppBar from "@material-ui/core/AppBar";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState } from "react";
import { AppProgress } from "../AppProgress/AppProgress";
import { MenuDrawer } from "./MenuDrawer";
import { useDelayedIsLoading } from "./useDelayedIsLoading";

const headerHeightREM = 4.25;
export const Page: React.FC<{
  isLoading?: boolean;
  h1?: JSX.Element | string;

  appBarActions?: JSX.Element;
  backFunction?: () => void;
}> = props => {
  const { isLoading, h1, children, appBarActions, backFunction } = props;

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

  function renderContent() {
    return (
      <div
        className="route-box"
        onClick={() => {
          setIsDrawerOpened(false);
        }}
      >
        <Fade in timeout={250}>
          <div style={{ width: "100%" }}>{children}</div>
        </Fade>
      </div>
    );
  }

  function renderHeader() {
    return (
      <>
        <AppBar position="fixed">
          <Toolbar
            style={{
              margin: "0 auto",
              maxWidth: "800px",
              width: "100%",
              padding: "1rem",
              height: `${headerHeightREM}rem`
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
                flex: "1 1 auto"
              }}
            >
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "25rem"
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
