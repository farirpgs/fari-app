import SaveIcon from "@material-ui/icons/Save";
import React, { useState } from "react";
import uuid from "uuid/v4";
import { routerHistory } from "../..";
import { AppFab } from "../../components/AppFab/AppFab";
import { CharacterFields } from "../../components/CharacterFields/CharacterFields";
import { Page } from "../../components/Page/Page";
import { getCharactersDb } from "../../database/database";
import { getGameBySlug } from "../../games/games";

export const CreateCharacter = props => {
  const { gameSlug } = props.match.params;
  const game = getGameBySlug(gameSlug);
  const [character, setCharacter] = useState<Object>({});

  return (
    <Page
      h1="Create Your Character"
      backFunction={() => {
        routerHistory.push(`/game/${game.slug}`);
      }}
    >
      <AppFab onClick={save}>
        <SaveIcon />
      </AppFab>

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
    const id = uuid();
    await getCharactersDb(game).put({ ...character, _id: id }, {});
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
