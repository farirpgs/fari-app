import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@material-ui/icons/Person";
import React, { useEffect, useState } from "react";
import { AppLink } from "../components/AppLink";
import { AppProgress } from "../components/AppProgress";
import { charactersDb } from "../database/database";
import { getGameBySlug } from "../games/games";
import { ICharacter } from "../games/IGame";

export const Characters = props => {
  const { gameSlug } = props.match.params;
  const game = getGameBySlug(gameSlug);

  const [characters, setCharacters] = useState<Array<ICharacter>>([]);
  const isLoading = Object.keys(characters).length === 0;

  useEffect(() => {
    load();
    async function load() {
      const result = await charactersDb.allDocs<ICharacter>({
        include_docs: true
      });
      setCharacters(result.rows.map(row => row.doc));
    }
  }, [gameSlug]);

  return (
    <div>
      {isLoading && <AppProgress />}
      <div className="route-box">
        <h1>Characters</h1>
        <h2>{game.name}</h2>

        <Fab
          color="secondary"
          style={{
            position: "fixed",
            zIndex: 1,
            bottom: "5rem",
            right: "2rem"
          }}
          onClick={() => {
            location.href = `/g/${game.slug}/create`;
          }}
        >
          <AddIcon />
        </Fab>

        {!isLoading && (
          <div>
            <div className="row">
              <div className="col-xs-12 col-md-8">
                <List component="nav">
                  {characters.map(character => (
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
                              location.reload();
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
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
