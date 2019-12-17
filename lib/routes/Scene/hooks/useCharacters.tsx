import { ICharacter } from "../../../types/ICharacter";
import { useState } from "react";
import { CharacterService } from "../../../services/character-service/CharacterService";
import _ from "lodash";
import { IPeerConnectionManager } from "./usePeerConnection";
import { googleAnalyticsService } from "../../../services/injections";

export type ICharactersManager = ReturnType<
  ReturnType<typeof makeUseCharacters>
>;

export function makeUseCharacters(characterService: CharacterService) {
  return function useCharacters(peerConnectionManager: IPeerConnectionManager) {
    const [sceneCharacters, setSceneCharacters] = useState<Array<ICharacter>>(
      []
    );
    const [playerCharactersIds, setPlayerCharactersIds] = useState<
      Array<string>
    >([]);
    const [isCharacterModalOpened, _setIsCharacterModalOpened] = useState(
      false
    );

    function addOrUpdateCharacterInScene(character: ICharacter) {
      setSceneCharacters(characters => {
        const exists = !!characters.find(c => c._id === character._id);

        const updatedList = exists
          ? characters.map(c => {
              if (c._id === character._id) {
                return character;
              }
              return c;
            })
          : [...characters, character];
        return updatedList;
      });
    }

    function removeCharacterFromScene(character: ICharacter) {
      setSceneCharacters(characters => {
        return characters.filter(c => {
          return c._id !== character._id;
        });
      });
      googleAnalyticsService.sendEvent({
        category: "SceneCharacter",
        action: "Delete"
      });
    }

    async function syncACharacter(character: ICharacter) {
      _sendCharacterToGM(character);
      characterService.update(character);
      googleAnalyticsService.sendEvent({
        category: "SceneCharacter",
        action: "Sync"
      });
    }

    function onCharacterSelectClose(character?: ICharacter) {
      if (!!character) {
        _sendCharacterToGM(character);
        _addOrUpdateCharacterForPlayer(character);
      }
      googleAnalyticsService.sendEvent({
        category: "SceneCharacter",
        action: "Create"
      });
      _setIsCharacterModalOpened(false);
    }

    function onSendCharacterToGMButtonClick() {
      _setIsCharacterModalOpened(true);
    }

    function _addOrUpdateCharacterForPlayer(character: ICharacter) {
      setPlayerCharactersIds(ids => {
        const idAlreadyExists = ids.indexOf(character._id) !== -1;
        if (idAlreadyExists) {
          return ids;
        }
        return [...ids, character._id];
      });
    }

    function _sendCharacterToGM(character: ICharacter) {
      peerConnectionManager.sendToGM({
        type: "UPDATE_CHARACTER_IN_GM_SCREEN",
        payload: { character: character }
      });
    }

    return {
      global: {
        sceneCharacters
      },
      player: {
        playerCharactersIds,
        isCharacterModalOpened,
        onSendCharacterToGMButtonClick,
        onCharacterSelectClose,
        syncACharacter,
        setSceneCharacters
      },
      gm: {
        addOrUpdateCharacterInScene,
        removeCharacterFromScene
      }
    };
  };
}
