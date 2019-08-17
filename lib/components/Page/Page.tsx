import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import InfoIcon from "@material-ui/icons/Info";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState } from "react";
import { routerHistory } from "../..";
import { usePWA } from "../../hooks/usePWA";
import { AppProgress } from "../AppProgress/AppProgress";
import { useDelayedIsLoading } from "./useDelayedIsLoading";

const headerHeightREM = 4.25;
export const Page: React.FC<{
  isLoading?: boolean;
  h1?: JSX.Element | string;
  h2?: JSX.Element | string;
  appBarActions?: JSX.Element;
}> = props => {
  const { isLoading, h1, h2, children, appBarActions } = props;
  const isReallyLoading = useDelayedIsLoading(isLoading);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  return (
    <>
      {renderHeader()}
      {!isLoading && renderContent()}
      <MenuDrawer
        open={isDrawerOpened}
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
          <div style={{ width: "100%" }}>
            {!!h2 && <h2>{h2}</h2>}
            {!!h2 && <Divider style={{ margin: "1rem 0" }} />}
            {children}
          </div>
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
              maxWidth: "1200px",
              width: "100%",
              padding: "1rem",
              height: `${headerHeightREM}rem`
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => {
                setIsDrawerOpened(!isDrawerOpened);
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component="h1"
              style={{
                flex: "1 0 auto"
              }}
            >
              {h1}
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

const MenuDrawer: React.FC<{ open: boolean; onClose: () => void }> = props => {
  const pwa = usePWA();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={props.open}
      PaperProps={{
        style: {
          width: "240px"
        }
      }}
    >
      <div className="row end-xs">
        <div className="col-xs">
          <IconButton onClick={props.onClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
      </div>
      <Divider />
      <List>
        {pwa.shouldSuggestInstallation && (
          <ListItem
            button
            onClick={() => {
              pwa.prompt();
              props.onClose();
            }}
          >
            <ListItemIcon>
              <CloudDownloadIcon />
            </ListItemIcon>
            <ListItemText primary={"Install"} />
          </ListItem>
        )}
        <ListItem
          button
          onClick={() => {
            props.onClose();
            routerHistory.push("/about");
          }}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary={"About"} />
        </ListItem>
      </List>
    </Drawer>
  );
};
