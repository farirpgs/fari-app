import Button from "@material-ui/core/Button";
import React, { useEffect, useState } from "react";
import { AppLink } from "../components/AppLink";
import { AppProgress } from "../components/AppProgress";
import { charactersDb } from "../database/database";
import { getGameBySlug } from "../games/games";
import { ICharacter } from "../games/IGame";
import { CharacterFields } from "./CharacterFields";

export const PlayCharacter = props => {
  const { gameSlug, characterId } = props.match.params;
  const game = getGameBySlug(gameSlug);
  const [character, setCharacter] = useState({});
  const isLoading = Object.keys(character).length === 0;

  useEffect(() => {
    load();
    async function load() {
      const result = await charactersDb.get<ICharacter>(characterId);
      setCharacter(result);
    }
  }, [gameSlug, characterId]);

  return (
    <div>
      {isLoading && <AppProgress />}
      <div className="route-box">
        <h1>Play Character</h1>
        <h2>
          <AppLink to={`/g/${game.slug}`}>All Characters</AppLink>
        </h2>

        {!isLoading && (
          <div className="row">
            <div className="col-xs-12">
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    await charactersDb.put(character, {});
                    location.reload();
                  }}
                >
                  Update
                </Button>
                <br />
                <br />
                <br />
                <CharacterFields
                  fields={game.fields}
                  character={character}
                  setCharacter={async character => {
                    setCharacter(character);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
