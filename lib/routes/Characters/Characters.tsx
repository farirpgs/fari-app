import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@material-ui/icons/Person";
import React, { useEffect, useState } from "react";
import { routerHistory } from "../..";
import { AppFab } from "../../components/AppFab/AppFab";
import { AppLink } from "../../components/AppLink/AppLink";
import { Page } from "../../components/Page/Page";
import { getGameBySlug } from "../../games/games";
import { ICharacter } from "../../games/IGame";
import { CharacterService } from "../../services/character-service/CharacterService";

export const Characters = props => {
  const { gameSlug } = props.match.params;
  const game = getGameBySlug(gameSlug);

  const [characters, setCharacters] = useState<Array<ICharacter>>(undefined);
  const [
    characterDeletedSnackBar,
    setCharacterDeletedSnackBar
  ] = React.useState({ visible: false });

  const [isLoading, setIsLoading] = useState(true);
  const hasItems = characters && characters.length > 0;

  const load = async () => {
    setIsLoading(true);
    const characters = await new CharacterService().getAll(game.slug);
    setCharacters(characters);
    setIsLoading(false);
  };

  async function deleteCharacter(character) {
    await new CharacterService().remove(character);
    await load();
    setCharacterDeletedSnackBar({ visible: true });
  }

  useEffect(() => {
    load();
  }, [gameSlug]);

  return (
    <Page
      isLoading={isLoading}
      h1={`Characters - ${game.name}`}
      backFunction={() => {
        routerHistory.push(`/games`);
      }}
    >
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={characterDeletedSnackBar.visible}
        onClose={() => setCharacterDeletedSnackBar({ visible: false })}
        message={<span id="message-id">Character Deleted</span>}
      />
      <AppFab
        onClick={() => {
          routerHistory.push(`/game/${game.slug}/create`);
        }}
      >
        <AddIcon />
      </AppFab>

      {!hasItems && (
        <Paper style={{ padding: "2rem", background: "aliceblue" }}>
          <p>You didn't create any characters yet.</p>
          <p>
            Click on the '+' button at the bottom right corner of the screen to
            get started!
          </p>
        </Paper>
      )}
      {hasItems && (
        <div>
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <List component="nav">
                {characters.map((character, index) => (
                  <AppLink
                    to={`/game/${game.slug}/play/${character._id}`}
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

                            deleteCharacter(character);
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
    </Page>
  );
};
