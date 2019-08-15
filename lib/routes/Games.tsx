import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import GamesIcons from "@material-ui/icons/Games";
import React from "react";
import { AppLink } from "../components/AppLink/AppLink";
import { Page } from "../components/Page/Page";
import { games } from "../games/games";

export const Games = props => {
  return (
    <Page h1="Games">
      <p>
        To create characters, select one of our supported game system below.
      </p>
      <List component="nav">
        {games.map(game => (
          <AppLink to={`/game/${game.slug}`} key={game.slug}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <GamesIcons />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={game.name} />
            </ListItem>
          </AppLink>
        ))}
      </List>
    </Page>
  );
};
