import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PersonIcon from "@material-ui/icons/Person";
import _ from "lodash";
import React from "react";
import { AppCircularProgress } from "../../../components/AppProgress/AppCircularProgress";
import { Banner } from "../../../components/Banner/Banner";
import { routerHistory } from "../../../components/History/History";
import { games } from "../../../games/games";
import { ICharacter } from "../../../types/ICharacter";

export const CharacterSelectDialogPure: React.FC<{
  open: boolean;
  isLoading: boolean;
  characters: Array<ICharacter>;
  onClose: (character?: ICharacter) => void;
}> = props => {
  const options = props.characters.map(c => {
    return { label: c.name, value: c };
  });

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">Choose your character !</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
        {props.isLoading && <AppCircularProgress></AppCircularProgress>}
        {!props.isLoading && props.characters.length === 0 && (
          <Banner variant="info" paper={false}>
            <div className="margin-2">
              You didn&apos;t create any characters yet.
              <br />
              Click on button below to add a get started!
            </div>
            <Fab
              onClick={() => {
                routerHistory.push("/games");
              }}
              variant="extended"
              color="default"
            >
              <AddIcon style={{ marginRight: " .5rem" }} />
              Add a Character
            </Fab>
          </Banner>
        )}
        {props.characters.map((c, index) => {
          return (
            <div key={index}>
              <div
                onClick={() => {
                  props.onClose(c);
                }}
              >
                <CharacterListItem character={c}></CharacterListItem>
              </div>
              {index !== props.characters.length - 1 && <Divider />}
            </div>
          );
        })}
      </DialogContent>
      <DialogActions
        style={{
          padding: "1rem 1.5rem"
        }}
      >
        <Button
          onClick={() => {
            props.onClose();
          }}
          color="secondary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CharacterListItem: React.FC<{ character: ICharacter }> = props => {
  const { character } = props;
  const truncatedDescription = _.truncate(character["description"], {
    length: 50
  });
  const game = games.find(g => g.slug === character.game);
  return (
    <>
      <ListItem
        button
        style={{
          zoom: "1.2"
        }}
        alignItems="flex-start"
      >
        <ListItemAvatar>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={character["name"]}
          secondary={
            // TODO: validateDOMNesting THIS IS A <p>
            <div>
              <div style={{ zoom: 0.8 }}>
                <b>{game.name}</b>
              </div>
              <div>{truncatedDescription}</div>
            </div>
          }
        />
      </ListItem>
    </>
  );
};
