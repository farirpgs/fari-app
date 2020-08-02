import { useTheme } from "@material-ui/core";
import produce from "immer";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { v4 as uuidV4 } from "uuid";
import {
  CharactersContext,
  CharacterType,
  ICharacter,
  migrateCharacter,
} from "../../contexts/CharactersContext/CharactersContext";
import { FariEntity } from "../../domains/FariEntity/FariEntity";
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
    if (charactersManager.state.managerCallback) {
      charactersManager.state.managerCallback(character);
    } else {
      history.push(`/characters/${character.id}`);
    }

    charactersManager.actions.closeManager();
  }

  function onUndo(character: ICharacter) {
    charactersManager.actions.upsert(character);
  }

  function onDelete(character: ICharacter) {
    charactersManager.actions.remove(character.id);
  }

  function onImport(charactersToImport: FileList | null) {
    FariEntity.import<ICharacter>({
      filesToImport: charactersToImport,
      fariType: "character",
      onImport: (c) => {
        const characterWithNewId = produce(c, (draft) => {
          draft.id = uuidV4();
        });
        const migratedCharacter = migrateCharacter(characterWithNewId);
        charactersManager.actions.upsert(migratedCharacter);
      },
    });
  }

  function onExport(character: ICharacter) {
    FariEntity.export({
      element: character,
      fariType: "character",
      name: character.name,
    });
  }

  return (
    <Manager
      list={charactersManager.state.characters}
      getViewModel={(c) => ({
        id: c.id,
        name: c.name,
        lastUpdated: c.lastUpdated,
      })}
      mode={charactersManager.state.mode}
      onItemClick={onItemClick}
      onAdd={onAdd}
      onDelete={onDelete}
      onUndo={onUndo}
      onClose={charactersManager.actions.closeManager}
      onImport={onImport}
      onExport={onExport}
    />
  );
};

CharactersManager.displayName = "CharactersManager";
