import { IScene } from "../../../types/IScene";
import { ICharacter } from "../../../types/ICharacter";
import { useState, useEffect } from "react";
import { IPeerManager } from "../types/IPeerManager";
import { CharacterService } from "../../../services/character-service/CharacterService";
import _ from "lodash";

const REFRESH_CHARACTER_INFO_EVERY_MS = 5000;

export function useCharacters(
  setScene: React.Dispatch<React.SetStateAction<IScene>>,
  peerManager: IPeerManager
) {
  const [chosenCharacters, setChosenCharacters] = useState<Array<ICharacter>>(
    []
  );
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
      const newList = [...chosenCharacters, character];
      const uniqList = _.uniqBy(newList, c => c._id);
      setChosenCharacters(uniqList);
    }
    setIsCharacterModalOpened(false);
  }

  function addOrUpdateCharacterFromScene(character: ICharacter) {
    setScene(scene => {
      const exists = !!scene.characters.find(c => c.id === character.id);

      const characters = exists
        ? scene.characters.map(c => {
            if (c._id === character._id) {
              return character;
            }
            return c;
          })
        : [...scene.characters, character];

      return {
        ...scene,
        characters: characters
      };
    });
  }

  function removeCharacterFromScene(character: ICharacter) {
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

  useEffect(() => {
    const id = setInterval(() => {
      chosenCharacters.forEach(async c => {
        const updatedCharacter = await new CharacterService().get(c._id);
        sendCharacterToGM(updatedCharacter);
      });
    }, REFRESH_CHARACTER_INFO_EVERY_MS);
    return () => {
      clearInterval(id);
    };
  }, [chosenCharacters]);

  return {
    isCharacterModalOpened,
    onSendCharacterToGMButtonClick,
    onCharacterSelectClose,
    addOrUpdateCharacterFromScene,
    removeCharacterFromScene
  };
}
