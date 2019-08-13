import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@material-ui/icons/Person";
import React, { useCallback, useEffect, useState } from "react";
import { routerHistory } from "..";
import { AppFab } from "../components/AppFab";
import { AppLink } from "../components/AppLink";
import { AppProgress } from "../components/AppProgress";
import { charactersDb } from "../database/database";
import { getGameBySlug } from "../games/games";
import { ICharacter } from "../games/IGame";

export const Characters = props => {
  const { gameSlug } = props.match.params;
  const game = getGameBySlug(gameSlug);

  const [characters, setCharacters] = useState<Array<ICharacter>>(undefined);

  const load = useCallback(async () => {
    const result = await charactersDb.allDocs<ICharacter>({
      include_docs: true
    });
    setCharacters(result.rows.map(row => row.doc));
  }, []);

  const isLoading = characters === undefined;
  const hasItems = characters && characters.length > 0;
  const shouldShowEmptyNotice = !isLoading && !hasItems;

  useEffect(() => {
    load();
  }, [gameSlug, load]);

  return (
    <div>
      {isLoading && <AppProgress />}
      <div className="route-box">
        <h1>Characters</h1>
        <h2>{game.name}</h2>

        <AppFab
          onClick={() => {
            routerHistory.push(`/g/${game.slug}/create`);
          }}
        >
          <AddIcon />
        </AppFab>
        {shouldShowEmptyNotice && (
          <Paper style={{ padding: "2rem", background: "aliceblue" }}>
            It seems you don't have any characters created yet. Click on the add
            icon at the bottom right corner of a screen to create one now
          </Paper>
        )}
        {hasItems && (
          <div>
            <div className="row">
              <div className="col-xs-12 col-md-8">
                <List component="nav">
                  {characters.map((character, index) => (
                    <AppLink
                      to={`/g/${game.slug}/play/${character._id}`}
                      key={character._id}
                    >
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={character["name"]} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={async e => {
                              e.stopPropagation();
                              e.preventDefault();

                              await charactersDb.remove(
                                character._id,
                                character._rev,
                                {}
                              );
                              load();
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index !== characters.length - 1 && <Divider />}
                    </AppLink>
                  ))}
                </List>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
