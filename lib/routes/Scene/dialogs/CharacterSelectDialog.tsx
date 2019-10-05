import React, { useEffect, useState } from "react";
import { CharacterService } from "../../../services/character-service/CharacterService";
import { ICharacter } from "../../../types/ICharacter";
import { CharacterSelectDialogPure } from "./CharacterSelectDialogPure";

export const CharacterSelectDialog: React.FC<{
  open: boolean;
  onClose: (character?: ICharacter) => void;
}> = props => {
  const [characters, setCharacters] = useState<Array<ICharacter>>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadCharacters() {
    setIsLoading(true);
    const result = await new CharacterService().getAllByGame("fae");
    setCharacters(result);
    setIsLoading(false);
  }

  useEffect(() => {
    loadCharacters();
  }, []);

  return (
    <CharacterSelectDialogPure
      characters={characters}
      open={props.open}
      isLoading={isLoading}
      onClose={character => {
        props.onClose(character);
      }}
    ></CharacterSelectDialogPure>
  );
};
