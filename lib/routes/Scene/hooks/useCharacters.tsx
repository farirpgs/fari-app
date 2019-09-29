import { IScene } from "../../../types/IScene";
import { ICharacter } from "../../../types/ICharacter";
import { useState } from "react";
import { IPeerManager } from "../types/IPeerManager";
export function useCharacters(
  setScene: React.Dispatch<React.SetStateAction<IScene>>,
  peerManager: IPeerManager
) {
  const [isCharacterModalOpened, setIsCharacterModalOpened] = useState(false);

  function sendCharacterToGM(character: ICharacter) {
    peerManager.sendToGM({
      type: "UPDATE_CHARACTER_IN_GM_SCREEN",
      payload: { character: character }
    });
  }

  function onCharacterSelectClose(character?: ICharacter) {
    if (!!character) {
      sendCharacterToGM(character);
    }
    setIsCharacterModalOpened(false);
  }

  function updateCharacter(character: ICharacter) {
    setScene(scene => {
      return {
        ...scene,
        characters: scene.characters.map(c => {
          if (c._id === character._id) {
            return character;
          }
          return c;
        })
      };
    });
  }

  function removeCharacter(character: ICharacter) {
    setScene(scene => {
      return {
        ...scene,
        characters: scene.characters.filter(c => {
          return c._id !== character.id;
        })
      };
    });
  }

  function onSendCharacterToGMButtonClick() {
    setIsCharacterModalOpened(true);
  }

  return {
    isCharacterModalOpened,
    onSendCharacterToGMButtonClick,
    onCharacterSelectClose,
    updateCharacter,
    removeCharacter
  };
}
