import produce from "immer";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import { CharacterTemplates } from "../../domains/character/CharacterType";
import { ICharacter } from "../../domains/character/types";
import { FariEntity } from "../../domains/fari-entity/FariEntity";
import { Id } from "../../domains/Id/Id";
import { Manager } from "../Manager/Manager";

type IProps = {};

export const CharactersManager: React.FC<IProps> = (props) => {
  const history = useHistory();
  const charactersManager = useContext(CharactersContext);

  const logger = useLogger();

  async function onAdd() {
    const newCharacter = await charactersManager.actions.add(
      CharacterTemplates.Blank
    );

    if (charactersManager.state.managerCallback) {
      charactersManager.state.managerCallback(newCharacter);
    } else {
      history.push(`/characters/${newCharacter.id}`);
    }

    charactersManager.actions.closeManager();
    logger.info("CharactersManager:onAdd");
  }

  function onItemClick(character: ICharacter) {
    if (charactersManager.state.managerCallback) {
      charactersManager.state.managerCallback(character);
    } else {
      history.push(`/characters/${character.id}`);
    }

    charactersManager.actions.closeManager();
    logger.info("CharactersManager:onItemClick");
  }

  function onUndoDelete(character: ICharacter) {
    charactersManager.actions.upsert(character);
    logger.info("CharactersManager:onUndoDelete");
  }

  function onDelete(character: ICharacter) {
    charactersManager.actions.remove(character.id);
    logger.info("CharactersManager:onDelete");
  }

  function onDuplicate(character: ICharacter) {
    charactersManager.actions.duplicate(character.id);
    logger.info("CharactersManager:onDuplicate");
  }

  function onImport(charactersToImport: FileList | null) {
    FariEntity.import<ICharacter>({
      filesToImport: charactersToImport,
      fariType: "character",
      onImport: (c) => {
        const characterWithNewId = produce(c, (draft) => {
          draft.id = Id.generate();
        });

        const migratedCharacter = CharacterFactory.migrate(characterWithNewId);

        charactersManager.actions.upsert(migratedCharacter);

        if (charactersManager.state.managerCallback) {
          charactersManager.state.managerCallback(migratedCharacter);
        } else {
          history.push(`/characters/${migratedCharacter.id}`);
        }
        charactersManager.actions.closeManager();
        logger.info("CharactersManager:onImport");
      },
    });
  }

  function onExport(character: ICharacter) {
    FariEntity.export({
      element: character,
      fariType: "character",
      name: character.name,
    });
    logger.info("CharactersManager:onExport");
  }

  return (
    <Manager
      list={charactersManager.state.characters}
      getViewModel={(c) => ({
        id: c.id,
        name: c.name,
        lastUpdated: c.lastUpdated,
        group: c.group,
      })}
      mode={charactersManager.state.mode}
      onItemClick={onItemClick}
      onAdd={onAdd}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onUndo={onUndoDelete}
      onClose={charactersManager.actions.closeManager}
      onImport={onImport}
      onExport={onExport}
    />
  );
};

CharactersManager.displayName = "CharactersManager";
