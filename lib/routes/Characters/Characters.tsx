import { Fab } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@material-ui/icons/Person";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { AppLink } from "../../components/AppLink/AppLink";
import { AppPaper } from "../../components/AppPaper/AppPaper";
import { Banner } from "../../components/Banner/Banner";
import { routerHistory } from "../../components/History/History";
import { Page } from "../../components/Page/Page";
import { getGameBySlug } from "../../games/getGameBySlug";
import { CharacterService } from "../../services/character-service/CharacterService";
import { ICharacter } from "../../types/ICharacter";

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
    const characters = await new CharacterService().getAllByGame(game.slug);
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
        routerHistory.push("/games");
      }}
    >
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={characterDeletedSnackBar.visible}
        onClose={() => setCharacterDeletedSnackBar({ visible: false })}
        message={<span id="message-id">Character Deleted</span>}
      />

      {!hasItems && (
        <Banner variant="info">
          <div>
            You didn&apos;t create any characters yet.
            <br />
            Click on button below to add a get started!
          </div>
        </Banner>
      )}

      <div className="row center-xs margin-1">
        <div className="col-xs">
          <Fab
            onClick={() => {
              routerHistory.push(`/game/${game.slug}/create`);
            }}
            variant="extended"
            color="primary"
          >
            <AddIcon style={{ marginRight: " .5rem" }} />
            Add a Character
          </Fab>
        </div>
      </div>

      {hasItems && (
        <AppPaper>
          <div className="row">
            <div className="col-xs-12">
              <List component="nav">
                {characters.map((character, index) => {
                  const truncatedDescription = _.truncate(
                    character["description"],
                    {
                      length: 50
                    }
                  );
                  return (
                    <AppLink
                      to={`/game/${game.slug}/play/${character._id}`}
                      key={character._id}
                    >
                      <ListItem
                        button
                        style={{
                          zoom: "1.2"
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={character["name"]}
                          secondary={truncatedDescription}
                        />

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
                  );
                })}
              </List>
            </div>
          </div>
        </AppPaper>
      )}
    </Page>
  );
};
