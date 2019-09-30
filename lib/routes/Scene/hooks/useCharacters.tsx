import { ICharacter } from "../../../types/ICharacter";
import { useState } from "react";
import { IPeerManager } from "../types/IPeerManager";
import { CharacterService } from "../../../services/character-service/CharacterService";
import _ from "lodash";

export function useCharacters(peerManager: IPeerManager) {
  const [sceneCharacters, setSceneCharacters] = useState<Array<ICharacter>>([]);
  const [isCharacterModalOpened, setIsCharacterModalOpened] = useState(false);

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
  }

  function sendCharacterToGM(character: ICharacter) {
    peerManager.sendToGM({
      type: "UPDATE_CHARACTER_IN_GM_SCREEN",
      payload: { character: character }
    });
  }

  async function syncCharacter(character: ICharacter) {
    sendCharacterToGM(character);
    await new CharacterService().update(character);
  }

  function onCharacterSelectClose(character?: ICharacter) {
    if (!!character) {
      sendCharacterToGM(character);
    }
    setIsCharacterModalOpened(false);
  }

  function onSendCharacterToGMButtonClick() {
    setIsCharacterModalOpened(true);
  }

  return {
    global: {
      sceneCharacters,
      setSceneCharacters
    },
    player: {
      isCharacterModalOpened,
      onSendCharacterToGMButtonClick,
      onCharacterSelectClose,
      syncCharacter
    },
    gm: {
      addOrUpdateCharacterInScene,
      removeCharacterFromScene
    }
  };
}
