import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import GamesIcons from "@material-ui/icons/Games";
import React from "react";
import { AppLink } from "../components/AppLink";
import { games } from "../games/games";

export const Games = props => {
  return (
    <div className="route-box">
      <h1>Games</h1>

      <div>
        <List component="nav">
          {games.map(game => (
            <AppLink to={`/g/${game.slug}`} key={game.slug}>
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
      </div>
    </div>
  );
};
