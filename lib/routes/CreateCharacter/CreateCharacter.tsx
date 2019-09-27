import { IconButton } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import React, { useState } from "react";
import { CharacterFields } from "../../components/CharacterFields/CharacterFields";
import { routerHistory } from "../../components/History/History";
import { Page } from "../../components/Page/Page";
import { getGameBySlug } from "../../games/getGameBySlug";
import { CharacterService } from "../../services/character-service/CharacterService";
import { ICharacter } from "../../types/ICharacter";

export const CreateCharacter = props => {
  const { gameSlug } = props.match.params;
  const game = getGameBySlug(gameSlug);
  const [character, setCharacter] = useState<ICharacter>({} as any);

  return (
    <Page
      h1="Create Your Character"
      backFunction={() => {
        routerHistory.push(`/game/${game.slug}`);
      }}
      appBarActions={
        <div>
          <IconButton edge="end" onClick={save} color="inherit">
            <SaveIcon />
          </IconButton>
        </div>
      }
    >
      <br />
      <CharacterFields
        rows={game.rows}
        character={character}
        setCharacter={setCharacter}
        onSubmit={save}
      />
    </Page>
  );

  async function save() {
    const id = await new CharacterService().add(character, game.slug);
    routerHistory.push(`/game/${game.slug}/play/${id}?new=true`);
  }
};

function createId(slug: string) {
  const fourRandomDigits = `${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}`;
  return `${slug}-${fourRandomDigits}`;
}

function getRandomDigit(): any {
  return Math.floor(Math.random() * 100) % 10;
}
