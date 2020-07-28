import { useTheme } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import {
  CharactersContext,
  CharactersManagerMode,
  CharacterType,
  ICharacter,
} from "../../contexts/CharactersContext/CharactersContext";
import { Manager } from "../Manager/Manager";

type IProps = {};

export const CharactersManager: React.FC<IProps> = (props) => {
  const history = useHistory();
  const charactersManager = useContext(CharactersContext);

  const theme = useTheme();

  function onAdd() {
    const newCharacter = charactersManager.actions.add(
      CharacterType.CoreCondensed
    );
    history.push(`/characters/${newCharacter.id}`);
    charactersManager.actions.closeManager();
  }

  function onItemClick(character: ICharacter) {
    if (charactersManager.state.mode === CharactersManagerMode.Redirect) {
      history.push(`/characters/${character.id}`);
    } else {
      charactersManager.actions.select(character);
    }
    charactersManager.actions.closeManager();
  }

  function onUndo(character: ICharacter) {
    charactersManager.actions.upsert(character);
  }

  function onDelete(character: ICharacter) {
    charactersManager.actions.remove(character.id);
  }

  return (
    <Manager
      list={charactersManager.state.characters}
      getViewModel={(c) => ({
        id: c.id,
        name: c.name,
        lastUpdated: c.lastUpdated,
      })}
      open={charactersManager.state.mode !== CharactersManagerMode.Close}
      onItemClick={onItemClick}
      onAdd={onAdd}
      onDelete={onDelete}
      onUndo={onUndo}
      onClose={charactersManager.actions.closeManager}
    />
  );
};

CharactersManager.displayName = "CharactersManager";
