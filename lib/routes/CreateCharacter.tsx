import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import kebabCase from "lodash/kebabCase";
import React, { useState } from "react";
import { AppLink } from "../components/AppLink";
import { charactersDb } from "../database/database";
import { getGameBySlug } from "../games/games";
import { CharacterFields } from "./CharacterFields";

export const CreateCharacter = props => {
  const { gameSlug } = props.match.params;
  const game = getGameBySlug(gameSlug);
  const [character, setCharacter] = useState({});

  return (
    <div className="route-box">
      <h1>Create Character</h1>
      <h2>
        <AppLink to={`/g/${game.slug}`}>All Characters</AppLink>
      </h2>
      <Fab
        color="secondary"
        style={{
          position: "fixed",
          zIndex: 1,
          bottom: "5rem",
          right: "2rem"
        }}
        onClick={async () => {
          const id = createId(kebabCase(character["name"]));
          await charactersDb.put({ ...character, _id: id }, {});
          location.href = `/g/${game.slug}/play/${id}`;
        }}
      >
        <SaveIcon />
      </Fab>

      <br />
      <br />
      <br />
      <CharacterFields
        fields={game.fields}
        character={character}
        setCharacter={setCharacter}
      />
    </div>
  );
};

function createId(slug: string) {
  const fourRandomDigits = `${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}`;
  return `${slug}-${fourRandomDigits}`;
}

function getRandomDigit(): any {
  return Math.floor(Math.random() * 100) % 10;
}
