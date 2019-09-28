import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { CharacterService } from "../../services/character-service/CharacterService";
import { ICharacter } from "../../types/ICharacter";

export const CharacterSelectDialog: React.FC<{
  open: boolean;
  onClose: (character?: ICharacter) => void;
}> = props => {
  const [characters, setCharacters] = useState<Array<ICharacter>>([]);
  const options = characters.map(c => {
    return { label: c.name, value: c };
  });

  async function loadCharacters() {
    const result = await new CharacterService().getAllByGame("fae");
    setCharacters(result);
  }

  useEffect(() => {
    loadCharacters();
  }, []);

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
        {characters.map((c, index) => {
          return (
            <div key={index}>
              <div
                onClick={() => {
                  props.onClose(c);
                }}
              >
                <CharacterListItem character={c}></CharacterListItem>
              </div>
              {index !== characters.length - 1 && <Divider />}
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
  return (
    <>
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
      </ListItem>
    </>
  );
};
