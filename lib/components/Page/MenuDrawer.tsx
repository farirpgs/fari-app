import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import React from "react";
import { usePWA } from "../../hooks/usePWA";
import { routerHistory } from "../History/History";
import { googleAnalyticsService } from "../../services/injections";

export const MenuDrawer: React.FC<{
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}> = props => {
  const pwa = usePWA();

  return (
    <SwipeableDrawer
      onOpen={props.onOpen}
      onClose={props.onClose}
      open={props.open}
      variant="persistent"
      anchor="left"
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
            routerHistory.push("/");
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            props.onClose();
            googleAnalyticsService.sendEvent({
              category: "Fari",
              action: "Support"
            });
            window.open("https://ko-fi.com/rpdeshaies");
          }}
        >
          <ListItemIcon>
            <LocalCafeIcon />
          </ListItemIcon>
          <ListItemText primary={"Support Fari"} />
        </ListItem>
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
        <ListItem
          button
          onClick={() => {
            props.onClose();
            window.open("https://twitter.com/rpdeshaies");
          }}
        >
          <ListItemIcon>
            <ContactSupportIcon></ContactSupportIcon>
          </ListItemIcon>
          <ListItemText primary={"Support"} />
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
};
